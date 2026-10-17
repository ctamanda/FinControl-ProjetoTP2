import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api';
import { rotaInicial } from '../acesso';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtClaims, LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.model';
import { Usuario } from '../../models/usuario.model';

const TOKEN_KEY = 'fincontrol_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly usuarios = inject(UsuarioService);

  private readonly tokenAtual = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this.tokenAtual.asReadonly();
  readonly claims = computed(() => decodificar(this.tokenAtual()));
  readonly email = computed(() => this.claims()?.upn ?? '');
  readonly isSuperAdmin = computed(() => this.claims()?.groups?.includes('SUPER_ADMIN') ?? false);

  isLoggedIn(): boolean {
    const claims = this.claims();
    if (!claims) {
      return false;
    }
    // exp vem em segundos; token vencido é tratado como deslogado.
    if (claims.exp * 1000 <= Date.now()) {
      this.limpar();
      return false;
    }
    return true;
  }

  login(dados: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, dados)
      .pipe(tap((res) => this.salvar(res.token)));
  }

  // 201 com os dados públicos do usuário criado (sem senha).
  register(dados: RegisterRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${API_URL}/auth/register`, dados);
  }

  logout(motivo?: 'expirou' | 'desativado'): void {
    this.limpar();
    this.router.navigate(['/login'], { queryParams: motivo ? { motivo } : {} });
  }

  // Depende do perfil carregado (módulos, empresa pendente); ver core/acesso.ts.
  rotaInicial(): string {
    return rotaInicial(this.usuarios.perfil());
  }

  private salvar(token: string): void {
    this.usuarios.limpar(); // perfil de outra sessão não vale para o novo token
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenAtual.set(token);
  }

  private limpar(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenAtual.set(null);
    this.usuarios.limpar();
  }
}

// Lê o payload do JWT (base64url). Só para exibir dados na tela:
// quem valida a assinatura é o back, a cada requisição.
function decodificar(token: string | null): JwtClaims | null {
  if (!token) {
    return null;
  }
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}
