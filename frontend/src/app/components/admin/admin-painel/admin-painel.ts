import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { Estatisticas, formatarBytes, ParametroFiscal, situacaoVigencia } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { Valor } from '../../shared/valor/valor';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe, MatIconModule, MatButtonModule, MatProgressBarModule, Valor],
  selector: 'app-admin-painel',
  styleUrl: './admin-painel.css',
  templateUrl: './admin-painel.html',
})
export class AdminPainel implements OnInit {
  private readonly adminService = inject(AdminService);

  protected readonly estatisticas = signal<Estatisticas | null>(null);
  protected readonly parametros = signal<ParametroFiscal[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly atualizadoEm = signal<Date | null>(null);

  protected readonly volume = computed(() => formatarBytes(this.estatisticas()?.volumeDadosBytes));

  protected readonly parametrosVigentes = computed(() =>
    this.parametros().filter((p) => p.ativo !== false && situacaoVigencia(p) === 'VIGENTE'),
  );

  // Barras do ranking proporcionais à categoria mais usada.
  protected readonly ranking = computed(() => {
    const lista = this.estatisticas()?.categoriasMaisUtilizadas ?? [];
    const maior = Math.max(1, ...lista.map((c) => c.totalTransacoes));
    return lista.map((c) => ({ ...c, largura: (c.totalTransacoes / maior) * 100 }));
  });

  // Distribuição das contas por tipo (gráfico de rosca em conic-gradient).
  protected readonly perfis = computed(() => {
    const e = this.estatisticas();
    if (!e) return [];
    const total = Math.max(1, e.totalUsuarios);
    let acumulado = 0;
    return [
      { rotulo: 'Contas pessoais', valor: e.totalContasPessoais, cor: 'var(--fc-azul)' },
      { rotulo: 'Usuários de empresas', valor: e.totalUsuariosEmpresa, cor: 'var(--fc-warning)' },
      { rotulo: 'Administradores', valor: e.totalAdmins, cor: 'var(--fc-roxo-medio)' },
    ].map((p) => {
      const inicio = acumulado;
      acumulado += (p.valor / total) * 100;
      return { ...p, inicio, fim: acumulado };
    });
  });

  protected readonly rosca = computed(() =>
    'conic-gradient(' + this.perfis().map((p) => `${p.cor} ${p.inicio}% ${p.fim}%`).join(', ') + ')',
  );

  protected readonly meses = computed(() => {
    const lista = this.estatisticas()?.transacoesPorMes ?? [];
    const maior = Math.max(1, ...lista.map((m) => m.quantidade));
    return lista.map((m) => ({
      rotulo: MESES[Number(m.mes.slice(5, 7)) - 1],
      quantidade: m.quantidade,
      altura: (m.quantidade / maior) * 100,
    }));
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.adminService.estatisticas().subscribe({
      next: (e) => {
        this.estatisticas.set(e);
        this.atualizadoEm.set(new Date());
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar as estatísticas.'));
        this.carregando.set(false);
      },
    });

    this.adminService.listarParametros().subscribe({
      next: (p) => this.parametros.set(p),
      error: () => this.parametros.set([]),
    });
  }
}
