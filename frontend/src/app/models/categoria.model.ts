export type TipoCategoria = 'RECEITA' | 'DESPESA';

export class Categoria {
    id!: number;
    nome!: string;
    tipo?: TipoCategoria;
    cor?: string | null;
    icone?: string | null; // Material Icons; vazio = ícone padrão do tipo
}
