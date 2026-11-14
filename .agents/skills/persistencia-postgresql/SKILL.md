---
name: persistencia-postgresql
description: Diretrizes consolidadas para modelagem de entidades JPA, repositórios com Hibernate Panache, migrations versionadas no Flyway e garantia de integridade e isolamento no PostgreSQL 16.
---

# Governança de Persistência — PostgreSQL & Flyway (FinControl)

Esta skill define as diretrizes técnicas, padrões de modelagem relacional e restrições operacionais para a camada de persistência com PostgreSQL 16, Hibernate ORM com Panache e Flyway no **FinControl**.

---

## 1. Objetivo da Skill

Orientar a criação e alteração de entidades JPA, mapeamentos relacionais, consultas customizadas com Panache Repository, integridade referencial, índices de desempenho e controle rigoroso de migrações SQL com Flyway.

---

## 2. Quando Usar

Utilize esta skill sempre que a tarefa envolver:
- Criação ou modificação de entidades JPA (`model/`).
- Criação de novas tabelas, colunas, chaves estrangeiras, restrições ou índices no PostgreSQL.
- Escrita de migrações SQL versionadas no Flyway (`src/main/resources/db/migration/`).
- Implementação de consultas, agregações e paginações com Panache Repository.
- Resolução de problemas de integridade relacional, concorrência ou bloqueios de exclusão.

---

## 3. Diretrizes de Execução

### 3.1. Herança da Superclasse Base (`DefaultEntity`)
- Todas as entidades persistentes de domínio devem herdar de `DefaultEntity`:
  ```java
  @MappedSuperclass
  public class DefaultEntity {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      private LocalDateTime dataCadastro;
      private LocalDateTime dataAlteracao;
      // hooks @PrePersist e @PreUpdate automáticos
  }
  ```
- Atributos devem ser privados, com métodos *getters* e *setters* explícitos.
- Anotações explícitas de coluna: `@Column(name = "...", length = ..., nullable = ...)`.

### 3.2. Controle de Schema via Migrações Flyway
- O esquema de banco é controlado com exclusividade por scripts SQL do Flyway localizados em:
  `backend/src/main/resources/db/migration/V{versao}__{descricao}.sql`
  *(Exemplo: `V4__cria_tabela_cartao.sql`)*.
- O Hibernate opera estritamente em modo de validação:
  ```properties
  quarkus.hibernate-orm.database.generation=validate
  quarkus.flyway.migrate-at-start=true
  ```
- Scripts de migração devem ser idempotentes e testados contra uma instância real de PostgreSQL 16.

### 3.3. Repositórios e Isolamento Multi-usuário com Panache
- Repositórios devem estender `PanacheRepositoryBase<Entidade, Long>`.
- Toda consulta de leitura ou mutação deve conter a cláusula de filtro por dono (`usuario` ou `usuario_id`), evitando acesso indevido entre usuários:
  ```java
  public Entidade findByDonoAndId(Usuario usuario, Long id) {
      return find("usuario = ?1 and id = ?2", usuario, id).firstResult();
  }
  ```
- Para agregações financeiras e saldos, utilize consultas HQL focadas em somas dinâmicas de lançamentos pagos, conforme definido em `docs/REGRAS_NEGOCIO.md`.

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibido alterar migrações antigas:** Migrations que já foram commitadas e executadas **nunca** devem ser alteradas ou excluídas. Quaisquer ajustes ou correções exigem a criação de uma nova migration subsequente.
> 2. **Aprovação prévia do desenvolvedor:** É terminantemente proibido criar novas entidades, alterar colunas existentes ou adicionar migrações sem a aprovação explícita prévia do desenvolvedor humano.
> 3. **Proibição de DDL automático:** O Hibernate **nunca** deve criar ou atualizar o schema automaticamente em ambientes dev ou prod (`update` ou `drop-and-create` são proibidos fora do perfil de teste).
> 4. **Respeito às regras de exclusão:** Entidades com dependências financeiras históricas não podem sofrer deleção física. Contas devem ser arquivadas (`ativa = false`) e usuários com histórico devem ser desativados (`ativo = false`).
