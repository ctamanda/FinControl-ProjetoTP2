import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../api';
import { Usuario, UsuarioUpdate } from '../../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/usuarios/me`;

  // Perfil do usuário logado, compartilhado com o cabeçalho do layout.
  readonly perfil = signal<Usuario | null>(null);

  carregarPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl).pipe(tap((u) => this.perfil.set(u)));
  }

  atualizarPerfil(dados: UsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(this.apiUrl, dados).pipe(tap((u) => this.perfil.set(u)));
  }
}
