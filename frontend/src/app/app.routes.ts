import { Routes } from '@angular/router';
import { Shell } from './components/layout/shell/shell';
import { MODULOS_TRANSACOES } from './core/acesso';
import { authGuard, empresaPendenteGuard, moduloGuard, perfilGuard, visitanteGuard } from './core/auth/auth.guard';

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
        // Última etapa do cadastro de MEI/Microempresa: obrigatória antes de usar o sistema.
        path: 'empresa/cadastro',
        loadComponent: () => import('./components/empresa/empresa-form/empresa-form').then((m) => m.EmpresaForm),
        title: 'Cadastro da empresa · FinControl',
        canActivate: [empresaPendenteGuard],
        data: { modo: 'cadastro' },
    },
    {
        // Configuração inicial, logo depois do cadastro (e da empresa, na conta de MEI/ME).
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
            },

            {
                path: 'transacoes',
                loadComponent: () =>
                    import('./components/transacoes/transacao-list/transacao-list').then((m) => m.TransacaoList),
                title: 'Transações · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },
            {
                path: 'transacoes/nova',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Nova transação · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
            },
            {
                path: 'transacoes/:id',
                loadComponent: () =>
                    import('./components/transacoes/transacao-form/transacao-form').then((m) => m.TransacaoForm),
                title: 'Editar transação · FinControl',
                canActivate: [moduloGuard(...MODULOS_TRANSACOES)],
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
                path: 'empresa',
                canActivate: [perfilGuard('ADMIN_EMPRESA', 'USUARIO_EMPRESA')],
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        loadComponent: () =>
                            import('./components/empresa/empresa-form/empresa-form').then((m) => m.EmpresaForm),
                        title: 'Minha empresa · FinControl',
                        data: { modo: 'dados' },
                    },
                    {
                        path: 'usuarios',
                        canActivate: [perfilGuard('ADMIN_EMPRESA')],
                        children: [
                            {
                                path: '',
                                loadComponent: () =>
                                    import('./components/empresa/usuario-empresa-list/usuario-empresa-list').then(
                                        (m) => m.UsuarioEmpresaList,
                                    ),
                                title: 'Usuários da empresa · FinControl',
                            },
                            {
                                path: 'novo',
                                loadComponent: () =>
                                    import('./components/empresa/usuario-empresa-form/usuario-empresa-form').then(
                                        (m) => m.UsuarioEmpresaForm,
                                    ),
                                title: 'Novo usuário · FinControl',
                            },
                            {
                                path: ':id',
                                loadComponent: () =>
                                    import('./components/empresa/usuario-empresa-form/usuario-empresa-form').then(
                                        (m) => m.UsuarioEmpresaForm,
                                    ),
                                title: 'Editar usuário · FinControl',
                            },
                        ],
                    },
                ],
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
                        path: 'empresas',
                        loadComponent: () =>
                            import('./components/admin/admin-empresa-list/admin-empresa-list').then((m) => m.AdminEmpresaList),
                        title: 'Empresas · FinControl',
                    },
                    {
                        path: 'empresas/:id',
                        loadComponent: () =>
                            import('./components/admin/admin-empresa-detalhe/admin-empresa-detalhe').then(
                                (m) => m.AdminEmpresaDetalhe,
                            ),
                        title: 'Empresa · FinControl',
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
