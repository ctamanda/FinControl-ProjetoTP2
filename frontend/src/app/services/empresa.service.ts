import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api';
import { Empresa, EmpresaRequest, UsuarioEmpresaRequest, UsuarioEmpresaUpdate } from '../models/empresa.model';
import { Usuario } from '../models/usuario.model';

// Empresa do usuário logado e os usuários dela (estes só para o admin da empresa).
@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/empresa`;

  buscar(): Observable<Empresa> {
    return this.http.get<Empresa>(this.apiUrl);
  }

  cadastrar(dados: EmpresaRequest): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, dados);
  }

  alterar(dados: EmpresaRequest): Observable<Empresa> {
    return this.http.put<Empresa>(this.apiUrl, dados);
  }

  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  buscarUsuario(id: number | string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  criarUsuario(dados: UsuarioEmpresaRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, dados);
  }

  alterarUsuario(id: number, dados: UsuarioEmpresaUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, dados);
  }

  // Desativar remove o acesso sem apagar o cadastro nem o histórico.
  alterarAtivo(id: number, ativo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuarios/${id}/${ativo ? 'ativar' : 'desativar'}`, null);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }
}
