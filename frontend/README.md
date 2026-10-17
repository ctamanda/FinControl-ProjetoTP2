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

O frontend consome a API REST do FinControl e oferece:

| Para quem | O que pode fazer |
|---|---|
| **Visitante** | Ver a página de apresentação, criar conta ("Para mim" ou "Para minha empresa") e entrar |
| **Usuário (USER)** | Ver a visão geral do mês, lançar receitas e despesas, gerenciar categorias e editar o perfil |
| **Administrador (ADMIN)** | Tudo do usuário + painel com estatísticas agregadas e CRUD de parâmetros fiscais |

Cada usuário enxerga **apenas os próprios dados**. O administrador vê somente números agregados (LGPD).

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
| ADMIN | `admin@fincontrol.com` | `admin123` | Criado pela migration `V10` do backend |
| USER | — | — | Crie pela tela **Experimente grátis** |

> Ao criar uma conta, o backend já gera 6 categorias: Alimentação, Moradia, Transporte, Lazer, Salário e Vendas.

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
    │   ├── auth/               # AuthService, interceptor e guards
    │   └── usuario/            # UsuarioService (GET/PUT /usuarios/me)
    ├── models/                 # tipos: usuário, auth, transação, categoria, admin
    ├── services/               # acesso à API: transações, categorias, admin
    └── components/
        ├── landing/            # página inicial pública
        ├── auth/               # login e cadastro (2 etapas)
        ├── layout/shell/       # barra superior + menu (área logada)
        ├── dashboard/          # visão geral do usuário
        ├── transacoes/         # lista e formulário
        ├── categorias/         # lista e formulário
        ├── perfil/             # dados do usuário
        ├── admin/              # painel, lista e formulário de parâmetros
        └── shared/             # logo, valor monetário, diálogo, fundo do login
public/
├── favicon.svg
└── logo/                       # símbolo para fundo claro e escuro
```

## Rotas e telas

| Rota | Tela | Acesso |
|---|---|---|
| `/` | Página inicial (apresentação do sistema e da API) | Público |
| `/login` | Login | Só visitante¹ |
| `/cadastro` | Cadastro em 2 etapas (`?perfil=empresa` já marca "Para minha empresa") | Só visitante¹ |
| `/dashboard` | Visão geral: saldo, receitas/despesas do mês, Pessoal × Empresa, categorias, gráfico de 6 meses | Logado |
| `/transacoes` | Lista com busca por descrição e paginação | Logado |
| `/transacoes/nova` · `/transacoes/:id` | Formulário de transação | Logado |
| `/categorias` | Categorias agrupadas em Despesas e Receitas | Logado |
| `/categorias/nova` · `/categorias/:id` | Formulário com tipo e cor | Logado |
| `/perfil` | Nome, perfil fiscal (PF/MEI/ME) e atividade do MEI | Logado |
| `/admin/painel` | Estatísticas agregadas, gráficos e parâmetros vigentes | **ADMIN** |
| `/admin/parametros` | Parâmetros fiscais com filtro por situação (vigente, futuro, encerrado) | **ADMIN** |
| `/admin/parametros/novo` · `/admin/parametros/:id` | Formulário de parâmetro | **ADMIN** |

¹ Quem já está logado é levado direto para a tela inicial do seu perfil (`/dashboard` ou `/admin/painel`).

### Cadastro: "Para mim" ou "Para minha empresa"

O backend trabalha com três perfis fiscais. A tela traduz a escolha assim:

| Escolha na tela | Etapa 2 | `perfilFiscal` enviado |
|---|---|---|
| Para mim | — | `PF` |
| Para minha empresa | "Sua empresa é" **MEI** + atividade (comércio, serviço, ambos) | `MEI` |
| Para minha empresa | "Sua empresa é" **Microempresa** | `ME` |

## Autenticação

```
Login ──POST /auth/login──▶ { token, expiresIn }
  │
  └─▶ token salvo em localStorage ("fincontrol_token")
        │
        ├─ AuthService lê o payload do JWT: upn (e-mail), groups (perfil), exp (validade)
        ├─ authInterceptor envia  Authorization: Bearer <token>  em toda chamada à API
        └─ resposta 401 ─▶ logout automático e volta ao login ("Sua sessão expirou")
```

| Peça | Arquivo | Função |
|---|---|---|
| `AuthService` | `core/auth/auth.service.ts` | Login, cadastro, logout, `isLoggedIn()`, `isAdmin()`, rota inicial por perfil |
| `authInterceptor` | `core/auth/auth.interceptor.ts` | Anexa o token (exceto em `/auth/*`) e trata 401 |
| `authGuard` | `core/auth/auth.guard.ts` | Exige usuário logado |
| `adminGuard` | `core/auth/auth.guard.ts` | Exige perfil ADMIN |
| `visitanteGuard` | `core/auth/auth.guard.ts` | Tira usuários logados das telas de login/cadastro |

> O frontend **só lê** o token para mostrar dados na tela. Quem valida assinatura, validade e perfil é o backend, em toda requisição.

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
| `--fc-roxo` | `#3B1478` | Cor da marca: barra superior, fundos de destaque |
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
