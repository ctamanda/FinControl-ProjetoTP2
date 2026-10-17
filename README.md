<p align="center">
  <img src="frontend/public/logo/fincontrol-simbolo-fundo-claro.svg" alt="FinControl" width="110" />
</p>

<h1 align="center">FinControl</h1>

<p align="center">
  Sistema de controle financeiro para <b>pessoas, MEIs e microempresas</b>.<br />
  API REST em <b>Quarkus</b> + interface web em <b>Angular</b>.<br />
  Projeto da disciplina de <b>Tópicos II</b>.
</p>

<p align="center">
  <a href="https://ctamanda.github.io/FinControl-ProjetoTP2/"><b>Ver o site</b></a> ·
  <a href="#explorando-a-api-swagger">Swagger da API</a> ·
  <a href="backend/README.md">Documentação do backend</a> ·
  <a href="frontend/README.md">Documentação do frontend</a>
</p>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Tecnologias](#tecnologias)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Explorando a API (Swagger)](#explorando-a-api-swagger)
- [Usando a API pelo terminal](#usando-a-api-pelo-terminal)
- [Usuários para teste](#usuários-para-teste)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Site no GitHub Pages](#site-no-github-pages)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Problemas comuns](#problemas-comuns)

---

## Sobre o projeto

O FinControl organiza **receitas, despesas e categorias** e mostra para onde vai cada real. Ele separa o que é **pessoal** do que é da **empresa**, pensando em quem é MEI ou tem uma microempresa.

| Perfil | O que faz |
|---|---|
| **Visitante** | Vê a página de apresentação e cria conta ("Para mim" ou "Para minha empresa") |
| **Usuário** | Visão geral do mês, lançamento de receitas e despesas, categorias com cor, perfil fiscal (PF, MEI ou ME) |
| **Administrador** | Painel com estatísticas **agregadas** do sistema e cadastro de **parâmetros fiscais** (ex.: teto de faturamento do MEI) |

**Privacidade (LGPD):** cada usuário só enxerga os próprios dados. Nem o administrador vê transações de outras pessoas; ele vê apenas totais e médias.

## Arquitetura

```
┌──────────────────────┐   HTTP + JSON    ┌────────────────────────┐   JDBC   ┌──────────────┐
│  Frontend (Angular)  │ ───────────────▶ │  Backend (Quarkus)     │ ───────▶ │ PostgreSQL 16│
│  localhost:4200      │  Authorization:  │  API REST              │          │ (Docker)     │
│  ou GitHub Pages     │  Bearer <JWT>    │  localhost:8080        │ ◀─────── │              │
└──────────────────────┘ ◀─────────────── │  Swagger: /q/swagger-ui│  Flyway  └──────────────┘
                                          └────────────────────────┘
```

1. O usuário faz login em `POST /auth/login` e recebe um **token JWT** (válido por 1 hora).
2. O frontend envia esse token em todas as chamadas.
3. O backend valida o token, identifica o usuário pelo e-mail que vem dentro dele e só devolve os dados desse usuário.

## Estrutura do repositório

```
FinControl-ProjetoTP2/
├── backend/                 # API REST (Java 25 + Quarkus)
│   ├── src/main/java/...    # resource, service, repository, model, dto, mapper, exception
│   ├── src/main/resources/  # application.properties, migrations Flyway, chave PÚBLICA JWT
│   ├── src/test/java/...    # testes de ponta a ponta (24 cenários)
│   ├── docker-compose.yml   # PostgreSQL para desenvolvimento
│   ├── Dockerfile
│   └── README.md            # documentação completa da API
├── frontend/                # Interface web (Angular 22)
│   ├── src/app/...          # telas, serviços, autenticação
│   ├── public/              # favicon e logo
│   └── README.md            # documentação do frontend
├── .github/workflows/       # publicação automática do frontend no GitHub Pages
└── README.md                # este arquivo
```

## Tecnologias

| Camada | Tecnologias |
|---|---|
| **Backend** | Java 25, Quarkus 3.38, Hibernate ORM + Panache, Bean Validation, SmallRye JWT, BCrypt, SmallRye OpenAPI (Swagger) |
| **Banco** | PostgreSQL 16 (Docker), Flyway para as migrations, H2 em memória nos testes |
| **Frontend** | Angular 22 (standalone + signals), Angular Material, RxJS |
| **Testes** | JUnit 5 + RestAssured (backend), Vitest (frontend) |
| **Entrega** | GitHub Actions + GitHub Pages (frontend), Dockerfile (backend) |

## Como rodar o projeto

### Pré-requisitos

| Ferramenta | Versão | Para quê |
|---|---|---|
| **JDK** | 25 | Backend |
| **Docker Desktop** | qualquer recente | Banco PostgreSQL |
| **Node.js** | 22 ou superior | Frontend |
| **Git** (com Git Bash no Windows) | — | Clonar e gerar as chaves JWT |

### 1. Clonar

```bash
git clone https://github.com/ctamanda/FinControl-ProjetoTP2.git
cd FinControl-ProjetoTP2
```

### 2. Subir o banco de dados

```bash
cd backend
docker compose up -d
```

Sobe um PostgreSQL 16 na porta **5432**, com banco `fincontroldb`, usuário `fincontrol` e senha `123456` (valores **só para desenvolvimento**).

> Se você já tem um PostgreSQL instalado usando a 5432, veja [Problemas comuns](#problemas-comuns).

### 3. Gerar as chaves JWT (só na primeira vez)

O backend assina os tokens com uma **chave privada**, que **não fica no repositório**. Cada pessoa gera a sua. No **Git Bash** (Windows), Linux ou Mac:

```bash
mkdir -p ~/.fincontrol && cd ~/.fincontrol
openssl genpkey -algorithm RSA -out privateKey.pem -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in privateKey.pem -out publicKey.pem
```

Depois, informe ao backend onde estão as chaves. **Windows (PowerShell)**, trocando `SEU_USUARIO`:

```powershell
setx JWT_PRIVATE_KEY_LOCATION "file:///C:/Users/SEU_USUARIO/.fincontrol/privateKey.pem"
setx JWT_PUBLIC_KEY_LOCATION  "file:///C:/Users/SEU_USUARIO/.fincontrol/publicKey.pem"
```

**Linux ou Mac:**

```bash
export JWT_PRIVATE_KEY_LOCATION="file://$HOME/.fincontrol/privateKey.pem"
export JWT_PUBLIC_KEY_LOCATION="file://$HOME/.fincontrol/publicKey.pem"
```

> No Windows, **feche e abra o terminal (ou o VS Code)** depois do `setx`.

### 4. Iniciar o backend

```bash
cd backend
./mvnw quarkus:dev        # Linux/Mac
.\mvnw.cmd quarkus:dev    # Windows
```

Pronto quando aparecer `Listening on: http://localhost:8080`. Na primeira vez, o Flyway cria as tabelas e o **usuário administrador**.

### 5. Iniciar o frontend

Em **outro terminal**:

```bash
cd frontend
npm install
npm start
```

### 6. Acessar

| O quê | Endereço |
|---|---|
| **Sistema (frontend)** | http://localhost:4200 |
| **API** | http://localhost:8080 |
| **Swagger UI** (documentação interativa) | http://localhost:8080/q/swagger-ui |
| **Especificação OpenAPI** | http://localhost:8080/q/openapi (YAML) · http://localhost:8080/q/openapi?format=json |
| **Dev UI do Quarkus** (só no modo dev) | http://localhost:8080/q/dev-ui |

## Explorando a API (Swagger)

O Swagger UI mostra todos os endpoints, os formatos de entrada e saída, e permite **testar direto pelo navegador**.

1. Com o backend rodando, abra **http://localhost:8080/q/swagger-ui**.
2. Abra **`POST /auth/login`** → **Try it out** → informe:
   ```json
   { "email": "admin@fincontrol.com", "password": "admin123" }
   ```
   → **Execute**.
3. Copie o valor de **`token`** da resposta (sem as aspas).
4. Clique em **Authorize** (cadeado no topo), cole o token e confirme. Não precisa escrever "Bearer".
5. Agora as rotas protegidas funcionam: experimente **`GET /usuarios/me`**, **`GET /categorias`** ou, como admin, **`GET /admin/estatisticas`**.

> O cadeado ao lado de cada rota indica que ela exige login. O perfil necessário (`USER` ou `ADMIN`) aparece na própria rota.
> O Swagger UI fica disponível no modo de desenvolvimento (`quarkus:dev`).

## Usando a API pelo terminal

```bash
# 1. Criar uma conta
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","nome":"Maria","password":"123456","perfilFiscal":"PF"}'

# 2. Entrar e guardar o token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"123456"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

# 3. Ver as categorias criadas automaticamente
curl http://localhost:8080/categorias -H "Authorization: Bearer $TOKEN"

# 4. Lançar uma despesa (use o id de uma categoria de DESPESA da lista acima)
curl -X POST http://localhost:8080/transacoes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"descricao":"Mercado","valor":152.37,"data":"2026-10-10","tipo":"DESPESA","escopo":"PESSOAL","idCategoria":1}'
```

## Usuários para teste

| Perfil | E-mail | Senha | Origem |
|---|---|---|---|
| **ADMIN** | `admin@fincontrol.com` | `admin123` | Criado pela migration `V10` |
| **USER** | — | — | Crie pela tela **Experimente grátis** ou por `POST /auth/register` |

> Toda conta nova já ganha 6 categorias: Alimentação, Moradia, Transporte, Lazer, Salário e Vendas.
> A senha do admin é de demonstração. **Troque-a em qualquer uso fora do ambiente acadêmico.**

## Endpoints

Resumo; detalhes, exemplos de JSON e códigos de resposta estão no [README do backend](backend/README.md#endpoints).

| Recurso | Rotas | Acesso |
|---|---|---|
| Autenticação | `POST /auth/register` · `POST /auth/login` | Público |
| Perfil | `GET /usuarios/me` · `PUT /usuarios/me` | Usuário logado |
| Transações | `GET/POST /transacoes` · `GET/PUT/DELETE /transacoes/{id}` (paginação e busca por descrição) | Usuário logado |
| Categorias | `GET/POST /categorias` · `GET/PUT/DELETE /categorias/{id}` | Usuário logado |
| Estatísticas | `GET /admin/estatisticas` | ADMIN |
| Parâmetros fiscais | `GET/POST /admin/parametros` · `GET/PUT/DELETE /admin/parametros/{id}` | ADMIN |

Os erros seguem o padrão **RFC 7807** (`application/problem+json`), com a lista de campos inválidos quando for o caso.

## Testes

```bash
# Backend: 24 testes de ponta a ponta (H2 em memória, sem Docker)
cd backend
./mvnw test          # Linux/Mac
.\mvnw.cmd test      # Windows

# Frontend
cd frontend
npm test
```

Os testes do backend cobrem:
- cadastro e login;
- validações e erros de entrada;
- **isolamento entre usuários** (ninguém lê, edita ou usa dados de outra pessoa);
- regras de transações, categorias e parâmetros fiscais;
- acesso restrito à área administrativa.

## Site no GitHub Pages

O frontend é publicado automaticamente em **https://ctamanda.github.io/FinControl-ProjetoTP2/** a cada push na `main` que altere a pasta `frontend/` (workflow em `.github/workflows/deploy-pages.yml`).

- **Configuração (uma vez):** Settings → Pages → Source: **Deploy from a branch** → branch **`gh-pages`**, pasta **/ (root)**.
- O site chama a API em `localhost:8080`, então para fazer login **o backend precisa estar rodando no computador de quem acessa**. O Chrome pode pedir permissão para acessar a rede local; clique em **Permitir**.

## Segurança e privacidade

- **Senhas** guardadas com BCrypt.
- **Login** por token JWT assinado com RSA, válido por 1 hora.
- **A chave privada JWT não vai para o repositório.** Cada pessoa gera a sua (passo 3), e o `.gitignore` bloqueia arquivos `.pem`, `.key` e `.env`. Só a chave **pública** é versionada.
- **Isolamento de dados:** toda consulta é filtrada pelo dono, e um id de outra pessoa responde 404.
- **Administrador sem acesso a dados individuais:** só estatísticas agregadas, e não existe listagem de usuários.
- As senhas que aparecem no projeto (`123456` do banco local e `admin123` do admin) são **apenas de desenvolvimento**. Em produção, use as variáveis de ambiente descritas no [README do backend](backend/README.md#variáveis-de-ambiente).

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| `autenticação do tipo senha falhou para o usuário "fincontrol"` | Já existe um PostgreSQL instalado ocupando a porta 5432 | Suba o banco em outra porta: `DB_PORT=5433 docker compose up -d` (PowerShell: `$env:DB_PORT="5433"; docker compose up -d`) e inicie o backend com `DATABASE_URL=jdbc:postgresql://localhost:5433/fincontroldb` |
| `release version 25 not supported` | O `JAVA_HOME` aponta para um Java mais antigo | Aponte o `JAVA_HOME` para o JDK 25 |
| Login responde erro 500 | Chaves JWT não encontradas | Refaça o passo 3 e reabra o terminal |
| `Port 8080 seems to be in use` | Outro backend já está rodando | Feche o processo anterior |
| Site do Pages abre, mas o login falha | Backend não está rodando na sua máquina | Inicie o backend (passo 4) |

---

<p align="center">
  FinControl · Projeto acadêmico da disciplina de Tópicos II
</p>
