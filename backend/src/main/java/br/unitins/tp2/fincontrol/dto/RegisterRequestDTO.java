package br.unitins.tp2.fincontrol.dto;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.TipoConta;
import br.unitins.tp2.fincontrol.validation.SenhaForte;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Cadastro inicial. PESSOAL informa a profissão; EMPRESA cadastra o responsável
// e depois a empresa (POST /empresa), antes de poder usar o sistema.
public record RegisterRequestDTO(

    @NotNull(message = "Escolha o tipo de conta: PESSOAL ou EMPRESA.")
    TipoConta tipoConta,

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

    @AssertTrue(message = "A profissão deve ser informada na conta pessoal.")
    public boolean isProfissaoInformada() {
        return tipoConta != TipoConta.PESSOAL || (profissao != null && !profissao.isBlank());
    }
}
