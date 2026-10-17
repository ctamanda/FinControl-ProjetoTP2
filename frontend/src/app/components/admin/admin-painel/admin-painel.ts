import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { Estatisticas, ParametroFiscal, situacaoVigencia } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { Valor } from '../../shared/valor/valor';

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

  protected readonly parametrosVigentes = computed(() =>
    this.parametros().filter((p) => situacaoVigencia(p) === 'VIGENTE'),
  );

  protected readonly contagemVigencia = computed(() => {
    const contagem = { VIGENTE: 0, FUTURO: 0, ENCERRADO: 0 };
    for (const p of this.parametros()) {
      contagem[situacaoVigencia(p)]++;
    }
    return contagem;
  });

  // Percentual de ADMIN para o gráfico de rosca (conic-gradient).
  protected readonly percentualAdmin = computed(() => {
    const e = this.estatisticas();
    return e && e.totalUsuarios > 0 ? (e.totalAdmins / e.totalUsuarios) * 100 : 0;
  });

  // Barras horizontais comparando os volumes do sistema.
  protected readonly volumes = computed(() => {
    const e = this.estatisticas();
    if (!e) {
      return [];
    }
    const itens = [
      { rotulo: 'Usuários', valor: e.totalUsuarios, cor: 'var(--fc-azul)' },
      { rotulo: 'Categorias', valor: e.totalCategorias, cor: 'var(--fc-amarelo)' },
      { rotulo: 'Transações', valor: e.totalTransacoes, cor: 'var(--fc-success)' },
    ];
    const maior = Math.max(1, ...itens.map((i) => i.valor));
    return itens.map((i) => ({ ...i, largura: (i.valor / maior) * 100 }));
  });

  protected readonly categoriasPorUsuario = computed(() => {
    const e = this.estatisticas();
    return e && e.totalUsuarios > 0 ? e.totalCategorias / e.totalUsuarios : 0;
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
