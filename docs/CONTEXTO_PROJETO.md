# Contexto do Projeto — FinControl

O **FinControl** é uma aplicação web voltada para o gerenciamento e controle financeiro pessoal, projetada com arquitetura desacoplada (backend RESTful e frontend SPA) e foco em segurança, isolamento estrito de dados entre usuários e experiência administrativa centralizada.

---

## 1. Visão do Projeto

O objetivo principal do FinControl é proporcionar controle sobre as finanças pessoais de pessoas físicas, permitindo o registro, acompanhamento e planejamento de suas movimentações financeiras cotidianas. 

A plataforma permite que o usuário gerencie múltiplas contas financeiras (carteira física, contas bancárias, investimentos), categorize suas despesas e receitas, acompanhe o fluxo de caixa mensal e controle obrigações pendentes (contas a pagar e a receber) com impacto controlado sobre o saldo das contas.

---

## 2. Stack Tecnológica

| Componente | Tecnologia | Versão / Detalhes |
|---|---|---|
| **Linguagem Backend** | Java | **Java 25** (`maven.compiler.release = 25`) |
| **Framework Backend** | Quarkus | **3.38.3** (Quarkus BOM `io.quarkus.platform`) |
| **Persistência / ORM** | Hibernate ORM com Panache | Quarkus Hibernate ORM Panache |
| **Banco de Dados** | PostgreSQL | **PostgreSQL 16** (Driver `quarkus-jdbc-postgresql`) |
| **Migrações de Banco** | Flyway | Quarkus Flyway (`flyway-database-postgresql`) |
| **Segurança & JWT** | SmallRye JWT + Elytron | `quarkus-smallrye-jwt`, `quarkus-smallrye-jwt-build`, BCrypt (`quarkus-elytron-security-common`) |
| **Documentação da API** | SmallRye OpenAPI / Swagger UI | OpenAPI 3.0 disponível via `/q/swagger-ui` |
| **Frontend** | Angular | **Angular 22** (`@angular/core: ^22.1.0`, `@angular/material: ^22.1.4`) |
| **Build Frontend** | Angular CLI / Vite | `@angular/cli: ^22.1.5`, TypeScript 6.0 |

---

## 3. Decisões Arquiteturais

### 3.1. Arquitetura em Camadas (Layered Architecture)
O backend adota o padrão em camadas desacopladas:
- **Resource (`resource/`):** Controladores JAX-RS / Quarkus REST responsáveis por expor os endpoints HTTP, validar entradas via Bean Validation (`@Valid`, anotações Jakarta), aplicar filtros de autorização (`@RolesAllowed`, `@RequerModulo`) e formatar respostas padronizadas com paginação (`PageResponse`).
- **Service (`service/`):** Contém todas as regras de negócio, coordenação de transações (`@Transactional`), validações de integridade e orquestração de registros de auditoria. Segue o padrão de interfaces com implementação desacoplada (ex.: `TransacaoService` e `TransacaoServiceImpl`).
- **Repository (`repository/`):** Camada de persistência estendendo `PanacheRepositoryBase<T, ID>`, responsável pelas consultas SQL/HQL customizadas, projeções e controle de paginação via `PanacheQuery`.
- **DTOs & Mappers (`dto/`, `mapper/`):** Desacoplamento completo entre as entidades JPA e o contrato de entrada/saída da API REST, evitando exposição de dados sensíveis e problemas de lazy-loading fora do contexto transacional.

### 3.2. Isolamento de Dados por Usuário (`usuario_id` via JWT)
Para garantir isolamento rigoroso entre contas de usuários (prevenção contra IDOR — *Insecure Direct Object References*):
- O token JWT emitido após a autenticação carrega o e-mail do usuário no claim padrão (`upn`).
- Em todos os endpoints protegidos, o `Resource` obtém a identidade do usuário autenticado a partir do token injetado (`JsonWebToken`) e repassa o objeto ou ID do usuário para a camada de `Service`.
- Todas as operações de leitura, inclusão, alteração e exclusão filtram obrigatoriamente pelo `usuario_id`, garantindo que um usuário nunca acesse ou manipule transações, contas ou categorias de outro titular.

