import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
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
import { MODULOS_TRANSACOES, temModulo, tiposEditaveis } from '../../../core/acesso';
import { AuthService } from '../../../core/auth/auth.service';
import { MesService } from '../../../core/mes.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { MODULOS, Modulo, ROTULOS_ROLE, ROTULOS_TIPO_EMPRESA, Usuario } from '../../../models/usuario.model';
import { Logo } from '../../shared/logo/logo';

interface ItemMenu {
  rota: string;
  icone: string;
  rotulo: string;
  exato?: boolean; // ativo só na rota exata (ex.: /empresa x /empresa/usuarios)
  queryParams?: Record<string, string>;
}

interface Secao {
  titulo: string;
  itens: ItemMenu[];
}

// Item que aparece no menu mas não abre: módulo sem acesso (cadeado) ou ainda sem tela (em breve).
interface ItemInativo {
  icone: string;
  rotulo: string;
  motivo: string;
  cadeado: boolean;
}

// Layout da área logada:
// - barra superior roxa com o mês do dashboard, ações rápidas (+), notificações, conta ativa e avatar;
// - no computador, trilho lateral de ícones (clicar nele abre com os nomes);
// - no celular, barra inferior com os atalhos principais e o + no centro.
@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule, Logo],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly mes = inject(MesService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly menuAberto = signal(false);
  protected readonly titulo = signal('');
  protected readonly comMes = signal(false); // a tela usa o seletor de mês (dashboards)
  protected readonly perfil = this.usuarioService.perfil;
  protected readonly rotulosRole = ROTULOS_ROLE;

  protected readonly nome = computed(() => this.perfil()?.nome || this.auth.email());
  protected readonly iniciais = computed(() => iniciais(this.nome()));

  // Conta ativa no seletor do topo: "Pessoal", "Studio Aurora · MEI", "… · Colaborador", "Administração".
  protected readonly contexto = computed(() => {
    const u = this.perfil();
    if (!u) return { icone: 'person_outline', rotulo: '' };
    if (u.role === 'SUPER_ADMIN') return { icone: 'shield', rotulo: 'Administração' };
    if (!u.empresa) return { icone: 'person_outline', rotulo: 'Pessoal' };
    const papel = u.role === 'ADMIN_EMPRESA' ? ROTULOS_TIPO_EMPRESA[u.empresa.tipo] : 'Colaborador';
    return { icone: 'business', rotulo: `${u.empresa.nome} · ${papel}` };
  });

  // Menu completo, por seção: só o que o usuário pode abrir (o back barra o resto).
  protected readonly secoes = computed<Secao[]>(() => {
    const u = this.perfil();
    if (!u) return [];
    if (u.role === 'SUPER_ADMIN') return menuAdmin();

    const financeiro: ItemMenu[] = [];
    if (temModulo(u, 'DASHBOARD')) financeiro.push({ rota: '/dashboard', icone: 'grid_view', rotulo: 'Visão geral' });
    if (temModulo(u, ...MODULOS_TRANSACOES)) {
      financeiro.push({ rota: '/transacoes', icone: 'swap_vert', rotulo: 'Lançamentos' });
      financeiro.push({ rota: '/a-pagar', icone: 'event_upcoming', rotulo: 'Contas a pagar' });
    }
    if (temModulo(u, 'CONTAS')) financeiro.push({ rota: '/contas', icone: 'account_balance', rotulo: 'Contas' });
    if (temModulo(u, 'CATEGORIAS')) financeiro.push({ rota: '/categorias', icone: 'sell', rotulo: 'Categorias' });

    const secoes: Secao[] = [{ titulo: u.empresa ? 'Financeiro da empresa' : 'Minhas finanças', itens: financeiro }];

    if (u.empresa) {
      const gestao: ItemMenu[] = [];
      if (u.role === 'ADMIN_EMPRESA') {
        gestao.push({ rota: '/empresa/usuarios', icone: 'group', rotulo: 'Colaboradores' });
      }
      gestao.push({ rota: '/empresa', icone: 'business', rotulo: 'Dados da empresa', exato: true });
      secoes.push({ titulo: 'Empresa', itens: gestao });
    }

    const conta: ItemMenu[] = [{ rota: '/perfil', icone: 'person_outline', rotulo: 'Meu perfil' }];
    if (u.role === 'PESSOAL') {
      conta.push({ rota: '/configuracoes', icone: 'tune', rotulo: 'Funcionalidades' });
    }
    secoes.push({ titulo: 'Conta', itens: conta });
    return secoes.filter((s) => s.itens.length);
  });

  // Módulos sem acesso (colaborador) e liberados sem tela ainda (em breve).
  protected readonly inativos = computed(() => itensInativos(this.perfil()));
  protected readonly qtdEmBreve = computed(() => this.inativos().filter((m) => !m.cadeado).length);

  // Barra inferior do celular: quatro atalhos (dois de cada lado do +).
  protected readonly atalhos = computed(() => {
    const itens = this.secoes().flatMap((s) => s.itens);
    const principais = itens.filter((i) => i.rota !== '/perfil' && i.rota !== '/configuracoes').slice(0, 4);
    for (const i of itens) {
      if (principais.length >= 4) break;
      if (!principais.includes(i)) principais.push(i);
    }
    return { esquerda: principais.slice(0, 2), direita: principais.slice(2, 4) };
  });

  // Ações do botão +.
  protected readonly acoesRapidas = computed<ItemMenu[]>(() => {
    const u = this.perfil();
    if (!u) return [];
    if (u.role === 'SUPER_ADMIN') {
      return [
        { rota: '/admin/usuarios/novo', icone: 'person_add', rotulo: 'Novo usuário' },
        { rota: '/admin/parametros/novo', icone: 'request_quote', rotulo: 'Parâmetro fiscal' },
        { rota: '/admin/categorias', icone: 'sell', rotulo: 'Categoria padrão' },
      ];
    }
    const acoes: ItemMenu[] = [];
    const tipos = tiposEditaveis(u);
    if (tipos.includes('RECEITA')) {
      acoes.push({ rota: '/transacoes/nova', icone: 'add_circle_outline', rotulo: 'Receita', queryParams: { tipo: 'RECEITA' } });
    }
    if (tipos.includes('DESPESA')) {
      acoes.push({ rota: '/transacoes/nova', icone: 'remove_circle_outline', rotulo: 'Despesa', queryParams: { tipo: 'DESPESA' } });
    }
    if (temModulo(u, 'CATEGORIAS')) acoes.push({ rota: '/categorias/nova', icone: 'sell', rotulo: 'Categoria' });
    if (u.role === 'ADMIN_EMPRESA') acoes.push({ rota: '/empresa/usuarios/novo', icone: 'person_add', rotulo: 'Colaborador' });
    return acoes;
  });

  ngOnInit(): void {
    this.usuarioService.carregarPerfil().subscribe({ error: () => {} });
    this.atualizarRota();

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.menuAberto.set(false); // o menu aberto fecha ao trocar de tela
        this.atualizarRota();
      });
  }

  sair(): void {
    this.auth.logout();
  }

  // Clicar na barra abre/fecha a lista com os nomes; clicar num link só navega
  // (a navegação fecha a barra) e "Sair" sai.
  aoClicarNoTrilho(evento: MouseEvent): void {
    const alvo = evento.target as HTMLElement;
    if (alvo.closest('a, .sair')) return;
    this.menuAberto.set(!this.menuAberto());
  }

  // Nome da tela atual (do "title" da rota, sem o " · FinControl") e se ela usa o seletor de mês.
  private atualizarRota(): void {
    let rota: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (rota.firstChild) {
      rota = rota.firstChild;
    }
    this.titulo.set(String(rota.title ?? '').split(' · ')[0]);
    this.comMes.set(!!rota.data['mes']);
  }
}

