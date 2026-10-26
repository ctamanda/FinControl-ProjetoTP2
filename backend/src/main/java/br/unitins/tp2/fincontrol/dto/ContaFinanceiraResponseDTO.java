package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;

import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;

// Saldos calculados no mês pedido (GET /contas?mes=yyyy-MM):
//  saldoAtual    = saldo inicial + receitas pagas - despesas pagas (todas as datas);
//  receitasMes / despesasMes = lançamentos do mês (pagos ou não);
//  saldoPrevisto = saldo atual + pendentes que vencem até o fim do mês.
public record ContaFinanceiraResponseDTO(
        Long id,
        String nome,
        TipoContaFinanceira tipo,
        String cor,
        boolean ativa,
        BigDecimal saldoInicial,
        BigDecimal saldoAtual,
        BigDecimal receitasMes,
        BigDecimal despesasMes,
        BigDecimal saldoPrevisto,
        long totalLancamentos
) {
}
