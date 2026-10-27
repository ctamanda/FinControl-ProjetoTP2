export type Role = 'SUPER_ADMIN' | 'PESSOAL';

export type Modulo =
  | 'DASHBOARD'
  | 'CONTAS'
  | 'RECEITAS'
  | 'DESPESAS'
  | 'LANCAMENTOS'
  | 'RECORRENTES'
  | 'CARTOES'
  | 'CATEGORIAS'
  | 'TAGS'
  | 'ORCAMENTOS'
  | 'RELATORIOS'
  | 'IMPORTACAO'
  | 'EXPORTACAO';

export interface InfoModulo {
  rotulo: string;
  descricao: string;
  icone: string;
  disponivel: boolean; // já tem tela; os demais aparecem como "em breve"
}

// Mesma lista do enum Modulo do back.
export const MODULOS: Record<Modulo, InfoModulo> = {
  DASHBOARD: { rotulo: 'Dashboard', descricao: 'Resumo do mês, saldo e gráficos', icone: 'home', disponivel: true },
  CONTAS: { rotulo: 'Contas financeiras', descricao: 'Bancos, carteiras e saldos', icone: 'account_balance', disponivel: true },
  RECEITAS: { rotulo: 'Receitas', descricao: 'Registrar entradas de dinheiro', icone: 'arrow_downward', disponivel: true },
  DESPESAS: { rotulo: 'Despesas', descricao: 'Registrar saídas de dinheiro', icone: 'arrow_upward', disponivel: true },
  LANCAMENTOS: { rotulo: 'Lançamentos', descricao: 'Receitas e despesas juntas', icone: 'swap_vert', disponivel: true },
  RECORRENTES: { rotulo: 'Lançamentos recorrentes', descricao: 'Contas que se repetem todo mês', icone: 'event_repeat', disponivel: false },
  CARTOES: { rotulo: 'Cartões de crédito', descricao: 'Faturas e limites dos cartões', icone: 'credit_card', disponivel: false },
  CATEGORIAS: { rotulo: 'Categorias', descricao: 'Organizar os lançamentos', icone: 'sell', disponivel: true },
  TAGS: { rotulo: 'Tags', descricao: 'Etiquetas livres nos lançamentos', icone: 'label', disponivel: false },
  ORCAMENTOS: { rotulo: 'Orçamentos', descricao: 'Metas de gasto por categoria', icone: 'savings', disponivel: false },
  RELATORIOS: { rotulo: 'Relatórios', descricao: 'Análises por período', icone: 'bar_chart', disponivel: false },
  IMPORTACAO: { rotulo: 'Importação', descricao: 'Trazer extratos e planilhas', icone: 'upload_file', disponivel: false },
  EXPORTACAO: { rotulo: 'Exportação', descricao: 'Baixar dados em planilha', icone: 'download', disponivel: false },
};

export const ROTULOS_ROLE: Record<Role, string> = {
  SUPER_ADMIN: 'Administrador do FinControl',
  PESSOAL: 'Conta pessoal',
};

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  telefone: string | null;
  profissao: string | null;
  role: Role;
  ativo: boolean;
  modulos: Modulo[]; // módulos que pode usar de fato
  dataCadastro?: string;
  ultimoAcesso?: string | null; // último login (nulo se ainda não entrou)
}

// Alterar os próprios dados exige a senha atual (o back confere).
export interface UsuarioUpdate {
  nome: string;
  telefone: string;
  profissao?: string | null; // só conta pessoal
  senhaAtual: string;
}
