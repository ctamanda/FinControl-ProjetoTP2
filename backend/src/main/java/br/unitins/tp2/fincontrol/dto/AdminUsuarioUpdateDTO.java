package br.unitins.tp2.fincontrol.dto;

import java.util.Set;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Edição pelo SUPER_ADMIN (PUT /admin/usuarios/{id}). E-mail, senha e empresa não mudam por aqui.
// O perfil só troca entre USUÁRIO e ADMINISTRADOR do mesmo tipo de conta:
// PESSOAL <-> SUPER_ADMIN e USUARIO_EMPRESA <-> ADMIN_EMPRESA.
public record AdminUsuarioUpdateDTO(

        @NotBlank(message = "O nome deve ser informado.")
        @Length(max = 100, message = "O nome deve conter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O telefone deve ser informado.")
        @Telefone
        String telefone,

        @Length(max = 100, message = "A profissão deve conter no máximo 100 caracteres.")
        String profissao,

        @NotNull(message = "Escolha o perfil do usuário.")
        Role role,

        Set<Modulo> modulos

) {
}
