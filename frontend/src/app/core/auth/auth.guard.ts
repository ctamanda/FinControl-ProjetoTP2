import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { rotaInicial, temModulo } from '../acesso';
import { UsuarioService } from '../usuario/usuario.service';
import { Modulo, Role, Usuario } from '../../models/usuario.model';
import { AuthService } from './auth.service';

// Os guards só evitam mostrar telas que o back recusaria: o back confere
// login, usuário ativo, empresa cadastrada e módulo em toda requisição.

// Carrega o perfil e decide; sem perfil (token inválido, usuário desativado) volta ao login.
function comPerfil(decidir: (u: Usuario, router: Router) => boolean | UrlTree): Observable<boolean | UrlTree> {
  const router = inject(Router);
  return inject(UsuarioService)
    .garantirPerfil()
    .pipe(
      map((u) => decidir(u, router)),
      catchError(() => of(router.createUrlTree(['/login']))),
    );
}

// Exige usuário logado e com o cadastro completo: admin de empresa sem empresa
// cadastrada só consegue abrir o cadastro da empresa.
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { voltar: state.url } });
  }
  return comPerfil((u, r) => (u.empresaPendente ? r.createUrlTree(['/empresa/cadastro']) : true));
};

// Tela do cadastro da empresa: só para quem ainda está com ela pendente.
export const empresaPendenteGuard: CanActivateFn = () => {
  if (!inject(AuthService).isLoggedIn()) {
    return inject(Router).createUrlTree(['/login']);
  }
  return comPerfil((u, r) => (u.empresaPendente ? true : r.createUrlTree([rotaInicial(u)])));
};

// Exige pelo menos um dos módulos; sem acesso, vai para a primeira tela permitida.
export function moduloGuard(...modulos: Modulo[]): CanActivateFn {
  return () => comPerfil((u, r) => (temModulo(u, ...modulos) ? true : r.createUrlTree([rotaInicial(u)])));
}

export function perfilGuard(...roles: Role[]): CanActivateFn {
  return () => comPerfil((u, r) => (roles.includes(u.role) ? true : r.createUrlTree([rotaInicial(u)])));
}

// Login/cadastro: quem já está logado vai direto para a tela inicial.
export const visitanteGuard: CanActivateFn = () => {
  if (!inject(AuthService).isLoggedIn()) {
    return true;
  }
  return comPerfil((u, r) => r.createUrlTree([rotaInicial(u)]));
};
