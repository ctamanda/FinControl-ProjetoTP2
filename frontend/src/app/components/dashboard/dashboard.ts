import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { hojeIso } from '../../models/admin.model';
import { Transacao } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';
import { Valor } from '../shared/valor/valor';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function chaveMes(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

@Component({
  imports: [RouterLink, DatePipe, DecimalPipe, MatIconModule, MatButtonModule, MatProgressBarModule, Valor],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly transacaoService = inject(TransacaoService);
  protected readonly perfil = inject(UsuarioService).perfil;

  protected readonly transacoes = signal<Transacao[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  private readonly mesAtual = hojeIso().slice(0, 7); // 'yyyy-MM'
  private readonly mesAnterior = chaveMes(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
  protected readonly nomeMesAnterior = MESES[new Date(this.mesAnterior + '-01T12:00').getMonth()];

  protected readonly primeiroNome = computed(() => (this.perfil()?.nome ?? '').split(' ')[0]);

  protected readonly saldo = computed(() =>
    this.transacoes().reduce((s, t) => s + (t.tipo === 'RECEITA' ? t.valor : -t.valor), 0),
  );

  private readonly doMes = computed(() => this.transacoes().filter((t) => t.data.startsWith(this.mesAtual)));
  private readonly doMesAnterior = computed(() =>
    this.transacoes().filter((t) => t.data.startsWith(this.mesAnterior)),
  );

  protected readonly receitasMes = computed(() => somar(this.doMes(), 'RECEITA'));
  protected readonly despesasMes = computed(() => somar(this.doMes(), 'DESPESA'));
  protected readonly qtdDespesasMes = computed(() => this.doMes().filter((t) => t.tipo === 'DESPESA').length);

  // Variação percentual em relação ao mês anterior (null quando não há base de comparação).
  protected readonly variacaoReceitas = computed(() =>
    variacao(this.receitasMes(), somar(this.doMesAnterior(), 'RECEITA')),
  );
  protected readonly variacaoDespesas = computed(() =>
    variacao(this.despesasMes(), somar(this.doMesAnterior(), 'DESPESA')),
  );

  // Cards Pessoal / Empresa / Mês anterior.
  protected readonly blocos = computed(() => {
    const pessoal = this.doMes().filter((t) => t.escopo === 'PESSOAL');
    const empresa = this.doMes().filter((t) => t.escopo === 'EMPRESA');
    return [
      { titulo: 'Pessoal', sub: 'Este mês', icone: 'person_outline', cor: 'blue', lista: pessoal },
      { titulo: 'Empresa', sub: 'Este mês', icone: 'storefront', cor: 'orange', lista: empresa },
      { titulo: 'Mês anterior', sub: this.nomeMesAnterior, icone: 'history', cor: 'green', lista: this.doMesAnterior() },
    ].map((b) => ({ ...b, receitas: somar(b.lista, 'RECEITA'), despesas: somar(b.lista, 'DESPESA') }));
  });

  // Minigráfico do saldo: saldo acumulado após cada lançamento (até 30 pontos).
  protected readonly linhaSaldo = computed(() => {
    const ordenadas = [...this.transacoes()].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : a.id - b.id));
    let acumulado = 0;
    const pontos = ordenadas.map((t) => (acumulado += t.tipo === 'RECEITA' ? t.valor : -t.valor)).slice(-30);
    if (pontos.length < 2) {
      return '';
    }
    const min = Math.min(...pontos);
    const max = Math.max(...pontos);
    const faixa = max - min || 1;
    return pontos
      .map((v, i) => {
        const x = (i / (pontos.length - 1)) * 160;
        const y = 36 - ((v - min) / faixa) * 32;
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  // Principais categorias de despesa do mês, com percentual sobre o total.
  protected readonly categorias = computed(() => {
    const grupos = new Map<string, { nome: string; cor: string; total: number }>();
    for (const t of this.doMes()) {
      if (t.tipo !== 'DESPESA') continue;
      const nome = t.categoria?.nome ?? 'Sem categoria';
      const atual = grupos.get(nome) ?? { nome, cor: t.categoria?.cor || '#9aa5b5', total: 0 };
      atual.total += t.valor;
      grupos.set(nome, atual);
    }
    const total = this.despesasMes() || 1;
    return [...grupos.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((g) => ({ ...g, percentual: (g.total / total) * 100 }));
  });

  // Receitas x despesas dos últimos 6 meses.
  protected readonly ultimosMeses = computed(() => {
    const hoje = new Date();
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const doMes = this.transacoes().filter((t) => t.data.startsWith(chaveMes(d)));
      meses.push({ rotulo: MESES[d.getMonth()], receitas: somar(doMes, 'RECEITA'), despesas: somar(doMes, 'DESPESA') });
    }
    const maior = Math.max(1, ...meses.flatMap((m) => [m.receitas, m.despesas]));
    return meses.map((m) => ({
      ...m,
      alturaReceitas: (m.receitas / maior) * 100,
      alturaDespesas: (m.despesas / maior) * 100,
    }));
  });

  protected readonly recentes = computed(() => this.transacoes().slice(0, 5));

  ngOnInit(): void {
    this.transacaoService.findTodas().subscribe({
      next: (lista) => {
        this.transacoes.set(lista.map((t) => ({ ...t, valor: Number(t.valor) })));
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar suas transações.'));
        this.carregando.set(false);
      },
    });
  }
}

function somar(lista: Transacao[], tipo: Transacao['tipo']): number {
  return lista.filter((t) => t.tipo === tipo).reduce((s, t) => s + t.valor, 0);
}

function variacao(atual: number, anterior: number): number | null {
  return anterior > 0 ? ((atual - anterior) / anterior) * 100 : null;
}
