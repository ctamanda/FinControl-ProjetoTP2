---
name: testes-backend
description: Diretrizes consolidadas para criação, revisão e execução real de testes unitários, de integração e de API REST no Quarkus com JUnit 5 e REST Assured.
---

# Governança de Testes Backend — JUnit 5 & REST Assured (FinControl)

Esta skill estabelece os padrões e protocolos operacionais para a suíte de testes automatizados do backend do **FinControl**, garantindo cobertura de regras de negócio, contratos de API e restrições de segurança.

---

## 1. Objetivo da Skill

Orientar a escrita, manutenção e execução mandatória de testes de unidade, de serviços e de integração de API REST (via REST Assured e JUnit 5), assegurando a ausência de regressões e a validação do isolamento de dados.

---

## 2. Quando Usar

Utilize esta skill sempre que:
- Escrever novos testes automatizados para endpoints, Services ou Repositories.
- Refatorar regras de negócio ou contratos de DTOs e validar a não quebra de funcionalidades prévias.
- Realizar revisões de qualidade de código e conformidade de segurança.
- Executar e validar a suíte de testes antes de considerar qualquer tarefa de backend concluída.

---

## 3. Diretrizes de Execução

### 3.1. Estrutura e Ferramentas
- **Frameworks:** JUnit 5 (`@Test`, assertivas JUnit / AssertJ) e REST Assured (`io.restassured.RestAssured`).
- **Anotação de Teste Quarkus:** Classes de integração de API devem usar `@QuarkusTest`.
- **Banco de Dados de Teste:** O perfil `%test` utiliza H2 em memória com recriação rápida (`%test.quarkus.datasource.db-kind=h2`), garantindo velocidade e isolamento dos testes sem dependência de containers externos.
- **Autenticação em Testes:** Empregar tokens gerados para o perfil de teste com claims válidas (`upn`, `groups`).

### 3.2. Matriz de Cobertura Obrigatória por Endpoint
Para todo endpoint ou serviço implementado, a suíte de testes deve cobrir obrigatoriamente:
1. **Caminho Feliz (Sucesso - 200 / 201 / 204):**
   - Requisição válida com dados corretos, conferindo o payload retornado e o estado persistido no banco.
2. **Validação de Entrada (Erro 400 Bad Request):**
   - Campos nulos, vazios, fora dos limites de caracteres, datas no formato incorreto ou valores negativos/inválidos (Bean Validation).
3. **Autenticação e Sessão (Erro 401 Unauthorized):**
   - Requisições sem cabeçalho `Authorization`, token expirado, token adulterado ou usuário desativado.
4. **Autorização e Perfis (Erro 403 Forbidden):**
   - Usuário com perfil `PESSOAL` tentando acessar rotas administrativas (`/admin/**`), ou usuário com flag `trocarSenha = true` tentando acessar rotas comuns sem `@PermiteSenhaProvisoria`.
5. **Isolamento de Dados (Erro 404 Not Found):**
   - Usuário A tentando buscar, editar ou excluir transação, categoria ou conta pertencente ao Usuário B. Deve retornar estritamente **404 Not Found** (anti-enumeração).
6. **Integridade e Bloqueio de Exclusão (Erro 400 / ValidationException):**
   - Tentativa de excluir conta com transações vinculadas ou excluir categoria com histórico.

### 3.3. Execução e Coleta de Evidências
- A execução deve ser feita a partir da pasta `backend/`:
  ```bash
  # Linux / macOS
  ./mvnw test

  # Windows (PowerShell)
  .\mvnw.cmd test
  ```
- O agente deve inspecionar a saída do terminal, contabilizar testes executados, aprovados e falhos, e apresentar o relatório textual ao desenvolvedor.

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibição de declaração sem evidência real:** É terminantemente proibido declarar testes como "aprovados" ou "concluídos" sem tê-los de fato executado via comando no terminal e colado as evidências de saída real.
> 2. **Proibido ignorar testes que falharam:** Não use `@Disabled` ou mute testes com falha para mascarar erros. Todo teste que falhar deve ter sua causa raiz investigada e corrigida.
> 3. **Não alterar regras de negócio para passar teste:** Testes devem refletir fielmente as regras documentadas em `docs/REGRAS_NEGOCIO.md`. Se um teste falhar devido a comportamento do domínio, a implementação do código deve ser corrigida, nunca a regra de negócio.
