import { HttpErrorResponse } from '@angular/common/http';

export const API_URL = 'http://localhost:8080';

// O back responde erros em RFC 7807 (Problem): o texto útil vem em "detail",
// e erros de validação trazem a lista "errors" com { field, message }.
export function mensagemDeErro(error: HttpErrorResponse, padrao: string): string {
  if (error.status === 0) {
    return 'Não foi possível conectar ao servidor.';
  }
  if (error.status === 403) {
    return 'Você não tem permissão para acessar este recurso.';
  }
  // 500 traz só "erro inesperado": a mensagem da tela explica melhor o contexto.
  if (error.status >= 500) {
    return padrao;
  }

  const problem = error.error;
  if (problem?.errors?.length) {
    return problem.errors.map((e: { message: string }) => e.message).join(' ');
  }
  if (typeof problem === 'string' && problem.trim()) {
    return problem;
  }
  return problem?.detail ?? padrao;
}
