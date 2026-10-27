-- V19: data e hora do último login de cada usuário (coluna "Último acesso" do painel do admin).
-- Quem ainda não entrou depois desta versão fica sem valor.
ALTER TABLE usuario ADD COLUMN ultimo_acesso TIMESTAMP;
