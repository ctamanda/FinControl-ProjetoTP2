import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterLink } from '@angular/router';
import { temModulo } from '../../../core/acesso';
import { siglaConta } from '../../../models/conta.model';
import { Indicador } from '../../shared/indicador/indicador';
import { LinhaSaldo } from '../../shared/linha-saldo/linha-saldo';
import { PainelFinanceiro } from '../painel-financeiro';
import { formatarMoeda, proximasDespesas } from '../resumo';

// Dashboard da conta pessoal: saldo do mês, ranking de categorias, indicadores e próximas contas.
@Component({
  selector: 'app-dashboard-pessoal',
  imports: [RouterLink, CurrencyPipe, DecimalPipe, MatIconModule, MatProgressBarModule, Indicador, LinhaSaldo],
  styleUrls: ['../../shared/painel.css', './dashboard-pessoal.css'],
  templateUrl: './dashboard-pessoal.html',
})
export class DashboardPessoal extends PainelFinanceiro {
  private readonly router = inject(Router);

  protected readonly moeda = formatarMoeda;
  protected readonly verCategorias = computed(() => temModulo(this.perfil(), 'CATEGORIAS'));

  protected readonly proximas = computed(() => proximasDespesas(this.transacoes()));
  protected readonly podeEditarContas = computed(() => temModulo(this.perfil(), 'CONTAS'));
  protected readonly sigla = siglaConta;

  pesquisar(termo: string): void {
    this.router.navigate(['/transacoes'], { queryParams: termo.trim() ? { busca: termo.trim() } : {} });
  }
}
