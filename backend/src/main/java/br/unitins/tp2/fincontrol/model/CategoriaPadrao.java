package br.unitins.tp2.fincontrol.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

// Modelo de categoria que toda conta pessoal e toda empresa nova recebe.
// Administrada pelo SUPER_ADMIN; só as ativas são copiadas para as contas novas.
@Entity
@Table(name = "categoria_padrao")
public class CategoriaPadrao extends DefaultEntity {

    @Column(length = 60, nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private TipoCategoria tipo;

    @Column(length = 20)
    private String cor;

    @Column(nullable = false)
    private boolean ativo = true;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public TipoCategoria getTipo() {
        return tipo;
    }

    public void setTipo(TipoCategoria tipo) {
        this.tipo = tipo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
