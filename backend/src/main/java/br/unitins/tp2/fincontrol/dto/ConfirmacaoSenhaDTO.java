package br.unitins.tp2.fincontrol.dto;

import jakarta.validation.constraints.NotBlank;

// Só a senha atual, para confirmar uma ação sensível (ex.: encerrar as outras sessões).
public record ConfirmacaoSenhaDTO(

        @NotBlank(message = "Confirme com a sua senha atual.")
        String senhaAtual

) {
}
