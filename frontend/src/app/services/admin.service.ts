import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api';
import {
  AdminEmpresa,
  AdminTransacao,
  AdminUsuarioRequest,
  AdminUsuarioUpdate,
  CategoriaPadrao,
  CategoriaRanking,
  Estatisticas,
  FiltroTransacoes,
  ParametroFiscal,
  RegistroAuditoria,
} from '../models/admin.model';
import { EmpresaRequest } from '../models/empresa.model';
import { PageResponse } from '../models/page-response.model';
import { Role, Usuario } from '../models/usuario.model';
import { TipoCategoria } from '../models/categoria.model';

// Endpoints exclusivos do administrador do FinControl (@RolesAllowed("SUPER_ADMIN") no back).
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/admin`;

  estatisticas(): Observable<Estatisticas> {
    return this.http.get<Estatisticas>(`${this.apiUrl}/estatisticas`);
  }

  // ---------------------------------------------------------- usuários

  listarUsuarios(
    filtro: { busca?: string; role?: Role | ''; ativo?: boolean | null; idEmpresa?: number | null },
    page = 0,
    pageSize = 20,
  ): Observable<PageResponse<Usuario>> {
    return this.http.get<PageResponse<Usuario>>(`${this.apiUrl}/usuarios`, {
      params: parametros({ ...filtro, page, pageSize }),
    });
  }

  buscarUsuario(id: number | string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  criarUsuario(dados: AdminUsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, dados);
  }

  alterarUsuario(id: number, dados: AdminUsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, dados);
  }

  alterarAtivoUsuario(id: number, ativo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/usuarios/${id}/${ativo ? 'ativar' : 'desativar'}`, null);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }

  // ---------------------------------------------------------- empresas

  listarEmpresas(filtro: { busca?: string; ativo?: boolean | null }, page = 0, pageSize = 20): Observable<PageResponse<AdminEmpresa>> {
    return this.http.get<PageResponse<AdminEmpresa>>(`${this.apiUrl}/empresas`, {
      params: parametros({ ...filtro, page, pageSize }),
    });
  }

  buscarEmpresa(id: number | string): Observable<AdminEmpresa> {
    return this.http.get<AdminEmpresa>(`${this.apiUrl}/empresas/${id}`);
  }

  alterarEmpresa(id: number, dados: EmpresaRequest): Observable<AdminEmpresa> {
    return this.http.put<AdminEmpresa>(`${this.apiUrl}/empresas/${id}`, dados);
  }

  alterarAtivoEmpresa(id: number, ativo: boolean): Observable<AdminEmpresa> {
    return this.http.patch<AdminEmpresa>(`${this.apiUrl}/empresas/${id}/${ativo ? 'ativar' : 'desativar'}`, null);
  }

  // ---------------------------------------------------------- transações (só leitura)

  listarTransacoes(filtro: FiltroTransacoes, page = 0, pageSize = 20): Observable<PageResponse<AdminTransacao>> {
    return this.http.get<PageResponse<AdminTransacao>>(`${this.apiUrl}/transacoes`, {
      params: parametros({ ...filtro, page, pageSize }),
    });
  }

  // ---------------------------------------------------------- categorias

  rankingCategorias(limite = 50): Observable<CategoriaRanking[]> {
    return this.http.get<CategoriaRanking[]>(`${this.apiUrl}/categorias/ranking`, { params: { limite } });
  }

  listarCategoriasPadrao(): Observable<CategoriaPadrao[]> {
    return this.http.get<CategoriaPadrao[]>(`${this.apiUrl}/categorias-padrao`);
  }

  salvarCategoriaPadrao(
    id: number | null,
    dados: { nome: string; tipo: TipoCategoria; cor: string | null },
  ): Observable<CategoriaPadrao> {
    return id
      ? this.http.put<CategoriaPadrao>(`${this.apiUrl}/categorias-padrao/${id}`, dados)
      : this.http.post<CategoriaPadrao>(`${this.apiUrl}/categorias-padrao`, dados);
  }

  alterarAtivoCategoriaPadrao(id: number, ativo: boolean): Observable<CategoriaPadrao> {
    return this.http.patch<CategoriaPadrao>(`${this.apiUrl}/categorias-padrao/${id}/${ativo ? 'ativar' : 'desativar'}`, null);
  }

  // ---------------------------------------------------------- parâmetros fiscais

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

  alterarAtivoParametro(id: number, ativo: boolean): Observable<ParametroFiscal> {
    return this.http.patch<ParametroFiscal>(`${this.apiUrl}/parametros/${id}/${ativo ? 'ativar' : 'desativar'}`, null);
  }

  excluirParametro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/parametros/${id}`);
  }

  // ---------------------------------------------------------- auditoria

  listarAuditoria(filtro: { busca?: string; acao?: string }, page = 0, pageSize = 20): Observable<PageResponse<RegistroAuditoria>> {
    return this.http.get<PageResponse<RegistroAuditoria>>(`${this.apiUrl}/auditoria`, {
      params: parametros({ ...filtro, page, pageSize }),
    });
  }
}

// Monta a query string ignorando filtros vazios.
function parametros(valores: Record<string, unknown>): HttpParams {
  let params = new HttpParams();
  for (const [chave, valor] of Object.entries(valores)) {
    if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
      params = params.set(chave, String(valor).trim());
    }
  }
  return params;
}
