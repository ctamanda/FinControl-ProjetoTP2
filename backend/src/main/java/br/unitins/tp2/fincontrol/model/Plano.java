package br.unitins.tp2.fincontrol.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

// Plano de assinatura oferecido no FinControl (ex.: Free, Pro), com valor e limites operacionais.
@Entity
@Table(name = "plano")
public class Plano extends DefaultEntity {

    @Column(length = 50, nullable = false, unique = true)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Column(name = "valor_mensal", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorMensal = BigDecimal.ZERO;

    @Column(name = "limite_contas")
    private Integer limiteContas;

    @Column(name = "limite_transacoes_mes")
    private Integer limiteTransacoesMes;

    @Column(nullable = false)
    private boolean ativo = true;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValorMensal() {
        return valorMensal;
    }

    public void setValorMensal(BigDecimal valorMensal) {
        this.valorMensal = valorMensal;
    }

    public Integer getLimiteContas() {
        return limiteContas;
    }

    public void setLimiteContas(Integer limiteContas) {
        this.limiteContas = limiteContas;
    }

    public Integer getLimiteTransacoesMes() {
        return limiteTransacoesMes;
    }

    public void setLimiteTransacoesMes(Integer limiteTransacoesMes) {
        this.limiteTransacoesMes = limiteTransacoesMes;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
