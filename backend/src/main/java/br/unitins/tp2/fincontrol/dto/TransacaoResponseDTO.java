package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.StatusPagamento;
import br.unitins.tp2.fincontrol.model.TipoTransacao;

public record TransacaoResponseDTO(
    Long id,
    String descricao,
    BigDecimal valor,
    LocalDate data,
    TipoTransacao tipo,
    Escopo escopo,
    CategoriaResponseDTO categoria,
    PessoaDTO usuario, // quem lançou (na empresa, pode ser outro usuário da equipe)
    ContaResumoDTO conta,
    boolean pago,
    LocalDate dataPagamento,
    StatusPagamento status
) {
}
