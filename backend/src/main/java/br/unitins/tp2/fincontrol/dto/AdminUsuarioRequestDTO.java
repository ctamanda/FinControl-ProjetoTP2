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

// SUPER_ADMIN cadastrando qualquer tipo de usuário (POST /admin/usuarios).
//  - SUPER_ADMIN e PESSOAL: sem empresa (PESSOAL exige profissão);
//  - USUARIO_EMPRESA: exige idEmpresa;
//  - ADMIN_EMPRESA: com idEmpresa entra numa empresa existente; sem, fica com a empresa pendente.
public record AdminUsuarioRequestDTO(

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

        @Length(max = 100, message = "A profissão deve conter no máximo 100 caracteres.")
        String profissao,

        @NotNull(message = "Escolha o perfil do usuário.")
        Role role,

        Long idEmpresa,

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
