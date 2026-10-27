package br.unitins.tp2.fincontrol.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

// Conta onde o dinheiro está (banco, poupança, carteira...). O saldo atual é calculado:
// saldo inicial + receitas pagas - despesas pagas lançadas nela.
// Mesmo dono das categorias e transações: o usuário.
@Entity
@Table(name = "conta_financeira")
public class ContaFinanceira extends DefaultEntity {

    @Column(length = 60, nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TipoContaFinanceira tipo;

    @Column(name = "saldo_inicial", precision = 15, scale = 2, nullable = false)
    private BigDecimal saldoInicial = BigDecimal.ZERO;

    @Column(length = 20)
    private String cor;

    // Conta arquivada: some das escolhas, mas os lançamentos antigos continuam nela.
    @Column(nullable = false)
    private boolean ativa = true;

    // Quem criou (e, na conta pessoal, o dono).
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoContaFinanceira getTipo() {
        return tipo;
    }

    public void setTipo(TipoContaFinanceira tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getSaldoInicial() {
        return saldoInicial;
    }

    public void setSaldoInicial(BigDecimal saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
