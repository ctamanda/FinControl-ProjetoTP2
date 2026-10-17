import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { API_URL } from '../api';
import { Usuario, UsuarioUpdate } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/usuarios/me`;

  // Perfil do usuário logado (perfil, módulos, empresa), compartilhado com guards, menu e telas.
  readonly perfil = signal<Usuario | null>(null);

  carregarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl).pipe(tap((u) => this.perfil.set(u)));
  }

  // Usa o perfil já carregado; só vai ao back na primeira vez (ou depois de limpar).
  garantirPerfil(): Observable<Usuario> {
    const atual = this.perfil();
    return atual ? of(atual) : this.carregarPerfil();
  }

  atualizarPerfil(dados: UsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(this.apiUrl, dados).pipe(tap((u) => this.perfil.set(u)));
  }

  limpar(): void {
    this.perfil.set(null);
  }
}
