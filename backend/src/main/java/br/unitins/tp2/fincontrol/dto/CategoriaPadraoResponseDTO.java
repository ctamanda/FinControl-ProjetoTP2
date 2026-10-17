package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;

import br.unitins.tp2.fincontrol.model.TipoCategoria;

public record CategoriaPadraoResponseDTO(
        Long id,
        String nome,
        TipoCategoria tipo,
        String cor,
        boolean ativo,
        LocalDateTime ultimaAlteracao
) {
}
