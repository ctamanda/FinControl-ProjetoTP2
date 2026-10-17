package br.unitins.tp2.fincontrol.dto;

import java.util.Set;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.NotBlank;

// Edição do próprio perfil (PUT /usuarios/me).
// "profissao" e "modulos" só valem para conta pessoal; nas demais são ignorados.
// "modulos" nulo mantém a escolha atual.
public record UsuarioUpdateDTO(

        @NotBlank(message = "O nome deve ser informado.")
        @Length(max = 100, message = "O nome deve conter no máximo 100 caracteres.")
        String nome,

        @NotBlank(message = "O telefone deve ser informado.")
        @Telefone
        String telefone,

        @Length(max = 100, message = "A profissão deve conter no máximo 100 caracteres.")
        String profissao,

        Set<Modulo> modulos

) {
}
