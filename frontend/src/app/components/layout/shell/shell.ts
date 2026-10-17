import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { Logo } from '../../shared/logo/logo';

interface ItemMenu {
  rota: string;
  icone: string;
  rotulo: string;
}

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, Logo],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly menuAberto = signal(false);
  protected readonly titulo = signal('');
  protected readonly naAreaAdmin = signal(false);
  protected readonly perfil = this.usuarioService.perfil;

  protected readonly nome = computed(() => this.perfil()?.nome || this.auth.email());
  protected readonly iniciais = computed(() =>
    this.nome()
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
  );

  protected readonly menuPrincipal: ItemMenu[] = [
    { rota: '/dashboard', icone: 'home', rotulo: 'Visão geral' },
    { rota: '/transacoes', icone: 'swap_vert', rotulo: 'Financeiro' },
    { rota: '/categorias', icone: 'sell', rotulo: 'Cadastros' },
  ];

  protected readonly menuAdmin: ItemMenu[] = [
    { rota: '/admin/painel', icone: 'monitoring', rotulo: 'Painel administrativo' },
    { rota: '/admin/parametros', icone: 'tune', rotulo: 'Parâmetros fiscais' },
  ];

  ngOnInit(): void {
    this.usuarioService.carregarPerfil().subscribe({ error: () => {} });
    this.atualizarTitulo();

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.menuAberto.set(false); // no celular o menu fecha ao trocar de tela
        this.atualizarTitulo();
      });
  }

  sair(): void {
    this.usuarioService.perfil.set(null);
    this.auth.logout();
  }

  // Nome da tela atual (do "title" da rota, sem o " · FinControl") para a faixa branca.
  private atualizarTitulo(): void {
    let rota: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (rota.firstChild) {
      rota = rota.firstChild;
    }
    this.titulo.set(String(rota.title ?? '').split(' · ')[0]);
    this.naAreaAdmin.set(this.router.url.startsWith('/admin'));
  }
}
