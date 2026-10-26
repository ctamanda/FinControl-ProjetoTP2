import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { temModulo, tiposEditaveis } from '../../../core/acesso';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { hojeIso } from '../../../models/admin.model';
import { Categoria } from '../../../models/categoria.model';
import { ContaFinanceira } from '../../../models/conta.model';
import { TipoTransacao, Transacao } from '../../../models/transacao.model';
import { CategoriaService } from '../../../services/categoria.service';
import { ContaService } from '../../../services/conta.service';
import { TransacaoService } from '../../../services/transacao.service';
import { IconeCategoria } from '../../shared/icone-categoria/icone-categoria';

// Novo/editar lançamento. "Pago" mexe no saldo da conta; "A pagar/A receber" fica pendente
// até o vencimento (a data) e aparece em Contas a pagar.
@Component({
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, IconeCategoria],
  selector: 'app-transacao-form',
  styleUrl: './transacao-form.css',
  templateUrl: './transacao-form.html',
})
export class TransacaoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transacaoService = inject(TransacaoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly contaService = inject(ContaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  // Com os módulos Receitas/Despesas a pessoa só lança o tipo liberado (o back confere de novo).
  private readonly perfil = inject(UsuarioService).perfil();
  protected readonly tipos = tiposEditaveis(this.perfil);
  // Atalhos "Receita"/"Despesa" abrem o form com ?tipo=; "Nova conta a pagar" manda ?pendente=1.
  private readonly tipoPedido = this.route.snapshot.queryParamMap.get('tipo') as TipoTransacao | null;
  private readonly pendentePedido = this.route.snapshot.queryParamMap.get('pendente') === '1';
  protected readonly podeCriarCategoria = temModulo(this.perfil, 'CATEGORIAS');
  protected readonly hoje = hojeIso();

  protected readonly form = this.fb.nonNullable.group({
    tipo: [
      (this.tipoPedido && this.tipos.includes(this.tipoPedido) ? this.tipoPedido : (this.tipos[0] ?? 'DESPESA')) as TipoTransacao,
      Validators.required,
    ],
    descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    data: [hojeIso(), Validators.required],
    idCategoria: [null as number | null, Validators.required],
    idConta: [null as number | null, Validators.required],
    pago: [!this.pendentePedido],
    dataPagamento: [hojeIso()],
  });

  protected readonly id = signal<number | null>(null);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly contas = signal<ContaFinanceira[]>([]);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);

  protected readonly tipo = toSignal(this.form.controls.tipo.valueChanges, {
    initialValue: this.form.controls.tipo.value,
  });
  protected readonly pago = toSignal(this.form.controls.pago.valueChanges, {
    initialValue: this.form.controls.pago.value,
  });
  private readonly idCategoria = toSignal(this.form.controls.idCategoria.valueChanges, {
    initialValue: this.form.controls.idCategoria.value,
  });

  protected readonly receita = computed(() => this.tipo() === 'RECEITA');

  // Só oferece categorias do mesmo tipo da transação (receita/despesa).
  protected readonly categoriasDoTipo = computed(() =>
    this.categorias().filter((c) => !c.tipo || c.tipo === this.tipo()),
  );
  protected readonly categoriaEscolhida = computed(() => this.categorias().find((c) => c.id === this.idCategoria()));

  private readonly enviado = signal(false);

  invalido(campo: 'descricao' | 'valor' | 'data' | 'idCategoria' | 'idConta'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  ngOnInit(): void {
    this.categoriaService.findAll().subscribe({
      next: (lista) => this.categorias.set(lista),
      error: (error: HttpErrorResponse) =>
        this.avisar(mensagemDeErro(error, 'Erro ao carregar categorias.')),
    });

    this.contaService.listar().subscribe({
      next: (lista) => {
        this.contas.update((atuais) => [...atuais.filter((c) => !lista.some((l) => l.id === c.id)), ...lista]);
        // Novo lançamento: já vem na primeira conta (a padrão).
        if (this.form.controls.idConta.value === null && lista.length) {
          this.form.controls.idConta.setValue(lista[0].id);
        }
      },
      error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Erro ao carregar as contas.')),
    });

    // Ao trocar o tipo, limpa a categoria se ela não servir mais.
    this.form.controls.tipo.valueChanges.subscribe((tipo) => {
      const selecionada = this.categorias().find((c) => c.id === this.form.controls.idCategoria.value);
      if (selecionada?.tipo && selecionada.tipo !== tipo) {
        this.form.controls.idCategoria.setValue(null);
      }
    });

    // Data futura sugere "a pagar"; pago com data no passado sugere o pagamento no mesmo dia.
    this.form.controls.data.valueChanges.subscribe((data) => {
      if (this.id() || !data) return;
      if (data > this.hoje) this.form.controls.pago.setValue(false);
      this.form.controls.dataPagamento.setValue(data <= this.hoje ? data : this.hoje);
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(Number(id));
      this.carregando.set(true);
      this.transacaoService.findById(id).subscribe({
        next: (t) => {
          // A conta do lançamento entra na lista mesmo se estiver arquivada.
          if (t.conta && !this.contas().some((c) => c.id === t.conta!.id)) {
            this.contas.update((lista) => [...lista, t.conta as ContaFinanceira]);
          }
          this.form.patchValue({
            tipo: t.tipo,
            descricao: t.descricao,
            valor: Number(t.valor),
            data: t.data,
            idCategoria: t.categoria?.id ?? null,
            idConta: t.conta?.id ?? null,
            pago: t.pago,
            dataPagamento: t.dataPagamento ?? (t.data <= this.hoje ? t.data : this.hoje),
          });
          this.carregando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.avisar(mensagemDeErro(error, 'Transação não encontrada.'));
          this.router.navigate(['/transacoes']);
        },
      });
    }
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }

    this.salvando.set(true);
    const v = this.form.getRawValue();
    const transacao = {
      tipo: v.tipo,
      descricao: v.descricao,
      valor: v.valor,
      data: v.data,
      pago: v.pago,
      dataPagamento: v.pago ? v.dataPagamento : null,
      categoria: { id: v.idCategoria },
      conta: { id: v.idConta },
    } as Transacao;
    const id = this.id();
    const requisicao: Observable<unknown> = id
      ? this.transacaoService.update(id, transacao)
      : this.transacaoService.create(transacao);

    requisicao.subscribe({
      next: () => {
        this.avisar(id ? 'Lançamento atualizado.' : v.pago ? 'Lançamento registrado.' : 'Conta agendada. Ela aparece em Contas a pagar.');
        this.router.navigate([v.pago ? '/transacoes' : '/a-pagar'], v.pago ? {} : { queryParams: { tipo: v.tipo } });
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Erro ao salvar o lançamento.'));
        this.salvando.set(false);
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3500, verticalPosition: 'top' });
  }
}
