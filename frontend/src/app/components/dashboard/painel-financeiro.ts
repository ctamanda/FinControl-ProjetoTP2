import { HttpErrorResponse } from '@angular/common/http';
import { computed, Directive, effect, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MODULOS_TRANSACOES, temModulo, tiposEditaveis } from '../../core/acesso';
import { mensagemDeErro } from '../../core/api';
import { chaveMes, MesService } from '../../core/mes.service';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { ContaFinanceira } from '../../models/conta.model';
import { Transacao } from '../../models/transacao.model';
import { ContaService } from '../../services/conta.service';
import { TransacaoService } from '../../services/transacao.service';
import { abrirPagamento } from '../shared/pagar-dialog/pagar-dialog';
import { doMes, fimDoMes, rankingCategorias, saldoDoMes, somar, variacao } from './resumo';

// Base dos dashboards pessoal, da empresa e do colaborador:
// carrega as transações da conta e calcula os números do mês escolhido no topo.
@Directive()
export abstract class PainelFinanceiro implements OnInit {
  private readonly transacaoService = inject(TransacaoService);
  private readonly contaService = inject(ContaService);
  private readonly dialog = inject(MatDialog);
  protected readonly mes = inject(MesService);
  protected readonly perfil = inject(UsuarioService).perfil;

  protected readonly transacoes = signal<Transacao[]>([]);
  // Contas com os saldos do mês escolhido (inclui as arquivadas: o dinheiro delas ainda conta).
  protected readonly contas = signal<ContaFinanceira[]>([]);
  protected readonly contasAtivas = computed(() => this.contas().filter((c) => c.ativa));
  private readonly saldoInicial = computed(() => this.contas().reduce((s, c) => s + Number(c.saldoInicial), 0));
  protected readonly totalContas = computed(() => ({
    receitas: this.contasAtivas().reduce((s, c) => s + Number(c.receitasMes), 0),
    despesas: this.contasAtivas().reduce((s, c) => s + Number(c.despesasMes), 0),
    atual: this.contas().reduce((s, c) => s + Number(c.saldoAtual), 0),
    previsto: this.contas().reduce((s, c) => s + Number(c.saldoPrevisto), 0),
  }));
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  protected readonly tiposEditaveis = computed(() => tiposEditaveis(this.perfil()));
  protected readonly verLancamentos = computed(() => temModulo(this.perfil(), ...MODULOS_TRANSACOES));
  protected readonly primeiroNome = computed(() => (this.perfil()?.nome ?? '').split(' ')[0]);

  protected readonly doMes = computed(() => doMes(this.transacoes(), this.mes.chave()));
  private readonly doMesAnterior = computed(() => doMes(this.transacoes(), chaveMes(this.mes.data(), -1)));

  protected readonly saldo = computed(() => saldoDoMes(this.transacoes(), this.mes.chave(), this.saldoInicial()));
  protected readonly fimDoMes = computed(() => fimDoMes(this.mes.chave()));
  protected readonly receitas = computed(() => somar(this.doMes(), 'RECEITA'));
  protected readonly despesas = computed(() => somar(this.doMes(), 'DESPESA'));
  protected readonly resultado = computed(() => this.receitas() - this.despesas());
  protected readonly margem = computed(() => (this.receitas() ? (this.resultado() / this.receitas()) * 100 : null));

  protected readonly variacaoSaldo = computed(() => variacao(this.saldo().atual, this.saldo().inicio));
  protected readonly variacaoReceitas = computed(() =>
    variacao(this.receitas(), somar(this.doMesAnterior(), 'RECEITA')),
  );
  protected readonly variacaoDespesas = computed(() =>
    variacao(this.despesas(), somar(this.doMesAnterior(), 'DESPESA')),
  );

  protected readonly categorias = computed(() => rankingCategorias(this.doMes()));

  constructor() {
    effect(() => this.carregarContas(this.mes.chave()));
  }

  ngOnInit(): void {
    this.mes.mesesAnteriores.set(null);
    this.carregarTransacoes();
  }

  // Marca uma conta a pagar/receber como paga e atualiza os números.
  pagar(t: Transacao): void {
    abrirPagamento(this.dialog, t).subscribe((paga) => {
      if (!paga) return;
      this.carregarTransacoes();
      this.carregarContas(this.mes.chave());
    });
  }

  private carregarContas(mes: string): void {
    this.contaService.listar(mes, true).subscribe({ next: (lista) => this.contas.set(lista), error: () => {} });
  }

  private carregarTransacoes(): void {
    this.transacaoService.findTodas().subscribe({
      next: (lista) => {
        this.transacoes.set(lista.map((t) => ({ ...t, valor: Number(t.valor) })));
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar os lançamentos.'));
        this.carregando.set(false);
      },
    });
  }
}
