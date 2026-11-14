---
name: seguranca-frontend
description: Diretrizes consolidadas para gestão de autenticação, sessão e segurança no Angular (FinControl), cobrindo o estado atual (localStorage/Bearer), roadmap para Cookies HttpOnly com CSRF e fluxo Authorization Code com PKCE via Keycloak (OIDC).
---

# Governança de Segurança Frontend — FinControl (Angular)

Esta skill estabelece os padrões técnicos, regras arquiteturais e diretrizes de evolução para a segurança da camada frontend (Angular 22+) do **FinControl**. Ela unifica o estado atual da gestão de sessão, as restrições inegociáveis e o roadmap planejado de modernização de segurança.

---

## 1. Objetivo da Skill

Orientar desenvolvedores e agentes na gestão de sessão, interceptação de requisições HTTP, proteção de rotas, consumo seguro de credenciais, combate a ataques XSS/CSRF e integração futura com provedor de identidade OIDC no Angular.

---

## 2. Estado Atual: Armazenamento em `localStorage` & Header Bearer

No modelo atual da aplicação Angular:

### 2.1. Interceptação HTTP (`HttpInterceptor`)
- As credenciais de acesso (token JWT) são recuperadas da memória local do navegador (`localStorage.getItem('token')`).
- O interceptor HTTP injeta o cabeçalho de autenticação em todas as chamadas à API:
  ```typescript
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  ```

### 2.2. Guarda de Rotas (`AuthGuard` / `CanActivateFn`)
- Valida a presença de token e a validade de expiração antes de permitir o acesso a rotas privadas (`/dashboard`, `/transacoes`, `/contas`, `/admin`).
- Em caso de ausência ou expiração do token, redireciona o usuário para `/login`.

### 2.3. Vulnerabilidades Identificadas
- O armazenamento de tokens em `localStorage` deixa as credenciais vulneráveis à exfiltração em eventuais brechas de *Cross-Site Scripting* (XSS).

---

## 3. Roadmap de Evolução 1: Migração para Cookies (HttpOnly / Secure) & CSRF

Para eliminar completamente o vetor de ataque XSS contra tokens de sessão, a aplicação deve transicionar para o modelo baseado em Cookies:

### 3.1. Eliminação do `localStorage`
- **Proibição Total de Persistência Manual:** O token JWT de acesso não deve ser gravado nem manipulado via `localStorage`, `sessionStorage` ou `document.cookie` no código Angular.
- O navegador gerenciará o cookie `access_token` de forma nativa e transparente.

### 3.2. Configuração de `withCredentials` no Cliente HTTP
- O Angular `HttpClient` ou a cadeia de interceptores deve garantir que todas as requisições destinadas à API do FinControl sejam enviadas com `withCredentials: true`:
  ```typescript
  const credsReq = req.clone({
    withCredentials: true
  });
  ```

### 3.3. Proteção CSRF no Angular (Double Submit Cookie)
Para evitar ataques de *Cross-Site Request Forgery*, o frontend deve operar o padrão Double Submit:
1. O backend envia um cookie não-HttpOnly contendo o token anti-CSRF (ex.: `XSRF-TOKEN`).
2. O interceptor do Angular lê o valor desse cookie através de um utilitário (ou via `HttpClientXsrfModule` / `withXsrfConfiguration` nativo do Angular).
3. Para métodos de escrita ou mutação (`POST`, `PUT`, `PATCH`, `DELETE`), o interceptor adiciona automaticamente o cabeçalho:
  ```typescript
  headers: req.headers.set('X-XSRF-TOKEN', xsrfTokenValue)
  ```
4. Requisições de leitura (`GET`, `HEAD`) não necessitam do cabeçalho anti-CSRF.

---

## 4. Roadmap de Evolução 2: Migração para Keycloak (OIDC com PKCE)

Com a evolução para Single Sign-On (SSO) corporativo e Keycloak:

### 4.1. Fluxo Authorization Code com PKCE
- **Eliminação de Formulários de Senha Locais:** O frontend não coletará mais senhas em campos de formulário próprios. O usuário é redirecionado para a página de login do Keycloak.
- Uso de biblioteca padrão do ecossistema Angular (ex.: `angular-oauth2-oidc` ou `@keycloak/keycloak-js`).
- Utilização obrigatória do fluxo **Authorization Code com PKCE (S256)** para SPAs, sem segredos embutidos no bundle JavaScript.

### 4.2. Renovação Silenciosa de Token (*Silent Token Refresh*)
- A biblioteca de autenticação deve orquestrar a renovação automática do access token em segundo plano via iframe oculto ou token refresh endpoint antes que ocorra a expiração (1 hora), garantindo que o usuário não seja deslogado no meio de uma operação financeira.

### 4.3. Logout Centralizado (Single Sign-Out)
- O encerramento de sessão deve disparar o endpoint de logout do Keycloak (`/protocol/openid-connect/logout`), invalidando a sessão no servidor de identidade e limpando os estados da aplicação Angular.

---

## 5. Restrições e Diretrizes Inegociáveis (Críticas)

> [!CAUTION]
> 1. **Proibição de Armazenamento Inseguro:** É terminantemente proibido salvar credenciais, senhas em texto puro ou chaves privadas em `localStorage`, `sessionStorage` ou cookies sem flag de segurança.
> 2. **Frontend Não é a Autoridade Final:** Guards de rota (`CanActivateFn`) e diretivas visuais (ex.: `*ngIf="isAdmin"`) são recursos estritamente voltados para **Experiência do Usuário (UX)**. A autoridade final e soberana de autorização reside no backend.
> 3. **Tratamento Global de Erros HTTP:**
>    - **401 Unauthorized:** O interceptor deve capturar a resposta, limpar o estado de usuário logado e redirecionar imediatamente para a tela de autenticação.
>    - **403 Forbidden:** O interceptor deve exibir mensagem amigável de acesso negado sem revelar detalhes de infraestrutura ou dados sensíveis. Se o motivo for senha provisória pendente, redirecionar para a tela de redefinição obrigatória de senha.
> 4. **Prevenção de Duplo Envio:** Formulários e botões de ação sensível (ex.: pagamento de transação, exclusão de conta) devem desabilitar o gatilho de submissão enquanto a requisição assíncrona estiver em voo.
