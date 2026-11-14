export interface Plano {
  id: number;
  nome: string;
  descricao?: string;
  valorMensal: number;
  limiteContas?: number | null;
  limiteTransacoesMes?: number | null;
  ativo?: boolean;
}

export interface Assinatura {
  id: number;
  plano: Plano;
  status: string;
  dataInicio: string;
  dataFim?: string | null;
}
