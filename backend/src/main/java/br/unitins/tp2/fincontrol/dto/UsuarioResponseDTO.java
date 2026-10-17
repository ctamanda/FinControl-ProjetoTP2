package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;
import java.util.Set;

import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Modulo;

// "modulos" são os módulos que o usuário pode usar de fato (já considerando o perfil).
// "empresaPendente" = ADMIN_EMPRESA que ainda não cadastrou a empresa.
public record UsuarioResponseDTO(
        Long id,
        String email,
        String nome,
        String telefone,
        String profissao,
        Role role,
        boolean ativo,
        Set<Modulo> modulos,
        EmpresaResumoDTO empresa,
        boolean empresaPendente,
        LocalDateTime dataCadastro
) {
}
