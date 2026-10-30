package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;
import java.util.Set;

import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Modulo;

// "modulos" são os módulos que o usuário pode usar de fato (já considerando o perfil).
// "bloqueadoAte" só vem preenchido enquanto a conta está bloqueada por senhas erradas;
// "trocarSenha" indica senha provisória ainda não trocada.
public record UsuarioResponseDTO(
        Long id,
        String email,
        String nome,
        String telefone,
        String profissao,
        Role role,
        boolean ativo,
        Set<Modulo> modulos,
        LocalDateTime dataCadastro,
        LocalDateTime ultimoAcesso,
        LocalDateTime bloqueadoAte,
        boolean trocarSenha
) {
}
