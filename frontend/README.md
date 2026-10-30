<p align="center">
  <img src="public/logo/fincontrol-simbolo-fundo-claro.svg" alt="FinControl" width="96" />
</p>

<h1 align="center">FinControl — Frontend</h1>

<p align="center">
  Interface web do FinControl, sistema de controle de finanças pessoais.<br />
  Projeto da disciplina de Tópicos II.
</p>

<p align="center">
  <a href="https://ctamanda.github.io/FinControl-ProjetoTP2/"><b>Ver online (GitHub Pages)</b></a> ·
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

O frontend consome a API REST do FinControl, um sistema de **finanças pessoais**: cada pessoa cria a
própria conta e controla o próprio dinheiro.

| Para quem | O que pode fazer |
|---|---|
| **Visitante** | Ver a página de apresentação, criar conta e entrar |
| **Conta pessoal** (`PESSOAL`) | Visão geral do mês, lançamentos, contas a pagar e a receber, contas financeiras, categorias e perfil, nas funcionalidades que escolheu usar |
| **Administrador do FinControl** (`SUPER_ADMIN`) | Painel do administrador: visão geral do mês, usuários, transações (só consulta), categorias padrão e auditoria |

Cada conta enxerga **apenas os próprios dados**. O administrador do FinControl consulta as transações de
todos sem poder alterá-las, e cada consulta fica na auditoria.

### Fluxo de entrada

```
ENTRAR NO FINCONTROL
  ├─ já tem conta ──► Login ───────────────────────────────┐
  └─ criar conta ──► Cadastro + senha                       │
                     └► Completar perfil (telefone, profissão)
                        └► Configuração inicial ────────────┤
                                                            ▼
                                ENTRAR NO SISTEMA (identifica o perfil)
                                   ┌────────────┴────────────┐
                                PESSOAL                    ADMIN
                           Minhas finanças        Painel do administrador
```

Na área logada, a **barra superior** roxa traz o logo, o seletor de mês (nas telas que usam), o botão
amarelo **+** (ações rápidas), as notificações e o avatar. No computador, a **barra lateral** roxa mostra
só os ícones das funções do perfil; clicar nela (fora de um ícone) abre a lista com os nomes. Funcionalidades
escolhidas que ainda não têm tela ficam num ícone ⋯ ("Em breve"). No celular, os atalhos principais ficam
na **barra inferior** branca, com o **+** redondo no centro; o restante abre pelo avatar ("Todas as telas").

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
| PESSOAL | — | — | Crie em **Criar conta** (ou o administrador cria em Usuários) |

### Dados de demonstração

Com o backend rodando em modo dev (`quarkus:dev`), a carga de demonstração cria 16 contas pessoais
(`nome.sobrenome@fincontrol.demo`, senha **`Demo@123`**) com cadastros, lançamentos e eventos de segurança
espalhados pelos últimos 6 meses. É o que deixa o painel do administrador cheio para a apresentação.
Como carregar e zerar: veja **Dados de demonstração** no README do backend.

| Para ver | E-mail | Senha |
|---|---|---|
| Painel do administrador | `admin@fincontrol.com` | `admin123` |
| Uma conta pessoal com 6 meses de dados | `ana.souza@fincontrol.demo` | `Demo@123` |
| Conta pessoal só com o básico (Dashboard, Lançamentos, Receitas, Despesas, Categorias) | `diego.alves@fincontrol.demo` | `Demo@123` |

