import { Routes } from '@angular/router';
import { Shell } from './components/layout/shell/shell';
import { adminGuard, authGuard, visitanteGuard } from './core/auth/auth.guard';

// Cada tela é carregada sob demanda (loadComponent) para manter o bundle inicial pequeno.
// Telas de Estados/Municípios saíram do menu: o back atual não tem esses endpoints.
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/landing/landing').then((m) => m.Landing),
        title: 'FinControl · Controle financeiro para você e sua empresa',
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
        path: '',
        component: Shell,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
                title: 'Visão geral · FinControl',
            },

            {
                path: 'transacoes',
                loadComponent: () =>
                    import('./components/transacoes/transacao-list/transacao-list').then((m) => m.TransacaoList),
                title: 'Transações · FinControl',
            },
            {
                path: 'transacoes/nova',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Nova transação · FinControl',
            },
            {
                path: 'transacoes/:id',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Editar transação · FinControl',
            },

            {
                path: 'categorias',
                loadComponent: () =>
                    import('./components/categorias/categoria-list/categoria-list').then((m) => m.CategoriaList),
                title: 'Categorias · FinControl',
            },
            {
                path: 'categorias/nova',
                loadComponent: () =>
                    import('./components/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
                title: 'Nova categoria · FinControl',
            },
            {
                path: 'categorias/:id',
                loadComponent: () =>
                    import('./components/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
                title: 'Editar categoria · FinControl',
            },

            {
                path: 'perfil',
                loadComponent: () => import('./components/perfil/perfil').then((m) => m.Perfil),
                title: 'Meu perfil · FinControl',
            },

            {
                path: 'admin',
                canActivate: [adminGuard],
                children: [
                    {path: '', pathMatch: 'full', redirectTo: 'painel'},
                    {
                        path: 'painel',
                        loadComponent: () =>
                            import('./components/admin/admin-painel/admin-painel').then((m) => m.AdminPainel),
                        title: 'Painel administrativo · FinControl',
                    },
                    {
                        path: 'parametros',
                        loadComponent: () =>
                            import('./components/admin/parametro-list/parametro-list').then((m) => m.ParametroList),
                        title: 'Parâmetros fiscais · FinControl',
                    },
                    {
                        path: 'parametros/novo',
                        loadComponent: () =>
                            import('./components/admin/parametro-form/parametro-form').then((m) => m.ParametroForm),
                        title: 'Novo parâmetro · FinControl',
                    },
                    {
                        path: 'parametros/:id',
                        loadComponent: () =>
                            import('./components/admin/parametro-form/parametro-form').then((m) => m.ParametroForm),
                        title: 'Editar parâmetro · FinControl',
                    },
                ],
            },
        ],
    },

    {path: '**', redirectTo: ''},
];
