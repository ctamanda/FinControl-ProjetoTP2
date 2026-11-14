package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;

public record MetricasSaasResponseDTO(
    BigDecimal mrr,
    double taxaConversao,
    long churn,
    long totalUsuariosPro,
    long totalUsuariosFree
) {}
