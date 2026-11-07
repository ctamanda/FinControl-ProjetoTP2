# Governança e Diretrizes de Desenvolvimento — FinControl (Monorepo)

Bem-vindo ao repositório do **FinControl**. Este arquivo define as diretrizes de governança, restrições arquiteturais e protocolos operacionais para desenvolvedores humanos e agentes de Inteligência Artificial que atuam neste monorepo.

---

## 1. Instrução de Leitura Prévia Obrigatória

Antes de qualquer proposta de código, refatoração, criação de testes ou alteração de arquitetura, o agente de IA **DEVE obrigatoriamente** inspecionar os arquivos da pasta `docs/` nesta ordem:

1. **[`docs/CONTEXTO_PROJETO.md`](file:///docs/CONTEXTO_PROJETO.md):** Visão geral do produto, stack tecnológica (Java 25, Quarkus 3.38, Angular 22, PostgreSQL 16), decisões arquiteturais, estado das funcionalidades e pendências de escopo.
2. **[`docs/REGRAS_NEGOCIO.md`](file:///docs/REGRAS_NEGOCIO.md):** Regras de cálculo de saldo, ciclo de vida de transações (paga, pendente, atrasada), integridade referencial, bloqueios de exclusão, validações de senha/telefone e matriz de segurança (`PESSOAL` vs `SUPER_ADMIN`).
3. **[`docs/modelo-plantuml.puml`](file:///docs/modelo-plantuml.puml):** Diagrama de classes UML do domínio, herança da superclasse `DefaultEntity`, cardinalidades e atributos tipados.

---

## 2. Restrições Críticas de Segurança (Inegociáveis)

> [!CAUTION]
> **A IA está terminantemente proibida de:**
> - Alterar regras de negócio, comportamentos de entidades JPA, migrações SQL do Flyway ou contratos de endpoints REST sem aprovação prévia e explícita do desenvolvedor humano.
> - Inventar endpoints, entidades, parâmetros, campos de formulário ou regras de validação que não existam no código ou na documentação aprovada.
> - Burlar ou flexibilizar o isolamento de dados por usuário. O isolamento baseado em `usuario_id` extraído do token JWT autenticado é inegociável.
> - Confiar em identificadores de inquilino ou usuário enviados no corpo da requisição ou parâmetros de rota sem validação contra o JWT.

Qualquer alteração estrutural solicitada e aprovada pelo desenvolvedor deve ser obrigatoriamente registrada no **Histórico de Mudanças Aprovadas** no final deste documento.

---

## 3. Governança de Skills Externas

O desenvolvimento do FinControl é orientado por skills especializadas. Os agentes de IA devem consultar as diretrizes da respectiva skill conforme a camada ou escopo da tarefa, **sem transcrever o conteúdo dessas skills para os arquivos do repositório**:

### Backend
- **`quarkus-backend`:** Implementação e revisão de Resources, Services, Repositories, DTOs, transações e validações.
- **`persistencia-postgresql`:** Mapeamento JPA, Hibernate Panache, migrations Flyway, integridade referencial, índices e isolamento de banco.
- **`testes-backend`:** Criação e execução real de testes unitários, de integração, autorização, concorrência e REST Assured.
- **`seguranca-oidc`:** Configurações de autenticação, validação de tokens JWT/OIDC, controle de sessão e perfis de segurança.
- **`armazenamento-s3`:** Padrões para integração com buckets S3 compatíveis, expurgo e manipulação segura de anexos.
- **`uml-classes`:** Padronização, modelagem e comparação contínua entre diagramas PlantUML e o código-fonte JPA.

### Frontend
- **`angular-frontend`:** Desenvolvimento de componentes standalone, rotas, guards, formulários reativos, consumo de APIs e injeção de dependência.
- **`ui-frontend`:** Construção visual com Angular Material/CDK, acessibilidade, responsividade e estados visuais completos.
- **`testes-frontend`:** Testes de componentes, serviços, validações de formulário, guards e cobertura com Vitest/Jasmine.
- **`seguranca-frontend-oidc`:** Fluxos de autenticação SPA, Authorization Code com PKCE, guards de rota e interceptação de tokens.

---

## 4. Comandos Operacionais

### 4.1. Banco de Dados (PostgreSQL 16 via Docker)
O banco principal utiliza PostgreSQL 16 gerenciado por compose:
```bash
# Iniciar o banco de dados em segundo plano (porta 5432)
docker compose -f backend/docker-compose.yml up -d

# Visualizar logs do banco
docker compose -f backend/docker-compose.yml logs -f

# Parar o container do banco
docker compose -f backend/docker-compose.yml down
```

### 4.2. Backend (Quarkus 3.38 + Java 25)
A partir da pasta `backend/`:
```bash
# Subir em modo de desenvolvimento com live-reload
./mvnw quarkus:dev
# No Windows (PowerShell):
.\mvnw.cmd quarkus:dev

# Executar todos os testes com relatório
./mvnw test
# No Windows (PowerShell):
.\mvnw.cmd test

# Recarregar base de demonstração (somente perfil dev)
.\mvnw.cmd quarkus:dev -Dfincontrol.demo=recarregar

# Interface Swagger UI / OpenAPI (com backend em execução)
# Acesso em: http://localhost:8080/q/swagger-ui
```

### 4.3. Frontend (Angular 22)
A partir da pasta `frontend/`:
```bash
# Instalar dependências
npm install

# Subir servidor de desenvolvimento (http://localhost:4200)
npm start
# ou:
npx ng serve

# Executar testes unitários
npm test

# Build de produção
npm run build
```

---

## 5. Histórico de Mudanças Aprovadas

Toda decisão de domínio, alteração de contratos ou adição de entidades aprovada pelo desenvolvedor deve ser catalogada abaixo:

| Data | Autor | Resumo da Decisão / Mudança Aprovada | Arquivos Impactados |
|---|---|---|---|
| 07/11/2026 | Documentador / Tech Lead | Consolidação da documentação inicial (`CONTEXTO_PROJETO.md`, `REGRAS_NEGOCIO.md`, `modelo-plantuml.puml`) e governança de agentes. | `docs/*`, `AGENTS.md` |

