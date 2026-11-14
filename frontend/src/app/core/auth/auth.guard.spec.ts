import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { isObservable, of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';

describe('authGuard', () => {
  let isLoggedInValue = true;
  let mockUsuario: Usuario = {
    id: 1,
    nome: 'Usuário Teste',
    email: 'teste@fincontrol.com',
    telefone: '63999990000',
    profissao: 'Engenheiro',
    role: 'PESSOAL',
    ativo: true,
    modulos: [],
    trocarSenha: false,
  };

  beforeEach(() => {
    isLoggedInValue = true;
    mockUsuario = {
      id: 1,
      nome: 'Usuário Teste',
      email: 'teste@fincontrol.com',
      telefone: '63999990000',
      profissao: 'Engenheiro',
      role: 'PESSOAL',
      ativo: true,
      modulos: [],
      trocarSenha: false,
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => isLoggedInValue,
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            garantirPerfil: () => of(mockUsuario),
          },
        },
      ],
    });
  });

  it('deve permitir navegação se o token existir e estiver válido', async () => {
    isLoggedInValue = true;
    mockUsuario.trocarSenha = false;

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/transacoes' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    if (isObservable(result)) {
      result.subscribe((val) => {
        expect(val).toBe(true);
      });
    } else {
      expect(result).toBe(true);
    }
  });

  it('deve bloquear e redirecionar para /login se o token não existir ou estiver expirado', () => {
    isLoggedInValue = false;

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/transacoes' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    const router = TestBed.inject(Router);
    const expectedTree = router.createUrlTree(['/login'], { queryParams: { voltar: '/transacoes' } });

    expect(result).toEqual(expectedTree);
  });
});
