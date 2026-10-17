package br.unitins.tp2.fincontrol.dto;

import java.util.Set;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Edição de um usuário da empresa pelo admin (PUT /empresa/usuarios/{id}).
// E-mail e senha não mudam por aqui; ativar/desativar tem rota própria.
public record UsuarioEmpresaUpdateDTO(

        @NotBlank(message = "O nome deve ser informado.")
        @Length(max = 100, message = "O nome deve conter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O telefone deve ser informado.")
        @Telefone
        String telefone,

        @NotNull(message = "Escolha o perfil: ADMIN_EMPRESA ou USUARIO_EMPRESA.")
        Role role,

        Set<Modulo> modulos

) {
}
