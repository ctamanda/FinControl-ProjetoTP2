---
name: quarkus-backend
description: Diretrizes consolidadas para implementação e revisão de funcionalidades backend em Java 25 com Quarkus 3.38+, cobrindo a arquitetura em camadas (Resource -> Service -> Repository), DTOs, Bean Validation e regras de negócio.
---

# Governança de Backend — Quarkus (FinControl)

Esta skill define os padrões arquiteturais, diretrizes de implementação e restrições técnicas para o desenvolvimento da camada de backend no monorepo do **FinControl** utilizando Java 25 e Quarkus 3.38+.

---

## 1. Objetivo da Skill

Orientar a criação, refatoração e revisão de endpoints HTTP REST, controladores (`Resource`), serviços de domínio (`Service`), repositórios (`Repository`), objetos de transferência de dados (`DTO`), mappers, validações e controle de transações.

---

## 2. Quando Usar

Utilize esta skill sempre que for necessário:
- Criar ou alterar endpoints HTTP e contratos de API REST.
- Implementar novas regras de negócio, fluxos de validação de domínio ou cálculos financeiros.
- Criar DTOs de entrada (`Request`) ou saída (`Response`), bem como seus respectivos mappers.
- Definir permissões de acesso por perfil (`@RolesAllowed`) ou por funcionalidade (`@RequerModulo`).
- Coordenar transações de banco de dados (`@Transactional`) e orquestrar chamadas de auditoria.

---

## 3. Diretrizes de Execução

### 3.1. Arquitetura Estritamente em Camadas
O backend do FinControl obedece rigorosamente ao fluxo unidirecional:
$$\text{Resource} \longrightarrow \text{Service} \longrightarrow \text{Repository} \longrightarrow \text{Entity}$$

1. **Camada Resource (`resource/`):**
   - Responsabilidade exclusiva de recepção HTTP, validação de payload via Bean Validation (`@Valid`, anotações Jakarta), segurança de rota (`@RolesAllowed`, `@RequerModulo`) e serialização de DTOs.
   - Extrai a identidade do usuário autenticado exclusivamente através do token JWT injetado (`JsonWebToken jwt`), repassando o objeto ou identificador do usuário para a camada de serviço.
   - Retornos paginados devem utilizar a estrutura padronizada `PageResponse<T>`.

2. **Camada Service (`service/`):**
   - Centraliza todas as regras de negócio, validações de integridade, cálculos e orquestração de transações (`@Transactional`).
   - Implementa a interface correspondente (ex.: `TransacaoService` e `TransacaoServiceImpl`).
   - Responsável por disparar registros de auditoria administrativa (`AuditoriaService`) em ações de alto impacto.
   - Lança exceções especializadas mapeadas pela RFC 7807 (ex.: `ValidationException`, `ResourceNotFoundException`).

3. **Camada Repository (`repository/`):**
   - Implementada com Panache estendendo `PanacheRepositoryBase<T, Long>`.
   - Centraliza todas as instruções de persistência, consultas HQL/SQL e ordenações com `PanacheQuery`.
   - Implementa métodos de busca vinculados obrigatoriamente ao dono (`findByDonoAndId`, `findByDono`).

### 3.2. Contratos REST e DTOs
- Toda entrada de dados deve ser representada por um Java Record com Bean Validation (`@NotBlank`, `@NotNull`, `@Length`, `@Pattern`, `@Positive`, `@Digits`, etc.).
- Toda saída deve ser mapeada via classes Mapper especializadas (ex.: `TransacaoResponseMapper`, `UsuarioResponseMapper`), garantindo desacoplamento do modelo JPA.

### 3.3. Isolamento Multi-usuário
- Todas as operações de consulta, criação, atualização e exclusão devem ser filtradas pelo `usuario_id` obtido do JWT autenticado.
- Acesso a ID inexistente ou pertencente a outro usuário deve responder com **404 Not Found** (nunca 403 Forbidden).

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibido retornar entidades JPA diretamente na API:** Toda resposta HTTP deve retornar DTOs (`Record`). Jamais exponha classes anotadas com `@Entity` diretamente nos Resources.
> 2. **Proibido inserir regras de negócio no Resource:** Resources devem apenas validar formato, delegar a execução ao Service e formatar a resposta. Toda a lógica de negócio pertence exclusivamente ao Service.
> 3. **Consulta prévia obrigatória:** É obrigatório inspecionar [`docs/REGRAS_NEGOCIO.md`](file:///docs/REGRAS_NEGOCIO.md) e [`docs/CONTEXTO_PROJETO.md`](file:///docs/CONTEXTO_PROJETO.md) antes de propor novos endpoints ou alterar lógicas existentes.
> 4. **Proibição de inventar contratos:** Não crie parâmetros, rotas ou campos que não tenham sido aprovados pelo desenvolvedor ou documentados.
