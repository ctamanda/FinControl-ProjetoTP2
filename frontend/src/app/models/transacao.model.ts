import { Pessoa } from './admin.model';
import { Categoria } from './categoria.model';
import { ContaResumo } from './conta.model';

export type TipoTransacao = 'RECEITA' | 'DESPESA';
// Calculado pelo back: pendente com o vencimento já passado = atrasado.
export type StatusPagamento = 'PAGO' | 'PENDENTE' | 'ATRASADO';

export class Transacao {
    id!: number;
    descricao!: string;
    valor!: number;
    data!: string; // LocalDate 'yyyy-MM-dd': data do lançamento ou, se pendente, o vencimento
    tipo!: TipoTransacao;
    categoria?: Categoria;
    usuario?: Pessoa; // dono do lançamento
    conta?: ContaResumo;
    pago!: boolean; // false = conta a pagar/receber
    dataPagamento?: string | null;
    status?: StatusPagamento;
}

// Filtros de GET /transacoes (todos opcionais). PENDENTE inclui os atrasados.
export interface FiltroLancamentos {
    descricao?: string;
    tipo?: TipoTransacao | null;
    status?: StatusPagamento | null;
    mes?: string | null; // 'yyyy-MM'
    idConta?: number | null;
}

export const ROTULOS_STATUS: Record<StatusPagamento, { receita: string; despesa: string }> = {
    PAGO: { receita: 'Recebido', despesa: 'Pago' },
    PENDENTE: { receita: 'A receber', despesa: 'A pagar' },
    ATRASADO: { receita: 'Atrasado', despesa: 'Atrasado' },
};
