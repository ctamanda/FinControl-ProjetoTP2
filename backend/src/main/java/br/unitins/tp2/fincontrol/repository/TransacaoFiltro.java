package br.unitins.tp2.fincontrol.repository;

import java.time.YearMonth;

import br.unitins.tp2.fincontrol.model.StatusPagamento;
import br.unitins.tp2.fincontrol.model.TipoTransacao;

// Filtros da lista de lançamentos (GET /transacoes). Campos nulos não filtram.
// status PENDENTE traz tudo que não foi pago (inclusive os atrasados); ATRASADO, só os vencidos.
public record TransacaoFiltro(
        String descricao,
        TipoTransacao tipo,
        StatusPagamento status,
        YearMonth mes,
        Long idConta
) {

    // A conta a pagar/receber mais próxima de vencer vem primeiro.
    public boolean soPendentes() {
        return status == StatusPagamento.PENDENTE || status == StatusPagamento.ATRASADO;
    }
}
