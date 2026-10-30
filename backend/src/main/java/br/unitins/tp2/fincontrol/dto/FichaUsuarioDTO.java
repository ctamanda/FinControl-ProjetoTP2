package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;

import br.unitins.tp2.fincontrol.model.Role;

// Ficha do usuário para o admin (GET /admin/usuarios/{id}/ficha): cadastro, acesso e
// quantidades. Não traz valores, saldos nem descrições de lançamentos.
//  - bloqueadoAte: preenchido só enquanto a conta está bloqueada por senhas erradas;
//  - tentativasErradas: senhas erradas seguidas desde o último acerto;
//  - trocarSenha: tem senha provisória e ainda não trocou.
public record FichaUsuarioDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        String profissao,
        Role role,
        boolean ativo,
        LocalDateTime dataCadastro,
        LocalDateTime ultimoAcesso,
        LocalDateTime bloqueadoAte,
        int tentativasErradas,
        boolean trocarSenha,
        long lancamentos,
        long contas,
        long categorias
) {
}
