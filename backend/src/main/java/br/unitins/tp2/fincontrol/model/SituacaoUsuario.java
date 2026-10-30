package br.unitins.tp2.fincontrol.model;

// Filtros de situação da lista de usuários do admin (GET /admin/usuarios?situacao=).
public enum SituacaoUsuario {
    // Bloqueada agora por senhas erradas seguidas.
    BLOQUEADO,
    // Conta pessoal ativa cujo último acesso registrado foi há 30 dias ou mais.
    SEM_ACESSO_30_DIAS,
    // Conta pessoal ativa que nunca fez um lançamento.
    SEM_LANCAMENTO
}
