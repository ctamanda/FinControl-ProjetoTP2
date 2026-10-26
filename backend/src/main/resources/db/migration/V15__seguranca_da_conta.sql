-- Segurança da conta:
--  - tentativas_login / bloqueado_ate: bloqueio temporário após várias senhas erradas seguidas;
--  - versao_sessao: vai no token (claim "sv"); ao trocar senha ou e-mail, ou em
--    "sair de todos os dispositivos", ela sobe e os tokens antigos deixam de valer.
ALTER TABLE usuario ADD COLUMN tentativas_login INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usuario ADD COLUMN bloqueado_ate TIMESTAMP;
ALTER TABLE usuario ADD COLUMN versao_sessao INTEGER NOT NULL DEFAULT 0;
