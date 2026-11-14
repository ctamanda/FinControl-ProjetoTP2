import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AssinaturaService } from './assinatura.service';

describe('AssinaturaService', () => {
  let service: AssinaturaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AssinaturaService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AssinaturaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve listar planos', () => {
    service.listarPlanos().subscribe();
    const req = httpMock.expectOne(req => req.url.includes('/planos'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('deve fazer upgrade', () => {
    service.fazerUpgrade(2).subscribe();
    const req = httpMock.expectOne(req => req.url.includes('/assinaturas/upgrade/2'));
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});