---
name: seguranca-backend
description: Diretrizes consolidadas para implementação, revisão e evolução da segurança no Quarkus (FinControl), cobrindo o estado atual com JWT nativo, roadmap para Cookies HttpOnly com proteção CSRF e futura migração para Keycloak (OIDC).
---

# Governança de Segurança Backend — FinControl (Quarkus)

Esta skill estabelece os padrões técnicos, regras arquiteturais e diretrizes de evolução para a segurança da camada backend (Java / Quarkus 3.38+) do **FinControl**. Ela unifica o estado atual do sistema, as restrições inegociáveis e o roadmap planejado de modernização de segurança.

---

## 1. Objetivo da Skill

Orientar desenvolvedores e agentes na implementação, manutenção e revisão de segurança dos endpoints HTTP, autenticação, controle de sessão, autorização baseada em perfis e isolamento estrito de dados entre usuários no backend.

---

## 2. Estado Atual: Autenticação JWT Nativa (SmallRye)

Atualmente, o FinControl opera com autenticação baseada em tokens JWT assinados pelo próprio backend:

### 2.1. Emissão de Tokens (`Tokens.java`)
- **Algoritmo e Chaves:** Criptografia assimétrica RSA com chave privada (`privateKey.pem`) e chave pública (`publicKey.pem`).
- **Tempo de Expiração:** 3.600 segundos (1 hora).
- **Claims Principais:**
  - `upn`: E-mail normalizado do usuário autenticado (chave de identidade do titular).
  - `groups`: Perfis de acesso (`SUPER_ADMIN` ou `PESSOAL`).
  - `sv` (*session version*): Versão numérica da sessão vinculada à coluna `versao_sessao` no banco de dados.

### 2.2. Filtro de Segurança Global (`AcessoFilter`)
Executado em toda requisição autenticada com prioridade `@Priority(Priorities.AUTHORIZATION + 10)`:
1. **Verificação de Conta Ativa:** Checa se o usuário do token ainda existe na base e se `ativo == true`. Usuários desativados perdem o acesso instantaneamente (**401 Unauthorized**).
2. **Controle de Versão de Sessão (`sv`):** Compara a claim `sv` com `usuario.getVersaoSessao()`. Se o usuário tiver trocado a senha, alterado o e-mail ou acionado "encerrar sessões", qualquer token emitido na versão anterior é sumariamente recusado (**401 Unauthorized**).
3. **Mecanismo de Senha Provisória:** Se `usuario.isTrocarSenha() == true`, o filtro bloqueia todos os endpoints com **403 Forbidden** (*"Troque a senha provisória antes de continuar."*), permitindo acesso exclusivo a endpoints anotados com `@PermiteSenhaProvisoria` (`GET /usuarios/me` e `PUT /usuarios/me/senha`).
4. **Verificação de Módulos:** Valida se a conta pessoal possui os módulos necessários anotados com `@RequerModulo` no Resource ou método.

### 2.3. Perfis e Autorização (`Role`)
- `@RolesAllowed("SUPER_ADMIN")`: Acesso restrito aos endpoints administrativos (`/admin/**`), incluindo listagem de usuários, métricas globais e auditoria.
- `@RolesAllowed({"PESSOAL", "SUPER_ADMIN"})`: Gestão das próprias contas financeiras, categorias e transações.

### 2.4. Proteção contra Ataques de Força Bruta (`ControleDeSenha`)
- Limite máximo de **5 tentativas consecutivas** de login com senha incorreta.
- Ao atingir o limite, a conta é bloqueada temporariamente por **15 minutos** com resposta HTTP **429 Too Many Requests**.
- Cada bloqueio ou redefinição é registrado na tabela imutável de auditoria (`auditoria`).
- Hash de senhas realizado obrigatoriamente com **BCrypt** via `quarkus-elytron-security-common`.

---

## 3. Roadmap de Evolução 1: Migração para Cookies (HttpOnly / Secure) & CSRF

Para mitigar os riscos de roubo de credenciais via ataques XSS decorrentes do armazenamento de tokens em `localStorage` no frontend, o backend deve evoluir para o modelo de Cookies Seguros:

