import { Modulo, Role, TipoEmpresa } from './usuario.model';

export interface Empresa {
  id: number;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string; // só dígitos
  tipo: TipoEmpresa;
  telefone: string;
  email: string;
  idResponsavel: number;
}

export interface EmpresaRequest {
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  tipo: TipoEmpresa;
  telefone: string;
  email: string;
}

export type RoleEmpresa = Extract<Role, 'ADMIN_EMPRESA' | 'USUARIO_EMPRESA'>;

export interface UsuarioEmpresaRequest {
  nome: string;
  email: string;
  telefone: string;
  role: RoleEmpresa;
  modulos: Modulo[];
  password: string;
  confirmPassword: string;
}

export interface UsuarioEmpresaUpdate {
  nome: string;
  telefone: string;
  role: RoleEmpresa;
  modulos: Modulo[];
}
