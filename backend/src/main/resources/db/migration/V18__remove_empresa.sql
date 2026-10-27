-- V18: o FinControl passa a ser só de finanças pessoais. Saem a empresa (MEI/ME),
-- os perfis ADMIN_EMPRESA e USUARIO_EMPRESA e o escopo dos lançamentos.
--
-- O que acontece com os dados que já existem:
--   * todo ADMIN_EMPRESA e USUARIO_EMPRESA vira PESSOAL (ativo como estava), com todos os módulos;
--   * categorias, contas financeiras e lançamentos da empresa passam para o responsável dela
--     (inclusive o que os colaboradores lançaram), e nada é apagado;
--   * categoria da empresa com o mesmo nome de uma categoria que o responsável já tinha:
--     se for do mesmo tipo, os lançamentos vão para a dele e a repetida sai; se não, ganha " (empresa)";
--   * quem ficar sem categorias ou sem conta (colaboradores e admin com empresa pendente)
--     recebe as categorias padrão ativas e a conta "Carteira", como num cadastro novo;
--   * o histórico da auditoria fica como está (é imutável).

-- --- 1. Dono de cada empresa -----------------------------------------
CREATE TEMPORARY TABLE dono_empresa AS
SELECT e.id AS empresa_id, e.responsavel_id AS usuario_id FROM empresa e;

-- --- 2. Categorias repetidas com as do responsável ---------------------
CREATE TEMPORARY TABLE categoria_repetida AS
SELECT c.id AS id_empresa, p.id AS id_pessoal, (c.tipo = p.tipo) AS mesmo_tipo
FROM categoria c
JOIN dono_empresa d ON d.empresa_id = c.empresa_id
JOIN categoria p ON p.usuario_id = d.usuario_id AND p.empresa_id IS NULL AND p.nome = c.nome;

UPDATE transacao t SET id_categoria = r.id_pessoal
FROM categoria_repetida r
WHERE r.mesmo_tipo AND t.id_categoria = r.id_empresa;

DELETE FROM categoria c USING categoria_repetida r WHERE r.mesmo_tipo AND c.id = r.id_empresa;

UPDATE categoria c SET nome = LEFT(c.nome, 50) || ' (empresa)'
FROM categoria_repetida r
WHERE NOT r.mesmo_tipo AND c.id = r.id_empresa;

-- --- 3. Dados da empresa passam para o responsável ---------------------
UPDATE categoria c SET usuario_id = d.usuario_id FROM dono_empresa d WHERE c.empresa_id = d.empresa_id;
UPDATE conta_financeira c SET usuario_id = d.usuario_id FROM dono_empresa d WHERE c.empresa_id = d.empresa_id;
UPDATE transacao t SET usuario_id = d.usuario_id FROM dono_empresa d WHERE t.empresa_id = d.empresa_id;

-- --- 4. Perfis e módulos ------------------------------------------------
CREATE TEMPORARY TABLE usuario_convertido AS
SELECT id FROM usuario WHERE role IN ('ADMIN_EMPRESA', 'USUARIO_EMPRESA');

DELETE FROM usuario_modulo WHERE modulo IN ('CLIENTES', 'FORNECEDORES', 'USUARIOS');
DELETE FROM usuario_modulo m USING usuario_convertido u WHERE m.usuario_id = u.id;

INSERT INTO usuario_modulo (usuario_id, modulo)
SELECT u.id, m.modulo
FROM usuario_convertido u
CROSS JOIN (VALUES
    ('DASHBOARD'), ('CONTAS'), ('RECEITAS'), ('DESPESAS'), ('LANCAMENTOS'), ('RECORRENTES'),
    ('CARTOES'), ('CATEGORIAS'), ('TAGS'), ('ORCAMENTOS'), ('RELATORIOS'), ('IMPORTACAO'), ('EXPORTACAO')
) AS m(modulo);

ALTER TABLE usuario DROP CONSTRAINT ck_usuario_role;
UPDATE usuario SET role = 'PESSOAL' WHERE id IN (SELECT id FROM usuario_convertido);
ALTER TABLE usuario ADD CONSTRAINT ck_usuario_role CHECK (role IN ('SUPER_ADMIN', 'PESSOAL'));

-- --- 5. Quem ficou sem dados iniciais -----------------------------------
INSERT INTO categoria (nome, tipo, cor, icone, usuario_id, datacadastro)
SELECT p.nome, p.tipo, p.cor, p.icone, u.id, NOW()
FROM usuario_convertido u
CROSS JOIN categoria_padrao p
WHERE p.ativo
  AND NOT EXISTS (SELECT 1 FROM categoria c WHERE c.usuario_id = u.id);

INSERT INTO conta_financeira (nome, tipo, saldo_inicial, cor, ativa, usuario_id, datacadastro)
SELECT 'Carteira', 'CARTEIRA', 0, '#3B1478', TRUE, u.id, NOW()
FROM usuario_convertido u
WHERE NOT EXISTS (SELECT 1 FROM conta_financeira c WHERE c.usuario_id = u.id);

-- --- 6. Estrutura de empresa sai ----------------------------------------
-- (DROP COLUMN leva junto as chaves estrangeiras e os índices da coluna.)
ALTER TABLE transacao DROP COLUMN empresa_id;
ALTER TABLE transacao DROP COLUMN escopo;
ALTER TABLE categoria DROP COLUMN empresa_id;
ALTER TABLE conta_financeira DROP COLUMN empresa_id;
ALTER TABLE usuario DROP COLUMN empresa_id;
DROP TABLE empresa;

DROP TABLE dono_empresa;
DROP TABLE categoria_repetida;
DROP TABLE usuario_convertido;
