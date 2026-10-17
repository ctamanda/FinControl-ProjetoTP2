package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;

public record AuditoriaResponseDTO(
        Long id,
        LocalDateTime dataHora,
        Long autorId,
        String autorEmail,
        String acao,
        String alvo,
        String detalhe
) {
}
