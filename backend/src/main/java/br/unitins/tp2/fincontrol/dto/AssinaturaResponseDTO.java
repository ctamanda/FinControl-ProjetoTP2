package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDate;

public record AssinaturaResponseDTO(
    Long id,
    PlanoResponseDTO plano,
    String status,
    LocalDate dataInicio,
    LocalDate dataFim
) {}
