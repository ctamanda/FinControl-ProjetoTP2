package br.unitins.tp2.fincontrol.dto;

import java.util.Set;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.validation.SenhaForte;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Admin da empresa cadastrando outro usuário (POST /empresa/usuarios).
// A senha inicial segue as mesmas regras do cadastro.
public record UsuarioEmpresaRequestDTO(

        @NotBlank(message = "O nome deve ser informado.")
        @Length(max = 100, message = "O nome deve conter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O e-mail deve ser informado.")
        @Email(message = "Informe um endereço de e-mail válido.")
        @Length(max = 254, message = "O e-mail deve conter no máximo 254 caracteres.")
        String email,

        @NotBlank(message = "O telefone deve ser informado.")
        @Telefone
        String telefone,

        @NotNull(message = "Escolha o perfil: ADMIN_EMPRESA ou USUARIO_EMPRESA.")
        Role role,

        Set<Modulo> modulos,

        @SenhaForte
        String password,

        @NotBlank(message = "A confirmação da senha deve ser informada.")
        String confirmPassword

) {

    @AssertTrue(message = "A confirmação da senha deve ser igual à senha.")
    public boolean isSenhaConfirmada() {
        if (password == null || confirmPassword == null) {
            return true;
        }

        return password.equals(confirmPassword);
    }
}
