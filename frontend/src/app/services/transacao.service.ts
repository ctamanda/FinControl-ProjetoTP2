import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { API_URL } from '../core/api';
import { PageResponse } from '../models/page-response.model';
import { FiltroLancamentos, Transacao } from '../models/transacao.model';

type TransacaoPayload = Pick<Transacao, 'descricao' | 'valor' | 'data' | 'tipo' | 'pago'> & {
    idCategoria?: number;
    idConta?: number;
    dataPagamento?: string | null;
};

// Limite do back (TransacaoServiceImpl.PAGE_SIZE_MAX).
const PAGE_SIZE_MAX = 100;

@Injectable({providedIn: 'root'})
export class TransacaoService {
    // O back filtra pelo usuário do JWT: cada um só vê as próprias transações.
    private readonly apiUrl: string = `${API_URL}/transacoes`;

    constructor(private http: HttpClient) {}

    private toPayload(transacao: Transacao): TransacaoPayload {
        return {
            descricao: transacao.descricao,
            valor: transacao.valor,
            data: transacao.data,
            tipo: transacao.tipo,
            pago: transacao.pago,
            dataPagamento: transacao.pago ? transacao.dataPagamento : null,
            idCategoria: transacao.categoria?.id,
            idConta: transacao.conta?.id,
        };
    }

    // page é base 0, igual ao back. Filtros vazios não são enviados.
    findAll(page: number = 0, pageSize: number = 10, filtro: FiltroLancamentos = {}): Observable<PageResponse<Transacao>> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        for (const [chave, valor] of Object.entries(filtro)) {
            if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
                params = params.set(chave, String(valor).trim());
            }
        }
        return this.http.get<PageResponse<Transacao>>(this.apiUrl, { params });
    }

    // Busca todas as páginas (para os totais e gráficos do dashboard).
    findTodas(maxPaginas: number = 10, filtro: FiltroLancamentos = {}): Observable<Transacao[]> {
        return this.findAll(0, PAGE_SIZE_MAX, filtro).pipe(
            expand((res) =>
                res.page + 1 < Math.min(res.totalPages, maxPaginas)
                    ? this.findAll(res.page + 1, PAGE_SIZE_MAX, filtro)
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

    // Conta a pagar/receber vira paga. Sem data, vale hoje; sem conta, fica a do lançamento.
    pagar(id: number, dados: { dataPagamento?: string; idConta?: number } = {}): Observable<Transacao> {
        return this.http.patch<Transacao>(`${this.apiUrl}/${id}/pagar`, dados);
    }

    // Desfaz o pagamento (volta a ser pendente).
    reabrir(id: number): Observable<Transacao> {
        return this.http.patch<Transacao>(`${this.apiUrl}/${id}/reabrir`, null);
    }

    delete(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}
