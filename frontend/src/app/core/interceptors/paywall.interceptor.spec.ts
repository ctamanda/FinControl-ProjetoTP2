import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { vi } from 'vitest';
import { paywallInterceptor } from './paywall.interceptor';
import { of } from 'rxjs';

describe('PaywallInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let dialogMock: any;

  beforeEach(() => {
    // O mock PRECISA ter 'openDialogs' para o interceptor não quebrar
    dialogMock = { 
      open: vi.fn().mockReturnValue({ afterClosed: () => of(true) }),
      openDialogs: [] 
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialog, useValue: dialogMock },
        provideHttpClient(withInterceptors([paywallInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve passar requisições normais', () => {
    http.get('/test').subscribe();
    const req = httpMock.expectOne('/test');
    req.flush({ success: true });
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('deve abrir o dialog no erro 402 e repassar o erro', () => {
    http.get('/protected').subscribe({
      error: (err) => {
        expect(err.status).toBe(402);
      }
    });

    const req = httpMock.expectOne('/protected');
    req.flush(
      { detail: 'Limite atingido' }, 
      { status: 402, statusText: 'Payment Required' }
    );

    expect(dialogMock.open).toHaveBeenCalled();
  });
});