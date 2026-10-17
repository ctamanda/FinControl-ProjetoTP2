import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs';
import { MODULOS_TRANSACOES, temModulo } from '../../../core/acesso';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { MODULOS, Modulo, ROTULOS_ROLE, Usuario } from '../../../models/usuario.model';
import { Logo } from '../../shared/logo/logo';

interface ItemMenu {
  rota: string;
  icone: string;
  rotulo: string;
  exato?: boolean; // ativo só na rota exata (ex.: /empresa x /empresa/usuarios)
}

interface Secao {
  titulo: string;
  itens: ItemMenu[];
}

type Ambiente = 'PESSOAL' | 'EMPRESA' | 'ADMIN';

// Layout da área logada: barra lateral com o menu do ambiente do usuário
// (Pessoal, Empresarial ou Painel Administrativo) + cabeçalho com o título da tela.
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule, Logo],
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
  protected readonly perfil = this.usuarioService.perfil;
  protected readonly rotulosRole = ROTULOS_ROLE;

  protected readonly nome = computed(() => this.perfil()?.nome || this.auth.email());
  protected readonly iniciais = computed(() =>
    this.nome()
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
  );

  protected readonly ambiente = computed<Ambiente>(() => {
    const u = this.perfil();
    if (u?.role === 'SUPER_ADMIN') return 'ADMIN';
    return u?.empresa ? 'EMPRESA' : 'PESSOAL';
  });

  protected readonly rotuloAmbiente = computed(
    () => ({ PESSOAL: 'Ambiente pessoal', EMPRESA: 'Ambiente empresarial', ADMIN: 'Painel administrativo' })[this.ambiente()],
  );

  // Menu da barra lateral: só o que o usuário pode abrir (o back barra o resto).
  protected readonly secoes = computed<Secao[]>(() => {
    const u = this.perfil();
    if (!u) return [];
    if (u.role === 'SUPER_ADMIN') return menuAdmin();

    const financeiro: ItemMenu[] = [];
    if (temModulo(u, 'DASHBOARD')) financeiro.push({ rota: '/dashboard', icone: 'space_dashboard', rotulo: 'Dashboard' });
    if (temModulo(u, ...MODULOS_TRANSACOES)) financeiro.push({ rota: '/transacoes', icone: 'swap_vert', rotulo: 'Lançamentos' });
    if (temModulo(u, 'CATEGORIAS')) financeiro.push({ rota: '/categorias', icone: 'sell', rotulo: 'Categorias' });

    const secoes: Secao[] = [{ titulo: u.empresa ? 'Financeiro da empresa' : 'Minhas finanças', itens: financeiro }];

    if (u.empresa) {
      const gestao: ItemMenu[] = [];
      if (u.role === 'ADMIN_EMPRESA') {
        gestao.push({ rota: '/empresa/usuarios', icone: 'manage_accounts', rotulo: 'Usuários e acessos' });
      }
      gestao.push({ rota: '/empresa', icone: 'storefront', rotulo: 'Dados da empresa', exato: true });
      secoes.push({ titulo: u.role === 'ADMIN_EMPRESA' ? 'Gestão' : 'Empresa', itens: gestao });
    }

    const conta: ItemMenu[] = [{ rota: '/perfil', icone: 'person_outline', rotulo: 'Meu perfil' }];
    if (u.role === 'PESSOAL') {
      conta.push({ rota: '/configuracoes', icone: 'tune', rotulo: 'Funcionalidades' });
    }
    secoes.push({ titulo: 'Conta', itens: conta });
    return secoes.filter((s) => s.itens.length);
  });

  // Módulos liberados que ainda não têm tela: aparecem como "em breve".
  protected readonly emBreve = computed(() => emBreve(this.perfil()));

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
    this.auth.logout();
  }

  // Nome da tela atual (do "title" da rota, sem o " · FinControl").
  private atualizarTitulo(): void {
    let rota: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (rota.firstChild) {
      rota = rota.firstChild;
    }
    this.titulo.set(String(rota.title ?? '').split(' · ')[0]);
  }
}

function menuAdmin(): Secao[] {
  return [
    {
      titulo: 'Gestão do sistema',
      itens: [
        { rota: '/admin/painel', icone: 'space_dashboard', rotulo: 'Visão geral' },
        { rota: '/admin/usuarios', icone: 'group', rotulo: 'Usuários' },
        { rota: '/admin/empresas', icone: 'storefront', rotulo: 'Empresas' },
        { rota: '/admin/transacoes', icone: 'receipt_long', rotulo: 'Transações' },
      ],
    },
    {
      titulo: 'Configuração',
      itens: [
        { rota: '/admin/categorias', icone: 'sell', rotulo: 'Categorias' },
        { rota: '/admin/parametros', icone: 'request_quote', rotulo: 'Parâmetros fiscais' },
        { rota: '/admin/auditoria', icone: 'history', rotulo: 'Auditoria' },
      ],
    },
    { titulo: 'Conta', itens: [{ rota: '/perfil', icone: 'person_outline', rotulo: 'Meu perfil' }] },
  ];
}

function emBreve(u: Usuario | null): { icone: string; rotulo: string }[] {
  if (!u || u.role === 'SUPER_ADMIN') return [];
  return (u.modulos as Modulo[])
    .filter((m) => !MODULOS[m].disponivel)
    .map((m) => ({ icone: MODULOS[m].icone, rotulo: MODULOS[m].rotulo }));
}
