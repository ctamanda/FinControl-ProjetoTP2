# Diretrizes de Frontend — FinControl

Este documento estabelece as regras de desenvolvimento, design visual, consumo de contratos e testes para o diretório `frontend/`.

---

## 1. Governança de Skills do Frontend

Ao atuar no frontend, o agente de IA deve consultar e aderir estritamente às diretrizes das seguintes skills especializadas:
- **`angular-frontend`:** Uso obrigatório na criação de componentes, rotas, formulários reativos, interceptores e serviços de comunicação HTTP.
- **`ui-frontend`:** Uso obrigatório para estilização, layouts responsivos, uso do Angular Material/CDK, acessibilidade e padronização visual.
- **`testes-frontend`:** Uso obrigatório na escrita e execução de testes de componentes, mocks de serviços e validações de formulário.
- **`seguranca-frontend-oidc`:** Diretrizes para armazenamento seguro de sessão, guards de rota, renovação e envio controlado do access token.

---

## 2. Padrões de Arquitetura Angular

1. **Angular Standalone Obrigatório:**
   - Todo novo componente, diretiva ou pipe deve ser standalone (`standalone: true`).
   - O uso de `NgModule` legado é vetado.
2. **Ecossistema Angular Material & CDK:**
   - Uso exclusivo dos componentes visuais oficiais (`@angular/material`, `@angular/cdk`) para manter consistência com o restante da aplicação (tabelas, diálogos de confirmação, formulários, alertas, menus e paginação).
3. **Contratos HTTP Estritos:**
   - As chamadas HTTP devem respeitar fielmente os endpoints documentados no OpenAPI do backend (`http://localhost:8080/q/swagger-ui`).
   - **É terminantemente proibido inventar endpoints**, rotas da API, parâmetros de query ou campos de modelos que não existam no backend.

---

## 3. Segurança e Autoridade de Acesso

- **Backend como Autoridade Soberana:**
  - O frontend nunca é o árbitro final de permissões. Ocultar botões ou proteger rotas via `CanActivateFn` são recursos de experiência do usuário (UX), mas toda autorização é fiscalizada no backend.
- **Proteção de Credenciais e Tokens:**
  - Tokens JWT devem ser trafegados exclusivamente via cabeçalho `Authorization: Bearer <token>`.
  - Tratamento centralizado de códigos HTTP:
    - **401 Unauthorized:** Redirecionamento automático para a tela de login com limpeza do estado de autenticação.
    - **403 Forbidden:** Exibição de mensagem informativa de permissão negada ou redirecionamento para troca de senha provisória se aplicável.

---

## 4. Padrões de Interface e Estados Visuais (UX/UI)

Toda tela, listagem ou formulário deve implementar tratamento explícito para os 5 estados visuais essenciais:

1. **Carregamento (*Loading*):** Exibição de `mat-spinner` ou placeholders durante a espera de respostas assíncronas.
2. **Sucesso (*Success*):** Confirmação de operações concluídas via feedback visual não intrusivo (ex.: `MatSnackBar`).
3. **Vazio (*Empty State*):** Mensagem amigável com orientação para ação (ex.: *"Nenhuma transação encontrada para este mês. Clique em Nova Transação para começar."*).
4. **Erro (*Error Handling*):** Mensagens de erro claras extraídas dos retornos padronizados da API (RFC 7807 Problem Details), destacando campos com validação rejeitada.
5. **Prevenção de Ações Duplicadas:** Botões de envio de formulário e ações críticas devem ser desabilitados automaticamente enquanto houver requisição HTTP em andamento.

---

## 5. Diretrizes de Testes e Build

- **Validação Local:** Antes de finalizar qualquer tarefa no frontend, execute e comprove o sucesso dos testes e da compilação:
  ```bash
  # Rodar testes unitários com Vitest
  npm test

  # Verificar build de produção sem erros de tipagem
  npm run build
  ```
- **Evidências Reais:** Proibido declarar tarefas de frontend como finalizadas sem rodar o linter/testes e fornecer evidência dos comandos executados.

