import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { API_URL } from '../core/api';
import { PageResponse } from '../models/page-response.model';
import { Transacao } from '../models/transacao.model';

type TransacaoPayload = Omit<Transacao, 'id' | 'categoria'> & {
    idCategoria?: number;
};

// Limite do back (TransacaoServiceImpl.PAGE_SIZE_MAX).
const PAGE_SIZE_MAX = 100;

@Injectable({providedIn: 'root'})
export class TransacaoService {
    // O back filtra pelo usuário do JWT: cada um só vê as próprias transações.
    private readonly apiUrl: string = `${API_URL}/transacoes`;

    constructor(private http: HttpClient) {}

    private toPayload(transacao: Transacao): TransacaoPayload {
        const { id, categoria, ...dados } = transacao;
        return {
            ...dados,
            idCategoria: categoria?.id,
        };
    }

    // page é base 0, igual ao back. descricao vazia = sem filtro.
    findAll(page: number = 0, pageSize: number = 10, descricao: string = ''): Observable<PageResponse<Transacao>> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);

        if (descricao.trim()) {
            params = params.set('descricao', descricao.trim());
        }

        return this.http.get<PageResponse<Transacao>>(this.apiUrl, { params });
    }

    // Busca todas as páginas (para os totais e gráficos do dashboard).
    findTodas(maxPaginas: number = 10): Observable<Transacao[]> {
        return this.findAll(0, PAGE_SIZE_MAX).pipe(
            expand((res) =>
                res.page + 1 < Math.min(res.totalPages, maxPaginas)
                    ? this.findAll(res.page + 1, PAGE_SIZE_MAX)
                    : EMPTY
            ),
            reduce((todas, res) => todas.concat(res.items), [] as Transacao[])
        );
    }

    findById(id: number | string): Observable<Transacao> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Transacao>(url);
    }

    create(transacao: Transacao): Observable<Transacao> {
        return this.http.post<Transacao>(this.apiUrl, this.toPayload(transacao));
    }

    update(id: number, transacao: Transacao): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<void>(url, this.toPayload(transacao));
    }

    delete(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}
