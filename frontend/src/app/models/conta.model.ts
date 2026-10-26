export type TipoContaFinanceira = 'CONTA_CORRENTE' | 'POUPANCA' | 'CARTEIRA' | 'INVESTIMENTO' | 'OUTRA';

// Conta financeira (banco, carteira...). Os saldos vêm calculados pelo back para o mês pedido:
// saldoAtual = inicial + receitas pagas - despesas pagas; saldoPrevisto = atual + pendentes até o fim do mês.
export interface ContaFinanceira {
  id: number;
  nome: string;
  tipo: TipoContaFinanceira;
  cor: string | null;
  ativa: boolean;
  saldoInicial: number;
  saldoAtual: number;
  receitasMes: number;
  despesasMes: number;
  saldoPrevisto: number;
  totalLancamentos: number;
}

export interface ContaResumo {
  id: number;
  nome: string;
  tipo: TipoContaFinanceira;
  cor: string | null;
}

export interface ContaRequest {
  nome: string;
  tipo: TipoContaFinanceira;
  saldoInicial: number;
  cor: string | null;
}

export const TIPOS_CONTA: Record<TipoContaFinanceira, { rotulo: string; icone: string }> = {
  CONTA_CORRENTE: { rotulo: 'Conta corrente', icone: 'account_balance' },
  POUPANCA: { rotulo: 'Poupança', icone: 'savings' },
  CARTEIRA: { rotulo: 'Carteira / dinheiro', icone: 'account_balance_wallet' },
  INVESTIMENTO: { rotulo: 'Investimento', icone: 'trending_up' },
  OUTRA: { rotulo: 'Outra', icone: 'payments' },
};

// Sigla da conta no círculo colorido (Nubank -> NU, Banco Inter -> BI).
export function siglaConta(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return (partes.length > 1 ? partes[0][0] + partes[1][0] : nome.slice(0, 2)).toUpperCase();
}
