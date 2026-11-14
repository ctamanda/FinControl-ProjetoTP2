import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { PlanosComponent } from './planos.component';
import { AssinaturaService } from '../../services/assinatura.service';

describe('PlanosComponent', () => {
  let component: PlanosComponent;
  let fixture: ComponentFixture<PlanosComponent>;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      listarPlanos: vi.fn().mockReturnValue(of([{ id: 1, nome: 'Free' }, { id: 2, nome: 'Pro' }])),
      buscarMinhaAssinatura: vi.fn().mockReturnValue(of({ plano: { nome: 'Free' } }))
    };

    await TestBed.configureTestingModule({
      imports: [PlanosComponent],
      providers: [
        { provide: AssinaturaService, useValue: mockService },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanosComponent);
    component = fixture.componentInstance;
  });

  it('deve renderizar os cards de plano', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('mat-card');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});