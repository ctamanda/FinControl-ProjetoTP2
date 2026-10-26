import { chaveMes } from '../../core/mes.service';
import { hojeIso } from '../../models/admin.model';
import { TipoTransacao, Transacao } from '../../models/transacao.model';

// Cálculos dos dashboards, feitos no front sobre as transações da conta
// (o back devolve só as do usuário ou da empresa dele).

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Cores das barras e fatias, na ordem do ranking.
export const PALETA = ['#3b1478', '#15803d', '#f5c518', '#2563c9', '#a78be8', '#e0465a'];

export function somar(lista: Transacao[], tipo: TipoTransacao): number {
  return lista.filter((t) => t.tipo === tipo).reduce((s, t) => s + t.valor, 0);
}

function saldo(lista: Transacao[]): number {
  return somar(lista, 'RECEITA') - somar(lista, 'DESPESA');
}

// Dia em que o dinheiro mexeu no saldo (só para lançamentos pagos).
function diaDoPagamento(t: Transacao): string {
  return t.dataPagamento ?? t.data;
}

export function doMes(lista: Transacao[], chave: string): Transacao[] {
  return lista.filter((t) => t.data.startsWith(chave));
}

// Variação percentual (null quando não há base de comparação).
export function variacao(atual: number, anterior: number): number | null {
  return anterior !== 0 ? ((atual - anterior) / Math.abs(anterior)) * 100 : null;
}

// Saldo das contas no início do mês, agora e previsto para o fim do mês.
// Só o que foi pago mexe no saldo (pela data do pagamento); o previsto soma também as
// contas a pagar/receber que vencem até o fim do mês (inclusive as atrasadas).
// Mês passado: "atual" = fechamento. Mês futuro: nada aconteceu ainda, "atual" = início.
export function saldoDoMes(lista: Transacao[], chave: string, saldoInicial = 0) {
  const hoje = hojeIso();
  const pagos = lista.filter((t) => t.pago);
  const pagosAte = (fimIso: string) => saldoInicial + saldo(pagos.filter((t) => diaDoPagamento(t) <= fimIso));
  const fim = chave + '-31';

  const inicio = saldoInicial + saldo(pagos.filter((t) => diaDoPagamento(t) < chave));
  const fechamento = pagosAte(fim);
  const previsto = fechamento + saldo(lista.filter((t) => !t.pago && t.data <= fim));
  const mesAtual = chave === hoje.slice(0, 7);
  const atual = mesAtual ? pagosAte(hoje) : chave < hoje ? fechamento : inicio;
  return { inicio, atual, previsto };
}

// '2026-10' -> '31/10'
export function fimDoMes(chave: string): string {
  const [ano, mes] = chave.split('-').map(Number);
  return `${new Date(ano, mes, 0).getDate()}/${String(mes).padStart(2, '0')}`;
}

// Despesas do mês agrupadas por categoria, com o percentual sobre o total.
export function rankingCategorias(lista: Transacao[], tipo: TipoTransacao = 'DESPESA', limite = 6) {
  const grupos = new Map<string, number>();
  for (const t of lista) {
    if (t.tipo !== tipo) continue;
    const nome = t.categoria?.nome ?? 'Sem categoria';
    grupos.set(nome, (grupos.get(nome) ?? 0) + t.valor);
  }
  const total = [...grupos.values()].reduce((s, v) => s + v, 0) || 1;
  const maior = Math.max(1, ...grupos.values());
  // largura: barra proporcional à maior categoria (a primeira ocupa a linha toda).
  return [...grupos.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([nome, valor], i) => ({
      nome,
      valor,
      percentual: (valor / total) * 100,
      largura: (valor / maior) * 100,
      cor: PALETA[i % PALETA.length],
    }));
}

// Receitas x despesas dos "n" meses que terminam no mês escolhido.
export function fluxoDeCaixa(lista: Transacao[], chave: string, n = 6) {
  const base = new Date(chave + '-01T12:00');
  const meses = [];
  for (let i = n - 1; i >= 0; i--) {
    const c = chaveMes(base, -i);
    const doMesI = doMes(lista, c);
    meses.push({ rotulo: MESES_CURTOS[Number(c.slice(5)) - 1], receitas: somar(doMesI, 'RECEITA'), despesas: somar(doMesI, 'DESPESA') });
  }
  const maior = escalaDoGrafico(Math.max(0, ...meses.flatMap((m) => [m.receitas, m.despesas])));
  return {
    maior,
    meses: meses.map((m) => ({ ...m, altReceitas: (m.receitas / maior) * 100, altDespesas: (m.despesas / maior) * 100 })),
  };
}

// Topo "redondo" para o eixo Y (1, 2, 5 × 10^n).
export function escalaDoGrafico(maior: number): number {
  if (maior <= 0) return 1;
  const potencia = 10 ** Math.floor(Math.log10(maior));
  return [1, 2, 5, 10].map((m) => m * potencia).find((v) => v >= maior)!;
}

// 10000 -> '10 mil'
export function rotuloEixo(valor: number): string {
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toLocaleString('pt-BR')} mi`;
  if (valor >= 1000) return `${(valor / 1000).toLocaleString('pt-BR')} mil`;
  return valor.toLocaleString('pt-BR');
}

// Contas a pagar (despesas pendentes): atrasadas primeiro, depois as que vencem antes.
export function proximasDespesas(lista: Transacao[], ateDias: number | null = null, limite = 5) {
  const hoje = hojeIso();
  const limiteData = ateDias === null ? null : somarDias(hoje, ateDias);
  return lista
    .filter((t) => t.tipo === 'DESPESA' && !t.pago && (!limiteData || t.data <= limiteData))
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, limite)
    .map((t) => {
      const dias = diasEntre(hoje, t.data);
      return { ...t, dia: Number(t.data.slice(8)), dias, quando: quando(dias) };
    });
}

function quando(dias: number): string {
  if (dias < -1) return `Venceu há ${-dias} dias`;
  if (dias === -1) return 'Venceu ontem';
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `Em ${dias} dias`;
}

function somarDias(iso: string, dias: number): string {
  const d = new Date(iso + 'T12:00');
  d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function diasEntre(de: string, ate: string): number {
  return Math.round((new Date(ate + 'T12:00').getTime() - new Date(de + 'T12:00').getTime()) / 86_400_000);
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
