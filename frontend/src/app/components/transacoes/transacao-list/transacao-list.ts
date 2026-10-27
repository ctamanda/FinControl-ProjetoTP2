import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { tiposEditaveis } from '../../../core/acesso';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { FiltroLancamentos, ROTULOS_STATUS, StatusPagamento, TipoTransacao, Transacao } from '../../../models/transacao.model';
import { ContaService } from '../../../services/conta.service';
import { TransacaoService } from '../../../services/transacao.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { IconeCategoria } from '../../shared/icone-categoria/icone-categoria';
import { abrirPagamento } from '../../shared/pagar-dialog/pagar-dialog';
import { Valor } from '../../shared/valor/valor';

type Aba = 'TODOS' | 'A_PAGAR' | 'A_RECEBER' | 'PAGOS' | 'ATRASADOS';

// Cada aba vira um filtro do GET /transacoes.
const FILTRO_DA_ABA: Record<Aba, { tipo: TipoTransacao | null; status: StatusPagamento | null }> = {
  TODOS: { tipo: null, status: null },
  A_PAGAR: { tipo: 'DESPESA', status: 'PENDENTE' },
  A_RECEBER: { tipo: 'RECEITA', status: 'PENDENTE' },
  PAGOS: { tipo: null, status: 'PAGO' },
  ATRASADOS: { tipo: null, status: 'ATRASADO' },
};

@Component({
  imports: [
    RouterLink,
    DatePipe,
    Valor,
    IconeCategoria,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  selector: 'app-transacao-list',
  styleUrl: './transacao-list.css',
  templateUrl: './transacao-list.html',
})
export class TransacaoList implements OnInit {
  private readonly transacaoService = inject(TransacaoService);
  private readonly contaService = inject(ContaService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly displayedColumns = ['data', 'descricao', 'categoria', 'conta', 'status', 'valor', 'acoes'];
  protected readonly transacoes = signal<Transacao[]>([]);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalItems = signal(0);
  protected readonly carregando = signal(false);
  protected readonly carregou = signal(false); // evita mostrar "nenhuma transação" antes da 1ª resposta

  // Receitas/Despesas: só lança e altera o tipo liberado (Lançamentos libera os dois).
  private readonly perfil = inject(UsuarioService).perfil();
  protected readonly tipos = tiposEditaveis(this.perfil);

  protected readonly abas: { id: Aba; rotulo: string }[] = [
    { id: 'TODOS', rotulo: 'Todos' },
    { id: 'A_PAGAR', rotulo: 'A pagar' },
    { id: 'A_RECEBER', rotulo: 'A receber' },
    { id: 'PAGOS', rotulo: 'Pagos' },
    { id: 'ATRASADOS', rotulo: 'Atrasados' },
  ];
  protected readonly aba = signal<Aba>((this.params.get('aba') as Aba) ?? 'TODOS');

  // Filtro por conta vindo da tela de Contas (?conta=ID).
  protected readonly idConta = signal<number | null>(Number(this.params.get('conta')) || null);
  protected readonly nomeConta = signal('');

  // Busca vinda do topo do dashboard (?busca=).
  protected filtro = this.params.get('busca') ?? '';
  private readonly digitacao = new Subject<string>();
  private consulta?: Subscription;

  ngOnInit(): void {
    // Filtro feito no servidor (LIKE, case-insensitive); espera o usuário parar de digitar.
    this.digitacao.pipe(debounceTime(300), distinctUntilChanged()).subscribe((valor) => {
      this.filtro = valor;
      this.pageIndex.set(0);
      this.loadTransacoes();
    });
    if (this.idConta()) {
      this.contaService.listar(undefined, true).subscribe({
        next: (contas) => this.nomeConta.set(contas.find((c) => c.id === this.idConta())?.nome ?? ''),
        error: () => {},
      });
    }
    this.loadTransacoes();
  }

  trocarAba(aba: Aba): void {
    this.aba.set(aba);
    this.pageIndex.set(0);
    this.loadTransacoes();
  }

  limparConta(): void {
    this.idConta.set(null);
    this.router.navigate([], { queryParams: { conta: null }, queryParamsHandling: 'merge', replaceUrl: true });
    this.loadTransacoes();
  }

  loadTransacoes(): void {
    // Cancela a consulta anterior: só a resposta da última página/filtro pedido vale.
    this.consulta?.unsubscribe();
    this.carregando.set(true);

    const filtro: FiltroLancamentos = { descricao: this.filtro, idConta: this.idConta(), ...FILTRO_DA_ABA[this.aba()] };
    this.consulta = this.transacaoService.findAll(this.pageIndex(), this.pageSize(), filtro).subscribe({
      next: (response) => {
        this.transacoes.set(response.items);
        this.pageIndex.set(response.page);
        this.pageSize.set(response.pageSize);
        this.totalItems.set(response.totalItems);
        this.carregando.set(false);
        this.carregou.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.transacoes.set([]);
        this.totalItems.set(0);
        this.carregando.set(false);
        this.exibirMensagem(mensagemDeErro(error, 'Erro ao buscar transações!'));
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransacoes();
  }

  applyFilter(event: Event): void {
    this.digitacao.next((event.target as HTMLInputElement).value.trim());
  }

  pagar(t: Transacao): void {
    abrirPagamento(this.dialog, t).subscribe((paga) => {
      if (!paga) return;
      this.exibirMensagem(t.tipo === 'RECEITA' ? 'Recebimento registrado.' : 'Pagamento registrado.');
      this.loadTransacoes();
    });
  }

  reabrir(t: Transacao): void {
    this.transacaoService.reabrir(t.id).subscribe({
      next: () => {
        this.exibirMensagem('Voltou a ficar pendente.');
        this.loadTransacoes();
      },
      error: (error: HttpErrorResponse) => this.exibirMensagem(mensagemDeErro(error, 'Não foi possível desfazer.')),
    });
  }

  excluir(t: Transacao): void {
    confirmar(this.dialog, {
      titulo: 'Excluir lançamento',
      mensagem: `Deseja excluir "${t.descricao}"? Esta ação não pode ser desfeita.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.transacaoService.delete(t.id).subscribe({
        next: () => {
          this.exibirMensagem('Lançamento excluído.');
          // Se apagou o último item da página, volta uma página.
          if (this.transacoes().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((p) => p - 1);
          }
          this.loadTransacoes();
        },
        error: (error: HttpErrorResponse) =>
          this.exibirMensagem(mensagemDeErro(error, 'Erro ao excluir o lançamento.')),
      });
    });
  }

  // "Pago"/"Recebido", "A pagar"/"A receber" ou "Atrasado".
  protected rotuloStatus(t: Transacao): string {
    const rotulos = ROTULOS_STATUS[t.status ?? (t.pago ? 'PAGO' : 'PENDENTE')];
    return t.tipo === 'RECEITA' ? rotulos.receita : rotulos.despesa;
  }

  exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
