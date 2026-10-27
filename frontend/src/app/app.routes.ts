import { Routes } from '@angular/router';
import { Shell } from './components/layout/shell/shell';
import { MODULOS_TRANSACOES } from './core/acesso';
import { authGuard, moduloGuard, perfilGuard, visitanteGuard } from './core/auth/auth.guard';

// Cada tela é carregada sob demanda (loadComponent) para manter o bundle inicial pequeno.
// Telas de Estados/Municípios saíram do menu: o back atual não tem esses endpoints.
//
// Toda rota interna passa pelo authGuard (logado e com o cadastro completo) e por um guard
// do módulo/perfil da tela. O back confere as mesmas regras em toda requisição.
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/landing/landing').then((m) => m.Landing),
        title: 'FinControl · Controle das suas finanças pessoais',
    },
    {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login').then((m) => m.Login),
        title: 'Entrar · FinControl',
        canActivate: [visitanteGuard],
    },
    {
        path: 'cadastro',
        loadComponent: () => import('./components/auth/register/register').then((m) => m.Register),
        title: 'Criar conta · FinControl',
        canActivate: [visitanteGuard],
    },
    {
        // Configuração inicial, logo depois do cadastro.
        path: 'bem-vindo',
        loadComponent: () =>
            import('./components/configuracao-inicial/configuracao-inicial').then((m) => m.ConfiguracaoInicial),
        title: 'Configuração inicial · FinControl',
        canActivate: [authGuard],
    },

    {
        path: '',
        component: Shell,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
                title: 'Visão geral · FinControl',
                canActivate: [moduloGuard('DASHBOARD')],
                data: { mes: true }, // mostra o seletor de mês na barra superior
            },

            {
                path: 'transacoes',
                loadComponent: () =>
                    import('./components/transacoes/transacao-list/transacao-list').then((m) => m.TransacaoList),
                title: 'Lançamentos · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },
            {
                path: 'transacoes/nova',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Novo lançamento · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },
            {
                path: 'transacoes/:id',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Editar lançamento · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },

            {
                // Contas a pagar e a receber (lançamentos pendentes), agrupadas pelo vencimento.
                path: 'a-pagar',
                loadComponent: () => import('./components/a-pagar/a-pagar').then((m) => m.APagar),
                title: 'Contas a pagar · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },

            {
                // Contas financeiras (bancos, carteira...) com os saldos do mês escolhido no topo.
                path: 'contas',
                loadComponent: () => import('./components/contas/conta-list/conta-list').then((m) => m.ContaList),
                title: 'Contas · FinControl',
                canActivate: [moduloGuard('CONTAS')],
                data: { mes: true },
            },

            {
                path: 'categorias',
                loadComponent: () =>
                    import('./components/categorias/categoria-list/categoria-list').then((m) => m.CategoriaList),
                title: 'Categorias · FinControl',
                canActivate: [moduloGuard('CATEGORIAS')],
            },
            {
                path: 'categorias/nova',
                loadComponent: () =>
                    import('./components/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
                title: 'Nova categoria · FinControl',
                canActivate: [moduloGuard('CATEGORIAS')],
            },
            {
                path: 'categorias/:id',
                loadComponent: () =>
                    import('./components/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
                title: 'Editar categoria · FinControl',
                canActivate: [moduloGuard('CATEGORIAS')],
            },

            {
                path: 'perfil',
                loadComponent: () => import('./components/perfil/perfil').then((m) => m.Perfil),
                title: 'Meu perfil · FinControl',
            },
            {
                path: 'configuracoes',
                loadComponent: () => import('./components/configuracoes/configuracoes').then((m) => m.Configuracoes),
                title: 'Funcionalidades · FinControl',
                canActivate: [perfilGuard('PESSOAL')],
            },

            {
                // Painel administrativo do FinControl (as seções ficam na barra lateral do Shell).
                path: 'admin',
                canActivate: [perfilGuard('SUPER_ADMIN')],
                children: [
                    {path: '', pathMatch: 'full', redirectTo: 'painel'},
                    {
                        path: 'painel',
                        loadComponent: () =>
                            import('./components/admin/admin-painel/admin-painel').then((m) => m.AdminPainel),
                        title: 'Visão geral do sistema · FinControl',
                        data: { mes: true },
                    },
                    {
                        path: 'usuarios',
                        loadComponent: () =>
                            import('./components/admin/admin-usuario-list/admin-usuario-list').then((m) => m.AdminUsuarioList),
                        title: 'Usuários · FinControl',
                    },
                    {
                        path: 'usuarios/novo',
                        loadComponent: () =>
                            import('./components/admin/admin-usuario-form/admin-usuario-form').then((m) => m.AdminUsuarioForm),
                        title: 'Novo usuário · FinControl',
                    },
                    {
                        path: 'usuarios/:id',
                        loadComponent: () =>
                            import('./components/admin/admin-usuario-form/admin-usuario-form').then((m) => m.AdminUsuarioForm),
                        title: 'Editar usuário · FinControl',
                    },
                    {
                        path: 'transacoes',
                        loadComponent: () =>
                            import('./components/admin/admin-transacoes/admin-transacoes').then((m) => m.AdminTransacoes),
                        title: 'Transações do sistema · FinControl',
                    },
                    {
                        path: 'categorias',
                        loadComponent: () =>
                            import('./components/admin/admin-categorias/admin-categorias').then((m) => m.AdminCategorias),
                        title: 'Categorias · FinControl',
                    },
                    {
                        path: 'auditoria',
                        loadComponent: () =>
                            import('./components/admin/admin-auditoria/admin-auditoria').then((m) => m.AdminAuditoria),
                        title: 'Auditoria · FinControl',
                    },
                ],
            },
        ],
    },

    {path: '**', redirectTo: ''},
];
