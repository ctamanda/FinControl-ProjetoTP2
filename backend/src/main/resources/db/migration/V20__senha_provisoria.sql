-- V20: senha provisória gerada pelo administrador.
-- Enquanto trocar_senha for verdadeiro, a pessoa só consegue ver o próprio perfil e trocar a senha.
ALTER TABLE usuario ADD COLUMN trocar_senha BOOLEAN NOT NULL DEFAULT FALSE;
