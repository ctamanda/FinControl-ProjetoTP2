<p align="center">
  <img src="docs/logo.svg" alt="FinControl" width="96" />
</p>

<h1 align="center">FinControl — Backend (API)</h1>

<p align="center">
  API REST do FinControl, sistema de controle financeiro para pessoas, MEIs e microempresas.<br />
  Projeto da disciplina de Tópicos II.
</p>

<p align="center">
  <a href="../README.md">README geral</a> ·
  <a href="../frontend/README.md">Frontend (Angular)</a> ·
  <a href="https://ctamanda.github.io/FinControl-ProjetoTP2/">Frontend online</a>
</p>

---

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Autenticação e perfis](#autenticação-e-perfis)
- [Endpoints](#endpoints)
- [Formato de erros](#formato-de-erros)
- [Regras de negócio](#regras-de-negócio)
- [Modelo de dados](#modelo-de-dados)
- [Migrations](#migrations)
- [Segurança e LGPD](#segurança-e-lgpd)
- [Testes automatizados](#testes-automatizados)
- [Docker](#docker)

---

## Visão geral

A API controla **usuários, empresas, transações (receitas e despesas), categorias** e **parâmetros fiscais**, com autenticação JWT. Existem dois tipos de conta, escolhidos no cadastro:

- **Pessoal**: a pessoa controla as próprias finanças.
- **MEI / Microempresa**: o responsável cadastra a empresa e pode cadastrar outros usuários para ajudar na gestão.

| Perfil (`role`) | Quem é | Acesso |
|---|---|---|
| **PESSOAL** | Titular de uma conta pessoal | Os próprios dados, nos módulos que escolheu usar |
| **ADMIN_EMPRESA** | Administrador de um MEI/Microempresa | Todos os dados e módulos da empresa + usuários e acessos da empresa |
| **USUARIO_EMPRESA** | Usuário comum cadastrado pelo administrador | Os dados da empresa, **só nos módulos liberados** pelo administrador |
| **SUPER_ADMIN** | Administração interna do FinControl | Painel administrativo: indicadores, todos os usuários e empresas, transações (só leitura), categorias padrão, parâmetros fiscais e auditoria |

Os dados ficam **isolados pelo dono**: numa conta pessoal, o dono é o usuário; numa empresa, é a empresa (todos os usuários dela enxergam os mesmos dados, conforme as permissões). Ninguém altera dados de outra conta ou empresa. O SUPER_ADMIN **consulta** as transações de todos (só leitura, com cada pesquisa registrada na auditoria).

## Tecnologias

| | |
|---|---|
| Linguagem | **Java 25** |
| Framework | **Quarkus 3.38.3** (Quarkus REST + Jackson) |
| Persistência | Hibernate ORM + Panache |
| Banco | **PostgreSQL 16** (H2 em memória no perfil de teste) |
| Migrations | Flyway |
| Segurança | SmallRye JWT (assinatura RSA) + BCrypt |
| Validação | Hibernate Validator (Bean Validation) |
| Documentação | SmallRye OpenAPI / Swagger UI |
| Build | Maven (wrapper incluso) |

## Arquitetura

Camadas clássicas, uma pasta para cada:

```
src/main/java/br/unitins/tp2/fincontrol/
├── resource/     # Endpoints REST (JAX-RS): recebem a requisição, pegam o usuário do JWT
├── service/      # Regras de negócio e transações (@Transactional)
├── repository/   # Consultas Panache (dados financeiros sempre filtrados pelo dono: conta ou empresa)
├── model/        # Entidades JPA e enums
├── dto/          # Records de entrada (RequestDTO, com validação) e saída (ResponseDTO)
├── mapper/       # Conversão entidade → DTO de resposta
├── security/     # AcessoFilter (checagem em toda requisição), Permissoes, @RequerModulo
├── validation/   # Validações reutilizáveis: @SenhaForte, @Telefone, @Cnpj
└── exception/    # Exceções e ExceptionMappers no formato RFC 7807
src/main/resources/
├── application.properties
├── publicKey.pem             # chave pública JWT (a privada NÃO é versionada)
└── db/migration/             # V4__ ... V12__
```

Fluxo de uma requisição autenticada:

```
HTTP + "Authorization: Bearer <jwt>"
  → SmallRye JWT valida assinatura, emissor e validade
  → @RolesAllowed confere o perfil (groups)
  → AcessoFilter: usuário ativo, empresa cadastrada e módulo liberado (@RequerModulo)
  → Resource lê o e-mail do token (upn) e busca o Usuario
  → Service aplica as regras usando esse usuário
  → Repository consulta pelo dono (empresa do usuário ou, na conta pessoal, o próprio usuário)
```

## Como executar

### Pré-requisitos

- **Java 25** (JDK)
- **Docker** (para o PostgreSQL) **ou** um PostgreSQL próprio

### 1. Subir o banco

```bash
docker compose up -d
```

Sobe o PostgreSQL 16 com banco `fincontroldb`, usuário `fincontrol` e senha `123456`, na porta **5432**.

> **Já tem um PostgreSQL instalado na 5432?** Suba o container em outra porta e aponte o backend para ela:
> ```powershell
> $env:DB_PORT="5433"; docker compose up -d
> $env:DATABASE_URL="jdbc:postgresql://localhost:5433/fincontroldb"
> ```

### 2. Configurar as chaves JWT (uma vez)

O token é assinado com uma chave **privada RSA**, que **não vai para o Git** (bloqueada no `.gitignore`). Cada desenvolvedor gera o seu par de chaves (no Git Bash, Linux ou Mac):

```bash
mkdir -p ~/.fincontrol && cd ~/.fincontrol
openssl genpkey -algorithm RSA -out privateKey.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in privateKey.pem -out publicKey.pem
```

Depois, aponte as variáveis de ambiente para os arquivos. No Windows (PowerShell), troque `SEU_USUARIO`:

```powershell
setx JWT_PRIVATE_KEY_LOCATION "file:///C:/Users/SEU_USUARIO/.fincontrol/privateKey.pem"
setx JWT_PUBLIC_KEY_LOCATION  "file:///C:/Users/SEU_USUARIO/.fincontrol/publicKey.pem"
```

Feche e abra o terminal para valer. No Linux ou Mac, use `export` com `file:///home/SEU_USUARIO/...`.

### 3. Iniciar

```bash
./mvnw quarkus:dev        # Linux/Mac
.\mvnw.cmd quarkus:dev    # Windows
```

Na primeira execução, o Flyway cria as tabelas e o **usuário administrador**.

| Endereço | O que é |
|---|---|
| http://localhost:8080 | API |
| http://localhost:8080/q/swagger-ui | Swagger UI (testar os endpoints) |
| http://localhost:8080/q/dev-ui | Dev UI do Quarkus |

### Usuário administrador inicial

| E-mail | Senha |
|---|---|
| `admin@fincontrol.com` | `admin123` |

Criado pela migration `V10__cria_admin.sql` (perfil **SUPER_ADMIN** desde a V12). **Troque a senha antes de qualquer uso fora do ambiente acadêmico.**

## Variáveis de ambiente

| Variável | Padrão | Para quê |
|---|---|---|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/fincontroldb` | URL JDBC do banco |
| `DATABASE_USER` | `fincontrol` | Usuário do banco |
| `DATABASE_PASSWORD` | `123456` | Senha do banco |
| `JWT_PRIVATE_KEY_LOCATION` | `privateKey.pem` (classpath) | Chave privada que **assina** os tokens |
| `JWT_PUBLIC_KEY_LOCATION` | `publicKey.pem` (classpath) | Chave pública que **valida** os tokens |
| `PROBLEM_BASE_URL` | `https://api.fincontrol.com` | Base do campo `type` dos erros |
| `DB_PORT` | `5432` | Porta do PostgreSQL no host (só no `docker-compose.yml`) |

**CORS** liberado para `http://localhost:4200` (ng serve) e `https://ctamanda.github.io` (GitHub Pages).

## Autenticação e perfis

1. `POST /auth/login` com e-mail e senha.
2. A resposta traz `{ "token": "...", "expiresIn": 3600 }`. O token vale **1 hora**.
3. Envie o token em todas as rotas protegidas:
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1Qi...
   ```

Conteúdo do token:

| Claim | Exemplo | Significado |
|---|---|---|
| `iss` | `fincontrol` | Emissor (validado pelo backend) |
| `upn` | `maria@email.com` | E-mail do usuário: é por ele que a API identifica quem chama |
| `groups` | `["PESSOAL"]` | Perfil (`SUPER_ADMIN`, `PESSOAL`, `ADMIN_EMPRESA` ou `USUARIO_EMPRESA`), usado pelo `@RolesAllowed` |
| `exp` | `1792200352` | Validade (1 hora após o login) |

> `/auth/register` cria **PESSOAL** ou **ADMIN_EMPRESA**. O `USUARIO_EMPRESA` é criado pelo administrador da empresa e o SUPER_ADMIN inicial vem das migrations V10/V12.

### Checagem em toda requisição

Antes de qualquer endpoint autenticado, o `security/AcessoFilter` confere:

1. **Usuário existe e está ativo.** Desativado recebe **401** na hora, mesmo com um token ainda válido.
2. **Cadastro completo.** `ADMIN_EMPRESA` sem empresa cadastrada recebe **403** `"Cadastre a empresa para continuar."` em tudo, exceto `/usuarios/me` e `POST /empresa`.
3. **Módulo.** Endpoints com `@RequerModulo` exigem pelo menos um dos módulos listados (ver tabela abaixo).

O perfil continua sendo checado pelo `@RolesAllowed` de cada resource.

### Módulos (funcionalidades)

Liberação simples por módulo: **tem acesso / não tem acesso**. Os módulos que o usuário pode usar vêm em `modulos` no `GET /usuarios/me`.

| Módulo | Conta pessoal | Usuário comum da empresa | Endpoints hoje |
|---|---|---|---|
| `DASHBOARD` | ✔ | ✔ | lê `/transacoes` e `/categorias` |
| `LANCAMENTOS` | ✔ | ✔ | `/transacoes` (receitas e despesas) |
| `RECEITAS` / `DESPESAS` | ✔ | ✔ | `/transacoes`, **só do seu tipo** |
| `CATEGORIAS` | ✔ | ✔ | `/categorias` (criar, alterar, excluir) |
| `CONTAS`, `RECORRENTES`, `CARTOES`, `TAGS`, `ORCAMENTOS`, `RELATORIOS`, `IMPORTACAO`, `EXPORTACAO` | ✔ | ✔ | ainda sem endpoints |
| `CLIENTES`, `FORNECEDORES` | — | ✔ | ainda sem endpoints |
| `USUARIOS` | — | — (vem do perfil `ADMIN_EMPRESA`) | `/empresa/usuarios` |

- **PESSOAL** escolhe os seus módulos em `PUT /usuarios/me` (no cadastro, todos os pessoais vêm marcados).
- **ADMIN_EMPRESA** tem todos os módulos.
- **USUARIO_EMPRESA** tem só os que o administrador liberar.
- **SUPER_ADMIN** tem os módulos pessoais, para os próprios lançamentos.

## Endpoints

Legenda de acesso: 🌐 público · 👤 qualquer usuário logado · 🏢 ADMIN_EMPRESA ou USUARIO_EMPRESA · 🔑 só ADMIN_EMPRESA · 🛡️ só SUPER_ADMIN

### Autenticação — `/auth`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| POST | `/auth/register` | 🌐 | `RegisterRequestDTO` | **201** `UsuarioResponseDTO` · **400** e-mail já cadastrado / campos inválidos |
| POST | `/auth/login` | 🌐 | `LoginRequestDTO` | **200** `{ token, expiresIn }` · **401** credenciais inválidas ou usuário desativado |

```jsonc
// POST /auth/register
{
  "tipoConta": "PESSOAL",           // PESSOAL | EMPRESA
  "nome": "Maria Souza",            // na conta EMPRESA, o nome do responsável
  "email": "maria@email.com",
  "telefone": "(63) 99999-0000",    // DDD + número; pontuação opcional
  "profissao": "Professora",        // obrigatória só na conta PESSOAL
  "password": "Senha@123",          // ver regras de senha
  "confirmPassword": "Senha@123"    // igual a password
}

// POST /auth/login
{ "email": "maria@email.com", "password": "Senha@123" }
```

A conta **EMPRESA** volta com `"empresaPendente": true`: o próximo passo é `POST /empresa`.

### Perfil do usuário — `/usuarios/me`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/usuarios/me` | 👤 | — | **200** `UsuarioResponseDTO` |
| PUT | `/usuarios/me` | 👤 | `UsuarioUpdateDTO` | **200** `UsuarioResponseDTO` |

```jsonc
// UsuarioResponseDTO
{ "id": 7, "email": "joana@doces.com", "nome": "Joana", "telefone": "63999990000",
  "profissao": null, "role": "ADMIN_EMPRESA", "ativo": true,
  "modulos": ["DASHBOARD", "CONTAS", "RECEITAS", "...", "USUARIOS"],
  "empresa": { "id": 2, "nome": "Doces da Joana", "tipo": "MEI", "responsavel": true },
  "empresaPendente": false }

// UsuarioUpdateDTO (e-mail e perfil de acesso não mudam por aqui)
// "profissao" e "modulos" só valem na conta PESSOAL; "modulos" nulo mantém os atuais.
{ "nome": "Maria S. Souza", "telefone": "63999990000",
  "profissao": "Professora", "modulos": ["DASHBOARD", "LANCAMENTOS", "CATEGORIAS"] }
```

### Empresa — `/empresa`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/empresa` | 🏢 | — | **200** `EmpresaResponseDTO` |
| POST | `/empresa` | 🔑 (com a empresa pendente) | `EmpresaRequestDTO` | **201** · **400** CNPJ inválido/repetido ou empresa já cadastrada |
| PUT | `/empresa` | 🔑 | `EmpresaRequestDTO` | **200** |

```jsonc
// EmpresaRequestDTO
{ "razaoSocial": "Joana Doces LTDA", "nomeFantasia": "Doces da Joana",  // nome fantasia opcional
  "cnpj": "12.345.678/0001-95",     // dígitos verificadores conferidos; gravado só com números
  "tipo": "MEI",                    // MEI | MICROEMPRESA
  "telefone": "(63) 3215-0000", "email": "contato@doces.com" }
```

Quem cadastra a empresa vira o **administrador principal** (`idResponsavel`) e a empresa ganha as 6 categorias iniciais.

### Usuários da empresa — `/empresa/usuarios`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/empresa/usuarios` | 🔑 | — | **200** lista de `UsuarioResponseDTO` |
| GET | `/empresa/usuarios/{id}` | 🔑 | — | **200** · **404** se não for da empresa |
| POST | `/empresa/usuarios` | 🔑 | `UsuarioEmpresaRequestDTO` | **201** |
| PUT | `/empresa/usuarios/{id}` | 🔑 | `UsuarioEmpresaUpdateDTO` | **200** |
| PATCH | `/empresa/usuarios/{id}/desativar` | 🔑 | — | **200** · remove o acesso sem apagar o cadastro |
| PATCH | `/empresa/usuarios/{id}/ativar` | 🔑 | — | **200** |
| DELETE | `/empresa/usuarios/{id}` | 🔑 | — | **204** · **400** se já registrou lançamentos/categorias |

```jsonc
// UsuarioEmpresaRequestDTO
{ "nome": "Carlos", "email": "carlos@doces.com", "telefone": "63988887777",
  "role": "USUARIO_EMPRESA",                 // USUARIO_EMPRESA | ADMIN_EMPRESA
  "modulos": ["DASHBOARD", "RECEITAS"],      // ignorado para ADMIN_EMPRESA (tem todos)
  "password": "Senha@123", "confirmPassword": "Senha@123" }

// UsuarioEmpresaUpdateDTO (e-mail e senha não mudam por aqui)
{ "nome": "Carlos", "telefone": "63988887777",
  "role": "USUARIO_EMPRESA", "modulos": ["DASHBOARD", "LANCAMENTOS"] }
```

### Transações — `/transacoes`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/transacoes?page=0&pageSize=10&descricao=` | 👤 `DASHBOARD`, `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` | — | **200** `PageResponse<TransacaoResponseDTO>` |
| GET | `/transacoes/{id}` | idem | — | **200** · **404** se não existir ou for de outra conta |
| POST | `/transacoes` | 👤 `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` | `TransacaoRequestDTO` | **201** · **403** tipo não liberado |
| PUT | `/transacoes/{id}` | idem | `TransacaoRequestDTO` | **204** |
| DELETE | `/transacoes/{id}` | idem | — | **204** |

- `page` começa em 0. `pageSize` vai de 1 a **100**.
- `descricao` é opcional e filtra por trecho, sem diferenciar maiúsculas.
- A lista vem ordenada por data, da mais recente para a mais antiga.
- Com só `RECEITAS` (ou só `DESPESAS`), a lista traz e aceita apenas aquele tipo.
- O `escopo` (`PESSOAL` ou `EMPRESA`) não é enviado: sai do tipo de conta de quem lança.

```jsonc
// TransacaoRequestDTO
{
  "descricao": "Mercado",        // 2 a 150 caracteres
  "valor": 152.37,               // > 0, até 2 casas
  "data": "2026-10-10",          // yyyy-MM-dd
  "tipo": "DESPESA",             // RECEITA | DESPESA
  "idCategoria": 3               // categoria da mesma conta/empresa e do mesmo tipo
}

// PageResponse
{ "items": [ { "id": 1, "descricao": "Mercado", "valor": 152.37, "data": "2026-10-10",
               "tipo": "DESPESA", "escopo": "PESSOAL",
               "categoria": { "id": 3, "nome": "Alimentação", "tipo": "DESPESA", "cor": "#FF5733" } } ],
  "page": 0, "pageSize": 10, "totalItems": 1, "totalPages": 1 }
```

### Categorias — `/categorias`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/categorias` | 👤 `CATEGORIAS` ou algum módulo de transações/dashboard | — | **200** lista ordenada por nome (sem paginação) |
| GET | `/categorias/{id}` | idem | — | **200** · **404** |
| POST | `/categorias` | 👤 `CATEGORIAS` | `CategoriaRequestDTO` | **201** `CategoriaResponseDTO` |
| PUT | `/categorias/{id}` | 👤 `CATEGORIAS` | `CategoriaRequestDTO` | **200** · **400** se mudar o tipo de uma categoria com transações |
| DELETE | `/categorias/{id}` | 👤 `CATEGORIAS` | — | **204** · **400** se houver transações na categoria |

```jsonc
// CategoriaRequestDTO
{ "nome": "Saúde", "tipo": "DESPESA", "cor": "#8E24AA" }   // nome 2–60; cor hexadecimal opcional
```

### Painel administrativo — `/admin` (só SUPER_ADMIN)

Toda alteração importante fica registrada na **auditoria** (quem, o quê, em quê, quando).

**Indicadores**

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/estatisticas` | **200** `EstatisticaResponseDTO` |

```jsonc
// EstatisticaResponseDTO
{ "totalUsuarios": 9, "usuariosAtivos": 8, "usuariosInativos": 1,
  "totalAdmins": 1, "totalUsers": 8,              // SUPER_ADMIN x demais
  "totalContasPessoais": 3, "totalUsuariosEmpresa": 5,
  "totalEmpresas": 2, "empresasAtivas": 2,
  "totalTransacoes": 7, "totalCategorias": 43, "mediaTransacoesPorUsuario": 0.8,
  "volumeDadosBytes": 8493215,                    // tamanho do banco (null se o banco não informar)
  "totalRegistros": 76, "novosUsuarios30Dias": 9, "transacoes30Dias": 7,
  "categoriasMaisUtilizadas": [ { "nome": "Vendas", "tipo": "RECEITA", "totalTransacoes": 3, "totalContas": 1 } ],
  "transacoesPorMes": [ { "mes": "2026-10", "quantidade": 5 } ] }   // últimos 6 meses
```

**Usuários** — qualquer tipo de conta

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/usuarios?busca=&role=&ativo=&idEmpresa=&page=0&pageSize=20` | — | **200** `PageResponse<UsuarioResponseDTO>` |
| GET | `/admin/usuarios/{id}` | — | **200** · **404** |
| POST | `/admin/usuarios` | `AdminUsuarioRequestDTO` | **201** |
| PUT | `/admin/usuarios/{id}` | `AdminUsuarioUpdateDTO` | **200** |
| PATCH | `/admin/usuarios/{id}/ativar` · `/desativar` | — | **200** |
| DELETE | `/admin/usuarios/{id}` | — | **204** · **400** se já registrou lançamentos |

```jsonc
// AdminUsuarioRequestDTO
{ "nome": "Ana", "email": "ana@x.com", "telefone": "63977776666",
  "profissao": "Contadora",           // obrigatória para PESSOAL
  "role": "PESSOAL",                  // PESSOAL | SUPER_ADMIN | USUARIO_EMPRESA | ADMIN_EMPRESA
  "idEmpresa": null,                  // obrigatório para USUARIO_EMPRESA; opcional para ADMIN_EMPRESA
  "modulos": ["DASHBOARD", "LANCAMENTOS"],
  "password": "Senha@123", "confirmPassword": "Senha@123" }

// AdminUsuarioUpdateDTO — o perfil só alterna entre USUÁRIO e ADMINISTRADOR do mesmo tipo de conta:
// PESSOAL <-> SUPER_ADMIN e USUARIO_EMPRESA <-> ADMIN_EMPRESA
{ "nome": "Ana", "telefone": "63977776666", "profissao": "Contadora", "role": "SUPER_ADMIN", "modulos": null }
```

**Empresas**

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/empresas?busca=&ativo=&page=0&pageSize=20` | — | **200** `PageResponse<AdminEmpresaResponseDTO>` (com responsável, total de usuários e de transações) |
| GET | `/admin/empresas/{id}` | — | **200** · **404** |
| PUT | `/admin/empresas/{id}` | `EmpresaRequestDTO` | **200** |
| PATCH | `/admin/empresas/{id}/ativar` · `/desativar` | — | **200** — desativada, nenhum usuário dela entra |

Os usuários de uma empresa saem de `GET /admin/usuarios?idEmpresa={id}`.

**Transações** — só leitura

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/transacoes?inicio=&fim=&idEmpresa=&idUsuario=&categoria=&tipo=&escopo=&descricao=&page=0&pageSize=20` | **200** `PageResponse<AdminTransacaoResponseDTO>` (cada item traz a empresa — nula na conta pessoal — e quem lançou) |

Cada nova pesquisa (página 0) é registrada na auditoria como `CONSULTA_TRANSACOES`.

**Categorias**

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/categorias/ranking?limite=50` | — | **200** uso das categorias no sistema todo (somadas por nome e tipo) |
| GET | `/admin/categorias-padrao` | — | **200** categorias que toda conta nova recebe |
| POST | `/admin/categorias-padrao` | `CategoriaRequestDTO` | **201** |
| PUT | `/admin/categorias-padrao/{id}` | `CategoriaRequestDTO` | **200** |
| PATCH | `/admin/categorias-padrao/{id}/ativar` · `/desativar` | — | **200** — só as ativas são copiadas para contas novas |

**Parâmetros fiscais** — valores fiscais ficam no banco, nunca fixos no código

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/parametros` | — | **200** lista (por chave e vigência) |
| GET | `/admin/parametros/{id}` | — | **200** · **404** |
| POST | `/admin/parametros` | `ParametroFiscalRequestDTO` | **201** |
| PUT | `/admin/parametros/{id}` | `ParametroFiscalRequestDTO` | **200** |
| PATCH | `/admin/parametros/{id}/ativar` · `/desativar` | — | **200** — desativado sai de uso e fica no histórico |
| DELETE | `/admin/parametros/{id}` | — | **204** |

```jsonc
// ParametroFiscalRequestDTO
{ "chave": "LIMITE_FATURAMENTO_MEI", "valor": 81000.00,
  "vigenciaInicio": "2026-01-01", "vigenciaFim": "2026-12-31",
  "descricao": "Teto de faturamento anual do MEI",   // opcional
  "tipoEmpresa": "MEI" }                            // MEI | MICROEMPRESA | null (os dois)

// A resposta traz também "ativo", "ultimaAlteracao" e "alteradoPor" (e-mail de quem alterou por último).
```

**Auditoria**

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/auditoria?busca=&acao=&page=0&pageSize=20` | **200** `PageResponse<AuditoriaResponseDTO>` (`dataHora`, `autorEmail`, `acao`, `alvo`, `detalhe`) |

Ações registradas: `USUARIO_CRIADO`, `USUARIO_ALTERADO`, `PERFIL_ALTERADO`, `USUARIO_ATIVADO`, `USUARIO_DESATIVADO`, `USUARIO_EXCLUIDO`, `EMPRESA_CADASTRADA`, `EMPRESA_ALTERADA`, `EMPRESA_ATIVADA`, `EMPRESA_DESATIVADA`, `CATEGORIA_PADRAO_*`, `PARAMETRO_*` e `CONSULTA_TRANSACOES`. Vale também para o que o administrador da empresa faz com a equipe.

## Formato de erros

Os erros da aplicação seguem o padrão **RFC 7807 / 9457** (`application/problem+json`):

```json
{
  "type": "http://localhost:8080/errors/validation-error",
  "title": "Erro de validação",
  "status": 400,
  "detail": "Um ou mais campos não passaram na validação.",
  "instance": "/transacoes",
  "timestamp": "2026-10-16T23:39:56-03:00",
  "errors": [
    { "field": "descricao", "message": "O campo deve conter entre 2 e 150 caracteres." }
  ]
}
```

| Status | Quando |
|---|---|
| 400 | Validação de campos (`errors`), regra de negócio (`detail`), corpo ausente ou JSON inválido (ex.: enum inexistente lista os valores aceitos; data fora de `aaaa-mm-dd`) |
| 401 | Sem token, token inválido ou expirado (**sem corpo**, vem da camada de segurança); senha errada no login; **usuário desativado** (com corpo RFC 7807) |
| 403 | Perfil sem permissão, ex.: PESSOAL em `/admin/*` (**sem corpo**); sem o módulo, tipo de transação não liberado ou empresa ainda não cadastrada (com `detail`) |
| 404 | Recurso inexistente **ou de outra conta/empresa** (não revela que existe) |
| 409 | Conflito no banco em requisições simultâneas (ex.: dois cadastros com o mesmo e-mail ao mesmo tempo) |
| 500 | Erro inesperado (detalhe só no log do servidor) |

## Regras de negócio

| Regra | Onde |
|---|---|
| E-mail único, **sem diferenciar maiúsculas** (gravado em minúsculas; login aceita qualquer caixa) | `UsuarioService` + índice `uk_usuario_email_lower` (V11) |
| Senha: 6 a 100 caracteres, com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial; `confirmPassword` igual a `password`. A resposta 400 lista **todas** as regras que faltam. Vale no cadastro e na criação de usuários da empresa | `validation/SenhaForte` + `@AssertTrue` nos DTOs |
| Senha guardada com **BCrypt** (nunca em texto puro) | `UsuarioService`, `UsuarioEmpresaService` |
| Telefone com DDD: 10 dígitos (fixo) ou 11 (celular, começando com 9); gravados só com números | `validation/Telefone` + `Documentos.soDigitos` |
| Conta PESSOAL exige profissão | `RegisterRequestDTO`, `UsuarioService.atualizarPerfil` |
| CNPJ com dígitos verificadores válidos e **único**; gravado só com números | `validation/Cnpj` + `EmpresaService` |
| ADMIN_EMPRESA só usa o sistema depois de cadastrar a empresa (uma única vez) | `AcessoFilter` + `EmpresaService.criar` |
| Conta pessoal e empresa começam com 6 categorias: Alimentação, Moradia, Transporte, Lazer (despesas), Salário e Vendas (receitas) | `CategoriasIniciais` |
| Dados da empresa (categorias e transações) são **compartilhados** entre os usuários dela; os da conta pessoal são só do titular | `repository/Dono` |
| Usuário comum não recebe o módulo `USUARIOS`; conta pessoal não escolhe `CLIENTES`/`FORNECEDORES` (400 listando os inválidos) | `Permissoes.exigirPermitidos` |
| O administrador **não altera o próprio perfil** nem se desativa/exclui | `UsuarioEmpresaService` |
| O **administrador principal** (quem criou a empresa) não pode ser rebaixado, desativado nem excluído | `UsuarioEmpresaService` |
| Usuário que já registrou lançamentos ou categorias **não é excluído**: deve ser desativado (mantém o histórico) | `UsuarioEmpresaService.excluir` |
| Usuário desativado não entra (401 no login) e perde o acesso na hora (401 em qualquer requisição) | `UsuarioService.autenticar` + `AcessoFilter` |
| Nome de categoria único **por conta/empresa**, sem diferenciar maiúsculas e ignorando espaços nas pontas | `CategoriaServiceImpl` |
| Cor de categoria vazia vira `null`; cor informada é gravada em maiúsculas | `CategoriaServiceImpl` |
| Não dá para **mudar o tipo** de uma categoria que já tem transações | `CategoriaServiceImpl` |
| Categoria com transações vinculadas **não pode ser excluída** | `CategoriaServiceImpl.delete` |
| Transação só aceita categoria **da mesma conta/empresa** e **do mesmo tipo** (despesa → categoria de despesa) | `TransacaoServiceImpl` |
| Paginação: `page ≥ 0` e `1 ≤ pageSize ≤ 100` | `TransacaoServiceImpl.validarPaginacao` |
| Parâmetro fiscal: `vigenciaFim ≥ vigenciaInicio` | DTO (`@AssertTrue`) + `ParametroFiscalServiceImpl` |
| Parâmetro fiscal: chave normalizada em `MAIUSCULAS_COM_UNDERLINE` (`"teto mei"` → `TETO_MEI`) | `ParametroFiscalServiceImpl.normalizarChave` |
| Parâmetro fiscal: **sem sobreposição** de vigência para a mesma chave | `ParametroFiscalServiceImpl.verificarSobreposicao` |
| Token de uma conta que não existe mais responde **401** | `AcessoFilter` + `UsuarioService.buscarLogado` |
| Perfil mudou depois do login (ex.: admin rebaixado): o token antigo responde **401** | `AcessoFilter` |
| Empresa desativada: nenhum usuário dela entra (401 no login e em qualquer requisição) | `Permissoes.motivoBloqueio` |
| Sempre existe **pelo menos um SUPER_ADMIN ativo**; ninguém altera o próprio perfil nem se desativa/exclui | `AdminUsuarioService` |
| Exclusão só de quem não tem histórico (lançamentos ou categorias criadas numa empresa); as categorias iniciais da conta pessoal vão junto | `AdminUsuarioService.temHistorico` |
| Categorias iniciais das contas novas vêm das **categorias padrão ativas** | `CategoriasIniciais` + `categoria_padrao` |
| Parâmetro fiscal: só os **ativos** contam na vigência e na regra de sobreposição | `ParametroFiscalServiceImpl` |
| Alterações administrativas importantes ficam na **auditoria** | `AuditoriaService` |

## Modelo de dados

```
empresa  1 ───< usuario           (usuario.empresa_id; nulo na conta pessoal)
usuario  1 ───< usuario_modulo    (módulos escolhidos/liberados)
empresa  1 ───< categoria         (categoria.empresa_id; nulo = conta pessoal)
empresa  1 ───< transacao         (transacao.empresa_id; nulo = conta pessoal)
usuario  1 ───< categoria         (categoria.usuario_id = dono pessoal ou quem criou)
usuario  1 ───< transacao         (transacao.usuario_id = dono pessoal ou quem lançou)
categoria 1 ─< transacao          (transacao.id_categoria)
parametro_fiscal                  (global, administrado pelo SUPER_ADMIN)
```

| Tabela | Colunas principais |
|---|---|
| `usuario` | `email` (único, sem diferenciar maiúsculas), `nome`, `password` (BCrypt), `telefone`, `profissao`, `role`, `ativo`, `empresa_id` |
| `usuario_modulo` | `usuario_id`, `modulo` |
| `empresa` | `razao_social`, `nome_fantasia`, `cnpj` (único), `tipo`, `telefone`, `email`, `responsavel_id` |
| `categoria` | `nome`, `tipo`, `cor`, `usuario_id`, `empresa_id` |
| `transacao` | `descricao`, `valor` NUMERIC(15,2), `data`, `tipo`, `escopo`, `id_categoria`, `usuario_id`, `empresa_id` |
| `parametro_fiscal` | `chave`, `valor` NUMERIC(15,2), `vigencia_inicio`, `vigencia_fim` · único (`chave`, `vigencia_inicio`) |

Todas as entidades herdam de `DefaultEntity`: `id` (IDENTITY), `dataCadastro` e `dataAlteracao`, preenchidas automaticamente.

**Enums** (gravados como texto):

| Enum | Valores |
|---|---|
| `Role` | `SUPER_ADMIN`, `PESSOAL`, `ADMIN_EMPRESA`, `USUARIO_EMPRESA` |
| `TipoConta` | `PESSOAL`, `EMPRESA` (só no cadastro) |
| `TipoEmpresa` | `MEI`, `MICROEMPRESA` |
| `Modulo` | ver [Módulos](#módulos-funcionalidades) |
| `TipoTransacao` / `TipoCategoria` | `RECEITA`, `DESPESA` |
| `Escopo` | `PESSOAL`, `EMPRESA` |

## Migrations

Quem cria e altera tabelas é o **Flyway**; o Hibernate só valida (`database.generation=validate`).

| Versão | O que faz |
|---|---|
| V4 | Cria `transacao` (e `categoria`, se ainda não existir) |
| V5 | Cria `usuario` |
| V6 | Adiciona o dono (`usuario_id`) em `transacao` |
| V7 | Renomeia `username` → `email`; adiciona `nome`, `perfil_fiscal` e `atividade_mei` |
| V8 | Adiciona o dono (`usuario_id`) em `categoria` + nome único por usuário |
| V9 | Cria `parametro_fiscal` |
| V10 | Cria o usuário administrador inicial e as 6 categorias dele |
| V11 | Padroniza e-mails em minúsculas e cria índice único que ignora maiúsculas |
| V12 | Tipos de conta: cria `empresa` e `usuario_modulo`; adiciona telefone, WhatsApp, profissão, `ativo` e `empresa_id` no usuário e `empresa_id` em categoria/transação; converte ADMIN → SUPER_ADMIN, PF → PESSOAL e MEI/ME → ADMIN_EMPRESA (com a empresa pendente); remove `perfil_fiscal` e `atividade_mei` |

| V13 | Painel administrativo: empresa ativa/inativa, `categoria_padrao` (as 6 iniciais saem do código), descrição/tipo de empresa/ativo/"alterado por" no parâmetro fiscal, tabela `auditoria` e os tetos de faturamento do MEI e da ME de 2026 |
| V14 | Remove a coluna `whatsapp` do usuário (o cadastro pede só o telefone) |

> **Regra do time:** migration que já foi para a `main` **nunca é editada**. Para mudar algo, crie uma nova (`V15__...`).

Contas MEI/ME antigas viram ADMIN_EMPRESA com a empresa pendente. Ao cadastrar a empresa, as categorias e transações que já tinham passam a ser da empresa.

## Segurança e LGPD

- **Senhas** com BCrypt; nunca saem nas respostas.
- **JWT RSA** com validade de 1 hora; a chave privada fica fora do repositório.
- **Checagem em toda requisição** (`AcessoFilter`): usuário ativo, cadastro da empresa concluído e módulo liberado.
- **Isolamento pelo dono:** transações e categorias são sempre buscadas pelo dono (conta pessoal ou empresa), que vem do token. Um id de outra conta responde **404**, como se não existisse.
- **Painel administrativo:** o SUPER_ADMIN gerencia usuários e empresas e **consulta** as transações de todos (sem alterar), e cada pesquisa de transações fica na auditoria. Essa visão foi uma decisão do projeto e substitui a regra anterior de "só dados agregados".
- **Auditoria** de toda alteração administrativa importante (usuários, perfis, empresas, categorias padrão, parâmetros fiscais).
- **Logs:** a exibição de SQL com parâmetros reais vale só no perfil `dev`.

## Testes automatizados

Testes de ponta a ponta em `src/test/java/.../ApiTest.java` (JUnit 5 + RestAssured), rodando com **H2 em memória**. Não precisam de Docker nem de PostgreSQL, e as chaves JWT são geradas na hora por `ChavesJwtTeste`.

```bash
./mvnw test        # Linux/Mac
.\mvnw.cmd test   # Windows
```

Cobrem 52 cenários:
- cadastro e login (conta pessoal e de empresa, e-mail sem diferenciar maiúsculas, regras de senha e confirmação, profissão, telefone, senha errada, categorias iniciais);
- empresa (só usa o sistema depois de cadastrar, CNPJ inválido/repetido, cadastro único, conta pessoal não cadastra empresa);
- usuários da empresa (módulos liberados, dados compartilhados, Receitas sem Despesas, `USUARIOS` não liberável, desativar/ativar, administrador principal protegido, exclusão só sem histórico, isolamento entre empresas);
- conta pessoal personalizando os módulos;
- erros de entrada (corpo ausente, JSON malformado, enum inválido, sem token);
- isolamento entre contas (ler, editar e excluir dados de outra pessoa; usar categoria alheia);
- regras de transação, categoria, perfil e paginação;
- painel administrativo (403 para os outros perfis, indicadores, busca e cadastro de usuários de todos os tipos, troca de perfil e token antigo invalidado, proteção do próprio usuário, exclusão só sem histórico, empresa desativada bloqueando a equipe, transações de todos com filtros e auditoria, categorias padrão e ranking, parâmetros fiscais ativos/inativos com "alterado por").

> Rodar `mvnw test` com o `quarkus:dev` aberto faz o modo dev reiniciar (as classes são recompiladas). Espere alguns segundos antes da próxima requisição.

## Docker

O `Dockerfile` gera a imagem da API em duas etapas (build com JDK 25 e execução com JRE 25):

```bash
docker build -t fincontrol-api .
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/fincontroldb \
  -e JWT_PRIVATE_KEY_LOCATION=file:///keys/privateKey.pem \
  -e JWT_PUBLIC_KEY_LOCATION=file:///keys/publicKey.pem \
  -v ~/.fincontrol:/keys \
  fincontrol-api
```

O `docker-compose.yml` sobe só o banco; a API roda com `quarkus:dev` durante o desenvolvimento.
