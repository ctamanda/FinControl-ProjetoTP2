<p align="center">
  <img src="docs/logo.svg" alt="FinControl" width="96" />
</p>

<h1 align="center">FinControl — Backend (API)</h1>

<p align="center">
  API REST do FinControl, sistema de controle de finanças pessoais.<br />
  Projeto da disciplina de Tópicos II.
</p>

<p align="center">
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

A API controla **usuários, contas financeiras, transações (receitas e despesas, pagas ou a pagar)** e **categorias**, com autenticação JWT. O FinControl é um sistema de **finanças pessoais**: cada pessoa cria a própria conta e controla o próprio dinheiro.

| Perfil (`role`) | Quem é | Acesso |
|---|---|---|
| **PESSOAL** | Titular de uma conta pessoal (único tipo aberto no cadastro) | Os próprios dados, nos módulos que escolheu usar |
| **SUPER_ADMIN** | Administração interna do FinControl | Painel administrativo: visão geral com indicadores do mês, todos os usuários, transações (só leitura e auditada), categorias padrão e auditoria |

Os dados ficam **isolados pelo dono**, que é sempre o usuário: ninguém lê nem altera dados de outra conta (um id de outra pessoa responde **404**). O SUPER_ADMIN **consulta** as transações de todos (só leitura, com cada pesquisa registrada na auditoria).

