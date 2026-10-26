package br.unitins.tp2.fincontrol.dto;

import br.unitins.tp2.fincontrol.validation.SenhaForte;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

// Troca da própria senha (PUT /usuarios/me/senha).
public record SenhaUpdateDTO(

        @NotBlank(message = "Informe a senha atual.")
        String senhaAtual,

        @SenhaForte
        String novaSenha,

        @NotBlank(message = "A confirmação da senha deve ser informada.")
        String confirmacaoSenha

) {

    @AssertTrue(message = "A confirmação da senha deve ser igual à nova senha.")
    public boolean isSenhaConfirmada() {
        return novaSenha == null || confirmacaoSenha == null || novaSenha.equals(confirmacaoSenha);
    }
}