```
[ Cliente (Angular) ]                                     [ Backend (Quarkus) ]
         │                                                           │
         │─── POST /auth/login { email, password } ─────────────────>│
         │                                                           │ (Autentica credenciais)
         │<── 200 OK ────────────────────────────────────────────────│
         │    Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict
         │    Set-Cookie: XSRF-TOKEN=...; Secure; SameSite=Strict (Legível p/ JS)
         │                                                           │
         │─── POST /transacoes (Cookie: access_token + XSRF) ────────>│
         │    Header: X-XSRF-TOKEN: <valor_do_cookie_xsrf>           │ (Valida JWT no cookie)
         │                                                           │ (Valida Double Submit CSRF)
         │<── 201 Created ───────────────────────────────────────────│
```

### 3.1. Requisitos de Implementação do Cookie de Acesso
- O endpoint de autenticação `/auth/login` **não deve mais retornar o token de acesso no corpo (body) da resposta JSON**.
- O token JWT deve ser emitido via cabeçalho `Set-Cookie` com as seguintes propriedades estritas:
  - `HttpOnly`: Impede qualquer leitura do token via scripts JavaScript (mitigação direta contra XSS).
  - `Secure`: Garante o tráfego exclusivo sob HTTPS (em produção).
  - `SameSite=Strict`: Impede o envio do cookie em requisições cross-site.
  - `Path=/`: Escopo válido para toda a API.

### 3.2. Proteção Anti-CSRF (Double Submit Cookie Pattern)
Como cookies com `withCredentials` são enviados automaticamente pelo navegador, a proteção contra Cross-Site Request Forgery (CSRF) torna-se obrigatória para todos os métodos mutáveis:
1. O backend gera um token criptográfico CSRF aleatório e o disponibiliza via cookie não-HttpOnly (ex.: `XSRF-TOKEN`, legível pelo Angular).
2. Para toda requisição que altere estado (`POST`, `PUT`, `PATCH`, `DELETE`), o backend deve validar obrigatoriamente se o cabeçalho HTTP `X-XSRF-TOKEN` enviado pelo cliente corresponde exatamente ao valor contido no cookie CSRF da requisição.
3. Requisições seguras de leitura (`GET`, `HEAD`, `OPTIONS`) são isentas da verificação do token CSRF.

---

## 4. Roadmap de Evolução 2: Migração para Keycloak (OIDC / SSO)

Para atender a cenários de Single Sign-On (SSO) corporativo, delegação centralizada de identidades e MFA:

### 4.1. Configuração do `quarkus-oidc`
- A emissão manual de JWT via `Tokens.java` será descontinuada em favor do servidor de identidade Keycloak.
- Configuração do Quarkus via `application.properties`:
  ```properties
  quarkus.oidc.auth-server-url=${KEYCLOAK_URL}/realms/fincontrol
  quarkus.oidc.client-id=fincontrol-backend
  quarkus.oidc.credentials.secret=${KEYCLOAK_CLIENT_SECRET}
  quarkus.oidc.token.issuer=any-valid-issuer-url
  quarkus.oidc.token.audience=fincontrol-backend
  ```

### 4.2. Resolução de Identidade e Mapeamento de Usuário
- O `quarkus-oidc` valida automaticamente a assinatura assimétrica dos tokens (via JWKS do Keycloak), expiração, `issuer` e `audience`.
- O backend extrai o identificador único (`sub` ou `preferred_username`/`email`) do token validado e mapeia para a entidade local `Usuario`.
- A autorização continuará aplicando o princípio do isolamento estrito: todas as consultas do banco continuam amarradas ao `usuario_id` correspondente à identidade autenticada.

---

## 5. Restrições de Segurança Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibição de Token no Body (Fase Cookies):** Assim que a migração para cookies for implantada, nunca retorne o JWT no corpo de respostas HTTP.
> 2. **Não confiar em perfis do cliente:** Nunca aceite `role`, `usuario_id` ou permissões enviadas no corpo (`body`) ou parâmetros de requisição. A autorização deve derivar exclusivamente do token validado.
> 3. **Proibição de Logs de Credenciais:** Nunca registre tokens JWT, hashes de senha, senhas provisórias ou dados de cartões em logs (nem mesmo em nível `DEBUG`).
> 4. **Isolamento de Dados Obrigatório:** Nenhuma consulta (`SELECT`, `UPDATE`, `DELETE`) de transações, contas ou categorias pode ser executada sem a cláusula de restrição ao `usuario_id` do titular autenticado.
> 5. **Ocultação de Recursos de Terceiros (Anti-Enumeração):** Requisições que tentem acessar IDs de outros usuários devem responder com **404 Not Found** (nunca 403 Forbidden).
