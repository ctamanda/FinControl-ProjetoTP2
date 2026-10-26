package br.unitins.tp2.fincontrol.dto;

import java.util.Set;

import br.unitins.tp2.fincontrol.model.Modulo;
import jakarta.validation.constraints.NotNull;

// Funcionalidades escolhidas pela conta pessoal (PUT /usuarios/me/modulos).
public record ModulosUpdateDTO(

        @NotNull(message = "Informe os módulos.")
        Set<Modulo> modulos

) {
}
