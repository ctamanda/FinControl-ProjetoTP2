import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api';
import { AuthService } from './auth.service';

// Anexa "Authorization: Bearer <jwt>" em toda chamada à API
// e derruba a sessão quando o back responde 401 (token vencido ou inválido).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const ehApi = req.url.startsWith(API_URL);
  const ehRotaPublica = req.url.startsWith(`${API_URL}/auth/`);

  const requisicao =
    token && ehApi && !ehRotaPublica
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(requisicao).pipe(
    catchError((error: HttpErrorResponse) => {
      // No /auth/login o 401 significa "senha errada": a tela de login trata.
      if (error.status === 401 && ehApi && !ehRotaPublica) {
        auth.logout('expirou');
      }
      return throwError(() => error);
    }),
  );
};
