-- V12: tipos de conta (pessoal / MEI-Microempresa), empresa, usuários da empresa e módulos liberados
--
-- Perfis novos:
--   ADMIN                      -> SUPER_ADMIN   (administração interna do FinControl)
--   USER com perfil PF         -> PESSOAL
--   USER com perfil MEI ou ME  -> ADMIN_EMPRESA (empresa pendente: cadastra no próximo login)
-- perfil_fiscal e atividade_mei saem do usuário: o tipo da empresa fica na tabela empresa.

-- --- Empresa ---------------------------------------------------------
CREATE TABLE empresa (
    id              BIGSERIAL    PRIMARY KEY,
    razao_social    VARCHAR(150) NOT NULL,
    nome_fantasia   VARCHAR(150),
    cnpj            VARCHAR(14)  NOT NULL,
    tipo            VARCHAR(15)  NOT NULL,
    telefone        VARCHAR(11)  NOT NULL,
    email           VARCHAR(254) NOT NULL,
    responsavel_id  BIGINT       NOT NULL,
    datacadastro    TIMESTAMP,
    dataalteracao   TIMESTAMP,
    CONSTRAINT uk_empresa_cnpj          UNIQUE (cnpj),
    CONSTRAINT ck_empresa_tipo          CHECK (tipo IN ('MEI', 'MICROEMPRESA')),
    CONSTRAINT fk_empresa_responsavel   FOREIGN KEY (responsavel_id) REFERENCES usuario (id)
);

-- --- Usuário ---------------------------------------------------------
ALTER TABLE usuario ADD COLUMN telefone   VARCHAR(11);
ALTER TABLE usuario ADD COLUMN whatsapp   VARCHAR(11);
ALTER TABLE usuario ADD COLUMN profissao  VARCHAR(100);
ALTER TABLE usuario ADD COLUMN ativo      BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE usuario ADD COLUMN empresa_id BIGINT;

ALTER TABLE usuario ADD CONSTRAINT fk_usuario_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresa (id);
CREATE INDEX idx_usuario_empresa ON usuario (empresa_id);

ALTER TABLE usuario ALTER COLUMN role TYPE VARCHAR(20);

UPDATE usuario SET role = CASE
    WHEN role = 'ADMIN' THEN 'SUPER_ADMIN'
    WHEN perfil_fiscal IN ('MEI', 'ME') THEN 'ADMIN_EMPRESA'
    ELSE 'PESSOAL'
END;

ALTER TABLE usuario ADD CONSTRAINT ck_usuario_role
    CHECK (role IN ('SUPER_ADMIN', 'PESSOAL', 'ADMIN_EMPRESA', 'USUARIO_EMPRESA'));

ALTER TABLE usuario DROP COLUMN perfil_fiscal;
ALTER TABLE usuario DROP COLUMN atividade_mei;

-- --- Módulos liberados por usuário ----------------------------------
CREATE TABLE usuario_modulo (
    usuario_id BIGINT      NOT NULL,
    modulo     VARCHAR(20) NOT NULL,
    CONSTRAINT pk_usuario_modulo PRIMARY KEY (usuario_id, modulo),
    CONSTRAINT fk_usuario_modulo_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
);

-- Contas pessoais existentes ficam com todos os módulos pessoais (mesmo padrão do cadastro).
INSERT INTO usuario_modulo (usuario_id, modulo)
SELECT u.id, m.modulo
FROM usuario u
CROSS JOIN (VALUES
    ('DASHBOARD'), ('CONTAS'), ('RECEITAS'), ('DESPESAS'), ('LANCAMENTOS'), ('RECORRENTES'),
    ('CARTOES'), ('CATEGORIAS'), ('TAGS'), ('ORCAMENTOS'), ('RELATORIOS'), ('IMPORTACAO'), ('EXPORTACAO')
) AS m(modulo)
WHERE u.role = 'PESSOAL';

-- --- Dados financeiros da empresa -----------------------------------
-- empresa_id preenchido = dado da empresa (compartilhado); nulo = dado da conta pessoal.
ALTER TABLE categoria ADD COLUMN empresa_id BIGINT;
ALTER TABLE categoria ADD CONSTRAINT fk_categoria_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresa (id);
CREATE INDEX idx_categoria_empresa ON categoria (empresa_id);

ALTER TABLE transacao ADD COLUMN empresa_id BIGINT;
ALTER TABLE transacao ADD CONSTRAINT fk_transacao_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresa (id);
CREATE INDEX idx_transacao_empresa ON transacao (empresa_id);
