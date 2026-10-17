-- V13: painel administrativo do FinControl (SUPER_ADMIN)
--
-- * empresa pode ser desativada (nenhum usuário dela entra);
-- * categorias padrão saem do código e vão para o banco (o admin gerencia);
-- * parâmetro fiscal ganha descrição, tipo de empresa, ativo e "alterado por";
-- * auditoria das alterações administrativas importantes;
-- * teto de faturamento do MEI/ME cadastrado como parâmetro (valor fiscal fora do código).

ALTER TABLE empresa ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

-- --- Categorias padrão ----------------------------------------------
CREATE TABLE categoria_padrao (
    id             BIGSERIAL   PRIMARY KEY,
    nome           VARCHAR(60) NOT NULL,
    tipo           VARCHAR(10) NOT NULL,
    cor            VARCHAR(20),
    ativo          BOOLEAN     NOT NULL DEFAULT TRUE,
    datacadastro   TIMESTAMP,
    dataalteracao  TIMESTAMP,
    CONSTRAINT ck_categoria_padrao_tipo CHECK (tipo IN ('RECEITA', 'DESPESA'))
);

CREATE UNIQUE INDEX uk_categoria_padrao_nome ON categoria_padrao (lower(nome));

-- As mesmas 6 que estavam fixas no código (UsuarioService.criarCategoriasIniciais).
INSERT INTO categoria_padrao (nome, tipo, cor, ativo, datacadastro) VALUES
    ('Alimentação', 'DESPESA', '#FF5733', TRUE, NOW()),
    ('Moradia',     'DESPESA', '#33FF57', TRUE, NOW()),
    ('Transporte',  'DESPESA', '#3357FF', TRUE, NOW()),
    ('Lazer',       'DESPESA', '#FF33A1', TRUE, NOW()),
    ('Salário',     'RECEITA', '#28A745', TRUE, NOW()),
    ('Vendas',      'RECEITA', '#FFC107', TRUE, NOW());

-- --- Parâmetros fiscais ---------------------------------------------
ALTER TABLE parametro_fiscal ADD COLUMN descricao VARCHAR(150);
ALTER TABLE parametro_fiscal ADD COLUMN tipo_empresa VARCHAR(15);
ALTER TABLE parametro_fiscal ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE parametro_fiscal ADD COLUMN alterado_por_id BIGINT;

ALTER TABLE parametro_fiscal ADD CONSTRAINT ck_parametro_fiscal_tipo_empresa
    CHECK (tipo_empresa IS NULL OR tipo_empresa IN ('MEI', 'MICROEMPRESA'));
ALTER TABLE parametro_fiscal ADD CONSTRAINT fk_parametro_fiscal_alterado_por
    FOREIGN KEY (alterado_por_id) REFERENCES usuario (id);

-- Tetos de faturamento anual (LC 123/2006), só se ainda não houver o parâmetro no período.
INSERT INTO parametro_fiscal (chave, valor, vigencia_inicio, vigencia_fim, descricao, tipo_empresa, ativo, datacadastro)
SELECT p.chave, p.valor, DATE '2026-01-01', DATE '2026-12-31', p.descricao, p.tipo_empresa, TRUE, NOW()
FROM (VALUES
    ('LIMITE_FATURAMENTO_MEI', 81000.00,  'Teto de faturamento anual do MEI', 'MEI'),
    ('LIMITE_FATURAMENTO_ME',  360000.00, 'Teto de faturamento anual da Microempresa', 'MICROEMPRESA')
) AS p(chave, valor, descricao, tipo_empresa)
WHERE NOT EXISTS (
    SELECT 1 FROM parametro_fiscal x
    WHERE x.chave = p.chave
      AND x.vigencia_inicio <= DATE '2026-12-31'
      AND x.vigencia_fim >= DATE '2026-01-01'
);

-- --- Auditoria -------------------------------------------------------
CREATE TABLE auditoria (
    id             BIGSERIAL    PRIMARY KEY,
    autor_id       BIGINT,
    autor_email    VARCHAR(254) NOT NULL,
    acao           VARCHAR(40)  NOT NULL,
    alvo           VARCHAR(200) NOT NULL,
    detalhe        VARCHAR(500),
    datacadastro   TIMESTAMP,
    dataalteracao  TIMESTAMP
);

CREATE INDEX idx_auditoria_data ON auditoria (datacadastro DESC);
