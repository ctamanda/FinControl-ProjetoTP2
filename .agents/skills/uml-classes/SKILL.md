---
name: uml-classes
description: Diretrizes consolidadas para padronização, modelagem e sincronização contínua do diagrama de classes UML em PlantUML com o modelo de dados JPA real do FinControl.
---

# Governança de Modelagem — UML & PlantUML (FinControl)

Esta skill estabelece os protocolos para a manutenção, revisão e evolução do diagrama de classes em PlantUML localizado em `docs/modelo-plantuml.puml`, garantindo alinhamento estrito com as entidades JPA reais da aplicação.

---

## 1. Objetivo da Skill

Garantir que a documentação visual da arquitetura de domínio (`docs/modelo-plantuml.puml`) represente fielmente a implementação real das entidades Java em `backend/src/main/java/br/unitins/tp2/fincontrol/model/`.

---

## 2. Quando Usar

Utilize esta skill sempre que:
- Houver adição de nova entidade JPA, enumeração ou relacionamento aprovado no backend.
- Ocorrer alteração em atributos, tipos de dados, visibilidade ou cardinalidades de entidades existentes.
- For solicitada uma comparação contínua entre a documentação de arquitetura e o código-fonte JPA.
- For necessário gerar ou atualizar representações visuais em sintaxe PlantUML.

---

## 3. Diretrizes de Execução

### 3.1. Código-fonte como Fonte da Verdade
- **Princípio Soberano:** O código Java das entidades em `backend/.../model/` é a **fonte absoluta da verdade**.
- O diagrama de classes nunca deve antecipar abstrações conceituais que não existam no código ou que não tenham sido expressamente validadas pelo desenvolvedor.
- Antes de qualquer modificação no arquivo `docs/modelo-plantuml.puml`, inspecione obrigatoriamente as classes físicas:
  - `DefaultEntity.java`
  - `Usuario.java`
  - `ContaFinanceira.java`
  - `Categoria.java`
  - `Transacao.java`
  - `RegistroAuditoria.java`
  - Enumerações associadas (`Role`, `Modulo`, `TipoContaFinanceira`, `TipoCategoria`, `TipoTransacao`, `StatusPagamento`).

### 3.2. Padrões de Sintaxe PlantUML
- Utilizar sintaxe PlantUML limpa e legível:
  - Explicitar a herança de `DefaultEntity`: `DefaultEntity <|-- Entidade`.
  - Cardinalidades explícitas e claras nas duas pontas da associação (ex.: `Usuario "1" <-- "*" Transacao : usuario_id`).
  - Atributos com visibilidade (`+` para público, `#` para protegido, `-` para privado) e tipos de dados abreviados (`Long`, `String`, `BigDecimal`, `LocalDate`, `LocalDateTime`, `boolean`, `int`).
  - Relacionamentos lógicos sem chave estrangeira no banco (como `RegistroAuditoria` em relação a `Usuario`) devem ser representados com linha pontilhada (`..>`).

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibido alterar código de produção para se adequar ao diagrama:** Jamais modifique entidades JPA, colunas de banco ou migrations do Flyway com o objetivo de "fazer o diagrama funcionar" ou para validar uma proposta teórica de diagrama.
> 2. **Proibição de inventar campos ou entidades:** O diagrama não deve conter classes, atributos ou métodos que não existam no código-fonte implementado.
> 3. **Reporte de divergências:** Se for identificada qualquer discrepância entre a documentação e o código real, o agente deve relatar a inconsistência ao desenvolvedor humano para aprovação formal antes de alterar os arquivos.
