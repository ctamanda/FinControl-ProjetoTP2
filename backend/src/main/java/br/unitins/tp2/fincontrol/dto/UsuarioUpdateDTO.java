package br.unitins.tp2.fincontrol.dto;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.NotBlank;

// Edição dos próprios dados (PUT /usuarios/me). Exige a senha atual: uma sessão aberta
// esquecida num computador não basta para alterar os dados de alguém.
// "profissao" só vale para conta pessoal; nas demais é ignorada.
// Os módulos da conta pessoal mudam em PUT /usuarios/me/modulos.
public record UsuarioUpdateDTO(

        @NotBlank(message = "O nome deve ser informado.")
        @Length(max = 100, message = "O nome deve conter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O telefone deve ser informado.")
        @Telefone
        String telefone,

        @Length(max = 100, message = "A profissão deve conter no máximo 100 caracteres.")
        String profissao,

        @NotBlank(message = "Confirme a alteração com a sua senha atual.")
        String senhaAtual

) {
}