export function iniciais(nome: string): string {
  return nome
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

function menuAdmin(): Secao[] {
  return [
    {
      titulo: 'Gestão do sistema',
      itens: [
        { rota: '/admin/painel', icone: 'grid_view', rotulo: 'Visão geral' },
        { rota: '/admin/usuarios', icone: 'group', rotulo: 'Usuários' },
        { rota: '/admin/empresas', icone: 'business', rotulo: 'Empresas e MEIs' },
        { rota: '/admin/transacoes', icone: 'swap_vert', rotulo: 'Transações' },
      ],
    },
    {
      titulo: 'Configuração',
      itens: [
        { rota: '/admin/categorias', icone: 'sell', rotulo: 'Categorias padrão' },
        { rota: '/admin/parametros', icone: 'receipt_long', rotulo: 'Parâmetros fiscais' },
        { rota: '/admin/auditoria', icone: 'verified_user', rotulo: 'Auditoria' },
      ],
    },
    { titulo: 'Conta', itens: [{ rota: '/perfil', icone: 'person_outline', rotulo: 'Meu perfil' }] },
  ];
}

// O colaborador vê com cadeado o que a administradora ainda não liberou.
const BLOQUEAVEIS: { modulo: Modulo; icone: string; rotulo: string }[] = [
  { modulo: 'CONTAS', icone: 'account_balance', rotulo: 'Contas bancárias' },
  { modulo: 'CATEGORIAS', icone: 'sell', rotulo: 'Categorias' },
  { modulo: 'USUARIOS', icone: 'group', rotulo: 'Colaboradores' },
];

function itensInativos(u: Usuario | null): ItemInativo[] {
  if (!u || u.role === 'SUPER_ADMIN') return [];
  const itens: ItemInativo[] = [];
  if (u.role === 'USUARIO_EMPRESA') {
    for (const b of BLOQUEAVEIS) {
      if (!u.modulos.includes(b.modulo)) {
        itens.push({ icone: b.icone, rotulo: b.rotulo, motivo: 'Sem acesso: peça à administração da empresa', cadeado: true });
      }
    }
  }
  for (const m of u.modulos as Modulo[]) {
    if (!MODULOS[m].disponivel) {
      itens.push({ icone: MODULOS[m].icone, rotulo: MODULOS[m].rotulo, motivo: 'Em breve', cadeado: false });
    }
  }
  return itens;
}
