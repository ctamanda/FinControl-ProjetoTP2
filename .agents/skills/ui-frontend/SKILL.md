---
name: ui-frontend
description: Diretrizes consolidadas para construção visual, design system com Angular Material/CDK, acessibilidade e gestão obrigatória dos 5 estados de interface no frontend do FinControl.
---

# Governança de UI & Design System — Angular Material (FinControl)

Esta skill define os padrões visuais, diretrizes de usabilidade, responsividade e acessibilidade aplicáveis à interface gráfica do **FinControl** com Angular Material e Angular CDK.

---

## 1. Objetivo da Skill

Orientar o desenvolvimento e revisão da camada visual, garantindo consistência estética com o ecossistema oficial do Angular Material/CDK, suporte a dispositivos móveis e desktops, e implementação rigorosa dos cinco estados visuais de interface.

---

## 2. Quando Usar

Utilize esta skill sempre que a tarefa envolver:
- Construção ou estilização de layouts, tabelas, modais, cabeçalhos, formulários ou listas.
- Implementação de feedback visual para requisições assíncronas (carregamento, sucesso, erro).
- Ajustes de responsividade (adaptação entre resoluções desktop e mobile).
- Melhorias de acessibilidade (navegação por teclado, contraste, leitores de tela).
- Padronização de componentes visuais do `@angular/material` e `@angular/cdk`.

---

## 3. Diretrizes de Execução

### 3.1. Uso Exclusivo do Angular Material & CDK
- Todos os componentes visuais devem provir dos pacotes oficiais:
  - `@angular/material` (`MatButtonModule`, `MatTableModule`, `MatPaginatorModule`, `MatDialogModule`, `MatSnackBarModule`, `MatCardModule`, `MatIconModule`, `MatFormFieldModule`, `MatInputModule`, `MatSelectModule`, `MatProgressSpinnerModule`).
  - `@angular/cdk` (layouts responsivos com `BreakpointObserver`, tabelas virtuais, acessibilidade).
- Estilização complementar deve ser escrita em SCSS modular e com variáveis globais do tema, evitando sobrescritas agressivas via `!important` desnecessário.

### 3.2. Os 5 Estados Visuais Obrigatórios de Interface
Toda visualização que dependa de carregamento ou submissão de dados deve contemplar explicitamente os 5 estados:

1. **Estado de Carregamento (*Loading*):**
   - Exibir `mat-spinner` centralizado ou skeleton loaders durante a busca inicial ou filtragem de dados.
2. **Estado Vazio (*Empty State*):**
   - Quando uma consulta não retornar registros, exibir ilustração/ícone representativo acompanhado de texto explicativo e botão de ação direta (ex.: *"Nenhum lançamento encontrado para este mês. [Novo Lançamento]"*).
3. **Estado de Erro (*Error Handling*):**
   - Erros da API devem ser tratados e apresentados de forma clara via `MatSnackBar` ou caixas de diálogo informativas, exibindo as mensagens retornadas pelo backend (RFC 7807 Problem Details).
4. **Estado de Sucesso (*Success Feedback*):**
   - Confirmações de inclusão, alteração ou exclusão devem emitir feedback não intrusivo com `MatSnackBar` (ex.: *"Transação paga com sucesso"*).
5. **Prevenção de Ações Duplicadas (*Double Click Prevention*):**
   - Todo botão de submissão ou ação sensível deve ser desabilitado automaticamente (`[disabled]="carregando || form.invalid"`) enquanto a requisição HTTP estiver em processamento.

### 3.3. Acessibilidade e Responsividade
- **Navegação por Teclado:** Garantir ordem lógica de foco em todos os campos de formulários e acionamento de ações via `Enter` e `Space`.
- **Rótulos e Identificadores:** Inserir `aria-label` em botões representados apenas por ícones (`mat-icon-button`).
- **Responsividade:** Telas devem adaptar tabelas e formulários para visualização fluida em dispositivos móveis (ex.: colunas condensadas em cards no mobile).

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibição de bibliotecas de UI de terceiros:** Não instale bibliotecas de interface alternativas (como Bootstrap, Tailwind, PrimeNG ou Ant Design) sem aprovação expressa do desenvolvedor. A UI do FinControl é baseada exclusivamente no Angular Material.
> 2. **Consistência visual:** Mantenha os padrões de cores, espaçamentos, tipografia e ícones existentes no projeto para não descaracterizar a identidade visual.
> 3. **Não omitir estados visuais:** Telas que apresentem apenas o estado feliz sem tratamento de carregamento, erro ou vazio serão consideradas incompletas.
