import { computed, Injectable, signal } from '@angular/core';

export const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

// 'yyyy-MM' do mês (local), deslocado em "delta" meses.
export function chaveMes(d: Date, delta = 0): string {
  const m = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
}

// Mês escolhido no seletor "‹ Outubro 2026 ›" da barra superior.
// O Shell mostra o seletor e os dashboards filtram os dados por ele.
@Injectable({ providedIn: 'root' })
export class MesService {
  private readonly inicio = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  // Quantos meses para trás a tela aceita (o painel admin só tem os últimos 6); null = sem limite.
  readonly mesesAnteriores = signal<number | null>(null);

  readonly data = this.inicio.asReadonly();
  readonly chave = computed(() => chaveMes(this.inicio()));
  readonly nome = computed(() => NOMES_MESES[this.inicio().getMonth()]);
  readonly rotulo = computed(() => `${this.nome()} ${this.inicio().getFullYear()}`);
  readonly ehAtual = computed(() => this.chave() === chaveMes(new Date()));

  readonly podeVoltar = computed(() => {
    const limite = this.mesesAnteriores();
    return limite === null || this.chave() > chaveMes(new Date(), -limite);
  });

  // Sem limite, dá para ver meses futuros (lançamentos agendados); com limite, para no mês atual.
  readonly podeAvancar = computed(() => this.mesesAnteriores() === null || !this.ehAtual());

  mover(delta: number): void {
    const d = this.inicio();
    this.inicio.set(new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  // Volta para o mês atual (usado ao trocar para uma tela com limite).
  irParaAtual(): void {
    this.inicio.set(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  }
}
