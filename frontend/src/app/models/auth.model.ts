import { AtividadeMei, PerfilFiscal, Role } from './usuario.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  nome: string;
  password: string;
  perfilFiscal: PerfilFiscal;
  atividadeMei?: AtividadeMei | null;
}

// Claims emitidas pelo back (AuthResource): upn = e-mail, groups = [role].
export interface JwtClaims {
  iss: string;
  upn: string;
  groups: Role[];
  exp: number; // segundos desde epoch
  iat: number;
}
