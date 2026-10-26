import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api';
import { ContaFinanceira, ContaRequest } from '../models/conta.model';

// Contas financeiras da conta pessoal ou da empresa (o back filtra pelo dono do token).
@Injectable({ providedIn: 'root' })
export class ContaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/contas`;

  // mes = 'yyyy-MM' (padrão: mês atual); inativas = incluir as arquivadas.
  listar(mes?: string, inativas = false): Observable<ContaFinanceira[]> {
    let params = new HttpParams();
    if (mes) params = params.set('mes', mes);
    if (inativas) params = params.set('inativas', 'true');
    return this.http.get<ContaFinanceira[]>(this.apiUrl, { params });
  }

  criar(dados: ContaRequest): Observable<ContaFinanceira> {
    return this.http.post<ContaFinanceira>(this.apiUrl, dados);
  }

  alterar(id: number, dados: ContaRequest): Observable<ContaFinanceira> {
    return this.http.put<ContaFinanceira>(`${this.apiUrl}/${id}`, dados);
  }

  // Arquivar esconde a conta das escolhas sem apagar os lançamentos.
  alterarAtiva(id: number, ativa: boolean): Observable<ContaFinanceira> {
    return this.http.patch<ContaFinanceira>(`${this.apiUrl}/${id}/${ativa ? 'reativar' : 'arquivar'}`, null);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
