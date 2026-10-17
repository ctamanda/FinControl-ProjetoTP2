package br.unitins.tp2.fincontrol.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Usuario extends DefaultEntity {

    @Column(name = "email", length = 254, nullable = false, unique = true)
    private String email;

    @Column(name = "nome", length = 100, nullable = false)
    private String nome;

    @Column(name = "password", length = 100, nullable = false)
    private String password;

    // Telefone: só dígitos (DDD + número).
    @Column(length = 11)
    private String telefone;

    // Só para contas pessoais.
    @Column(length = 100)
    private String profissao;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20, nullable = false)
    private Role role;

    // Desativado não entra nem usa token antigo, mas o cadastro e o histórico continuam.
    @Column(nullable = false)
    private boolean ativo = true;

    // Empresa do usuário (ADMIN_EMPRESA e USUARIO_EMPRESA).
    // ADMIN_EMPRESA sem empresa = cadastro da empresa pendente.
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    // Módulos escolhidos (conta pessoal) ou liberados pelo admin (usuário da empresa).
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_modulo", joinColumns = @JoinColumn(name = "usuario_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "modulo", length = 20, nullable = false)
    private Set<Modulo> modulos = new HashSet<>();

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Set<Modulo> getModulos() {
        return modulos;
    }

    public void setModulos(Set<Modulo> modulos) {
        this.modulos = modulos;
    }
}
