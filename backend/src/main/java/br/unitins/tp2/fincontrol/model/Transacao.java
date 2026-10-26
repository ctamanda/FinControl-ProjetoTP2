package br.unitins.tp2.fincontrol.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Transacao extends DefaultEntity {

    @Column(length = 150, nullable = false)
    private String descricao;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal valor;

    // Data do lançamento; quando ainda não foi pago, é o vencimento.
    @Column(nullable = false)
    private LocalDate data;

    // false = conta a pagar/receber (pendente). Só lançamentos pagos mexem no saldo da conta.
    @Column(nullable = false)
    private boolean pago = true;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @ManyToOne(optional = false)
    @JoinColumn(name = "conta_id", nullable = false)
    private ContaFinanceira conta;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private TipoTransacao tipo;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private Escopo escopo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Preenchida quando a transação é da empresa; nula numa conta pessoal.
    // Nesse caso "usuario" é quem lançou.
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public TipoTransacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoTransacao tipo) {
        this.tipo = tipo;
    }

    public Escopo getEscopo() {
        return escopo;
    }

    public void setEscopo(Escopo escopo) {
        this.escopo = escopo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public boolean isPago() {
        return pago;
    }

    public void setPago(boolean pago) {
        this.pago = pago;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public ContaFinanceira getConta() {
        return conta;
    }

    public void setConta(ContaFinanceira conta) {
        this.conta = conta;
    }

    // Pendente com o vencimento já passado = atrasado.
    public StatusPagamento getStatus() {
        if (pago) {
            return StatusPagamento.PAGO;
        }
        return data.isBefore(LocalDate.now()) ? StatusPagamento.ATRASADO : StatusPagamento.PENDENTE;
    }
}
