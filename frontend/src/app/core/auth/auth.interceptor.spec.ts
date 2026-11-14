import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { API_URL } from '../api';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenAtual: string | null = 'token-jwt-teste-123';

  beforeEach(() => {
    tokenAtual = 'token-jwt-teste-123';

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            token: () => tokenAtual,
            logout: () => {},
          },
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve adicionar o header Authorization: Bearer <token> em requisições para a API do FinControl', () => {
    tokenAtual = 'meu-token-jwt-autenticado';

    http.get(`${API_URL}/transacoes`).subscribe();

    const req = httpTesting.expectOne(`${API_URL}/transacoes`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer meu-token-jwt-autenticado');
    req.flush([]);
  });

  it('não deve adicionar o header se não houver token na sessão', () => {
    tokenAtual = null;

    http.get(`${API_URL}/transacoes`).subscribe();

    const req = httpTesting.expectOne(`${API_URL}/transacoes`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('não deve adicionar o header Authorization em rotas públicas como /auth/login', () => {
    tokenAtual = 'meu-token-jwt-autenticado';

    http.post(`${API_URL}/auth/login`, { email: 'a@b.com', password: '123' }).subscribe();

    const req = httpTesting.expectOne(`${API_URL}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
