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
import { mensagemDeErro } from '../../../core/api';
import { hojeIso } from '../../../models/admin.model';
import { Categoria } from '../../../models/categoria.model';
import { Escopo, TipoTransacao, Transacao } from '../../../models/transacao.model';
import { CategoriaService } from '../../../services/categoria.service';
import { TransacaoService } from '../../../services/transacao.service';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-transacao-form',
  styleUrl: './transacao-form.css',
  templateUrl: './transacao-form.html',
})
export class TransacaoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly transacaoService = inject(TransacaoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  protected readonly form = this.fb.nonNullable.group({
    tipo: ['DESPESA' as TipoTransacao, Validators.required],
    descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    data: [hojeIso(), Validators.required],
    escopo: ['PESSOAL' as Escopo, Validators.required],
    idCategoria: [null as number | null, Validators.required],
  });

  protected readonly id = signal<number | null>(null);
  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);

  protected readonly tipo = toSignal(this.form.controls.tipo.valueChanges, {
    initialValue: this.form.controls.tipo.value,
  });

  // Só oferece categorias do mesmo tipo da transação (receita/despesa).
  protected readonly categoriasDoTipo = computed(() =>
    this.categorias().filter((c) => !c.tipo || c.tipo === this.tipo()),
  );

  private readonly enviado = signal(false);

  invalido(campo: 'descricao' | 'valor' | 'data' | 'idCategoria'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  ngOnInit(): void {
    this.categoriaService.findAll().subscribe({
      next: (lista) => this.categorias.set(lista),
      error: (error: HttpErrorResponse) =>
        this.avisar(mensagemDeErro(error, 'Erro ao carregar categorias.')),
    });

    // Ao trocar o tipo, limpa a categoria se ela não servir mais.
    this.form.controls.tipo.valueChanges.subscribe((tipo) => {
      const selecionada = this.categorias().find((c) => c.id === this.form.controls.idCategoria.value);
      if (selecionada?.tipo && selecionada.tipo !== tipo) {
        this.form.controls.idCategoria.setValue(null);
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(Number(id));
      this.carregando.set(true);
      this.transacaoService.findById(id).subscribe({
        next: (t) => {
          this.form.patchValue({ ...t, valor: Number(t.valor), idCategoria: t.categoria?.id ?? null });
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
    const { idCategoria, ...dados } = this.form.getRawValue();
    const transacao = { ...dados, categoria: { id: idCategoria } } as Transacao;
    const id = this.id();
    const requisicao: Observable<unknown> = id
      ? this.transacaoService.update(id, transacao)
      : this.transacaoService.create(transacao);

    requisicao.subscribe({
      next: () => {
        this.avisar(id ? 'Transação atualizada.' : 'Transação cadastrada.');
        this.router.navigate(['/transacoes']);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Erro ao salvar a transação.'));
        this.salvando.set(false);
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3000, verticalPosition: 'top' });
  }
}
