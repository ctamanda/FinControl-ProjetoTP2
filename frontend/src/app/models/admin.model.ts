import { Categoria, TipoCategoria } from './categoria.model';
import { Escopo, TipoTransacao } from './transacao.model';
import { EmpresaResumo, Modulo, Role, TipoEmpresa } from './usuario.model';

// Modelos do painel do administrador do FinControl (SUPER_ADMIN).

export interface CategoriaRanking {
  nome: string;
  tipo: TipoCategoria;
  totalTransacoes: number;
  totalContas: number; // em quantas contas/empresas a categoria aparece
}

// totalAdmins = administradores do FinControl (SUPER_ADMIN); totalUsers = todos os demais.
export interface Estatisticas {
  totalUsuarios: number;
  usuariosAtivos: number;
  usuariosInativos: number;
  totalAdmins: number;
  totalUsers: number;
  totalContasPessoais: number;
  totalEmpresas: number;
  empresasAtivas: number;
  totalUsuariosEmpresa: number;
  totalTransacoes: number;
  totalCategorias: number;
  mediaTransacoesPorUsuario: number;
  volumeDadosBytes: number | null; // tamanho do banco (nulo se o banco não informar)
  totalRegistros: number;
  novosUsuarios30Dias: number;
  transacoes30Dias: number;
  categoriasMaisUtilizadas: CategoriaRanking[];
  transacoesPorMes: { mes: string; quantidade: number }[]; // mes = 'yyyy-MM'
}

export interface ParametroFiscal {
  id?: number;
  chave: string;
  valor: number;
  vigenciaInicio: string; // 'yyyy-MM-dd'
  vigenciaFim: string; // 'yyyy-MM-dd'
  descricao?: string | null;
  tipoEmpresa?: TipoEmpresa | null; // nulo = MEI e Microempresa
  ativo?: boolean;
  ultimaAlteracao?: string | null;
  alteradoPor?: string | null;
}

export interface Pessoa {
  id: number;
  nome: string;
  email: string;
}

export interface AdminEmpresa {
  id: number;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  tipo: TipoEmpresa;
  telefone: string;
  email: string;
  ativo: boolean;
  responsavel: Pessoa;
  totalUsuarios: number;
  totalTransacoes: number;
  dataCadastro: string;
}

export interface AdminTransacao {
  id: number;
  data: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  escopo: Escopo;
  categoria: Categoria;
  empresa: EmpresaResumo | null;
  usuario: Pessoa;
}

export interface FiltroTransacoes {
  inicio?: string;
  fim?: string;
  idEmpresa?: number | null;
  idUsuario?: number | null;
  categoria?: string;
  tipo?: TipoTransacao | '';
  escopo?: Escopo | '';
  descricao?: string;
}

export interface CategoriaPadrao {
  id: number;
  nome: string;
  tipo: TipoCategoria;
  cor: string | null;
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

export interface AdminUsuarioRequest {
  nome: string;
  email: string;
  telefone: string;
  profissao: string | null;
  role: Role;
  idEmpresa: number | null;
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

export type SituacaoVigencia = 'VIGENTE' | 'FUTURO' | 'ENCERRADO';

export function situacaoVigencia(p: ParametroFiscal, hoje = hojeIso()): SituacaoVigencia {
  if (hoje < p.vigenciaInicio) return 'FUTURO';
  if (hoje > p.vigenciaFim) return 'ENCERRADO';
  return 'VIGENTE';
}

// Data local no formato do back (LocalDate); toISOString() usaria UTC e erraria o dia à noite.
export function hojeIso(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// 15 800 000 -> "15,1 MB"
export function formatarBytes(bytes: number | null | undefined): string {
  if (bytes == null) return '—';
  const unidades = ['B', 'KB', 'MB', 'GB', 'TB'];
  let valor = bytes;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i++;
  }
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: i ? 1 : 0 })} ${unidades[i]}`;
}
