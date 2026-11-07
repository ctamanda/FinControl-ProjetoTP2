# Diretrizes de Backend — FinControl

Este documento estabelece as regras de implementação, arquitetura, persistência e testes aplicáveis exclusivamente ao diretório `backend/`.

---

## 1. Governança de Skills do Backend

Ao atuar no backend, o agente de IA deve consultar e aderir estritamente às diretrizes das seguintes skills especializadas:
- **`quarkus-backend`:** Uso obrigatório na criação ou alteração de recursos HTTP, serviços de negócio, validações e DTOs.
- **`persistencia-postgresql`:** Uso obrigatório em alterações de esquema de banco, entidades JPA, migrações Flyway e repositórios Panache.
- **`testes-backend`:** Uso obrigatório para escrever, revisar e executar testes com validação real de evidências.
- **`seguranca-oidc`:** Uso em configurações de segurança, SmallRye JWT, validações de claims e permissões.
- **`armazenamento-s3`:** Uso em integrações futuras com storage de objetos compatível com S3.
- **`uml-classes`:** Uso para manter o diagrama de classes PlantUML sincronizado com o código JPA.

---

## 2. Arquitetura em Camadas Inegociável

O backend adota o fluxo unidirecional:
$$\text{Resource} \longrightarrow \text{Service} \longrightarrow \text{Repository} \longrightarrow \text{Entity}$$

1. **Camada Resource (`resource/`):**
   - Endpoints JAX-RS / Quarkus REST.
   - Responsável por receber requisições HTTP, aplicar validações via Bean Validation (`@Valid`), verificar autorização via anotações (`@RolesAllowed`, `@RequerModulo`) e retornar respostas padronizadas com DTOs e paginação (`PageResponse`).
   - **REGRA INVIOLÁVEL:** Entidades JPA **nunca** devem ser retornadas diretamente nos endpoints HTTP. O uso de DTOs e Mappers é obrigatório para evitar vazamento de dados sensíveis e exceções de lazy-loading fora de transação.
2. **Camada Service (`service/`):**
   - Centraliza todas as regras de negócio, validações de domínio e transacionalidade (`@Transactional`).
   - É a única camada autorizada a acionar registros de auditoria (`AuditoriaService`) para ações administrativas.
   - Interfaces desacopladas da implementação quando pertinente (ex.: `TransacaoService` e `TransacaoServiceImpl`).
3. **Camada Repository (`repository/`):**
   - Estende `PanacheRepositoryBase<T, ID>`.
   - Responsável exclusiva por consultas HQL/SQL, ordenações, filtros dinâmicos e contagens.
   - Deve encapsular as queries com escopo de dono (`findByDonoAndId`, `findByDono`).
4. **Camada Model / Entity (`model/`):**
   - Entidades JPA devem herdar de `DefaultEntity` para obter `id`, `dataCadastro` e `dataAlteracao`.
   - Atributos com visibilidade privada, encapsulamento por métodos acessores e anotações explícitas de coluna e relacionamento.

---

## 3. Segurança e Isolamento Multi-usuário

- **Resolução do Usuário Autenticado:**
  - O identificador do usuário é extraído exclusivamente a partir do claim `upn` do token JWT injetado (`JsonWebToken jwt`), resolvido via `usuarioService.buscarLogado(jwt.getName())`.
  - É proibido confiar em IDs enviados pelo cliente em headers ou parâmetros para definir o dono do recurso.
- **Tratamento de Violação de Propriedade:**
  - Qualquer tentativa de consultar, atualizar ou deletar um recurso pertencente a outro usuário deve responder com **404 Not Found** (e não 403), impedindo que invasores confirmem a existência de dados alheios por enumeração.
- **Filtro de Segurança Global (`AcessoFilter`):**
  - Checa se o usuário permanece ativo, valida se a versão da sessão coincide com o token (`versaoSessao`), bloqueia requisições comuns para usuários com senha provisória pendente e valida módulos contratados.

---

## 4. Persistência e Migrações (Flyway + PostgreSQL)

- **Controle de Schema Exclusivo via Flyway:**
  - O Hibernate apenas valida o banco (`quarkus.hibernate-orm.database.generation=validate`).
  - Novas tabelas, colunas, chaves estrangeiras ou índices devem ser criados via scripts SQL em `src/main/resources/db/migration/V{versao}__{descricao}.sql`.
  - **Migrations commitadas nunca são alteradas:** Se for necessário corrigir ou ajustar uma migração anterior, crie uma nova migration com a versão subsequente.
- **Integridade Referencial:**
  - Não exclua registros que sirvam de base para histórico financeiro. Aplique a política de arquivamento (`ativa = false`) para contas e desativação (`ativo = false`) para usuários.

---

## 5. Diretrizes de Testes

- **Execução Obrigatória:** É proibido declarar testes como concluídos ou aprovados sem tê-los de fato executado via `./mvnw test` e exibido as saídas reais do terminal.
- **Cobertura Mínima Exigida:** Casos felizes, cenários de erro de validação (400), credenciais inválidas (401), permissão insuficiente (403), isolamento entre usuários (404 em ID alheio) e concorrência.