### 3.3. Segurança Baseada em Perfis e Sessão Dinâmica
A segurança e autorização da aplicação operam em múltiplos níveis:
- **Perfis (`Role`):**
  - `SUPER_ADMIN`: Administradores internos da plataforma. Possuem acesso exclusivo ao `/admin/**`, permitindo gerenciar usuários, monitorar estatísticas agregadas, auditar ações e configurar categorias padrão globais.
  - `PESSOAL`: Usuários titulares de contas de finanças pessoais, com acesso restrito aos seus próprios lançamentos, contas e relatórios.
- **Filtro de Acesso Global (`AcessoFilter`):**
  - Executado em todas as requisições autenticadas.
  - Valida se o usuário permanece ativo no banco (usuários desativados perdem acesso imediatamente).
  - Controle de revogação de sessão via claim `sv` (*versão da sessão*): qualquer alteração de credenciais (troca de senha/e-mail) ou encerramento manual de sessões invalida tokens antigos instantaneamente.
  - Suporte a senha provisória: usuários com senha provisória só conseguem acessar endpoints liberados por `@PermiteSenhaProvisoria` até realizarem a troca de credencial.
  - Validação de módulos ativados via anotação `@RequerModulo`.

---

## 4. Estado Atual do Sistema (Implementado)

- **Módulo de Segurança e Autenticação:**
  - Login e autenticação com JWT assimétrico e expiração configurada (1 hora).
  - Criptografia de senhas com algoritmo BCrypt via Elytron.
  - Controle de troca de senha provisória e invalidação de sessão ativa.
- **Gestão de Usuários:**
  - Cadastro público de usuários pessoais.
  - Edição de perfil do usuário logado (nome, profissão, telefone, senha).
  - Gestão administrativa pelo Super Admin: listagem paginada com filtros, visualização detalhada (ficha do usuário), ativação/desativação, redefinição de perfil e emissão de senha provisória.
- **Painel do Administrador & Estatísticas:**
  - Dashboard gerencial do Super Admin com métricas globais consolidadas (total de usuários, transações, valores movimentados e ranking de categorias mais utilizadas).
  - Manutenção de categorias padrão do sistema (`CategoriaPadrao`) disponíveis para importação por novos usuários.
- **Módulo de Auditoria (`RegistroAuditoria`):**
  - Registro imutável de ações administrativas críticas executadas por administradores (bloqueios, redefinições de senha, alterações de perfis).
  - Armazenamento desacoplado de chaves estrangeiras (`autor_id` e `autor_email`) para preservar o histórico mesmo em caso de exclusão futura da conta.
- **Transações Financeiras (Pagas e Pendentes) & Contas:**
  - CRUD completo de contas financeiras (`ContaFinanceira`) e categorias (`Categoria`).
  - Lançamento de movimentações financeiras (`Transacao`) categorizadas por tipo (`RECEITA` e `DESPESA`).
  - Controle de status: booleano `pago`, data de pagamento e enum calculada `StatusPagamento` (`PAGO`, `PENDENTE`, `ATRASADO`).
  - Lógica de saldo: apenas movimentações efetivamente pagas impactam o saldo em conta.
  - Filtros avançados por mês de competência (`aaaa-mm`), tipo, status, conta e paginação.

---

## 5. Pendências e Próximos Passos

- **Implementação de Assinatura (Planos Free / Pro):**
  - Atualmente existe uma seleção preliminar de módulos por usuário (`usuario_modulo`), porém não há regras de tarifação, limites operacionais por plano ou controle de vigência de planos SaaS (Free/Pro).
- **Gateway de Pagamento:**
  - Integração com provedores externos (ex.: Asaas, Stripe, Mercado Pago) para cobrança recorrente de assinaturas ou liquidação direta de cobranças.
- **Módulo Fiscal (MEI / ME — Fora do Escopo Atual):**
  - Conforme alinhamento de escopo, regras tributárias, parametrização fiscal e distinção de pessoa jurídica/MEI foram despriorizadas nesta etapa, mantendo o produto com foco estrito em Finanças Pessoais.
- **Módulos do Sistema Pendentes de Telas/Implementação Completa:**
  - Funcionalidades previstas no enum `Modulo` que ainda não possuem endpoints completos ou interfaces no frontend: Cartões de Crédito (`CARTOES`), Orçamentos/Metas (`ORCAMENTOS`), Relatórios Avançados (`RELATORIOS`), Importação de Extratos OFX/CSV (`IMPORTACAO`), Exportação de Dados (`EXPORTACAO`) e Etiquetas (`TAGS`).
  - Rotinas automáticas em lote de transações recorrentes via agendador (`quarkus.scheduler`).

