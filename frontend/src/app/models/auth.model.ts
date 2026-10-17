import { Role, TipoConta } from './usuario.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  tipoConta: TipoConta;
  nome: string;
  email: string;
  telefone: string;
  profissao: string | null; // obrigatória na conta pessoal
  password: string;
  confirmPassword: string;
}

// Claims emitidas pelo back (AuthResource): upn = e-mail, groups = [role].
export interface JwtClaims {
  iss: string;
  upn: string;
  groups: Role[];
  exp: number; // segundos desde epoch
  iat: number;
}
