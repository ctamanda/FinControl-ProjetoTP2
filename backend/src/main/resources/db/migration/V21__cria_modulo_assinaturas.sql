-- V21: Módulo de Assinaturas (Fase 1) - Tabelas plano e assinatura com seed dos planos Free e Pro
--
-- * plano: define os planos disponíveis no FinControl, valores e limites operacionais;
-- * assinatura: associa o usuário ao seu plano contratado, com vigência e status;
-- * seed: planos Free (R$ 0,00 com limites) e Pro (R$ 29,90 ilimitado).

CREATE TABLE plano (
    id                     BIGSERIAL     PRIMARY KEY,
    nome                   VARCHAR(50)   NOT NULL,
    descricao              VARCHAR(255),
    valor_mensal           NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    limite_contas          INTEGER,
    limite_transacoes_mes  INTEGER,
    ativo                  BOOLEAN       NOT NULL DEFAULT TRUE,
    datacadastro           TIMESTAMP,
    dataalteracao          TIMESTAMP
);

CREATE UNIQUE INDEX uk_plano_nome ON plano (lower(nome));

CREATE TABLE assinatura (
    id             BIGSERIAL    PRIMARY KEY,
    usuario_id     BIGINT       NOT NULL,
    plano_id       BIGINT       NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ATIVA',
    data_inicio    DATE         NOT NULL DEFAULT CURRENT_DATE,
    data_fim       DATE,
    datacadastro   TIMESTAMP,
    dataalteracao  TIMESTAMP,
    CONSTRAINT fk_assinatura_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id),
    CONSTRAINT fk_assinatura_plano   FOREIGN KEY (plano_id)   REFERENCES plano (id),
    CONSTRAINT ck_assinatura_status  CHECK (status IN ('ATIVA', 'CANCELADA', 'PENDENTE', 'EXPIRADA'))
);

CREATE INDEX idx_assinatura_usuario ON assinatura (usuario_id);
CREATE INDEX idx_assinatura_plano   ON assinatura (plano_id);

-- Seed dos planos iniciais (Free e Pro)
INSERT INTO plano (nome, descricao, valor_mensal, limite_contas, limite_transacoes_mes, ativo, datacadastro)
VALUES 
    ('Free', 'Plano básico gratuito com limites de contas e lançamentos mensais', 0.00, 2, 50, TRUE, NOW()),
    ('Pro',  'Plano profissional completo com contas e lançamentos ilimitados', 29.90, NULL, NULL, TRUE, NOW());
