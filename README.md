<p align="center">
  <img src="frontend/public/logo/fincontrol-simbolo-fundo-claro.svg" alt="FinControl" width="110" />
</p>

<h1 align="center">FinControl</h1>

<p align="center">
  Sistema de controle de <b>finanças pessoais</b>.<br />
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
- [Funcionalidades](#funcionalidades)
- [Perfis e permissões](#perfis-e-permissões)
- [Regras de negócio](#regras-de-negócio)
- [Arquitetura](#arquitetura)
- [Modelo de dados](#modelo-de-dados)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Tecnologias](#tecnologias)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Dados de demonstração](#dados-de-demonstração)
- [Explorando a API (Swagger)](#explorando-a-api-swagger)
- [Usando a API pelo terminal](#usando-a-api-pelo-terminal)
- [Usuários para teste](#usuários-para-teste)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Publicação](#publicação)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Próximas fases](#próximas-fases)
- [Problemas comuns](#problemas-comuns)

---

## Sobre o projeto

O FinControl organiza o dinheiro do dia a dia de **uma pessoa**: **receitas, despesas, contas a pagar e a receber,
contas financeiras e categorias**, mostrando em linguagem simples **quanto entrou, quanto saiu e quanto sobrou** em
cada mês. Cada pessoa cria a própria conta, e os dados dela são privados. Uma equipe interna (o **administrador do
FinControl**) cuida da plataforma: usuários, categorias padrão, segurança e auditoria.

O controle é **manual**: a pessoa informa os saldos e registra os lançamentos. Não há integração com bancos, leitura de
extratos nem contabilidade formal. Contas de empresa (MEI/microempresa) saíram do escopo (migrations V17 e V18; os dados
antigos viraram contas pessoais).

**Objetivos**

1. Mostrar o resultado de cada mês de forma clara.
2. Não deixar conta vencer: contas a pagar e a receber em destaque.
3. Dar ao administrador uma **visão real do uso da plataforma**, sem expor o dinheiro de ninguém, com histórico de quem fez o quê.
4. Funcionar bem no **celular**.

## Funcionalidades

### Conta pessoal

| Área | O que faz |
|---|---|
| **Cadastro** | Três etapas: cadastro (nome, e-mail, senha) → perfil (telefone, profissão) → configuração (funcionalidades). A conta nasce com as categorias padrão e a conta "Carteira" |
| **Login e sessão** | E-mail e senha, sessão de 1 hora. 5 senhas erradas seguidas bloqueiam a conta por 15 minutos |
| **Dashboard** | Saldo no início do mês, atual e previsto; entrou, saiu e sobrou; ranking de gastos por categoria; próximas contas; seletor de mês |
| **Lançamentos** | Receitas e despesas com valor, data, categoria, conta, descrição e situação (pago ou pendente). Filtros: todos, a pagar, a receber, pagos, atrasados, por conta e por texto |
| **Contas a pagar e a receber** | Agrupadas em Atrasadas, Próximos 7 dias e Mais adiante, com totais. "Pagar" pede a data e a conta; "Desfazer" volta para pendente |
| **Contas financeiras** | Conta corrente, poupança, carteira, investimento ou outra, com saldo inicial e cor. Saldo calculado pelos lançamentos pagos |
| **Categorias** | As da conta, com cor e ícone. Categoria com lançamentos não pode ser excluída nem trocar de tipo |
| **Funcionalidades** | A pessoa liga e desliga os módulos que quer usar (os que ainda não têm tela aparecem como "em breve") |
| **Meu perfil e segurança** | Alterar dados, senha e e-mail pede a senha atual. "Sair de todos os dispositivos" encerra as outras sessões |

### Painel do administrador (`SUPER_ADMIN`)

O administrador **cuida da plataforma, não do dinheiro dos usuários**: vê números somados de todos e as quantidades de
cada conta, e tudo o que faz fica na auditoria. Todas as regras são checadas no servidor.

| Tela | O que faz |
|---|---|
| **Visão geral** | Seletor de mês no topo; todos os números acompanham. Usuários ativos no mês, novos cadastros, lançamentos e volume registrado, cada um com a variação contra o mês anterior. Gráfico de novos cadastros (6 meses). **Base de usuários**: total, quem **parou de usar** (30+ dias sem entrar) e quem **cadastrou e nunca lançou**, cada número abrindo a lista filtrada. Uso dos módulos (ligado e já com dados). **Segurança**: contas bloqueadas hoje, senhas trocadas, sessões encerradas e e-mails trocados nos últimos 7 dias. Categorias padrão mais usadas. Últimas ações da auditoria |
| **Usuários** | Busca por nome ou e-mail, abas Todos / Ativos / Inativos / Bloqueados / Administradores, paginação e último acesso. Criar conta pessoal ou outro administrador, editar, ativar/desativar (corta o acesso na hora, inclusive em sessões abertas) e excluir só quem não tem histórico |
| **Ficha do usuário** | Nome, e-mail, telefone, cadastro, último acesso, situação e **quantidades** de lançamentos, contas e categorias, **sem valores nem descrições**. Ações de suporte: **desbloquear** a conta, **encerrar todas as sessões** e **gerar senha provisória** (mostrada uma única vez; a pessoa é obrigada a trocá-la no próximo login) |
| **Transações** | Consulta dos lançamentos dos usuários, só leitura, para suporte. Cada consulta fica registrada na auditoria |
| **Categorias padrão** | Criar, editar, ativar e desativar, com tipo, cor e ícone; ranking de uso. As ativas são copiadas para cada conta nova |
| **Auditoria** | Toda ação administrativa e de segurança, com filtros por autor, ação, período e texto, paginada. **Ninguém altera nem apaga** os registros |

Nenhum número do painel é estimado: tudo sai de consultas agregadas sobre cadastros, lançamentos e auditoria.

## Perfis e permissões

| Perfil | Quem é | Como é criado |
|---|---|---|
| **Visitante** | Quem ainda não entrou | Vê a página de apresentação e cria conta |
| **PESSOAL** | Dono de uma conta de finanças pessoais | Cadastro público ou pelo administrador |
| **SUPER_ADMIN** | Equipe que administra o FinControl | Só por outro administrador (o primeiro vem da instalação) |

| Ação | Super Admin | Pessoal |
|---|---|---|
| Visão geral do sistema, usuários, categorias padrão e auditoria | ✔ | — |
| Criar administrador ou conta pessoal; desbloquear, encerrar sessões, gerar senha provisória | ✔ | — |
| Ver lançamentos dos usuários | Só leitura, auditada | — |
| Criar, editar ou excluir lançamentos, contas ou categorias **de outra pessoa** | — | — |
| Lançamentos, contas a pagar/receber, contas financeiras e categorias **próprias** | Lançamentos e categorias próprios | ✔ |
| Ligar e desligar módulos da própria conta | — | ✔ |
| Editar os próprios dados, senha e e-mail (com a senha atual) | ✔ | ✔ |

**Princípios de acesso**

1. **Toda permissão é checada no servidor**, em cada requisição. Esconder botões é só conforto visual.
2. **Isolamento por dono:** os dados financeiros pertencem sempre ao usuário. O id de outra pessoa responde **404**, como se não existisse.
3. Desativar um usuário **corta o acesso na hora**, inclusive nas sessões abertas.
4. Sempre existe **pelo menos um administrador ativo**; ninguém altera o próprio perfil nem se desativa ou exclui.

## Regras de negócio

**Saldo**
- Saldo atual da conta = saldo inicial + receitas **pagas** − despesas **pagas**.
- Lançamento pendente não mexe no saldo; entra só no **previsto** (saldo atual + pendentes até o fim do mês, inclusive atrasados).
- Valores com 2 casas decimais, em decimal exato.

**Situação de um lançamento**
- **Pago:** tem data de pagamento (nunca futura). **Pendente:** a data é o vencimento. **Atrasado:** pendente vencido (calculado).
- Sem situação informada: data até hoje → pago; data futura → pendente.
- Despesa só usa categoria de despesa, e receita só categoria de receita.

**Contas e categorias**
- Conta com lançamentos só é arquivada (não excluída), e sempre sobra uma conta ativa.
- Categoria com lançamentos não pode ser excluída nem trocar de tipo; nomes repetidos são recusados (ignorando espaços e maiúsculas).

**Usuários e administração**
- Desativar ≠ excluir: o histórico continua. Excluir só é possível para quem não tem lançamentos nem ações na auditoria.
- O perfil alterna entre `PESSOAL` e `SUPER_ADMIN`; o token emitido com o perfil antigo deixa de valer. Administrador que vira conta pessoal ganha as categorias padrão e a Carteira.
- Trocar senha ou e-mail, encerrar sessões ou receber senha provisória invalida os tokens já emitidos.
- Com **senha provisória**, a pessoa só consegue ver o próprio perfil e trocar a senha; as outras rotas respondem 403 até a troca.

**Indicadores do painel**
- "Usuários ativos no mês" = contas pessoais com pelo menos um lançamento com data no mês; "volume" = receitas + despesas do mês.
- "Pararam de usar" = contas pessoais ativas com último login registrado há 30 dias ou mais. Quem ainda não tem login gravado fica de fora (o sistema não chuta).
- "Uso do módulo" tem como base as contas pessoais ativas; "com dados" = quem já lançou, criou conta além da Carteira ou categoria própria.

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
3. Em toda requisição o backend valida o token e confere se o usuário está ativo, se a sessão ainda vale, se não há
   senha provisória pendente e se ele tem acesso à funcionalidade. Só então devolve os dados dele.

O backend segue camadas: `resource` (REST) → `service` (regras) → `repository` (Panache) → `model` (entidades JPA),
com `dto`/`mapper` nas bordas, `security` (filtro de acesso, tokens, senhas) e `exception` (erros RFC 7807).
Os diagramas (casos de uso, classes, componentes, camadas e fluxo JWT) ficam em [`docs/`](docs/).

## Modelo de dados

```
usuario 1 ──< usuario_modulo     (módulos escolhidos)
usuario 1 ──< categoria          (tipo, cor, ícone)
usuario 1 ──< conta_financeira   (tipo, saldo inicial, cor, ativa)
usuario 1 ──< transacao          (valor, data/vencimento, tipo, pago, data_pagamento)
categoria 1 ──< transacao
conta_financeira 1 ──< transacao
categoria_padrao                 (modelo copiado para cada conta nova)
auditoria                        (autor, ação, alvo, detalhe, data/hora; imutável)
```

O usuário guarda também os campos de segurança: tentativas de login, bloqueio, versão da sessão, último acesso e
senha provisória pendente. A senha é sempre um hash BCrypt.

**Migrations (Flyway)** — nunca editadas depois de publicadas; toda mudança vira uma nova versão.

| Versão | O que faz |
|---|---|
| V4–V9 | Tabelas iniciais: transação, categoria e usuário, dono de cada registro e campos do cadastro |
| V10 | Usuário administrador inicial |
| V11 | E-mail único sem diferenciar maiúsculas |
| V12 | Perfis e módulos escolhidos pela conta; telefone e profissão |
| V13 | Painel administrativo: `categoria_padrao` e `auditoria` |
| V14 | Remove o WhatsApp do cadastro |
| V15 | Segurança da conta: tentativas de login, bloqueio e versão da sessão |
| V16 | Contas financeiras, pago/pendente, data de pagamento e ícones nas categorias |
| V17 | Remove os parâmetros fiscais (MEI/ME) |
| V18 | Remove empresa: perfis de empresa viram PESSOAL, os dados de cada empresa passam para o responsável, nenhum lançamento é apagado |
| V19 | Último acesso do usuário |
| V20 | Senha provisória (troca obrigatória no próximo login) |

Detalhes de cada versão no [README do backend](backend/README.md#migrations).

## Estrutura do repositório

```
FinControl-ProjetoTP2/
├── backend/                 # API REST (Java 25 + Quarkus)
│   ├── src/main/java/...    # resource, service, repository, model, dto, mapper, security, validation, exception, dev
│   ├── src/main/resources/  # application.properties, migrations Flyway, chave PÚBLICA JWT
│   ├── src/test/java/...    # testes de ponta a ponta (62 testes)
│   ├── docker-compose.yml   # PostgreSQL para desenvolvimento
│   ├── Dockerfile
│   └── README.md            # documentação completa da API
├── frontend/                # Interface web (Angular 22)
│   ├── src/app/...          # telas (finanças pessoais e painel do administrador), serviços, autenticação
│   ├── public/              # favicon e logo
│   └── README.md            # documentação do frontend
├── docs/                    # diagramas e requisitos
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

## Dados de demonstração

No modo dev (`quarkus:dev`) o backend carrega uma massa de exemplo para o painel do administrador ter números reais.
Ela **não existe** no build de produção nem nos testes, e usa só pessoas fictícias (`@fincontrol.demo`).

- **16 contas pessoais** cadastradas ao longo dos últimos 6 meses: 2 desativadas, 1 que parou de usar e 2 que nunca lançaram;
- contas financeiras, categorias próprias e lançamentos de todos os meses (alguns a pagar e atrasados);
- eventos de auditoria: senhas trocadas, contas bloqueadas, sessões encerradas, e-mail alterado, ações do admin.

| Comando (na pasta `backend`) | O que faz |
|---|---|
| `./mvnw quarkus:dev` | Carrega se ainda não existir |
| `./mvnw quarkus:dev -Dfincontrol.demo=recarregar` | Zera e carrega de novo, com as datas de hoje |
| `./mvnw quarkus:dev -Dfincontrol.demo=zerar` | Apaga só as contas de demonstração e o que é delas |
| `./mvnw quarkus:dev -Dfincontrol.demo=nada` | Sobe sem tocar nos dados de demonstração |

No Windows, use `.\mvnw.cmd` e coloque o `-D...` entre aspas no PowerShell. Detalhes no [README do backend](backend/README.md#dados-de-demonstração-só-no-perfil-dev).

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
5. Agora as rotas protegidas funcionam: experimente **`GET /usuarios/me`** ou, como admin, **`GET /admin/painel`**.

> O cadeado ao lado de cada rota indica que ela exige login. O perfil necessário (`PESSOAL` ou `SUPER_ADMIN`) aparece na própria rota.
> O Swagger UI fica disponível no modo de desenvolvimento (`quarkus:dev`).

## Usando a API pelo terminal

```bash
# 1. Criar uma conta
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","nome":"Maria","telefone":"63999990000","profissao":"Professora","password":"Senha@123","confirmPassword":"Senha@123"}'

# 2. Entrar e guardar o token
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"Senha@123"}' | sed -E 's/.*"token":"([^"]+)".*/\1/')

# 3. Ver as categorias criadas automaticamente
curl http://localhost:8080/categorias -H "Authorization: Bearer $TOKEN"

# 4. Lançar uma despesa (use o id de uma categoria de DESPESA da lista acima)
curl -X POST http://localhost:8080/transacoes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"descricao":"Mercado","valor":152.37,"data":"2026-10-10","tipo":"DESPESA","idCategoria":1}'
```

## Usuários para teste

| Perfil | E-mail | Senha | Origem |
|---|---|---|---|
| **SUPER_ADMIN** | `admin@fincontrol.com` | `admin123` | Criado pela migration `V10` (perfil atualizado na `V12`) |
| **PESSOAL** | `ana.souza@fincontrol.demo` (e outras 15) | `Demo@123` | Dados de demonstração do modo dev |
| **PESSOAL** | — | — | Crie em **Criar conta** ou por `POST /auth/register` |

> Toda conta pessoal começa com as **categorias padrão** ativas (de início: Alimentação, Moradia, Transporte, Lazer, Salário e Vendas) e com a conta "Carteira".
> Senhas novas precisam de 6+ caracteres, com maiúscula, minúscula, número e caractere especial.
> A senha do admin e as de demonstração são públicas. **Troque-as em qualquer uso fora do ambiente acadêmico.**

## Endpoints

Resumo; detalhes, exemplos de JSON e códigos de resposta estão no [README do backend](backend/README.md#endpoints).

| Recurso | Rotas | Acesso |
|---|---|---|
| Autenticação | `POST /auth/register` · `POST /auth/login` | Público |
| Perfil | `GET/PUT /usuarios/me` · `PUT /usuarios/me/modulos` · `/senha` · `/email` · `POST /usuarios/me/encerrar-sessoes` | Usuário logado |
| Transações | `GET/POST /transacoes` · `GET/PUT/DELETE /transacoes/{id}` · `PATCH .../pagar` · `.../reabrir` (paginação e filtros) | Conforme as funcionalidades escolhidas |
| Contas | `GET/POST /contas` · `GET/PUT/DELETE /contas/{id}` · `PATCH .../arquivar` · `.../reativar` | Conta pessoal |
| Categorias | `GET/POST /categorias` · `GET/PUT/DELETE /categorias/{id}` | Conforme as funcionalidades escolhidas |
| Painel do administrador | `/admin/painel` · `/admin/estatisticas` · `/admin/transacoes` · `/admin/categorias-padrao` · `/admin/categorias/ranking` · `/admin/auditoria` | SUPER_ADMIN |
| Usuários (admin) | `/admin/usuarios` (busca e situação) · `/{id}/ficha` · `/{id}/ativar` · `/desativar` · `/desbloquear` · `/encerrar-sessoes` · `/senha-provisoria` | SUPER_ADMIN |

Os erros seguem o padrão **RFC 7807** (`application/problem+json`), com a lista de campos inválidos quando for o caso.

## Testes

```bash
# Backend: 62 testes de ponta a ponta (H2 em memória, sem Docker)
cd backend
./mvnw test          # Linux/Mac
.\mvnw.cmd test      # Windows

# Frontend
cd frontend
npm test
```

Os testes do backend cobrem:
- cadastro e login (regras de senha, telefone, profissão, categorias e conta iniciais);
- segurança da conta (senha atual para alterar dados, tokens antigos invalidados, bloqueio por senhas erradas);
- validações e erros de entrada;
- **isolamento entre contas** (ninguém lê, edita ou usa dados de outra pessoa);
- regras de transações, pagamentos, contas financeiras e categorias;
- painel do administrador (visão geral do mês, usuários, desativação imediata, transações auditadas,
  categorias padrão, auditoria com filtros e sem rota para alterar), o suporte ao usuário (desbloqueio, encerrar sessões,
  senha provisória, ficha sem valores, quem parou de usar e quem nunca lançou) e o que o admin não pode fazer
  (alterar dados dos usuários, receber senha ou hash).

## Publicação

**Frontend:** publicado automaticamente em **https://ctamanda.github.io/FinControl-ProjetoTP2/** a cada push na `main`
que altere a pasta `frontend/` (workflow em `.github/workflows/deploy-pages.yml`).

- **Configuração (uma vez):** Settings → Pages → Source: **Deploy from a branch** → branch **`gh-pages`**, pasta **/ (root)**.
- O endereço da API fica em `frontend/src/app/core/api.ts` (hoje `http://localhost:8080`). Com o backend publicado, troque pela URL dele.

**Backend:** o `Dockerfile` gera a imagem da API. Em produção, informe pelas variáveis de ambiente o banco
(`DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`) e as chaves JWT (`JWT_PRIVATE_KEY_LOCATION`, `JWT_PUBLIC_KEY_LOCATION`).
Ao subir, o Flyway aplica sozinho as migrations pendentes: **faça backup do banco antes**. O CORS já aceita o endereço do GitHub Pages.

## Segurança e privacidade

- **Senhas** guardadas com BCrypt; nenhuma resposta da API traz senha ou hash.
- **Login** por token JWT assinado com RSA, válido por 1 hora.
- **A chave privada JWT não vai para o repositório.** Cada pessoa gera a sua (passo 3), e o `.gitignore` bloqueia `.pem`, `.key` e `.env`. Só a chave **pública** é versionada. Arquivos de IA, prompts, referências de design e configurações de editor também ficam fora do Git.
- **Isolamento de dados:** toda consulta é filtrada pelo dono, e um id de outra conta responde 404.
- **Checagem em toda requisição:** usuário ativo, sessão válida, senha provisória já trocada e funcionalidade liberada.
- **Bloqueio** por 5 senhas erradas seguidas (15 minutos); o administrador pode desbloquear.
- **Auditoria imutável** de ações administrativas e eventos de segurança. A senha provisória nunca é registrada, só o fato de ter sido gerada.
- **LGPD:** só os dados necessários (nome, e-mail, telefone, profissão); dados de uma conta nunca visíveis para outra; a ficha do administrador mostra só quantidades, e a consulta de lançamentos para suporte é só leitura e auditada.
- As senhas que aparecem no projeto (`123456` do banco local, `admin123` e `Demo@123`) são **apenas de desenvolvimento**. Em produção, use as variáveis de ambiente descritas no [README do backend](backend/README.md#variáveis-de-ambiente).

## Próximas fases

| Fase | Conteúdo | Situação |
|---|---|---|
| MVP | Cadastro, login, perfis e módulos, lançamentos, categorias, dashboard, segurança da conta | ✅ |
| 1 | Contas financeiras, pago/pendente, contas a pagar e a receber, ícones, visual estilo iOS | ✅ |
| 1ª apresentação | Saída de empresa/MEI; painel do administrador completo com dados reais e suporte ao usuário | ✅ |
| 2 | Cartão de crédito com faturas | ⬜ |
| 3 | Lançamentos recorrentes e parcelados; transferência entre contas | ⬜ |
| 4 | Orçamento mensal por categoria e metas | ⬜ |
| 5 | Lembretes: alertas, sino, notificação do navegador, Google Agenda | ⬜ |
| 6 | Relatórios PDF/Excel, exportação dos dados, tema escuro, termos de uso e privacidade | ⬜ |

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| `autenticação do tipo senha falhou para o usuário "fincontrol"` | Já existe um PostgreSQL instalado ocupando a porta 5432 | Suba o banco em outra porta: `DB_PORT=5433 docker compose up -d` (PowerShell: `$env:DB_PORT="5433"; docker compose up -d`) e inicie o backend com `DATABASE_URL=jdbc:postgresql://localhost:5433/fincontroldb` |
| `release version 25 not supported` | O `JAVA_HOME` aponta para um Java mais antigo | Aponte o `JAVA_HOME` para o JDK 25 |
| Login responde erro 500 | Chaves JWT não encontradas | Refaça o passo 3 e reabra o terminal |
| `Port 8080 seems to be in use` | Outro backend já está rodando | Feche o processo anterior |
| Site do Pages abre, mas o login falha | O site chama a API em `localhost:8080` e o backend não está rodando na sua máquina | Inicie o backend (passo 4) ou aponte o `api.ts` para o backend publicado |
| Login leva para "Crie a sua senha" | O administrador gerou uma senha provisória | Informe a senha provisória e crie a sua |

---

<p align="center">
  FinControl · Projeto acadêmico da disciplina de Tópicos II
</p>
