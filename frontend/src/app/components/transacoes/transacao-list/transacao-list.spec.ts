import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { TransacaoList } from './transacao-list';
import { TransacaoService } from '../../../services/transacao.service';
import { ContaService } from '../../../services/conta.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { PageResponse } from '../../../models/page-response.model';
import { Transacao } from '../../../models/transacao.model';

describe('TransacaoList', () => {
  let component: TransacaoList;
  let fixture: ComponentFixture<TransacaoList>;
  let findAllSubject: Subject<PageResponse<Transacao>>;
  let snackBarMessage: string = '';

  const mockResponseSucesso: PageResponse<Transacao> = {
    items: [
      {
        id: 1,
        descricao: 'Salário Mensal',
        valor: 5000,
        data: '2026-11-05',
        tipo: 'RECEITA',
        pago: true,
        dataPagamento: '2026-11-05',
        status: 'PAGO',
        categoria: { id: 1, nome: 'Salário', tipo: 'RECEITA' },
        conta: { id: 1, nome: 'Conta Corrente', tipo: 'CONTA_CORRENTE', cor: '#1976d2' },
      },
    ],
    page: 0,
    pageSize: 10,
    totalItems: 1,
    totalPages: 1,
  };

  beforeEach(async () => {
    findAllSubject = new Subject<PageResponse<Transacao>>();
    snackBarMessage = '';

    await TestBed.configureTestingModule({
      imports: [TransacaoList],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            perfil: () => ({
              id: 1,
              nome: 'Usuário Teste',
              role: 'PESSOAL',
              modulos: ['LANCAMENTOS', 'RECEITAS', 'DESPESAS'],
            }),
          },
        },
        {
          provide: ContaService,
          useValue: {
            listar: () => of([]),
          },
        },
        {
          provide: TransacaoService,
          useValue: {
            findAll: () => findAllSubject.asObservable(),
            reabrir: () => of({}),
            delete: () => of({}),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: (msg: string) => {
              snackBarMessage = msg;
              return {} as any;
            },
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: () => ({ afterClosed: () => of(true) }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransacaoList);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit e o primeiro loadTransacoes
  });

  it('deve exibir indicador de carregamento durante a requisição (Loading)', () => {
    // Como findAllSubject ainda não emitiu, o componente está em estado carregando
    expect(component['carregando']()).toBe(true);

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('deve renderizar a tabela com os dados retornados (Sucesso)', () => {
    findAllSubject.next(mockResponseSucesso);
    fixture.detectChanges();

    expect(component['carregando']()).toBe(false);
    expect(component['transacoes']().length).toBe(1);

    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Salário Mensal');
    expect(texto).toContain('Conta Corrente');
  });

  it('deve exibir mensagem de "Nenhuma transação encontrada" (Empty State)', () => {
    findAllSubject.next({
      items: [],
      page: 0,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });
    fixture.detectChanges();

    expect(component['carregando']()).toBe(false);
    expect(component['totalItems']()).toBe(0);

    const estadoVazio = fixture.nativeElement.querySelector('.estado-vazio');
    expect(estadoVazio).toBeTruthy();
    expect(estadoVazio.textContent).toContain('Nenhum lançamento encontrado');
  });

  it('deve exibir MatSnackBar de erro se a resposta for 403 (Erro)', () => {
    findAllSubject.error(
      new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
        error: { detail: 'Acesso negado aos lançamentos financeiros.' },
      })
    );
    fixture.detectChanges();

    expect(component['carregando']()).toBe(false);
    expect(component['transacoes']().length).toBe(0);
    expect(snackBarMessage).toBeTruthy();
    expect(snackBarMessage).toContain('Acesso negado');
  });

  it('deve desabilitar ou prevenir novas chamadas concorrentes enquanto a requisição estiver em andamento (Prevenção de duplo clique)', () => {
    // Na inicialização, a requisição já está em andamento
    expect(component['carregando']()).toBe(true);

    // Nova chamada ao carregar enquanto já carrega cancela a subscrição anterior e mantém carregando seguro
    component.loadTransacoes();
    expect(component['carregando']()).toBe(true);

    findAllSubject.next(mockResponseSucesso);
    fixture.detectChanges();

    expect(component['carregando']()).toBe(false);
  });
});
