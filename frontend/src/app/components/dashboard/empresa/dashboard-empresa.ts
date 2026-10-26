import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { ParametroFiscal } from '../../../models/admin.model';
import { MODULOS, ROTULOS_TIPO_EMPRESA, Usuario } from '../../../models/usuario.model';
import { EmpresaService } from '../../../services/empresa.service';
import { iniciais } from '../../layout/shell/shell';
import { Indicador } from '../../shared/indicador/indicador';
import { LinhaSaldo } from '../../shared/linha-saldo/linha-saldo';
import { PainelFinanceiro } from '../painel-financeiro';
import { fluxoDeCaixa, formatarMoeda, proximasDespesas, rotuloEixo, somar } from '../resumo';

// Dashboard do administrador da empresa (MEI/ME): finanças da empresa, teto de faturamento e equipe.
@Component({
  selector: 'app-dashboard-empresa',
  imports: [RouterLink, CurrencyPipe, DatePipe, DecimalPipe, MatIconModule, MatProgressBarModule, Indicador, LinhaSaldo],
  styleUrls: ['../../shared/painel.css', './dashboard-empresa.css'],
  templateUrl: './dashboard-empresa.html',
})
export class DashboardEmpresa extends PainelFinanceiro implements OnInit {
  private readonly empresaService = inject(EmpresaService);

  protected readonly moeda = formatarMoeda;
  protected readonly iniciais = iniciais;
  protected readonly rotuloEixo = rotuloEixo;
  protected readonly modulos = MODULOS;

  protected readonly empresa = computed(() => this.perfil()?.empresa ?? null);
  protected readonly rotuloEmpresa = computed(() => {
    const e = this.empresa();
    return e ? `${e.nome} · ${ROTULOS_TIPO_EMPRESA[e.tipo]}` : '';
  });

  protected readonly equipe = signal<Usuario[]>([]);
  protected readonly colaboradores = computed(() => this.equipe().filter((u) => u.id !== this.perfil()?.id));

  protected readonly fluxo = computed(() => fluxoDeCaixa(this.transacoes(), this.mes.chave()));
  protected readonly contasAPagar = computed(() => proximasDespesas(this.transacoes(), null, 4));
  protected readonly ultimos = computed(() => this.transacoes().slice(0, 5));

  // Teto de faturamento anual (parâmetro LIMITE_FATURAMENTO_* vigente para o tipo da empresa).
  private readonly parametros = signal<ParametroFiscal[]>([]);
  protected readonly limite = computed(() => {
    const p = this.parametros().find((x) => x.chave.startsWith('LIMITE_FATURAMENTO'));
    if (!p) return null;
    const ano = this.mes.chave().slice(0, 4);
    const faturado = somar(this.transacoes().filter((t) => t.data.startsWith(ano)), 'RECEITA');
    const valor = Number(p.valor);
    return { ano, valor, faturado, restante: Math.max(0, valor - faturado), percentual: (faturado / valor) * 100 };
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.empresaService.listarUsuarios().subscribe({ next: (lista) => this.equipe.set(lista), error: () => {} });
    this.empresaService.parametros().subscribe({ next: (lista) => this.parametros.set(lista), error: () => {} });
  }
}
