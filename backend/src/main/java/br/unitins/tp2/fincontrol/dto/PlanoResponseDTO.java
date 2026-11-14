package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;

public record PlanoResponseDTO(
    Long id,
    String nome,
    String descricao,
    BigDecimal valorMensal,
    Integer limiteContas,
    Integer limiteTransacoesMes,
    boolean ativo
) {}
