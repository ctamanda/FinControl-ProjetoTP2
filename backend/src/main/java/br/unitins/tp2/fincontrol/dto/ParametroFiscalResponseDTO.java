package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.unitins.tp2.fincontrol.model.TipoEmpresa;

// "ultimaAlteracao" e "alteradoPor": quando e por quem o parâmetro foi criado ou alterado pela última vez.
public record ParametroFiscalResponseDTO(
        Long id,
        String chave,
        BigDecimal valor,
        LocalDate vigenciaInicio,
        LocalDate vigenciaFim,
        String descricao,
        TipoEmpresa tipoEmpresa,
        boolean ativo,
        LocalDateTime ultimaAlteracao,
        String alteradoPor
) {
}