> Toda conta pessoal começa com as **categorias padrão** ativas (de início: Alimentação, Moradia, Transporte, Lazer, Salário e Vendas), que o administrador mantém, e com a conta "Carteira".

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
    │   ├── validadores.ts      # senha forte e telefone (mesmas regras do back)
    │   ├── mes.service.ts      # mês escolhido no seletor da barra superior
    │   ├── auth/               # AuthService, interceptor e guards
    │   └── usuario/            # UsuarioService (perfil logado: GET/PUT /usuarios/me)
    ├── models/                 # tipos: usuário (perfis, módulos), auth, transação, conta, categoria, admin
    ├── services/               # acesso à API: transações, contas, categorias, admin
    └── components/
        ├── landing/            # página inicial pública
        ├── auth/               # login e criar conta (cadastro + senha → perfil)
        ├── configuracao-inicial/ # última etapa da entrada (/bem-vindo)
        ├── configuracoes/      # funcionalidades da conta pessoal
        ├── layout/shell/       # barra superior, barra lateral e barra inferior (área logada)
        ├── dashboard/          # visão geral do mês da conta pessoal
        ├── a-pagar/            # contas a pagar e a receber
        ├── contas/             # contas financeiras
        ├── transacoes/         # lista e formulário
        ├── categorias/         # lista e formulário
        ├── perfil/             # cartão de identidade + dados pessoais + acesso
        ├── admin/              # painel do administrador: visão geral, usuários, transações,
        │                       #   categorias padrão e auditoria
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
| `/cadastro` | Criar conta pessoal: cadastro + senha → completar perfil | Só visitante¹ |
| `/bem-vindo` | Configuração inicial: escolher as funcionalidades | Logado |
| `/dashboard` | Visão geral do mês escolhido no topo: saldo início → atual → previsto, categorias, contas, próximas contas a pagar | Módulo `DASHBOARD` |
| `/transacoes` · `/transacoes/nova` · `/transacoes/:id` | Lançamentos com abas Todos / A pagar / A receber / Pagos / Atrasados, conta, situação e "marcar como pago" (`?conta=ID` filtra por conta; `?tipo=` e `?pendente=1` preenchem o formulário) | `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` |
| `/a-pagar` | Contas a pagar e a receber: atrasadas, próximos 7 dias e mais adiante, com pagar/receber e desfazer | `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` |
| `/contas` | Contas financeiras (banco, carteira, poupança): saldo atual e previsto no mês, cadastro, arquivar, excluir | `CONTAS` |
| `/categorias` · `/categorias/nova` · `/categorias/:id` | Categorias com ícone e cor | `CATEGORIAS` |
| `/perfil` | Meu perfil: identidade, dados pessoais (nome, telefone, profissão), **segurança da conta** (senha, e-mail de acesso, sair dos outros aparelhos) e acesso | Logado |
| `/configuracoes` | Funcionalidades da conta pessoal | `PESSOAL` |
| `/admin/painel` | Visão geral do mês (seletor no topo): usuários ativos, novos cadastros, lançamentos e volume com a variação do mês anterior; novos cadastros em 6 meses; tabela de usuários com abas; uso dos módulos; **base de usuários** (total, quem parou de usar há 30+ dias e quem nunca lançou, cada um abrindo a lista filtrada); segurança; categorias padrão mais usadas; auditoria recente | `SUPER_ADMIN` |
| `/admin/usuarios` · `/novo` · `/:id` | Usuários: busca, abas Todos / Ativos / Inativos / Bloqueados / Administradores, filtros vindos do painel (`?filtro=SEM_ACESSO_30_DIAS` ou `SEM_LANCAMENTO`), paginação, último acesso, selos "Bloqueado" e "Senha provisória", criar conta pessoal ou administrador (`?perfil=SUPER_ADMIN`), editar, ativar/desativar (corta o acesso na hora), excluir só sem histórico | `SUPER_ADMIN` |
| `/admin/usuarios/:id/ficha` | Ficha do usuário para o suporte: cadastro, último acesso, situação e **quantidades** (lançamentos, contas, categorias), sem valores nem descrições. Ações: desbloquear, encerrar sessões, gerar senha provisória (mostrada uma vez, com botão de copiar), desativar/reativar | `SUPER_ADMIN` |
| `/admin/transacoes` | Transações de todos os usuários (só consulta e auditada) com filtros por período, usuário (`?usuario=ID`), categoria, tipo e descrição | `SUPER_ADMIN` |
| `/admin/categorias` | Categorias padrão (criar, editar, ativar/desativar, cor e ícone) + ranking de uso | `SUPER_ADMIN` |
| `/admin/auditoria` | Auditoria só leitura com filtros de autor, ação (`?acao=`), período e texto (`?busca=`) | `SUPER_ADMIN` |
| `/trocar-senha` | Primeiro acesso com senha provisória: a pessoa cria a própria senha antes de usar o sistema | Logado com senha provisória |

¹ Quem já está logado é levado direto para a primeira tela que pode abrir (ver `rotaInicial` em `core/acesso.ts`).

Sem acesso a uma tela, o guard leva para a primeira tela permitida.

### Cadastro

| Etapa | O que pede |
|---|---|
| 1. Cadastro + senha | Nome, e-mail, senha e confirmação |
| 2. Completar perfil | Telefone e profissão |
| 3. Configuração inicial | Escolher as funcionalidades |

- **Senha:** mínimo de 6 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial. A lista de requisitos fica verde em tempo real, e o olho mostra/oculta a senha.
- **Telefone** ganha máscara enquanto a pessoa digita.
- O backend valida tudo de novo: as regras da tela só guiam quem digita.

### Funcionalidades (módulos)

A conta pessoal escolhe na configuração inicial e depois em **Conta → Funcionalidades** o que quer usar (tem acesso / não tem acesso). Os módulos que ainda não têm tela aparecem como "em breve", mas já podem ser escolhidos. O painel do administrador mostra quantas contas usam cada um.

## Autenticação

