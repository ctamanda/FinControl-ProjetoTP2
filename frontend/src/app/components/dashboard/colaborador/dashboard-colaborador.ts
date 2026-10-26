import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MODULOS, Modulo } from '../../../models/usuario.model';
import { TipoTransacao } from '../../../models/transacao.model';
import { Indicador } from '../../shared/indicador/indicador';
import { PainelFinanceiro } from '../painel-financeiro';
import { formatarMoeda, proximasDespesas, somar } from '../resumo';

// Dashboard do colaborador da empresa: atalhos para registrar, os próprios lançamentos,
// as contas da semana e o que a administração liberou para ele.
@Component({
  selector: 'app-dashboard-colaborador',
  imports: [RouterLink, CurrencyPipe, DatePipe, MatIconModule, MatProgressBarModule, MatTooltipModule, Indicador],
  styleUrls: ['../../shared/painel.css', './dashboard-colaborador.css'],
  templateUrl: './dashboard-colaborador.html',
})
export class DashboardColaborador extends PainelFinanceiro {
  protected readonly moeda = formatarMoeda;

  protected readonly empresa = computed(() => this.perfil()?.empresa?.nome ?? '');
  protected readonly podeReceita = computed(() => this.tiposEditaveis().includes('RECEITA'));
  protected readonly podeDespesa = computed(() => this.tiposEditaveis().includes('DESPESA'));

  // Só o que a própria pessoa lançou.
  private readonly meus = computed(() => this.transacoes().filter((t) => t.usuario?.id === this.perfil()?.id));
  protected readonly meusNoMes = computed(() => this.meus().filter((t) => t.data.startsWith(this.mes.chave())));
  protected readonly minhasReceitas = computed(() => somar(this.meusNoMes(), 'RECEITA'));
  protected readonly minhasDespesas = computed(() => somar(this.meusNoMes(), 'DESPESA'));

  protected readonly filtro = signal<TipoTransacao | null>(null);
  protected readonly recentes = computed(() =>
    this.meus()
      .filter((t) => !this.filtro() || t.tipo === this.filtro())
      .slice(0, 6),
  );

  protected readonly semana = computed(() => proximasDespesas(this.transacoes(), 7, 5));
  protected readonly totalSemana = computed(() => this.semana().reduce((s, t) => s + t.valor, 0));

  // Módulos que a administração pode liberar: primeiro os liberados, depois os sem acesso.
  protected readonly acessos = computed(() => {
    const meus = this.perfil()?.modulos ?? [];
    return (Object.entries(MODULOS) as [Modulo, (typeof MODULOS)[Modulo]][])
      .filter(([, info]) => info.empresa)
      // Lançamentos já inclui Receitas e Despesas: não mostra os dois como "sem acesso".
      .filter(([m]) => !(meus.includes('LANCAMENTOS') && (m === 'RECEITAS' || m === 'DESPESAS')))
      .map(([m, info]) => ({ rotulo: info.rotulo, liberado: meus.includes(m) }))
      .sort((a, b) => Number(b.liberado) - Number(a.liberado))
      .slice(0, 7);
  });
}
