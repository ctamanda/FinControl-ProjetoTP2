import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api';
import { Estatisticas, ParametroFiscal } from '../models/admin.model';

// Endpoints exclusivos do perfil ADMIN (@RolesAllowed("ADMIN") no back).
// Só dados agregados e parâmetros do sistema: nenhum dado individual de usuário (LGPD).
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/admin`;

  estatisticas(): Observable<Estatisticas> {
    return this.http.get<Estatisticas>(`${this.apiUrl}/estatisticas`);
  }

  listarParametros(): Observable<ParametroFiscal[]> {
    return this.http.get<ParametroFiscal[]>(`${this.apiUrl}/parametros`);
  }

  buscarParametro(id: number | string): Observable<ParametroFiscal> {
    return this.http.get<ParametroFiscal>(`${this.apiUrl}/parametros/${id}`);
  }

  criarParametro(parametro: ParametroFiscal): Observable<ParametroFiscal> {
    return this.http.post<ParametroFiscal>(`${this.apiUrl}/parametros`, parametro);
  }

  atualizarParametro(id: number, parametro: ParametroFiscal): Observable<ParametroFiscal> {
    return this.http.put<ParametroFiscal>(`${this.apiUrl}/parametros/${id}`, parametro);
  }

  excluirParametro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parametros/${id}`);
  }
}