```
Login ──POST /auth/login──▶ { token, expiresIn }
  │
  └─▶ token salvo em localStorage ("fincontrol_token")
        │
        ├─ AuthService lê o payload do JWT: upn (e-mail), groups (perfil), exp (validade)
        ├─ authInterceptor envia  Authorization: Bearer <token>  em toda chamada à API
        ├─ UsuarioService carrega o perfil (GET /usuarios/me): role e módulos
        └─ resposta 401 ─▶ logout automático e volta ao login ("Sua sessão expirou", "Seu acesso foi desativado"
                           ou "Sessão encerrada", quando a senha/e-mail mudou em outro aparelho)
```

**Segurança da conta (Meu perfil).** Alterar os dados pessoais abre o diálogo **"Confirme que é você"**
(`shared/confirmar-senha`), que pede a senha atual; o back confere e responde 400 se estiver errada.
Trocar a senha, trocar o e-mail de acesso e "sair de todos os outros aparelhos" também pedem a senha e
recebem do back um **token novo** (`AuthService.alterarSenha`, `alterarEmail`, `encerrarOutrasSessoes`):
esta sessão continua e as outras caem. Depois de 5 senhas erradas seguidas a conta fica bloqueada por
15 minutos, e o login mostra a mensagem do back (429).

| Peça | Arquivo | Função |
|---|---|---|
| `AuthService` | `core/auth/auth.service.ts` | Login, cadastro, logout, `isLoggedIn()`, `isSuperAdmin()`, rota inicial |
| `authInterceptor` | `core/auth/auth.interceptor.ts` | Anexa o token (exceto em `/auth/*`) e trata 401 |
| `authGuard` | `core/auth/auth.guard.ts` | Exige usuário logado (com o perfil ainda válido no back); com senha provisória, manda para `/trocar-senha` |
| `senhaProvisoriaGuard` | `core/auth/auth.guard.ts` | Só deixa abrir `/trocar-senha` quem ainda tem senha provisória |
| `moduloGuard(...)` | `core/auth/auth.guard.ts` | Exige pelo menos um dos módulos |
| `perfilGuard(...)` | `core/auth/auth.guard.ts` | Exige um dos perfis (`SUPER_ADMIN` ou `PESSOAL`) |
| `visitanteGuard` | `core/auth/auth.guard.ts` | Tira usuários logados das telas de login/cadastro |

> O frontend **só decide o que mostrar**. Quem valida token, usuário ativo, sessão, perfil e módulo é o backend, em toda requisição.

## Comunicação com a API

O endereço da API fica em **`src/app/core/api.ts`**:

```ts
export const API_URL = 'http://localhost:8080';
```

| Serviço | Endpoints usados |
|---|---|
| `AuthService` | `POST /auth/register`, `POST /auth/login` |
| `UsuarioService` | `GET /usuarios/me`, `PUT /usuarios/me`, `PUT /usuarios/me/modulos` (senha, e-mail e sessões ficam no `AuthService`) |
| `TransacaoService` | `GET/POST /transacoes`, `GET/PUT/DELETE /transacoes/{id}`, `PATCH /transacoes/{id}/pagar` e `/reabrir` |
| `ContaService` | `GET/POST /contas`, `GET/PUT/DELETE /contas/{id}`, `PATCH /contas/{id}/arquivar` e `/reativar` |
| `CategoriaService` | `GET/POST /categorias`, `GET/PUT/DELETE /categorias/{id}` |
| `AdminService` | `GET /admin/painel?mes=`, `/admin/usuarios` (ficha, desbloquear, encerrar sessões, senha provisória), `/admin/transacoes`, `/admin/categorias-padrao`, `/admin/categorias/ranking`, `/admin/auditoria` |

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
| `--fc-success` | `#1E8A5F` | Confirmações e situação "pago" |

- **Logo:** `public/logo/fincontrol-simbolo-fundo-claro.svg` e `...-fundo-escuro.svg`. No app ela é desenhada pelo componente `<app-logo>` (SVG embutido), com as opções `[pequeno]` e `[fundoClaro]`.
- **Favicon:** `public/favicon.svg`.
- Todos os tokens ficam no `:root` de `src/styles.css`, e o tema do Material em `src/material-theme.scss`.

**Acabamento estilo iOS** (vale para o site todo):

- Fonte do sistema (SF Pro no iPhone/Mac; Inter nos demais), fundo cinza claro `--fc-bg: #F2F2F7` e cartões brancos com `--fc-radius: 20px` e sombra suave.
- Campos preenchidos (`--fc-campo`) com cantos de 12px e anel roxo no foco; botões, chips e busca em pílula; diálogos com 24px.
- `.segmentado` (controle segmentado do iOS) para escolhas lado a lado: Despesa/Receita, Pago/A pagar, abas de filtro.
- `.status-pg` (Pago, A pagar, Atrasado) e `.btn-pagar` para as contas a pagar.
- Categorias com ícone: `core/icones.ts` (ícones oferecidos), `<app-icone-categoria>` (ícone no círculo da cor da categoria) e `<app-seletor-icone>` (grade de escolha).

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
