package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDate;

// "Marcar como pago" (PATCH /transacoes/{id}/pagar). Os dois campos são opcionais:
// sem data, vale hoje; sem conta, fica a conta que já estava no lançamento.
public record PagamentoRequestDTO(LocalDate dataPagamento, Long idConta) {
}
