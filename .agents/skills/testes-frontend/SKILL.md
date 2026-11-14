---
name: testes-frontend
description: Diretrizes consolidadas para criação, revisão e execução real de testes unitários e de integração de componentes e serviços Angular com TestBed, Vitest e HttpTestingController.
---

# Governança de Testes Frontend — Angular & Vitest (FinControl)

Esta skill estabelece os protocolos técnicos, metodologias de teste e padrões de cobertura para os testes automatizados do frontend do **FinControl** em Angular 22+.

---

## 1. Objetivo da Skill

Orientar a escrita, manutenção e execução real de testes unitários e de componentes, garantindo a validação de formulários reativos, interceptores, guards de rota e integração simulada com a API REST.

---

## 2. Quando Usar

Utilize esta skill sempre que a tarefa envolver:
- Criação de novos testes unitários para componentes standalone ou serviços Angular.
- Validação de fluxos de interação do usuário (cliques, preenchimento de campos, submissão).
- Teste de serviços HTTP com simulação de respostas via `HttpTestingController`.
- Validação de guards de autenticação (`CanActivateFn`) e interceptores de requisição.
- Execução mandatória da suíte de testes antes de concluir qualquer alteração no frontend.

---

## 3. Diretrizes de Execução

### 3.1. Infraestrutura de Testes
- **Ambiente:** `TestBed` oficial do Angular configurado com o executor de testes do projeto (Vitest / Jasmine).
- **Simulação de Comunicação HTTP:** Utilizar `provideHttpClient()` com `provideHttpClientTesting()` e injetar o `HttpTestingController` para verificar chamadas assíncronas:
  ```typescript
  describe('TransacaoService', () => {
    let service: TransacaoService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          TransacaoService,
          provideHttpClient(),
          provideHttpClientTesting()
        ]
      });
      service = inject(TransacaoService);
      httpTesting = inject(HttpTestingController);
    });

    afterEach(() => {
      httpTesting.verify();
    });

    it('deve listar transações paginadas', () => {
      service.buscar({}).subscribe(res => {
        expect(res.items.length).toBe(1);
      });

      const req = httpTesting.expectOne(r => r.url.includes('/transacoes'));
      expect(req.request.method).toBe('GET');
      req.flush({ items: [{ id: 1, descricao: 'Salário' }], totalItems: 1 });
    });
  });
  ```

### 3.2. Foco no Comportamento Observável
- **Interação com o Usuário:** Testar a reação do componente diante de eventos reais (preenchimento de inputs, submissão de formulários, acionamento de botões).
- **Validação de Formulários:** Assegurar que botões permaneçam desabilitados enquanto o formulário contiver campos inválidos e que mensagens de erro sejam exibidas adequadamente.
- **Transição de Estados:** Garantir que o estado de carregamento (*spinner*) seja acionado no disparo da requisição e encerrado ao término (seja por sucesso ou erro).
- **Navegação e Guards:** Testar se usuários sem credenciais são devidamente redirecionados para `/login`.

### 3.3. Execução Obrigatória e Evidências
- A suíte de testes deve ser executada a partir da pasta `frontend/`:
  ```bash
  npm test
  ```
- O agente deve coletar a saída do comando, conferir se todos os testes passaram e reportar as evidências textuais ao desenvolvedor.

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibição de declaração sem evidência real:** É terminantemente proibido declarar cobertura de testes ou afirmar aprovação sem executar o comando `npm test` no terminal e apresentar os resultados reais.
> 2. **Proibido mockar regras de negócio do backend:** Testes de frontend devem simular as respostas HTTP que o backend real forneceria (ex.: payload de sucesso ou RFC 7807 de erro). Nunca reinvente ou altere a lógica de negócio do backend nos mocks.
> 3. **Proibido silenciar testes:** Nunca use `fdescribe`, `fit`, `xdescribe` ou `xit` em código versionado para ignorar testes falhos. Corrija o teste ou a implementação defeituosa.
