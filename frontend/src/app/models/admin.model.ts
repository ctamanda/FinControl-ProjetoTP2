import { Categoria, TipoCategoria } from './categoria.model';
import { TipoTransacao } from './transacao.model';
import { Modulo, Role } from './usuario.model';

// Modelos do painel do administrador do FinControl (SUPER_ADMIN).

export interface CategoriaRanking {
  nome: string;
  tipo: TipoCategoria;
  totalTransacoes: number;
  totalContas: number; // em quantas contas a categoria aparece
}

// Indicador do mês escolhido, com o mês anterior para calcular a variação.
export interface Indicador<T = number> {
  atual: T;
  anterior: T;
}

// GET /admin/painel?mes=aaaa-mm: tudo sai do que está gravado no banco.
export interface PainelAdmin {
  mes: string;
  usuariosAtivos: Indicador; // contas pessoais com lançamento no mês
  novosCadastros: Indicador;
  lancamentos: Indicador;
  volume: Indicador; // soma de receitas + despesas do mês
  totais: { usuarios: number; ativos: number; inativos: number; administradores: number; contasPessoaisAtivas: number };
  cadastrosPorMes: { mes: string; contasPessoais: number }[]; // 6 meses até o escolhido
  modulos: { modulo: Modulo; ligados: number; comDados: number | null }[];
  categoriasPadrao: UsoCategoriaPadrao[];
  seguranca: {
    contasBloqueadasHoje: number;
    senhasTrocadasSemana: number;
    sessoesEncerradasSemana: number;
    emailsTrocadosSemana: number;
  };
}

export interface UsoCategoriaPadrao {
  id: number;
  nome: string;
  tipo: TipoCategoria;
  cor: string | null;
  icone: string | null;
  ativo: boolean;
  lancamentos: number;
  usuarios: number;
}

export interface Pessoa {
  id: number;
  nome: string;
  email: string;
}

export interface AdminTransacao {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: Categoria;
  usuario: Pessoa;
}

export interface FiltroTransacoes {
  inicio?: string;
  fim?: string;
  idUsuario?: number | null;
  categoria?: string;
  tipo?: TipoTransacao | '';
  descricao?: string;
}

export interface CategoriaPadrao {
  id: number;
  nome: string;
  tipo: TipoCategoria;
  cor: string | null;
  icone: string | null;
  ativo: boolean;
  ultimaAlteracao: string | null;
}

export interface RegistroAuditoria {
  id: number;
  dataHora: string;
  autorId: number | null;
  autorEmail: string;
  acao: string;
  alvo: string;
  detalhe: string | null;
}

export interface FiltroAuditoria {
  busca?: string;
  autor?: string;
  acao?: string;
  inicio?: string; // aaaa-mm-dd
  fim?: string;
}

export interface AdminUsuarioRequest {
  nome: string;
  email: string;
  telefone: string;
  profissao: string | null;
  role: Role;
  modulos: Modulo[];
  password: string;
  confirmPassword: string;
}

export interface AdminUsuarioUpdate {
  nome: string;
  telefone: string;
  profissao: string | null;
  role: Role;
  modulos: Modulo[] | null;
}

// Data local no formato do back (LocalDate); toISOString() usaria UTC e erraria o dia à noite.
export function hojeIso(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
