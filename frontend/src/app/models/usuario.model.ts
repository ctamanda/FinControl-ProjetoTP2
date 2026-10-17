export type Role = 'SUPER_ADMIN' | 'PESSOAL' | 'ADMIN_EMPRESA' | 'USUARIO_EMPRESA';
export type TipoConta = 'PESSOAL' | 'EMPRESA';
export type TipoEmpresa = 'MEI' | 'MICROEMPRESA';

export type Modulo =
  | 'DASHBOARD'
  | 'CONTAS'
  | 'RECEITAS'
  | 'DESPESAS'
  | 'LANCAMENTOS'
  | 'RECORRENTES'
  | 'CARTOES'
  | 'CATEGORIAS'
  | 'CLIENTES'
  | 'FORNECEDORES'
  | 'TAGS'
  | 'ORCAMENTOS'
  | 'RELATORIOS'
  | 'IMPORTACAO'
  | 'EXPORTACAO'
  | 'USUARIOS';

export interface InfoModulo {
  rotulo: string;
  descricao: string;
  icone: string;
  pessoal: boolean; // pode ser escolhido numa conta pessoal
  empresa: boolean; // pode ser liberado pelo admin para um usuário comum
  disponivel: boolean; // já tem tela; os demais aparecem como "em breve"
}

// Mesma regra do enum Modulo do back.
export const MODULOS: Record<Modulo, InfoModulo> = {
  DASHBOARD: { rotulo: 'Dashboard', descricao: 'Resumo do mês, saldo e gráficos', icone: 'home', pessoal: true, empresa: true, disponivel: true },
  CONTAS: { rotulo: 'Contas financeiras', descricao: 'Bancos, carteiras e saldos', icone: 'account_balance', pessoal: true, empresa: true, disponivel: false },
  RECEITAS: { rotulo: 'Receitas', descricao: 'Registrar entradas de dinheiro', icone: 'arrow_downward', pessoal: true, empresa: true, disponivel: true },
  DESPESAS: { rotulo: 'Despesas', descricao: 'Registrar saídas de dinheiro', icone: 'arrow_upward', pessoal: true, empresa: true, disponivel: true },
  LANCAMENTOS: { rotulo: 'Lançamentos', descricao: 'Receitas e despesas juntas', icone: 'swap_vert', pessoal: true, empresa: true, disponivel: true },
  RECORRENTES: { rotulo: 'Lançamentos recorrentes', descricao: 'Contas que se repetem todo mês', icone: 'event_repeat', pessoal: true, empresa: true, disponivel: false },
  CARTOES: { rotulo: 'Cartões de crédito', descricao: 'Faturas e limites dos cartões', icone: 'credit_card', pessoal: true, empresa: true, disponivel: false },
  CATEGORIAS: { rotulo: 'Categorias', descricao: 'Organizar os lançamentos', icone: 'sell', pessoal: true, empresa: true, disponivel: true },
  CLIENTES: { rotulo: 'Clientes', descricao: 'Quem compra da empresa', icone: 'groups', pessoal: false, empresa: true, disponivel: false },
  FORNECEDORES: { rotulo: 'Fornecedores', descricao: 'De quem a empresa compra', icone: 'local_shipping', pessoal: false, empresa: true, disponivel: false },
  TAGS: { rotulo: 'Tags', descricao: 'Etiquetas livres nos lançamentos', icone: 'label', pessoal: true, empresa: true, disponivel: false },
  ORCAMENTOS: { rotulo: 'Orçamentos', descricao: 'Metas de gasto por categoria', icone: 'savings', pessoal: true, empresa: true, disponivel: false },
  RELATORIOS: { rotulo: 'Relatórios', descricao: 'Análises por período', icone: 'bar_chart', pessoal: true, empresa: true, disponivel: false },
  IMPORTACAO: { rotulo: 'Importação', descricao: 'Trazer extratos e planilhas', icone: 'upload_file', pessoal: true, empresa: true, disponivel: false },
  EXPORTACAO: { rotulo: 'Exportação', descricao: 'Baixar dados em planilha', icone: 'download', pessoal: true, empresa: true, disponivel: false },
  USUARIOS: { rotulo: 'Administração de usuários', descricao: 'Equipe e permissões', icone: 'manage_accounts', pessoal: false, empresa: false, disponivel: true },
};

export const ROTULOS_ROLE: Record<Role, string> = {
  SUPER_ADMIN: 'Administrador do FinControl',
  PESSOAL: 'Conta pessoal',
  ADMIN_EMPRESA: 'Administrador da empresa',
  USUARIO_EMPRESA: 'Usuário da empresa',
};

export const ROTULOS_TIPO_EMPRESA: Record<TipoEmpresa, string> = {
  MEI: 'MEI',
  MICROEMPRESA: 'Microempresa',
};

export interface EmpresaResumo {
  id: number;
  nome: string;
  tipo: TipoEmpresa;
  responsavel: boolean; // o usuário é o administrador principal
}

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  telefone: string | null;
  profissao: string | null;
  role: Role;
  ativo: boolean;
  modulos: Modulo[]; // módulos que pode usar de fato
  empresa: EmpresaResumo | null;
  empresaPendente: boolean; // admin de empresa que ainda não cadastrou a empresa
  dataCadastro?: string;
}

export interface UsuarioUpdate {
  nome: string;
  telefone: string;
  profissao?: string | null;
  modulos?: Modulo[] | null; // só conta pessoal
}
