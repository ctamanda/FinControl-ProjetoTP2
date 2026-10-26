package br.unitins.tp2.fincontrol.dto;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Troca do e-mail de acesso (PUT /usuarios/me/email).
public record EmailUpdateDTO(

        @NotBlank(message = "Informe o novo e-mail.")
        @Email(message = "Informe um endereço de e-mail válido.")
        @Length(max = 254, message = "O e-mail deve conter no máximo 254 caracteres.")
        String novoEmail,

        @NotBlank(message = "Confirme a alteração com a sua senha atual.")
        String senhaAtual

) {
}
