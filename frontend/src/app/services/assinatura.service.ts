import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../core/api';
import { Assinatura, Plano } from '../models/assinatura.model';

@Injectable({ providedIn: 'root' })
export class AssinaturaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/assinaturas`;

  readonly assinaturaAtual = signal<Assinatura | null>(null);

  buscarMinhaAssinatura(): Observable<Assinatura> {
    return this.http.get<Assinatura>(`${this.apiUrl}/me`).pipe(
      tap((assinatura) => this.assinaturaAtual.set(assinatura))
    );
  }

  listarPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${this.apiUrl}/planos`);
  }

  fazerUpgrade(planoId: number): Observable<Assinatura> {
    return this.http.post<Assinatura>(`${this.apiUrl}/upgrade/${planoId}`, {}).pipe(
      tap((assinatura) => this.assinaturaAtual.set(assinatura))
    );
  }
}
