export type PerfilFiscal = 'PF' | 'MEI' | 'ME';
export type AtividadeMei = 'COMERCIO' | 'SERVICO' | 'AMBOS';
export type Role = 'ADMIN' | 'USER';

export const ROTULOS_PERFIL_FISCAL: Record<PerfilFiscal, string> = {
  PF: 'Pessoa Física',
  MEI: 'Microempreendedor Individual (MEI)',
  ME: 'Microempresa (ME)',
};

export const ROTULOS_ATIVIDADE_MEI: Record<AtividadeMei, string> = {
  COMERCIO: 'Comércio',
  SERVICO: 'Serviço',
  AMBOS: 'Comércio e Serviço',
};

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  perfilFiscal: PerfilFiscal;
  atividadeMei?: AtividadeMei | null;
  role: Role;
}

export interface UsuarioUpdate {
  nome: string;
  perfilFiscal: PerfilFiscal;
  atividadeMei?: AtividadeMei | null;
}
