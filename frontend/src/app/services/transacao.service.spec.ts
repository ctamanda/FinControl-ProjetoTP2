import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TransacaoService } from './transacao.service';
import { API_URL } from '../core/api';
import { PageResponse } from '../models/page-response.model';
import { Transacao } from '../models/transacao.model';

describe('TransacaoService', () => {
  let service: TransacaoService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransacaoService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TransacaoService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('deve enviar requisição GET com os parâmetros de paginação e filtro corretos', () => {
    const mockResponse: PageResponse<Transacao> = {
      items: [
        {
          id: 1,
          descricao: 'Mercado Mensal',
          valor: 350.75,
          data: '2026-11-10',
          tipo: 'DESPESA',
          pago: true,
          dataPagamento: '2026-11-10',
          status: 'PAGO',
        },
      ],
      page: 0,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
    };

    service
      .findAll(0, 10, { descricao: 'Mercado', tipo: 'DESPESA', idConta: 1 })
      .subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.items.length).toBe(1);
        expect(res.items[0].descricao).toBe('Mercado Mensal');
      });

    const req = httpTesting.expectOne((r) => r.url === `${API_URL}/transacoes`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('10');
    expect(req.request.params.get('descricao')).toBe('Mercado');
    expect(req.request.params.get('tipo')).toBe('DESPESA');
    expect(req.request.params.get('idConta')).toBe('1');

    req.flush(mockResponse);
  });

  it('deve tratar o erro 400 (validação) e repassar a mensagem do RFC 7807', () => {
    const rfc7807Error = {
      type: 'https://api.fincontrol.com/erros/validacao',
      title: 'Parâmetros inválidos',
      status: 400,
      detail: 'O valor da transação deve ser positivo.',
      errors: [{ field: 'valor', message: 'O valor deve ser maior que zero.' }],
    };

    let erroRecebido: HttpErrorResponse | undefined;

    service.findAll(0, 10).subscribe({
      next: () => {
        throw new Error('A requisição deveria ter falhado com status 400');
      },
      error: (err: HttpErrorResponse) => {
        erroRecebido = err;
      },
    });

    const req = httpTesting.expectOne((r) => r.url === `${API_URL}/transacoes`);
    req.flush(rfc7807Error, { status: 400, statusText: 'Bad Request' });

    expect(erroRecebido).toBeDefined();
    expect(erroRecebido?.status).toBe(400);
    expect(erroRecebido?.error.detail).toBe('O valor da transação deve ser positivo.');
    expect(erroRecebido?.error.title).toBe('Parâmetros inválidos');
  });
});
