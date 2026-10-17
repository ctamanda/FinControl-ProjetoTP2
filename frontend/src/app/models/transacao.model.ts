import { Categoria } from './categoria.model';

export type TipoTransacao = 'RECEITA' | 'DESPESA';
export type Escopo = 'PESSOAL' | 'EMPRESA';

export class Transacao {
    id!: number;
    descricao!: string;
    valor!: number;
    data!: string; // LocalDate serializado como 'yyyy-MM-dd'
    tipo!: TipoTransacao;
    escopo!: Escopo;
    categoria?: Categoria;
}
