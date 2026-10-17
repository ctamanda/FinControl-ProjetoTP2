# FinControl — Documento de Requisitos

**Projeto:** FinControl — Sistema de Controle Financeiro Pessoal  
**Etapa:** Apresentação A1  
**Backend:** Quarkus / Java  
**Frontend:** Angular  
**Banco de dados:** PostgreSQL  
**Repositórios:**
- [Backend — Quarkus](https://github.com/ctamanda/topicos-2-back/tree/feat/a1-apresentacao)
- [Frontend — Angular](https://github.com/ctamanda/topicos-2-front/tree/feat/a1-apresentacao)

**Status do documento:** requisitos da especificação e situação atual da implementação.

### Legenda de status

| Status | Significado |
|---|---|
| **[Implementado]** | A funcionalidade está presente no código atual. |
| **[Parcial]** | Existe implementação relacionada, mas ela não atende a todo o requisito da especificação. |
| **[Futuro]** | A funcionalidade ainda precisa ser desenvolvida. |

---

# 1. Visão geral

O **FinControl** é um sistema de controle financeiro pessoal com perfil fiscal, desenvolvido para permitir que usuários registrem receitas e despesas, organizem suas movimentações por categorias e acompanhem sua situação financeira por meio de um dashboard.

O sistema utiliza uma arquitetura cliente-servidor, com frontend desenvolvido em Angular e backend desenvolvido em Quarkus. A persistência dos dados é realizada em PostgreSQL, e a autenticação utiliza JSON Web Tokens (JWT).

O projeto prevê funcionalidades financeiras e fiscais voltadas a pessoas físicas, microempreendedores individuais (MEI) e empresas enquadradas no perfil ME. A implementação atual contempla principalmente o controle de transações, categorias, cadastro de usuários e manutenção de parâmetros fiscais.

## 1.1. Público-alvo

O público-alvo previsto é composto por:

- Pessoas físicas que desejam organizar suas receitas e despesas.
- Microempreendedores individuais que precisam acompanhar suas movimentações financeiras.
- Usuários que precisam distinguir movimentações pessoais das empresariais.
- Administradores responsáveis pelas estatísticas agregadas do sistema e pela manutenção dos parâmetros fiscais.

## 1.2. Diferenciais propostos

- **Organização financeira:** registro e classificação de receitas e despesas.
- **Separação financeira:** distinção entre movimentações pessoais e empresariais.
- **Dashboard:** visualização resumida da situação financeira.
- **Perfil fiscal:** cadastro de informações relacionadas ao enquadramento fiscal do usuário.
- **Parâmetros fiscais versionados por vigência:** armazenamento de valores com datas de validade.
- **Privacidade por usuário:** cada conta deve ter acesso somente aos próprios dados financeiros.
- **Modelo SaaS:** estrutura preparada para atender diferentes usuários sem misturar seus dados.
- **Evolução fiscal:** previsão de funcionalidades de cálculo e simulação tributária em etapas futuras.

Os cálculos tributários, as metas mensais, as recorrências automáticas e a exportação de relatórios ainda não fazem parte das funcionalidades implementadas.

## 1.3. Modelo SaaS e LGPD

O FinControl adota como princípio de arquitetura o isolamento dos dados por usuário. Cada usuário deve consultar e modificar apenas seus próprios registros financeiros e categorias.

O perfil `ADMIN` possui um escopo administrativo limitado às estatísticas agregadas e ao gerenciamento de parâmetros fiscais. Não deve ter acesso a transações, categorias ou outros registros financeiros individuais de terceiros.

Esse modelo está alinhado ao princípio de minimização de acesso aos dados pessoais previsto na abordagem de privacidade da LGPD. A conformidade efetiva depende também de controles técnicos, tratamento adequado de dados, políticas de retenção e demais medidas que não se resumem à autenticação.

**Pendência importante:** a revisão técnica identificou a necessidade de reforçar a validação de propriedade da categoria ao criar ou atualizar uma transação. Essa validação deve garantir que a categoria associada pertença ao mesmo usuário autenticado. Até que essa pendência seja corrigida e testada, o isolamento completo não deve ser considerado garantido em todos os fluxos.

---

# 2. Perfis de usuário

O sistema possui dois papéis de acesso: `USER` e `ADMIN`.

Os papéis são independentes. O administrador não herda automaticamente os casos de uso do usuário no modelo de requisitos.

## 2.1. Usuário — `USER`

O usuário comum pode:

- Cadastrar uma conta.
- Autenticar-se no sistema.
- Consultar e atualizar o próprio perfil.
- Consultar, cadastrar, editar e excluir as próprias transações.
- Consultar, cadastrar, editar e excluir as próprias categorias, respeitando as regras de negócio.
- Consultar o dashboard financeiro associado à própria conta.
- Informar dados do próprio perfil fiscal.

As funcionalidades de metas mensais, transações recorrentes, cálculo tributário e exportação de relatórios estão previstas, mas ainda não estão implementadas.

## 2.2. Administrador — `ADMIN`

O administrador pode:

- Consultar estatísticas agregadas do sistema.
- Listar parâmetros fiscais.
- Consultar um parâmetro fiscal.
- Cadastrar parâmetros fiscais.
- Editar parâmetros fiscais.
- Excluir parâmetros fiscais.

O administrador não possui funcionalidade para consultar transações ou categorias individuais de outros usuários.

O escopo administrativo está em discussão com o professor e poderá ser revisto em versões futuras. Este documento considera apenas as funções administrativas identificadas na versão atual.

---

# 3. Requisitos funcionais

Os requisitos funcionais estão organizados por módulo. O status indica a situação da funcionalidade na versão atual do projeto.

## 3.1. Módulo de autenticação

| ID | Requisito funcional | Status |
|---|---|---|
| RF01 | O sistema deve permitir o cadastro de uma nova conta por meio de e-mail e senha. | **[Implementado]** |
| RF02 | O sistema deve autenticar usuários por meio de suas credenciais. | **[Implementado]** |
| RF03 | O sistema deve gerar um token JWT após a autenticação bem-sucedida. | **[Implementado]** |
| RF04 | O sistema deve armazenar a senha de forma protegida, utilizando BCrypt. | **[Implementado]** |
| RF05 | O sistema deve permitir a consulta do perfil do usuário autenticado. | **[Implementado]** |
| RF06 | O sistema deve permitir a atualização dos dados permitidos do próprio perfil. | **[Implementado]** |
| RF07 | O frontend deve manter o token e utilizá-lo nas requisições autenticadas. | **[Implementado]** |
| RF08 | O sistema deve permitir a recuperação de senha por e-mail. | **[Futuro]** |
| RF09 | O sistema deve permitir a alteração de senha pelo usuário autenticado. | **[Futuro]** |

**Observação:** o cadastro público cria contas com o papel `USER`. O sistema não disponibiliza um endpoint público para atribuição do papel `ADMIN`.

## 3.2. Módulo financeiro — Transações

| ID | Requisito funcional | Status |
|---|---|---|
| RF10 | O sistema deve permitir listar as próprias transações. | **[Implementado]** |
| RF11 | O sistema deve permitir consultar os detalhes de uma transação própria. | **[Implementado]** |
| RF12 | O sistema deve permitir cadastrar receitas e despesas. | **[Implementado]** |
| RF13 | O sistema deve permitir editar uma transação própria. | **[Implementado]** |
| RF14 | O sistema deve permitir excluir uma transação própria. | **[Implementado]** |
| RF15 | O sistema deve permitir pesquisar transações por descrição. | **[Implementado]** |
| RF16 | O sistema deve permitir paginar os resultados da listagem de transações. | **[Implementado]** |
| RF17 | O sistema deve distinguir transações pessoais e empresariais. | **[Implementado]** |
| RF18 | O sistema deve restringir as operações financeiras aos registros do usuário autenticado. | **[Parcial]** |
| RF19 | O sistema deve permitir configurar transações recorrentes. | **[Futuro]** |
| RF20 | O sistema deve gerar automaticamente transações recorrentes conforme a periodicidade configurada. | **[Futuro]** |

O CRUD de transações está implementado. A proteção da propriedade dos registros é aplicada nas operações usuais, mas a validação de propriedade da categoria associada precisa ser reforçada para garantir o isolamento completo.

A geração automática de recorrências depende de novas estruturas de dados, regras de periodicidade e um mecanismo de agendamento.

## 3.3. Módulo financeiro — Dashboard

| ID | Requisito funcional | Status |
|---|---|---|
| RF21 | O sistema deve apresentar o saldo calculado a partir das receitas e despesas. | **[Implementado]** |
| RF22 | O dashboard deve apresentar valores resumidos de receitas e despesas. | **[Implementado]** |
| RF23 | O dashboard deve apresentar gráficos de movimentações financeiras. | **[Implementado]** |
| RF24 | O dashboard deve apresentar informações financeiras recentes e históricos resumidos. | **[Implementado]** |
| RF25 | O dashboard deve permitir a comparação com o período anterior. | **[Parcial]** |
| RF26 | O sistema deve permitir o cadastro e acompanhamento de metas mensais. | **[Futuro]** |
| RF27 | O sistema deve alertar quando uma meta atingir 80% do valor definido. | **[Futuro]** |
| RF28 | O sistema deve indicar quando uma meta atingir ou ultrapassar 100%. | **[Futuro]** |
| RF29 | O sistema deve projetar o resultado financeiro ao final do mês. | **[Futuro]** |
| RF30 | O sistema deve exportar um relatório financeiro mensal em CSV. | **[Futuro]** |

O dashboard atual realiza cálculos e apresenta informações a partir das transações disponíveis. A existência de comparativos e gráficos não significa que os requisitos de metas mensais e projeções financeiras estejam integralmente atendidos.

A exportação CSV ainda precisa ser desenvolvida.

## 3.4. Módulo de categorias

| ID | Requisito funcional | Status |
|---|---|---|
| RF31 | O sistema deve listar as categorias do usuário autenticado. | **[Implementado]** |
| RF32 | O sistema deve permitir cadastrar categorias. | **[Implementado]** |
| RF33 | O sistema deve permitir editar categorias próprias. | **[Implementado]** |
| RF34 | O sistema deve permitir excluir categorias próprias que não possuam transações vinculadas. | **[Implementado]** |
| RF35 | O sistema deve impedir nomes duplicados de categorias dentro da mesma conta. | **[Implementado]** |
| RF36 | O sistema deve criar seis categorias iniciais no cadastro do usuário. | **[Implementado]** |
| RF37 | O sistema deve garantir que uma transação só seja associada a uma categoria pertencente ao mesmo usuário. | **[Parcial]** |

As categorias iniciais são:

- Alimentação.
- Moradia.
- Transporte.
- Lazer.
- Salário.
- Vendas.

As quatro primeiras são categorias de despesa; Salário e Vendas são categorias de receita.

O sistema impede a exclusão de categorias que tenham transações vinculadas. A validação da propriedade da categoria nas operações de transação precisa ser concluída para atender plenamente ao requisito de isolamento.

## 3.5. Módulo de perfil fiscal

| ID | Requisito funcional | Status |
|---|---|---|
| RF38 | O sistema deve permitir consultar o próprio perfil fiscal. | **[Implementado]** |
| RF39 | O sistema deve permitir atualizar o perfil fiscal. | **[Implementado]** |
| RF40 | O sistema deve permitir representar os perfis PF, MEI e ME. | **[Implementado]** |
| RF41 | O sistema deve permitir representar a atividade MEI como comércio, serviço ou ambos. | **[Implementado]** |
| RF42 | O sistema deve calcular o DAS do MEI. | **[Futuro]** |
| RF43 | O sistema deve acompanhar o faturamento anual do MEI em relação ao teto definido na especificação. | **[Futuro]** |
| RF44 | O sistema deve calcular uma provisão de IRPF para o MEI. | **[Futuro]** |
| RF45 | O sistema deve disponibilizar um simulador de IRPF para pessoa física. | **[Futuro]** |
| RF46 | O sistema deve oferecer um cálculo simplificado para ME com base no Simples Nacional. | **[Futuro]** |
| RF47 | O sistema deve calcular estimativas tributárias com base no perfil fiscal e nos parâmetros aplicáveis. | **[Futuro]** |

O cadastro de informações fiscais está implementado, mas não existe ainda um módulo completo de cálculo tributário. O armazenamento do perfil fiscal e dos parâmetros legais não deve ser confundido com a execução das fórmulas de cálculo.

Os cálculos futuros deverão considerar as regras tributárias aplicáveis e a vigência dos parâmetros, com validação das fórmulas e dos valores antes de serem utilizados como estimativas.

## 3.6. Módulo administrativo

| ID | Requisito funcional | Status |
|---|---|---|
| RF48 | O sistema deve permitir ao administrador consultar estatísticas agregadas. | **[Implementado]** |
| RF49 | O sistema deve permitir listar parâmetros fiscais. | **[Implementado]** |
| RF50 | O sistema deve permitir consultar um parâmetro fiscal específico. | **[Implementado]** |
| RF51 | O sistema deve permitir cadastrar parâmetros fiscais. | **[Implementado]** |
| RF52 | O sistema deve permitir editar parâmetros fiscais. | **[Implementado]** |
| RF53 | O sistema deve permitir excluir parâmetros fiscais. | **[Implementado]** |
| RF54 | O sistema deve validar a vigência dos parâmetros fiscais. | **[Implementado]** |
| RF55 | O sistema deve impedir períodos de vigência sobrepostos para a mesma chave. | **[Implementado]** |
| RF56 | O sistema deve permitir ao administrador consultar dados financeiros individuais de outros usuários. | **[Futuro — não previsto no escopo atual]** |
| RF57 | O sistema deve oferecer auditoria administrativa de operações. | **[Futuro — não implementado]** |

O requisito RF56 não constitui uma funcionalidade aprovada. Está listado apenas para deixar explícito que o acesso administrativo a dados individuais não faz parte do escopo atual e não deve ser incluído sem discussão sobre necessidade, autorização e privacidade.

O papel `ADMIN` permanece limitado às estatísticas agregadas e aos parâmetros fiscais enquanto o escopo administrativo é discutido com o professor.

## 3.7. Funcionalidades complementares futuras

| ID | Requisito funcional | Status |
|---|---|---|
| RF58 | O sistema deve consultar informações de endereço a partir de um CEP por meio da API ViaCEP. | **[Futuro — Trabalho 04]** |
| RF59 | O sistema deve permitir configurar e acompanhar transações recorrentes. | **[Futuro]** |
| RF60 | O sistema deve automatizar a criação das transações recorrentes agendadas. | **[Futuro]** |

A integração com ViaCEP está prevista como Trabalho 04. Não deve ser apresentada como recurso disponível na versão atual.

---

# 4. Requisitos não funcionais

## 4.1. Segurança e privacidade

| ID | Requisito não funcional | Status |
|---|---|---|
| RNF01 | As senhas devem ser armazenadas utilizando hash BCrypt. | **[Implementado]** |
| RNF02 | A autenticação deve utilizar JWT assinado e validado pelo backend. | **[Implementado]** |
| RNF03 | O token deve possuir prazo de validade definido. | **[Implementado]** |
| RNF04 | O sistema deve aplicar autorização no backend, e não depender exclusivamente da proteção de rotas do frontend. | **[Implementado, sujeito a testes de autorização]** |
| RNF05 | As consultas e alterações de dados financeiros devem respeitar o isolamento por usuário. | **[Parcial — requer correção e testes da associação de categorias]** |
| RNF06 | O administrador não deve acessar registros financeiros individuais de outros usuários. | **[Implementado no escopo funcional atual]** |
| RNF07 | As chaves privadas utilizadas na assinatura do JWT devem permanecer fora do repositório. | **[Requisito de implantação]** |
| RNF08 | O sistema deve evitar exposição desnecessária de dados pessoais e financeiros. | **[Parcial — requer validação contínua]** |
| RNF09 | As operações protegidas devem rejeitar tokens inválidos ou expirados. | **[Implementado conforme a configuração JWT]** |

### Diretrizes de segurança

- A senha não deve ser armazenada em texto puro.
- O frontend não deve ser responsável por decidir sozinho se uma operação é autorizada.
- A identidade do usuário deve ser obtida do token validado.
- As consultas devem limitar os registros ao usuário autenticado.
- O acesso administrativo deve permanecer restrito às operações aprovadas.
- Chaves privadas e credenciais de produção não devem ser versionadas.
- A aplicação deve ser implantada com HTTPS em ambientes acessíveis pela rede.
- Os fluxos de associação entre transações e categorias precisam ser testados para impedir referências a dados de outras contas.

## 4.2. Performance

| ID | Requisito não funcional | Status |
|---|---|---|
| RNF10 | A listagem de transações deve utilizar paginação. | **[Implementado]** |
| RNF11 | O tamanho da página deve ser limitado a, no máximo, 100 registros. | **[Implementado]** |
| RNF12 | As consultas devem evitar carregar desnecessariamente todos os registros de uma conta. | **[Parcial — depende da consulta e do endpoint]** |
| RNF13 | O banco deve manter restrições de integridade e índices adequados às consultas realizadas. | **[Parcial — sujeito à revisão de desempenho]** |

A paginação reduz a quantidade de dados retornada em cada requisição. O limite máximo de 100 registros por página evita solicitações excessivamente grandes por meio do endpoint de listagem de transações.

Não há, neste documento, uma meta quantitativa de tempo de resposta ou de usuários simultâneos, pois esses valores ainda não foram definidos e validados por testes de carga.

## 4.3. Usabilidade

| ID | Requisito não funcional | Status |
|---|---|---|
| RNF14 | A aplicação deve oferecer interface web para as operações implementadas. | **[Implementado]** |
| RNF15 | A interface deve permitir cadastro e autenticação de forma direta. | **[Implementado]** |
| RNF16 | O dashboard deve apresentar informações financeiras de forma visual. | **[Implementado]** |
| RNF17 | O sistema deve apresentar mensagens compreensíveis para operações e erros. | **[Parcial — sujeito à avaliação dos fluxos]** |
| RNF18 | A documentação da API deve estar disponível para consulta durante o desenvolvimento. | **[Implementado por Swagger/OpenAPI, conforme configuração]** |

## 4.4. Manutenibilidade e evolução

| ID | Requisito não funcional | Status |
|---|---|---|
| RNF19 | O backend deve manter separação entre Resource, Service e Repository. | **[Implementado]** |
| RNF20 | As alterações no esquema do banco devem ser controladas por migrations. | **[Implementado com Flyway]** |
| RNF21 | A documentação deve distinguir funcionalidades implementadas de funcionalidades futuras. | **[Em atualização]** |
| RNF22 | O modelo deve permitir a evolução dos módulos financeiros e fiscais sem misturar os dados dos usuários. | **[Diretriz arquitetural]** |

---

# 5. Regras de negócio — RN01 a RN11

Esta seção relaciona as regras da especificação do professor à situação atual do código.

| Regra | Descrição | Status | Situação atual |
|---|---|---|---|
| RN01 | Saldo = receitas − despesas. | **[Implementado]** | O dashboard calcula e apresenta o saldo a partir das movimentações financeiras. |
| RN02 | A meta deve entrar em alerta ao atingir 80% do valor definido e ser considerada estourada a partir de 100%. | **[Futuro]** | Não há módulo de metas mensais implementado. |
| RN03 | O sistema deve calcular uma projeção financeira para o fim do mês. | **[Futuro]** | O dashboard apresenta resumos financeiros, mas não implementa a projeção prevista na especificação. |
| RN04 | O sistema deve comparar períodos mensais. | **[Parcial]** | Existe comparação financeira com o período anterior no dashboard, mas o atendimento integral à regra precisa ser conferido em relação aos critérios da especificação. |
| RN05 | Transações recorrentes devem ser geradas automaticamente. | **[Futuro]** | Não há modelo de recorrência nem agendador implementado para essa finalidade. |
| RN06 | Uma categoria só pode ser excluída quando não houver transações vinculadas. | **[Implementado]** | O backend verifica a existência de transações associadas antes de excluir uma categoria. |
| RN07 | O DAS do MEI deve considerar 5% do salário mínimo mais ICMS e/ou ISS, conforme a atividade. | **[Futuro]** | O sistema armazena perfil fiscal e parâmetros, mas não executa esse cálculo. |
| RN08 | O sistema deve apresentar o faturamento anual do MEI em relação ao teto de R$ 81.000. | **[Futuro]** | Não há cálculo implementado de faturamento anual acumulado nem indicador de limite do MEI. |
| RN09 | O sistema deve calcular a provisão de IRPF do MEI com base no lucro presumido, conforme a especificação. | **[Futuro]** | O cálculo tributário não está implementado. |
| RN10 | O sistema deve disponibilizar um simulador de IRPF com base na tabela progressiva. | **[Futuro]** | Não há simulador de IRPF implementado. |
| RN11 | O sistema deve oferecer cálculo simplificado para ME com base no Simples Nacional. | **[Futuro]** | O cálculo simplificado está previsto para uma versão futura. |

### Observações sobre as regras fiscais

Os valores, percentuais e fórmulas mencionados nas RN07 a RN11 são requisitos da especificação do projeto. Antes da implementação, deverão ser verificados quanto à legislação aplicável e à vigência dos parâmetros fiscais utilizados.

O sistema já possui uma entidade para parâmetros fiscais com datas de vigência e validação de períodos sobrepostos. Isso fornece uma base para o módulo fiscal, mas **não significa que os cálculos tributários estejam disponíveis**.

---

# 6. Modelo de dados

O modelo de dados atual possui quatro entidades principais. Os campos comuns de identificação e auditoria são herdados de `DefaultEntity`, uma classe base anotada como `@MappedSuperclass`.

## 6.1. Entidades principais

| Entidade | Finalidade | Campos principais |
|---|---|---|
| `Usuario` | Representar a conta, suas credenciais e seu perfil fiscal. | `email`, `nome`, `password`, `perfilFiscal`, `atividadeMei`, `role` |
| `Categoria` | Classificar receitas e despesas de cada usuário. | `nome`, `tipo`, `cor`, `usuario` |
| `Transacao` | Registrar movimentações financeiras. | `descricao`, `valor`, `data`, `tipo`, `escopo`, `categoria`, `usuario` |
| `ParametroFiscal` | Armazenar parâmetros fiscais globais com período de vigência. | `chave`, `valor`, `vigenciaInicio`, `vigenciaFim` |

## 6.2. Campos herdados

`DefaultEntity` fornece os campos comuns às entidades persistentes:

- `id`: identificador do registro.
- `dataCadastro`: data e hora de criação.
- `dataAlteracao`: data e hora da última alteração.

## 6.3. Relacionamentos

- **Usuário 1:N Categorias:** um usuário pode possuir várias categorias; cada categoria pertence a um usuário.
- **Usuário 1:N Transações:** um usuário pode registrar várias transações; cada transação pertence a um usuário.
- **Categoria 1:N Transações:** uma categoria pode classificar várias transações; cada transação está associada a uma categoria.

Os parâmetros fiscais são globais e não possuem vínculo com um usuário específico.

## 6.4. Enums do domínio

| Enum | Valores |
|---|---|
| `Role` | `ADMIN`, `USER` |
| `PerfilFiscal` | `PF`, `MEI`, `ME` |
| `AtividadeMei` | `COMERCIO`, `SERVICO`, `AMBOS` |
| `TipoCategoria` | `RECEITA`, `DESPESA` |
| `TipoTransacao` | `RECEITA`, `DESPESA` |
| `Escopo` | `PESSOAL`, `EMPRESA` |

## 6.5. Estruturas ainda não implementadas

Não há, no modelo atual descrito, entidades específicas para:

- Metas mensais.
- Configuração de recorrências.
- Endereços consultados pelo CEP.
- Apurações e simulações tributárias.
- Relatórios exportados como registros persistentes.

Essas estruturas deverão ser avaliadas quando os respectivos requisitos forem priorizados.

---

# 7. API REST

A API do FinControl disponibiliza endpoints de autenticação, perfil, transações, categorias e administração.

A autorização efetiva é realizada no backend. Os endpoints financeiros devem respeitar o escopo do usuário autenticado, independentemente das proteções de interface do frontend.

## 7.1. Autenticação

| Método | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| `POST` | `/auth/register` | Público | Cadastrar uma conta. |
| `POST` | `/auth/login` | Público | Autenticar e obter o JWT. |

## 7.2. Perfil do usuário

| Método | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/usuarios/me` | Usuário autenticado | Consultar o próprio perfil. |
| `PUT` | `/usuarios/me` | Usuário autenticado | Atualizar o próprio perfil. |

## 7.3. Transações

| Método | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/transacoes` | Usuário autenticado | Listar as próprias transações. |
| `GET` | `/transacoes/{id}` | Usuário autenticado | Consultar uma transação própria. |
| `POST` | `/transacoes` | Usuário autenticado | Cadastrar uma transação. |
| `PUT` | `/transacoes/{id}` | Usuário autenticado | Atualizar uma transação própria. |
| `DELETE` | `/transacoes/{id}` | Usuário autenticado | Excluir uma transação própria. |

A listagem aceita parâmetros de paginação e filtro por descrição. O tamanho da página possui limite máximo de 100 registros.

## 7.4. Categorias

| Método | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/categorias` | Usuário autenticado | Listar as próprias categorias. |
| `GET` | `/categorias/{id}` | Usuário autenticado | Consultar uma categoria própria. |
| `POST` | `/categorias` | Usuário autenticado | Cadastrar uma categoria. |
| `PUT` | `/categorias/{id}` | Usuário autenticado | Atualizar uma categoria própria. |
| `DELETE` | `/categorias/{id}` | Usuário autenticado | Excluir uma categoria própria sem transações vinculadas. |

## 7.5. Administração

Todos os endpoints desta seção exigem o papel `ADMIN`.

| Método | Endpoint | Acesso | Finalidade |
|---|---|---|---|
| `GET` | `/admin/estatisticas` | ADMIN | Consultar estatísticas agregadas. |
| `GET` | `/admin/parametros` | ADMIN | Listar parâmetros fiscais. |
| `GET` | `/admin/parametros/{id}` | ADMIN | Consultar um parâmetro fiscal. |
| `POST` | `/admin/parametros` | ADMIN | Cadastrar um parâmetro fiscal. |
| `PUT` | `/admin/parametros/{id}` | ADMIN | Atualizar um parâmetro fiscal. |
| `DELETE` | `/admin/parametros/{id}` | ADMIN | Excluir um parâmetro fiscal. |

As estatísticas administrativas não devem ser confundidas com acesso aos dados individuais dos usuários. Não existe, no escopo atual, endpoint administrativo destinado a listar transações de terceiros.

## 7.6. Endpoints futuros

Os seguintes recursos não estão disponíveis na API atual:

- Endpoints de metas mensais.
- Endpoints para configuração e consulta de recorrências.
- Endpoints de cálculos tributários.
- Endpoint para integração com ViaCEP.
- Endpoint para exportação de relatório mensal em CSV.

---

# 8. Stack e arquitetura

## 8.1. Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| Java | Linguagem do backend. |
| Quarkus 3.38 | Framework da API REST. |
| Hibernate ORM com Panache | Persistência e consultas. |
| PostgreSQL 16 | Banco de dados relacional. |
| Flyway | Controle de migrations. |
| SmallRye JWT | Autenticação e validação de tokens. |
| RSA | Assinatura e verificação dos JWTs. |
| BCrypt | Proteção das senhas armazenadas. |
| Maven | Build e gerenciamento de dependências. |
| Angular | Frontend web. |
| TypeScript | Linguagem utilizada no frontend Angular. |
| Swagger/OpenAPI | Documentação dos endpoints REST. |
| Docker | Suporte ao ambiente local de desenvolvimento. |

## 8.2. Arquitetura do backend

O backend segue uma arquitetura em camadas:

1. **Resource:** recebe requisições HTTP e produz respostas REST.
2. **Service:** executa regras de negócio e coordena as operações.
3. **Repository:** realiza o acesso aos dados com Panache.
4. **Model:** representa entidades persistentes e enums do domínio.
5. **DTOs e mappers:** apoiam o transporte e a conversão de dados entre camadas.
6. **Tratamento de exceções:** centraliza a resposta a erros da aplicação.

O banco de dados é gerenciado por meio de migrations do Flyway. As migrations existentes documentam a evolução do esquema, incluindo usuários, transações, categorias, parâmetros fiscais e a conta administrativa inicial.

## 8.3. Arquitetura do frontend

O frontend Angular contém componentes de interface, serviços de comunicação com a API, proteção de rotas e um interceptor HTTP.

- O `AuthGuard` protege as rotas da aplicação.
- O `AuthInterceptor` inclui o token JWT nas requisições autenticadas.
- Os serviços Angular se comunicam com os endpoints do backend.
- O token é armazenado no `localStorage`, utilizando a chave `token`.

A proteção de rotas do Angular melhora o fluxo de navegação, mas não substitui a autenticação e a autorização obrigatórias no backend.

---

# 9. Limitações e trabalhos futuros

## 9.1. Pendências funcionais

| Prioridade sugerida | Funcionalidade | Situação |
|---|---|---|
| Alta | Reforçar e testar a validação de propriedade da categoria nas transações. | Pendência de segurança e isolamento. |
| Alta | Revisar a validação automática dos DTOs de entrada. | Pendência técnica a verificar e corrigir. |
| Média | Implementar metas mensais. | Futuro. |
| Média | Implementar alertas de metas em 80% e 100%. | Futuro. |
| Média | Implementar projeção financeira mensal. | Futuro. |
| Média | Completar os comparativos mensais conforme a especificação. | Parcial. |
| Média | Implementar recorrências e agendamento automático. | Futuro. |
| Média | Implementar exportação de relatórios em CSV. | Futuro. |
| Média | Desenvolver cálculos tributários para MEI e PF. | Futuro. |
| Média | Desenvolver cálculo simplificado para ME. | Futuro. |
| Média | Integrar consulta de CEP com ViaCEP. | Futuro — Trabalho 04. |

## 9.2. Pendências de segurança e qualidade

Além das funcionalidades futuras, recomenda-se:

- Validar a propriedade dos registros associados em todas as operações de criação e atualização.
- Criar testes automatizados que tentem acessar dados de outro usuário.
- Confirmar que os DTOs de entrada são submetidos à validação Bean Validation.
- Manter chaves privadas e credenciais de produção fora do repositório.
- Revisar a configuração de autorização dos endpoints administrativos.
- Verificar mensagens de erro para evitar exposição de dados sensíveis.
- Validar a configuração de CORS e HTTPS nos amb

## 9.3. Módulo fiscal

O módulo fiscal atual possui o cadastro do perfil fiscal do usuário e a administração de parâmetros com vigência. A execução das regras de cálculo ainda precisa ser desenvolvida.

A implementação futura deve considerar:

- Fórmulas e faixas tributárias aplicáveis.
- Vigência temporal dos parâmetros.
- Diferenças entre PF, MEI e ME.
- Regras para comércio e prestação de serviços.
- Tratamento de valores e arredondamentos.
- Testes com cenários conhecidos e validação das fórmulas antes de disponibilizar os resultados.

## 9.4. ViaCEP — Trabalho 04

A integração com ViaCEP está prevista como trabalho futuro. Será necessário implementar a comunicação com a API externa, tratar CEPs inválidos e falhas de conexão e definir quais informações serão utilizadas pelo sistema.

A consulta por CEP não deve ser apresentada como uma funcionalidade implementada na versão atual.

## 9.5. Escopo administrativo

O escopo do administrador permanece em discussão com o professor.

Até que exista uma decisão formal, o papel `ADMIN` deve permanecer limitado às funcionalidades implementadas:

- Consultar estatísticas agregadas.
- Listar parâmetros fiscais.
- Consultar um parâmetro fiscal.
- Cadastrar, editar e excluir parâmetros fiscais.

Não fazem parte do escopo aprovado o gerenciamento administrativo de contas, a consulta de transações individuais de terceiros ou a auditoria administrativa de operações.

---

# 10. Documentação e diagramas

Os diagramas de apoio à apresentação A1 devem ficar na pasta `docs/` do repositório backend.

| Documento | Conteúdo |
|---|---|
| [`docs/diagrama-casos-de-uso.md`](docs/diagrama-casos-de-uso.md) | Atores, casos de uso implementados e funcionalidades futuras. |
| [`docs/diagrama-de-classes.md`](docs/diagrama-de-classes.md) | Entidades, enums e relacionamentos do domínio. |
| [`docs/diagrama-sequencia-login-jwt.md`](docs/diagrama-sequencia-login-jwt.md) | Sequência de autenticação e emissão do JWT. |
| [`docs/diagrama-componentes.md`](docs/diagrama-componentes.md) | Arquitetura macro do sistema. |
| [`docs/diagrama-arquitetura-camadas.md`](docs/diagrama-arquitetura-camadas.md) | Organização do backend em camadas. |
| [`docs/diagrama-fluxo-jwt.md`](docs/diagrama-fluxo-jwt.md) | Fluxo de autenticação e autorização JWT. |

Os links acima pressupõem que os arquivos estejam presentes na pasta `docs/` do repositório. Caso algum arquivo ainda não tenha sido adicionado, ele deverá ser incluído antes da publicação desta documentação.

Os diagramas devem distinguir visualmente as funcionalidades implementadas das futuras e refletir o código existente, sem representar recursos planejados como se já estivessem disponíveis.

---

# Considerações finais

O FinControl já possui uma base funcional para cadastro e autenticação de usuários, controle de transações e categorias, dashboard financeiro, manutenção do perfil fiscal e administração de parâmetros fiscais.

A próxima etapa de desenvolvimento deve priorizar a consolidação do isolamento dos dados entre usuários e, em seguida, as funcionalidades previstas na especificação do professor: metas mensais, projeções, recorrências, cálculos fiscais e exportação de relatórios.

Este documento registra tanto os requisitos esperados quanto as limitações conhecidas da versão atual, servindo como referência para a apresentação A1 e para o planejamento das próximas entregas.