> Até a V17/V18 o sistema também tinha contas de MEI/microempresa, colaboradores e parâmetros fiscais. Isso saiu do escopo; veja [Migrations](#migrations) para o que aconteceu com os dados.

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
├── repository/   # Consultas Panache (dados financeiros sempre filtrados pelo dono: o usuário)
├── model/        # Entidades JPA e enums
├── dto/          # Records de entrada (RequestDTO, com validação) e saída (ResponseDTO)
├── mapper/       # Conversão entidade → DTO de resposta
├── security/     # AcessoFilter (checagem em toda requisição), Permissoes, @RequerModulo
├── validation/   # Validações reutilizáveis: @SenhaForte, @Telefone
├── dev/          # Carga de dados de demonstração (só existe no perfil dev)
└── exception/    # Exceções e ExceptionMappers no formato RFC 7807
src/main/resources/
├── application.properties
├── publicKey.pem             # chave pública JWT (a privada NÃO é versionada)
└── db/migration/             # V4__ ... V19__
```

Fluxo de uma requisição autenticada:

```
HTTP + "Authorization: Bearer <jwt>"
  → SmallRye JWT valida assinatura, emissor e validade
  → @RolesAllowed confere o perfil (groups)
  → AcessoFilter: usuário ativo, perfil e sessão ainda válidos, módulo liberado (@RequerModulo)
  → Resource lê o e-mail do token (upn) e busca o Usuario
  → Service aplica as regras usando esse usuário
  → Repository consulta pelo dono (o próprio usuário)
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

### Dados de demonstração (só no perfil dev)

Para apresentar o painel do administrador com números de verdade, o perfil **dev** (`quarkus:dev`)
carrega uma massa de exemplo gerada pela classe `dev/CargaDemonstracao`. Ela **não existe** no build
de produção nem nos testes (`@IfBuildProfile("dev")`).

O que a carga cria (tudo com e-mail `@fincontrol.demo` e senha **`Demo@123`**):

- **16 contas pessoais** cadastradas ao longo dos últimos 6 meses, com módulos variados: 2 desativadas pelo admin,
  1 que **parou de usar** (Rafael, sem entrar há 41 dias) e 2 que se cadastraram e **nunca lançaram** (Otávio e Paula);
- contas financeiras (Carteira, Nubank, Banco Inter, Poupança) e categorias próprias (Pet, Saúde, Assinaturas, Educação, Freelance);
- **lançamentos de todos os meses** desde o cadastro de cada uma: salário, aluguel, luz, mercado, transporte, lazer...
  Os do resto do mês atual ficam **a pagar/receber** e algumas contas do mês passado ficam **atrasadas**;
- **eventos de auditoria**: senhas trocadas, contas bloqueadas por senha errada (hoje), sessões encerradas,
  e-mail alterado, usuário criado e desativado pelo admin;
- último acesso de cada conta.

Como usar (propriedade `fincontrol.demo`):

| Comando | O que faz |
|---|---|
| `./mvnw quarkus:dev` | **Carrega** se ainda não existir (`%dev.fincontrol.demo=carregar` no `application.properties`). Se já existe, não mexe em nada |
| `./mvnw quarkus:dev -Dfincontrol.demo=recarregar` | **Zera e carrega de novo** (as datas acompanham o dia de hoje) |
| `./mvnw quarkus:dev -Dfincontrol.demo=zerar` | **Zera**: apaga só as contas `@fincontrol.demo`, os dados delas e os registros de auditoria em que elas aparecem |
| `./mvnw quarkus:dev -Dfincontrol.demo=nada` | Sobe sem tocar nos dados de demonstração |

No Windows, use `.\mvnw.cmd` no lugar de `./mvnw`. Os valores são gerados com semente fixa: a mesma carga
dá os mesmos números. Os seus dados e os do admin não são alterados.

> As contas de demonstração têm senha pública: servem só para o ambiente local e para a apresentação.

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
| `groups` | `["PESSOAL"]` | Perfil (`SUPER_ADMIN` ou `PESSOAL`), usado pelo `@RolesAllowed` |
| `exp` | `1792200352` | Validade (1 hora após o login) |
| `sv` | `0` | Versão da sessão: trocar senha/e-mail ou encerrar as sessões invalida os tokens antigos |

> `/auth/register` cria só **PESSOAL**. Outros administradores são criados pelo SUPER_ADMIN no painel; o primeiro vem das migrations V10/V12.

### Checagem em toda requisição

Antes de qualquer endpoint autenticado, o `security/AcessoFilter` confere:

1. **Usuário existe e está ativo.** Desativado recebe **401** na hora, mesmo com um token ainda válido.
2. **Perfil e sessão.** Se o perfil mudou depois do login ou a sessão foi encerrada (claim `sv`), o token antigo recebe **401**.
3. **Módulo.** Endpoints com `@RequerModulo` exigem pelo menos um dos módulos listados (ver tabela abaixo).

O perfil continua sendo checado pelo `@RolesAllowed` de cada resource.

### Módulos (funcionalidades)

Liberação simples por módulo: **tem acesso / não tem acesso**. A conta pessoal escolhe os módulos no
cadastro (todos vêm marcados) e depois em `PUT /usuarios/me/modulos`. Os que pode usar vêm em `modulos`
no `GET /usuarios/me`. O SUPER_ADMIN tem todos, para os próprios lançamentos.

| Módulo | Endpoints hoje |
|---|---|
| `DASHBOARD` | lê `/transacoes`, `/categorias` e `/contas` |
| `LANCAMENTOS` | `/transacoes` (receitas e despesas) |
| `RECEITAS` / `DESPESAS` | `/transacoes`, **só do seu tipo** |
| `CATEGORIAS` | `/categorias` (criar, alterar, excluir) |
| `CONTAS` | `/contas` (criar, alterar, arquivar, excluir) |
| `RECORRENTES`, `CARTOES`, `TAGS`, `ORCAMENTOS`, `RELATORIOS`, `IMPORTACAO`, `EXPORTACAO` | ainda sem endpoints ("em breve" na tela) |

## Endpoints

Legenda de acesso: 🌐 público · 👤 qualquer usuário logado · 🛡️ só SUPER_ADMIN

### Autenticação — `/auth`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| POST | `/auth/register` | 🌐 | `RegisterRequestDTO` | **201** `UsuarioResponseDTO` · **400** e-mail já cadastrado / campos inválidos |
| POST | `/auth/login` | 🌐 | `LoginRequestDTO` | **200** `{ token, expiresIn }` · **401** credenciais inválidas ou usuário desativado |

```jsonc
// POST /auth/register
{
  "nome": "Maria Souza",
  "email": "maria@email.com",
  "telefone": "(63) 99999-0000",    // DDD + número; pontuação opcional
  "profissao": "Professora",        // obrigatória
  "password": "Senha@123",          // ver regras de senha
  "confirmPassword": "Senha@123"    // igual a password
}

// POST /auth/login
{ "email": "maria@email.com", "password": "Senha@123" }
```

A conta já nasce pronta para usar: todos os módulos, as categorias padrão ativas e a conta "Carteira".
O login grava o **último acesso** do usuário (mostrado no painel do admin).

### Perfil do usuário — `/usuarios/me`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/usuarios/me` | 👤 | — | **200** `UsuarioResponseDTO` |
| PUT | `/usuarios/me` | 👤 | `UsuarioUpdateDTO` (com `senhaAtual`) | **200** `UsuarioResponseDTO` |
| PUT | `/usuarios/me/modulos` | PESSOAL | `{ "modulos": [...] }` | **200** `UsuarioResponseDTO` |
| PUT | `/usuarios/me/senha` | 👤 | `{ "senhaAtual", "novaSenha", "confirmacaoSenha" }` | **200** `LoginResponseDTO` (token novo) |
| PUT | `/usuarios/me/email` | 👤 | `{ "novoEmail", "senhaAtual" }` | **200** `LoginResponseDTO` (token novo) |
| POST | `/usuarios/me/encerrar-sessoes` | 👤 | `{ "senhaAtual" }` | **200** `LoginResponseDTO` (token novo) |

**Reautenticação:** alterar dados pessoais, senha ou e-mail e encerrar as sessões exigem a **senha atual**,
mesmo com o token válido. Senha errada responde **400** com o campo `senhaAtual` e conta como tentativa
errada para o bloqueio (ver [Segurança e LGPD](#segurança-e-lgpd)). Senha, e-mail e "encerrar sessões"
invalidam todos os tokens anteriores e devolvem um token novo para a sessão atual continuar.

```jsonc
// UsuarioResponseDTO
{ "id": 7, "email": "maria@email.com", "nome": "Maria Souza", "telefone": "63999990000",
  "profissao": "Professora", "role": "PESSOAL", "ativo": true,
  "modulos": ["DASHBOARD", "CONTAS", "RECEITAS", "..."],
  "dataCadastro": "2026-10-16T10:20:00", "ultimoAcesso": "2026-10-26T22:54:12" }

// UsuarioUpdateDTO (e-mail e perfil de acesso não mudam por aqui)
// "profissao" é obrigatória na conta PESSOAL; os módulos mudam em PUT /usuarios/me/modulos.
{ "nome": "Maria S. Souza", "telefone": "63999990000", "profissao": "Professora",
  "senhaAtual": "Senha@123" }
```

### Transações — `/transacoes`

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/transacoes?page=0&pageSize=10` + filtros | 👤 `DASHBOARD`, `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` | — | **200** `PageResponse<TransacaoResponseDTO>` |
| GET | `/transacoes/{id}` | idem | — | **200** · **404** se não existir ou for de outra conta |
| POST | `/transacoes` | 👤 `LANCAMENTOS`, `RECEITAS` ou `DESPESAS` | `TransacaoRequestDTO` | **201** · **403** tipo não liberado |
| PUT | `/transacoes/{id}` | idem | `TransacaoRequestDTO` | **204** |
| PATCH | `/transacoes/{id}/pagar` | idem | `{ "dataPagamento"?, "idConta"? }` (opcional) | **200** · **400** se já estiver pago |
| PATCH | `/transacoes/{id}/reabrir` | idem | — | **200** (volta a pendente) · **400** se não estiver pago |
| DELETE | `/transacoes/{id}` | idem | — | **204** |

- `page` começa em 0. `pageSize` vai de 1 a **100**.
- Filtros opcionais: `descricao` (trecho, sem diferenciar maiúsculas), `tipo` (`RECEITA`/`DESPESA`),
  `status` (`PAGO`, `PENDENTE` — inclui os atrasados — ou `ATRASADO`), `mes` (`aaaa-mm`, pela data) e `idConta`.
- A lista vem da data mais recente para a mais antiga; filtrando pendentes, do vencimento mais próximo.
- **Contas a pagar e a receber:** lançamento com `pago: false` é pendente e a `data` é o vencimento.
  Só os pagos mexem no saldo da conta. O `status` é calculado: `PAGO`, `PENDENTE` ou `ATRASADO` (vencido).
- Com só `RECEITAS` (ou só `DESPESAS`), a lista traz e aceita apenas aquele tipo.

```jsonc
// TransacaoRequestDTO
{
  "descricao": "Mercado",        // 2 a 150 caracteres
  "valor": 152.37,               // > 0, até 2 casas
  "data": "2026-10-10",          // yyyy-MM-dd; se pendente, é o vencimento
  "tipo": "DESPESA",             // RECEITA | DESPESA
  "idCategoria": 3,              // categoria do mesmo dono e do mesmo tipo
  "idConta": 2,                  // opcional: padrão = conta ativa mais antiga (não aceita arquivada)
  "pago": true,                  // opcional: padrão = data até hoje (data futura vira pendente)
  "dataPagamento": "2026-10-10"  // opcional: padrão = a data (ou hoje); não pode ser futura
}

// PageResponse
{ "items": [ { "id": 1, "descricao": "Mercado", "valor": 152.37, "data": "2026-10-10",
               "tipo": "DESPESA",
               "categoria": { "id": 3, "nome": "Alimentação", "tipo": "DESPESA", "cor": "#FF5733", "icone": "restaurant" },
               "usuario": { "id": 7, "nome": "Maria", "email": "maria@ex.com" },
               "conta": { "id": 2, "nome": "Nubank", "tipo": "CONTA_CORRENTE", "cor": "#820AD1" },
               "pago": true, "dataPagamento": "2026-10-10", "status": "PAGO" } ],
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
// CategoriaRequestDTO (cor hexadecimal e ícone do Material Icons opcionais)
{ "nome": "Saúde", "tipo": "DESPESA", "cor": "#8E24AA", "icone": "favorite" }
```

### Contas financeiras — `/contas`

Onde o dinheiro está (banco, poupança, carteira...). O saldo é calculado a cada consulta:
`saldoAtual` = saldo inicial + receitas pagas − despesas pagas. Toda conta pessoal nasce com a conta
**Carteira**.

| Método | Rota | Acesso | Corpo | Resposta |
|---|---|---|---|---|
| GET | `/contas?mes=aaaa-mm&inativas=false` | PESSOAL com `CONTAS` ou algum módulo de transações/dashboard | — | **200** lista com os saldos do mês |
| GET | `/contas/{id}?mes=` | idem | — | **200** · **404** de outro usuário |
| POST | `/contas` | 👤 `CONTAS` | `ContaFinanceiraRequestDTO` | **201** |
| PUT | `/contas/{id}` | 👤 `CONTAS` | `ContaFinanceiraRequestDTO` | **200** |
| PATCH | `/contas/{id}/arquivar` · `/reativar` | 👤 `CONTAS` | — | **200** · **400** se for a última conta ativa |
| DELETE | `/contas/{id}` | 👤 `CONTAS` | — | **204** · **400** se tiver lançamentos (arquive) ou for a última ativa |

```jsonc
// ContaFinanceiraRequestDTO (nome único por dono; saldo inicial pode ser negativo)
{ "nome": "Nubank", "tipo": "CONTA_CORRENTE", "saldoInicial": 1500.00, "cor": "#820AD1" }
// tipo: CONTA_CORRENTE | POUPANCA | CARTEIRA | INVESTIMENTO | OUTRA

// ContaFinanceiraResponseDTO (mês pedido; padrão = mês atual)
{ "id": 2, "nome": "Nubank", "tipo": "CONTA_CORRENTE", "cor": "#820AD1", "ativa": true,
  "saldoInicial": 1500.00, "saldoAtual": 2940.10,
  "receitasMes": 5400.00, "despesasMes": 3610.30,   // lançamentos do mês, pagos ou não
  "saldoPrevisto": 2328.40,                          // atual + pendentes que vencem até o fim do mês
  "totalLancamentos": 37 }
```

### Painel administrativo — `/admin` (só SUPER_ADMIN)

Toda alteração importante fica registrada na **auditoria** (quem, o quê, em quê, quando).

**Visão geral do mês**

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/painel?mes=aaaa-mm` | **200** `PainelAdminDTO` (padrão: mês atual) · **400** mês em formato errado |
| GET | `/admin/estatisticas` | **200** `EstatisticaResponseDTO` (totais gerais do sistema) |

```jsonc
// PainelAdminDTO: cada indicador vem com o mês anterior, para a variação
{ "mes": "2026-10",
  "usuariosAtivos": { "atual": 15, "anterior": 12 },   // contas pessoais com lançamento no mês
  "novosCadastros": { "atual": 11, "anterior": 2 },    // contas pessoais criadas no mês
  "lancamentos":    { "atual": 131, "anterior": 107 }, // lançamentos com data no mês
  "volume":         { "atual": 26403.20, "anterior": 10751.64 }, // receitas + despesas do mês
  "totais": { "usuarios": 22, "ativos": 20, "inativos": 2, "administradores": 1, "contasPessoaisAtivas": 19 },
  "cadastrosPorMes": [ { "mes": "2026-05", "contasPessoais": 2 }, "... 6 meses até o escolhido" ],
  "modulos": [ { "modulo": "DESPESAS", "ligados": 19, "comDados": 15 },
               { "modulo": "DASHBOARD", "ligados": 19, "comDados": null } ],  // null = não guarda dados para contar
  "categoriasPadrao": [ { "id": 1, "nome": "Alimentação", "tipo": "DESPESA", "cor": "#FF5733", "icone": "restaurant",
                          "ativo": true, "lancamentos": 43, "usuarios": 14 } ],  // uso no mês, somando as cópias
  "seguranca": { "contasBloqueadasHoje": 2, "senhasTrocadasSemana": 5,
                 "sessoesEncerradasSemana": 2, "emailsTrocadosSemana": 1 },  // contados na auditoria
  "engajamento": { "semAcesso30Dias": 1, "nuncaLancaram": 2, "semAcessoRegistrado": 0 } }  // situação de hoje
```

Nada no painel é estimado: tudo sai de cadastros, lançamentos e auditoria. "Ligado" é o módulo escolhido
pela conta; "com dados" é quem já usou de fato (lançou receita/despesa, cadastrou conta além da Carteira
ou criou categoria própria). A base dos percentuais são as contas pessoais ativas.

`engajamento` olha as contas pessoais ativas **hoje** (não depende do mês): `semAcesso30Dias` conta quem
tem último login registrado há 30 dias ou mais; `nuncaLancaram`, quem não tem nenhum lançamento.
Quem ainda não tem login gravado (o último acesso só é gravado desde a V19) vai em `semAcessoRegistrado`
e não entra em "parou de usar", para não chutar um número.

**Usuários**

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/usuarios?busca=&role=&ativo=&situacao=&page=0&pageSize=20` | — | **200** `PageResponse<UsuarioResponseDTO>` (com `ultimoAcesso`, `bloqueadoAte` e `trocarSenha`) |
| GET | `/admin/usuarios/{id}` | — | **200** · **404** |
| GET | `/admin/usuarios/{id}/ficha` | — | **200** `FichaUsuarioDTO`: cadastro, acesso, situação e **quantidades** (lançamentos, contas, categorias), sem valores nem descrições |
| PATCH | `/admin/usuarios/{id}/desbloquear` | — | **200** zera as senhas erradas e o bloqueio · **400** se a conta não está bloqueada |
| POST | `/admin/usuarios/{id}/encerrar-sessoes` | — | **200** todos os tokens do usuário deixam de valer · **400** na própria conta (use `/usuarios/me/encerrar-sessoes`) |
| POST | `/admin/usuarios/{id}/senha-provisoria` | — | **200** `{ "senhaProvisoria": "..." }` (só nesta resposta, `Cache-Control: no-store`) · **400** na própria conta |
| POST | `/admin/usuarios` | `AdminUsuarioRequestDTO` | **201** |
| PUT | `/admin/usuarios/{id}` | `AdminUsuarioUpdateDTO` | **200** |
| PATCH | `/admin/usuarios/{id}/ativar` · `/desativar` | — | **200** · desativar corta o acesso na hora (401 no próximo pedido) |
| DELETE | `/admin/usuarios/{id}` | — | **204** · **400** se tiver histórico (lançamentos ou ações na auditoria) |

`situacao` aceita `BLOQUEADO` (bloqueada agora por senhas erradas), `SEM_ACESSO_30_DIAS` e `SEM_LANCAMENTO`
(contas pessoais ativas, os mesmos critérios do painel).

**Senha provisória:** o admin gera uma senha de 10 caracteres que cumpre as regras de senha forte. A senha atual
deixa de valer, as sessões abertas caem e o bloqueio é tirado. No próximo login a pessoa só consegue ver o
próprio perfil (`GET /usuarios/me`, com `trocarSenha: true`) e trocar a senha (`PUT /usuarios/me/senha`);
qualquer outra rota responde **403** até a troca. O banco guarda só o hash, e a auditoria registra o fato
(`SENHA_PROVISORIA_GERADA`), nunca a senha.

Desbloquear (`CONTA_DESBLOQUEADA`), encerrar sessões (`SESSOES_ENCERRADAS`, autor = admin) e a senha
provisória ficam na auditoria com o e-mail do admin.

```jsonc
// AdminUsuarioRequestDTO
{ "nome": "Ana", "email": "ana@x.com", "telefone": "63977776666",
  "profissao": "Contadora",           // obrigatória para PESSOAL
  "role": "PESSOAL",                  // PESSOAL | SUPER_ADMIN
  "modulos": ["DASHBOARD", "LANCAMENTOS"],
  "password": "Senha@123", "confirmPassword": "Senha@123" }

// AdminUsuarioUpdateDTO — o perfil alterna entre PESSOAL e SUPER_ADMIN
{ "nome": "Ana", "telefone": "63977776666", "profissao": "Contadora", "role": "SUPER_ADMIN", "modulos": null }
```

**Transações** — só leitura

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/transacoes?inicio=&fim=&idUsuario=&categoria=&tipo=&descricao=&page=0&pageSize=20` | **200** `PageResponse<AdminTransacaoResponseDTO>` (cada item traz o usuário dono) |

Cada nova pesquisa (página 0) é registrada na auditoria como `CONSULTA_TRANSACOES`. Não existe rota
para o admin alterar ou apagar lançamentos.

**Categorias**

| Método | Rota | Corpo | Resposta |
|---|---|---|---|
| GET | `/admin/categorias/ranking?limite=50` | — | **200** uso das categorias no sistema todo (somadas por nome e tipo) |
| GET | `/admin/categorias-padrao` | — | **200** categorias que toda conta nova recebe |
| POST | `/admin/categorias-padrao` | `CategoriaRequestDTO` (nome, tipo, cor, ícone) | **201** |
| PUT | `/admin/categorias-padrao/{id}` | `CategoriaRequestDTO` | **200** |
| PATCH | `/admin/categorias-padrao/{id}/ativar` · `/desativar` | — | **200** — só as ativas são copiadas para contas novas |

**Auditoria** — só leitura

| Método | Rota | Resposta |
|---|---|---|
| GET | `/admin/auditoria?autor=&acao=&inicio=aaaa-mm-dd&fim=aaaa-mm-dd&busca=&page=0&pageSize=20` | **200** `PageResponse<AuditoriaResponseDTO>` (`dataHora`, `autorEmail`, `acao`, `alvo`, `detalhe`) · **400** fim antes do início |

`autor` procura no e-mail de quem fez; `acao` é a ação exata; `inicio` e `fim` são dias inteiros;
`busca` procura no autor, no alvo e no detalhe. **Não há** `PUT`, `PATCH` nem `DELETE` em `/admin/auditoria` (405): a trilha é imutável.

Ações registradas: `USUARIO_CRIADO`, `USUARIO_ALTERADO`, `PERFIL_ALTERADO`, `USUARIO_ATIVADO`, `USUARIO_DESATIVADO`,
`USUARIO_EXCLUIDO`, `CATEGORIA_PADRAO_*`, `CONSULTA_TRANSACOES` e os eventos de segurança `DADOS_PESSOAIS_ALTERADOS`,
`SENHA_ALTERADA`, `EMAIL_ALTERADO`, `SESSOES_ENCERRADAS` e `CONTA_BLOQUEADA`. Registros antigos de empresa e
parâmetros fiscais (`EMPRESA_*`, `PARAMETRO_*`) continuam guardados como histórico.

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
| 401 | Sem token, token inválido ou expirado (**sem corpo**, vem da camada de segurança); senha errada no login; **usuário desativado** ou sessão encerrada (com corpo RFC 7807) |
| 429 | Conta bloqueada por alguns minutos depois de 5 senhas erradas seguidas |
| 403 | Perfil sem permissão, ex.: PESSOAL em `/admin/*` (**sem corpo**); sem o módulo ou tipo de transação não liberado (com `detail`) |
| 404 | Recurso inexistente **ou de outro usuário** (não revela que existe) |
| 405 | Método que não existe na rota (ex.: `DELETE /admin/auditoria`) |
| 409 | Conflito no banco em requisições simultâneas (ex.: dois cadastros com o mesmo e-mail ao mesmo tempo) |
| 500 | Erro inesperado (detalhe só no log do servidor) |

## Regras de negócio

| Regra | Onde |
|---|---|
| E-mail único, **sem diferenciar maiúsculas** (gravado em minúsculas; login aceita qualquer caixa) | `UsuarioService` + índice `uk_usuario_email_lower` (V11) |
| Senha: 6 a 100 caracteres, com pelo menos 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial; `confirmPassword` igual a `password`. A resposta 400 lista **todas** as regras que faltam | `validation/SenhaForte` + `@AssertTrue` nos DTOs |
| Senha guardada com **BCrypt** (nunca em texto puro) | `UsuarioService`, `AdminUsuarioService` |
| Telefone com DDD: 10 dígitos (fixo) ou 11 (celular, começando com 9); gravados só com números | `validation/Telefone` + `Documentos.soDigitos` |
| O cadastro público cria só conta PESSOAL, que exige profissão | `RegisterRequestDTO`, `UsuarioService` |
| Conta pessoal começa com as categorias padrão ativas e uma conta financeira "Carteira" | `DadosIniciais` |
| O dono dos dados é sempre o usuário: categorias, contas e transações de outra pessoa respondem **404** | `repository/Dono` |
| Só lançamento pago mexe no saldo; pendente é conta a pagar/receber e a data é o vencimento | `TransacaoServiceImpl`, `ContaFinanceiraService` |
| Data de pagamento não pode ser futura; conta arquivada não recebe lançamento novo | `TransacaoServiceImpl` |
| Sempre sobra uma conta ativa; conta com lançamentos não é excluída (só arquivada) | `ContaFinanceiraService` |
| Nome de categoria único **por usuário**, sem diferenciar maiúsculas e ignorando espaços nas pontas | `CategoriaServiceImpl` |
| Cor de categoria vazia vira `null`; cor informada é gravada em maiúsculas | `CategoriaServiceImpl` |
| Não dá para **mudar o tipo** de uma categoria que já tem transações | `CategoriaServiceImpl` |
| Categoria com transações vinculadas **não pode ser excluída** | `CategoriaServiceImpl.delete` |
| Transação só aceita categoria **do mesmo dono** e **do mesmo tipo** (despesa → categoria de despesa) | `TransacaoServiceImpl` |
| Paginação: `page ≥ 0` e `1 ≤ pageSize ≤ 100` | `TransacaoServiceImpl.validarPaginacao` |
| Usuário desativado não entra (401 no login) e perde o acesso na hora (401 em qualquer requisição) | `UsuarioService.autenticar` + `AcessoFilter` |
| Token de uma conta que não existe mais responde **401** | `AcessoFilter` + `UsuarioService.buscarLogado` |
| Perfil mudou depois do login (ex.: admin rebaixado): o token antigo responde **401** | `AcessoFilter` |
| Sempre existe **pelo menos um SUPER_ADMIN ativo**; ninguém altera o próprio perfil nem se desativa/exclui | `AdminUsuarioService` |
| Ficha do usuário só com quantidades; valores, saldos e descrições ficam de fora | `AdminUsuarioService.ficha` |
| Senha provisória: aparece uma vez, só o hash é guardado e as outras rotas respondem 403 até a troca | `AdminUsuarioService`, `AcessoFilter` |
| Exclusão só de quem não tem histórico (lançamentos ou ações na auditoria); as categorias e a conta iniciais vão junto | `AdminUsuarioService.temHistorico` |
| Admin rebaixado a PESSOAL ganha as categorias padrão e a Carteira, se ainda não tiver | `AdminUsuarioService` |
| Categorias iniciais das contas novas vêm das **categorias padrão ativas** (com cor e ícone) | `DadosIniciais` + `categoria_padrao` |
| Alterações administrativas importantes e eventos de segurança ficam na **auditoria**, que não pode ser alterada | `AuditoriaService` |

## Modelo de dados

```
usuario  1 ───< usuario_modulo    (módulos escolhidos)
usuario  1 ───< categoria         (categoria.usuario_id = dono)
usuario  1 ───< conta_financeira  (conta_financeira.usuario_id = dono)
usuario  1 ───< transacao         (transacao.usuario_id = dono)
categoria 1 ─< transacao          (transacao.id_categoria)
conta_financeira 1 ─< transacao   (transacao.conta_id)
categoria_padrao                  (global: o que toda conta nova recebe)
auditoria                         (global, imutável; autor gravado como id + e-mail, sem chave estrangeira)
```

| Tabela | Colunas principais |
|---|---|
| `usuario` | `email` (único, sem diferenciar maiúsculas), `nome`, `password` (BCrypt), `telefone`, `profissao`, `role`, `ativo`, `tentativas_login`, `bloqueado_ate`, `versao_sessao`, `ultimo_acesso` |
| `usuario_modulo` | `usuario_id`, `modulo` |
| `categoria` | `nome`, `tipo`, `cor`, `icone`, `usuario_id` |
| `conta_financeira` | `nome`, `tipo`, `saldo_inicial` NUMERIC(15,2), `cor`, `ativa`, `usuario_id` |
| `transacao` | `descricao`, `valor` NUMERIC(15,2), `data` (vencimento se pendente), `tipo`, `pago`, `data_pagamento`, `id_categoria`, `conta_id`, `usuario_id` |
| `categoria_padrao` | `nome` (único sem diferenciar maiúsculas), `tipo`, `cor`, `icone`, `ativo` |
| `auditoria` | `autor_id`, `autor_email`, `acao`, `alvo`, `detalhe`, `datacadastro` |

Todas as entidades herdam de `DefaultEntity`: `id` (IDENTITY), `dataCadastro` e `dataAlteracao`, preenchidas automaticamente.

**Enums** (gravados como texto):

| Enum | Valores |
|---|---|
| `Role` | `SUPER_ADMIN`, `PESSOAL` |
| `Modulo` | ver [Módulos](#módulos-funcionalidades) |
| `TipoTransacao` / `TipoCategoria` | `RECEITA`, `DESPESA` |
| `TipoContaFinanceira` | `CONTA_CORRENTE`, `POUPANCA`, `CARTEIRA`, `INVESTIMENTO`, `OUTRA` |
| `StatusPagamento` (calculado) | `PAGO`, `PENDENTE`, `ATRASADO` |

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
| V15 | Segurança da conta: tentativas de login, bloqueio temporário e versão da sessão |
| V16 | Contas financeiras; lançamento com conta, `pago` e data de pagamento; ícone nas categorias (os lançamentos antigos vão para a conta "Carteira"/"Caixa" criada para cada dono, e os de data futura viram pendentes) |
| V17 | Remove a tabela `parametro_fiscal` (só existia para os limites do MEI/ME) |
| V18 | **Remove empresa** (ver abaixo): converte os perfis de empresa em PESSOAL, passa os dados da empresa para o responsável e apaga a tabela `empresa`, as colunas `empresa_id` e `transacao.escopo` |
| V19 | Último acesso do usuário (`ultimo_acesso`), gravado no login |
| V20 | Senha provisória (`trocar_senha`, falso para todo mundo que já existe) |

> **Regra do time:** migration que já foi para a `main` **nunca é editada**. Para mudar algo, crie uma nova (`V21__...`).

**O que a V18 faz com os dados que já existem** (nada financeiro é apagado):

1. Todo `ADMIN_EMPRESA` e `USUARIO_EMPRESA` vira **PESSOAL**, continua ativo ou inativo como estava e recebe todos os módulos.
2. As categorias, contas financeiras e lançamentos de cada empresa passam para o **responsável** dela,
   inclusive o que os colaboradores lançaram.
3. Se o responsável já tinha uma categoria pessoal com o mesmo nome: sendo do mesmo tipo, os lançamentos
   vão para a dele e a repetida sai; sendo de outro tipo, a da empresa ganha o sufixo " (empresa)".
4. Quem fica sem categorias ou sem conta (colaboradores e admin com empresa pendente) recebe as categorias
   padrão ativas e a conta "Carteira", como num cadastro novo.
5. Saem os módulos `CLIENTES`, `FORNECEDORES` e `USUARIOS`, as colunas `empresa_id` e `transacao.escopo` e a tabela `empresa`.
6. A auditoria antiga fica como está (é imutável).

## Segurança e LGPD

- **Senhas** com BCrypt; nunca saem nas respostas.
- **JWT RSA** com validade de 1 hora; a chave privada fica fora do repositório.
- **Reautenticação:** alterar os próprios dados pessoais, a senha ou o e-mail pede a senha atual de novo.
  Uma sessão esquecida aberta não basta para mudar os dados de ninguém.
- **Bloqueio contra força bruta:** 5 senhas erradas seguidas (no login ou na confirmação de senha)
  bloqueiam a conta por 15 minutos (**429**); acertar a senha zera a contagem. O bloqueio vai para a auditoria.
- **Encerramento de sessões:** o token leva a versão da sessão do usuário (claim `sv`). Trocar a senha
  ou o e-mail, ou usar "sair de todos os outros aparelhos", sobe a versão e os tokens antigos passam a
  responder **401** na hora.
- **Checagem em toda requisição** (`AcessoFilter`): usuário ativo, perfil e sessão válidos e módulo liberado.
- **Isolamento pelo dono:** transações, contas e categorias são sempre buscadas pelo dono (o usuário do token). Um id de outra conta responde **404**, como se não existisse.
- **Painel administrativo:** o SUPER_ADMIN gerencia os usuários e **consulta** as transações de todos (sem alterar), e cada pesquisa de transações fica na auditoria. Essa visão foi uma decisão do projeto e substitui a regra anterior de "só dados agregados".
- **Auditoria imutável** de toda alteração administrativa importante (usuários, perfis, categorias padrão, consultas de transações)
  e dos eventos de segurança da conta (dados pessoais, senha e e-mail alterados, sessões encerradas, conta bloqueada).
- **Logs:** a exibição de SQL com parâmetros reais vale só no perfil `dev`.
- **Repositório:** `.env`, chaves (só a `publicKey.pem` vai para o Git), arquivos de IA, prompts e referências de design ficam no `.gitignore`.

## Testes automatizados

Testes de ponta a ponta em `src/test/java/.../ApiTest.java` (JUnit 5 + RestAssured), rodando com **H2 em memória**. Não precisam de Docker nem de PostgreSQL, e as chaves JWT são geradas na hora por `ChavesJwtTeste`.

```bash
./mvnw test        # Linux/Mac
.\mvnw.cmd test   # Windows
```

São **62 testes**, todos passando. Cobrem:
- cadastro e login (conta pessoal, e-mail sem diferenciar maiúsculas, regras de senha e confirmação, profissão, telefone, senha errada, categorias e conta iniciais);
- segurança da conta (senha atual para alterar dados, troca de senha/e-mail invalidando os tokens, encerrar sessões, bloqueio depois de 5 senhas erradas);
- módulos da conta pessoal (Receitas sem Despesas, módulo inexistente recusado);
- erros de entrada (corpo ausente, JSON malformado, enum inválido, sem token);
- isolamento entre contas (ler, editar e excluir dados de outra pessoa; usar categoria ou conta alheia);
- regras de transação, pagamento, contas financeiras, categoria, perfil e paginação;
- painel administrativo (403 para a conta pessoal, visão geral do mês com mês anterior e mês sem dados, resumo de segurança,
  último acesso, busca e cadastro de usuários e administradores, troca de perfil com token antigo invalidado, desativar cortando o
  acesso na hora, proteção do próprio usuário, exclusão só sem histórico, transações de todos com filtros e auditoria,
  categorias padrão e ranking, auditoria com filtros de autor, ação e período e sem rota para alterar ou apagar);
- suporte ao usuário pelo admin (filtro de bloqueados e desbloqueio, encerrar as sessões de alguém, senha provisória
  com troca obrigatória e sem a senha na auditoria, ficha sem valores, contas que pararam de usar e que nunca lançaram);
- o que o admin **não pode**: alterar ou apagar lançamentos, categorias e contas de um usuário, e nenhuma resposta
  da API traz senha ou hash de senha.

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
