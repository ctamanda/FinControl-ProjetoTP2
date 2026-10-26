package br.unitins.tp2.fincontrol.model;

// Onde o dinheiro está. Cartão de crédito não entra aqui: ele terá fatura própria.
public enum TipoContaFinanceira {
    CONTA_CORRENTE,
    POUPANCA,
    CARTEIRA,
    INVESTIMENTO,
    OUTRA
}
