package br.unitins.tp2.fincontrol.dto;

import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;

// Conta dentro de um lançamento.
public record ContaResumoDTO(Long id, String nome, TipoContaFinanceira tipo, String cor) {
}
