-- V16: contas financeiras, status de pagamento dos lançamentos e ícone das categorias.
--
-- * conta_financeira: onde o dinheiro está (banco, carteira...), com saldo inicial;
-- * todo lançamento passa a ter conta, "pago" e data de pagamento
--   (pendente = conta a pagar/receber; só os pagos mexem no saldo);
-- * categoria e categoria padrão ganham ícone (Material Icons).
--
-- Dados que já existem: cada conta pessoal ganha a conta "Carteira" e cada empresa a "Caixa",
-- os lançamentos antigos vão para ela e os de data futura viram pendentes (agendados).

CREATE TABLE conta_financeira (
    id             BIGSERIAL     PRIMARY KEY,
    nome           VARCHAR(60)   NOT NULL,
    tipo           VARCHAR(20)   NOT NULL,
    saldo_inicial  NUMERIC(15,2) NOT NULL DEFAULT 0,
    cor            VARCHAR(20),
    ativa          BOOLEAN       NOT NULL DEFAULT TRUE,
    usuario_id     BIGINT        NOT NULL,
    empresa_id     BIGINT,
    datacadastro   TIMESTAMP,
    dataalteracao  TIMESTAMP,
    CONSTRAINT fk_conta_financeira_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT fk_conta_financeira_empresa FOREIGN KEY (empresa_id) REFERENCES empresa (id),
    CONSTRAINT ck_conta_financeira_tipo
        CHECK (tipo IN ('CONTA_CORRENTE', 'POUPANCA', 'CARTEIRA', 'INVESTIMENTO', 'OUTRA'))
);

CREATE INDEX idx_conta_financeira_usuario ON conta_financeira (usuario_id);
CREATE INDEX idx_conta_financeira_empresa ON conta_financeira (empresa_id);

-- Conta inicial de cada empresa e de cada conta pessoal (ou de quem já tem lançamento pessoal).
INSERT INTO conta_financeira (nome, tipo, saldo_inicial, cor, ativa, usuario_id, empresa_id, datacadastro)
SELECT 'Caixa', 'CARTEIRA', 0, '#3B1478', TRUE, e.responsavel_id, e.id, NOW()
FROM empresa e;

INSERT INTO conta_financeira (nome, tipo, saldo_inicial, cor, ativa, usuario_id, empresa_id, datacadastro)
SELECT 'Carteira', 'CARTEIRA', 0, '#3B1478', TRUE, u.id, NULL, NOW()
FROM usuario u
WHERE u.role = 'PESSOAL'
   OR EXISTS (SELECT 1 FROM transacao t WHERE t.usuario_id = u.id AND t.empresa_id IS NULL);

-- --- Lançamentos: conta, pago e data de pagamento ---------------------
ALTER TABLE transacao ADD COLUMN conta_id BIGINT;

UPDATE transacao t
SET conta_id = (SELECT MIN(c.id) FROM conta_financeira c WHERE c.empresa_id = t.empresa_id)
WHERE t.empresa_id IS NOT NULL;

UPDATE transacao t
SET conta_id = (SELECT MIN(c.id) FROM conta_financeira c WHERE c.usuario_id = t.usuario_id AND c.empresa_id IS NULL)
WHERE t.empresa_id IS NULL;

ALTER TABLE transacao ALTER COLUMN conta_id SET NOT NULL;
ALTER TABLE transacao ADD CONSTRAINT fk_transacao_conta FOREIGN KEY (conta_id) REFERENCES conta_financeira (id);
CREATE INDEX idx_transacao_conta ON transacao (conta_id);

ALTER TABLE transacao ADD COLUMN pago BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE transacao ADD COLUMN data_pagamento DATE;

-- Até hoje: pago na própria data. Data futura: agendado (pendente).
UPDATE transacao SET pago = (data <= CURRENT_DATE),
                     data_pagamento = CASE WHEN data <= CURRENT_DATE THEN data END;

-- Lista de contas a pagar/receber (pendentes por vencimento).
CREATE INDEX idx_transacao_pendentes ON transacao (pago, data);

-- --- Ícone das categorias ---------------------------------------------
ALTER TABLE categoria ADD COLUMN icone VARCHAR(40);
ALTER TABLE categoria_padrao ADD COLUMN icone VARCHAR(40);

-- Ícone sugerido pelo nome (as demais ficam com o ícone padrão do tipo, escolhido na tela).
CREATE TEMPORARY TABLE icone_sugerido (prefixo VARCHAR(20), icone VARCHAR(40));
INSERT INTO icone_sugerido VALUES
    ('aliment', 'restaurant'), ('mercad', 'shopping_cart'), ('morad', 'home'), ('alugu', 'home'),
    ('transp', 'directions_car'), ('combust', 'local_gas_station'), ('lazer', 'sports_esports'),
    ('saúd', 'favorite'), ('saud', 'favorite'), ('educa', 'school'), ('deliver', 'delivery_dining'),
    ('assinat', 'subscriptions'), ('softw', 'subscriptions'), ('impost', 'account_balance'),
    ('fornec', 'local_shipping'), ('market', 'campaign'), ('roupa', 'checkroom'), ('pet', 'pets'),
    ('viage', 'flight'), ('salár', 'payments'), ('salar', 'payments'), ('vend', 'storefront'),
    ('serviç', 'handyman'), ('servic', 'handyman'), ('invest', 'trending_up'), ('freel', 'work'),
    ('outr', 'category');

UPDATE categoria c SET icone = (
    SELECT s.icone FROM icone_sugerido s WHERE lower(c.nome) LIKE s.prefixo || '%' LIMIT 1);
UPDATE categoria_padrao c SET icone = (
    SELECT s.icone FROM icone_sugerido s WHERE lower(c.nome) LIKE s.prefixo || '%' LIMIT 1);

DROP TABLE icone_sugerido;
