<p align="center">
  <img src="public/logo/fincontrol-simbolo-fundo-claro.svg" alt="FinControl" width="96" />
</p>

<h1 align="center">FinControl — Frontend</h1>

<p align="center">
  Interface web do FinControl, sistema de controle financeiro para pessoas, MEIs e microempresas.<br />
  Projeto da disciplina de Tópicos II.
</p>

<p align="center">
  <a href="https://ctamanda.github.io/FinControl-ProjetoTP2/"><b>Ver online (GitHub Pages)</b></a> ·
  <a href="../README.md">README geral</a> ·
  <a href="../backend/README.md">Backend (API)</a>
</p>

---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Usuários para teste](#usuários-para-teste)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rotas e telas](#rotas-e-telas)
- [Autenticação](#autenticação)
- [Comunicação com a API](#comunicação-com-a-api)
- [Identidade visual](#identidade-visual)
- [Padrões de código](#padrões-de-código)
- [Publicação no GitHub Pages](#publicação-no-github-pages)
- [Observações](#observações)

---

## Visão geral

O frontend consome a API REST do FinControl. No cadastro a pessoa escolhe o tipo de conta: **Pessoal** ou **MEI / Microempresa**.

| Para quem | O que pode fazer |
|---|---|
| **Visitante** | Ver a página de apresentação, criar conta e entrar |
| **Conta pessoal** (`PESSOAL`) | Visão geral, lançamentos, categorias e perfil, nas funcionalidades que escolheu usar |
| **Administrador da empresa** (`ADMIN_EMPRESA`) | Cadastrar e editar a empresa, tudo do financeiro da empresa e **usuários e acessos** da equipe |
| **Usuário da empresa** (`USUARIO_EMPRESA`) | Só as funcionalidades que o administrador liberou, com os dados da empresa |
| **Administrador do FinControl** (`SUPER_ADMIN`) | Painel administrativo: indicadores, usuários, empresas, transações (só consulta), categorias padrão, parâmetros fiscais e auditoria |

Cada conta enxerga **apenas os próprios dados**; numa empresa, os dados são compartilhados entre os usuários dela. O administrador do FinControl consulta as transações de todos sem poder alterá-las, e cada consulta fica na auditoria.

### Fluxo de entrada

```
ENTRAR NO FINCONTROL
  ├─ já tem conta ──► Login ───────────────────────────────────────────┐
  └─ criar conta ──► Tipo (Pessoal | MEI/Microempresa)                  │
                     └► Cadastro + senha                                │
                        └► Completar perfil (telefone; profissão)       │
                           └► [MEI/ME] Cadastro da empresa              │
                              └► Configuração inicial ──────────────────┤
                                                                        ▼
                                          ENTRAR NO SISTEMA (identifica o perfil)
                                 ┌────────────────────┼────────────────────┐
                              PESSOAL             MEI/MICRO               ADMIN
                          Ambiente pessoal   Ambiente empresarial   Painel administrativo
```

Na área logada, a **barra lateral** mostra o ambiente e só as funções que o perfil pode usar (no celular ela vira gaveta, aberta pelo ☰). Funcionalidades liberadas que ainda não têm tela aparecem em "Em breve".

## Tecnologias

| | |
|---|---|
| Framework | **Angular 22** (componentes *standalone*, *signals*, sem Zone.js) |
| UI | Angular Material 22 (tabela, paginação, diálogos, menus) + CSS próprio |
| Formulários | Reactive Forms |
| HTTP | `HttpClient` com interceptor funcional |
| Testes | Vitest |
| Build | `@angular/build` (esbuild), *lazy loading* por rota |
| Deploy | GitHub Actions → branch `gh-pages` → GitHub Pages |

## Como executar

### Pré-requisitos

- **Node.js 22** (ou superior) e npm
- **Backend rodando** em `http://localhost:8080` — veja o [README do backend](../backend/README.md)

### Passos

```bash
git clone https://github.com/ctamanda/FinControl-ProjetoTP2.git
cd FinControl-ProjetoTP2/frontend
npm install
npm start
```

Abra **http://localhost:4200**.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm start` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Build de produção em `dist/hello-world/browser` |
| `npm test` | Testes unitários (Vitest) |

## Usuários para teste

| Perfil | E-mail | Senha | Observação |
|---|---|---|---|
| SUPER_ADMIN | `admin@fincontrol.com` | `admin123` | Criado pelas migrations `V10`/`V12` do backend |
| PESSOAL ou ADMIN_EMPRESA | — | — | Crie em **Criar conta** (ou o super admin cria em Usuários) |
| USUARIO_EMPRESA | — | — | Criado pelo administrador da empresa em **Gestão → Usuários e acessos** |

> Toda conta pessoal e toda empresa começam com as **categorias padrão** ativas (de início: Alimentação, Moradia, Transporte, Lazer, Salário e Vendas), que o super admin administra.

## Estrutura de pastas

```
src/
├── index.html                  # favicon, fontes e cor do tema
├── material-theme.scss         # tema do Angular Material (roxo + amarelo)
├── styles.css                  # tokens de cor (--fc-*) e estilos globais
└── app/
    ├── app.config.ts           # providers: rotas, HttpClient + interceptor, locale pt-BR
    ├── app.routes.ts           # rotas (lazy loading) e guards
    ├── core/
    │   ├── api.ts              # API_URL e tradução de erros (RFC 7807)
    │   ├── acesso.ts           # regras de acesso na tela: módulos, tipos liberados, rota inicial
    │   ├── validadores.ts      # senha forte, telefone, CNPJ e máscaras (mesmas regras do back)
    │   ├── auth/               # AuthService, interceptor e guards
    │   └── usuario/            # UsuarioService (perfil logado: GET/PUT /usuarios/me)
    ├── models/                 # tipos: usuário (perfis, módulos), empresa, auth, transação, categoria, admin
    ├── services/               # acesso à API: transações, categorias, empresa e usuários, admin
    └── components/
        ├── landing/            # página inicial pública
        ├── auth/               # login e criar conta (tipo → cadastro + senha → perfil)
        ├── configuracao-inicial/ # última etapa da entrada (/bem-vindo)
        ├── configuracoes/      # funcionalidades da conta pessoal
        ├── layout/shell/       # barra lateral por ambiente + cabeçalho (área logada)
        ├── dashboard/          # visão geral (cards coloridos; equipe para o admin da empresa)
        ├── transacoes/         # lista e formulário
        ├── categorias/         # lista e formulário
        ├── perfil/             # cartão de identidade + dados pessoais + acesso
        ├── empresa/            # cadastro/dados da empresa, usuários da empresa (lista e formulário)
        ├── admin/              # painel administrativo: visão geral, usuários, empresas, transações,
        │                       #   categorias, parâmetros fiscais e auditoria
        └── shared/             # logo, valor, diálogo, fundo do login, máscara, requisitos da senha,
                                #   seletor de funcionalidades, etapas do cadastro
public/
├── favicon.svg
└── logo/                       # símbolo para fundo claro e escuro
```

## Rotas e telas

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Página inicial (apresentação do sistema e da API) | Público |
| `/login` | Login | Só visitante¹ |
| `/cadastro` | Criar conta: tipo → cadastro + senha → completar perfil (`?perfil=empresa` já marca "MEI / Microempresa") | Só visitante¹ |
| `/empresa/cadastro` | Cadastro da empresa (etapa da conta MEI/Microempresa) | Admin de empresa **com a empresa pendente** |
| `/bem-vindo` | Configuração inicial: funcionalidades (pessoal) ou primeiros passos (empresa) | Logado |
| `/dashboard` | Visão geral: cards coloridos (saldo, receitas, despesas, equipe), este mês × mês anterior, categorias, 6 meses | Módulo `DASHBOARD` |
| `/transacoes` · `/transacoes/nova` · `/transacoes/:id` | Lançamentos (só os tipos liberados) | `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` |
| `/categorias` · `/categorias/nova` · `/categorias/:id` | Categorias | `CATEGORIAS` |
| `/perfil` | Meu perfil: identidade, dados pessoais (nome, telefone, profissão) e acesso | Logado |
| `/configuracoes` | Funcionalidades da conta pessoal | `PESSOAL` |
| `/empresa` | Dados da empresa (só o administrador edita) | `ADMIN_EMPRESA` ou `USUARIO_EMPRESA` |
| `/empresa/usuarios` · `/novo` · `/:id` | Usuários e acessos da empresa | `ADMIN_EMPRESA` |
| `/admin/painel` | Visão geral do sistema: usuários, empresas, transações, volume de dados, categorias mais usadas | `SUPER_ADMIN` |
| `/admin/usuarios` · `/novo` · `/:id` | Todos os usuários: busca, filtros, cadastro de qualquer perfil, ativar/desativar, excluir | `SUPER_ADMIN` |
| `/admin/empresas` · `/:id` | Empresas: dados, situação, quem tem acesso, números vinculados | `SUPER_ADMIN` |
| `/admin/transacoes` | Transações do sistema (só consulta) com filtros por período, empresa, usuário, categoria, tipo e origem | `SUPER_ADMIN` |
| `/admin/categorias` | Categorias padrão + ranking de uso | `SUPER_ADMIN` |
| `/admin/parametros` · `/novo` · `/:id` | Parâmetros fiscais (vale para MEI/ME, ativo, última alteração) | `SUPER_ADMIN` |
| `/admin/auditoria` | Quem fez cada alteração administrativa | `SUPER_ADMIN` |

¹ Quem já está logado é levado direto para a primeira tela que pode abrir (ver `rotaInicial` em `core/acesso.ts`).

Sem acesso a uma tela, o guard leva para a primeira tela permitida.

### Cadastro

| Etapa | Pessoal | MEI / Microempresa |
|---|---|---|
| 1. Tipo | Pessoal | MEI / Microempresa |
| 2. Cadastro + senha | Nome, e-mail, senha e confirmação | Dados do responsável: nome, e-mail, senha e confirmação |
| 3. Completar perfil | Telefone e profissão | Telefone |
| 4. Empresa | — | Nome, nome fantasia, CNPJ, tipo, telefone e e-mail |
| 5. Configuração inicial | Escolher as funcionalidades | Primeiros passos: equipe, categorias, primeiro lançamento |

- **Senha:** mínimo de 6 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial. A lista de requisitos fica verde em tempo real, e o olho mostra/oculta a senha.
- **Telefone e CNPJ** ganham máscara enquanto a pessoa digita. O CNPJ tem os dígitos verificadores conferidos.
- O backend valida tudo de novo: as regras da tela só guiam quem digita.

### Funcionalidades (módulos)

A conta pessoal escolhe na configuração inicial e depois em **Conta → Funcionalidades** o que quer usar. O administrador da empresa libera, por usuário comum, o que cada um acessa (tem acesso / não tem acesso). Os módulos que ainda não têm tela aparecem como "em breve", mas já podem ser liberados.

## Autenticação

```
Login ──POST /auth/login──▶ { token, expiresIn }
  │
  └─▶ token salvo em localStorage ("fincontrol_token")
        │
        ├─ AuthService lê o payload do JWT: upn (e-mail), groups (perfil), exp (validade)
        ├─ authInterceptor envia  Authorization: Bearer <token>  em toda chamada à API
        ├─ UsuarioService carrega o perfil (GET /usuarios/me): role, módulos, empresa, empresaPendente
        └─ resposta 401 ─▶ logout automático e volta ao login ("Sua sessão expirou" ou "Seu acesso foi desativado")
```

| Peça | Arquivo | Função |
|---|---|---|
| `AuthService` | `core/auth/auth.service.ts` | Login, cadastro, logout, `isLoggedIn()`, `isSuperAdmin()`, rota inicial |
| `authInterceptor` | `core/auth/auth.interceptor.ts` | Anexa o token (exceto em `/auth/*`) e trata 401 |
| `authGuard` | `core/auth/auth.guard.ts` | Exige usuário logado e com o cadastro completo (empresa cadastrada) |
| `empresaPendenteGuard` | `core/auth/auth.guard.ts` | Só deixa abrir o cadastro da empresa quem ainda não cadastrou |
| `moduloGuard(...)` | `core/auth/auth.guard.ts` | Exige pelo menos um dos módulos |
| `perfilGuard(...)` | `core/auth/auth.guard.ts` | Exige um dos perfis (ex.: `SUPER_ADMIN`, `ADMIN_EMPRESA`) |
| `visitanteGuard` | `core/auth/auth.guard.ts` | Tira usuários logados das telas de login/cadastro |

> O frontend **só decide o que mostrar**. Quem valida token, usuário ativo, empresa cadastrada, perfil e módulo é o backend, em toda requisição.

## Comunicação com a API

O endereço da API fica em **`src/app/core/api.ts`**:

```ts
export const API_URL = 'http://localhost:8080';
```

| Serviço | Endpoints usados |
|---|---|
| `AuthService` | `POST /auth/register`, `POST /auth/login` |
| `UsuarioService` | `GET /usuarios/me`, `PUT /usuarios/me` |
| `TransacaoService` | `GET/POST /transacoes`, `GET/PUT/DELETE /transacoes/{id}` |
| `CategoriaService` | `GET/POST /categorias`, `GET/PUT/DELETE /categorias/{id}` |
| `AdminService` | `GET /admin/estatisticas`, CRUD `/admin/parametros` |

**Erros:** o backend responde no formato RFC 7807. A função `mensagemDeErro()` (em `core/api.ts`) transforma a resposta em uma frase para a tela: usa a lista `errors` (erros de campo) ou o `detail`.

**Detalhes importantes:**
- `GET /transacoes` é paginado (máximo 100 por página). Para os totais do dashboard, `TransacaoService.findTodas()` busca as páginas em sequência.

## Identidade visual

| Token | Cor | Uso |
|---|---|---|
| `--fc-roxo` | `#3B1478` | Cor da marca: item ativo do menu, fundos de destaque |
| `--fc-roxo-escuro` | `#2A0E57` | Rodapé, menu no celular |
| `--fc-primary` / `--fc-roxo-medio` | `#4C1D95` | Botões principais, links, foco |
| `--fc-roxo-claro` | `#F3EDFC` | Fundos suaves, item selecionado |
| `--fc-amarelo` | `#FACC15` | Destaques, botão "Começar grátis", avatar |
| `--fc-azul` / `--fc-danger` | `#2B5FB4` / `#E0384B` | Valores positivos / negativos |
| `--fc-success` | `#1E8A5F` | Confirmações e situação "vigente" |

- **Logo:** `public/logo/fincontrol-simbolo-fundo-claro.svg` e `...-fundo-escuro.svg`. No app ela é desenhada pelo componente `<app-logo>` (SVG embutido), com as opções `[pequeno]` e `[fundoClaro]`.
- **Favicon:** `public/favicon.svg`.
- Todos os tokens ficam no `:root` de `src/styles.css`, e o tema do Material em `src/material-theme.scss`.

## Padrões de código

- **Componentes standalone** com `inject()` e estado em **signals** (`signal`, `computed`, `toSignal`).
- **Campos de formulário:** classe global `.campo` (rótulo acima, caixa simples) em vez de `mat-form-field`. Os erros aparecem depois que o campo é tocado ou quando o usuário tenta enviar.
- **Valores monetários:** use `<app-valor [valor]="x" [negativar]="ehDespesa" />`. Ele formata em pt-BR, deixa os centavos menores e pinta de azul ou vermelho.
- **Exclusões** sempre passam pelo `ConfirmDialog` (`shared/confirm-dialog`).
- **Avisos** usam `MatSnackBar` no topo da tela.
- **Rotas** usam `loadComponent` (cada tela é carregada sob demanda).

## Publicação no GitHub Pages

O workflow **`.github/workflows/deploy-pages.yml`** (na raiz do repositório) roda a cada push na `main` que altere a pasta `frontend/` e:

1. instala as dependências e compila com `--base-href /<nome-do-repositório>/` (hoje `/FinControl-ProjetoTP2/`);
2. copia o `index.html` para `404.html`, para que links diretos (ex.: `/admin/painel`) abram o app;
3. publica o resultado na branch **`gh-pages`**.

Configuração no GitHub (uma vez): **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.

> O site publicado continua chamando a API em `localhost:8080`. Por isso, para usar o login, o backend precisa estar rodando na máquina de quem acessa. O backend já libera `https://ctamanda.github.io` no CORS.

## Observações

- As telas antigas de **Estados** e **Municípios** continuam no código (`components/estados`, `components/municipios`), mas estão fora das rotas, porque o backend atual não tem esses endpoints.
- Datas e moeda usam o locale **pt-BR** (registrado em `app.config.ts`).
