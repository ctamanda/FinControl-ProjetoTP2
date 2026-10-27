package br.unitins.tp2.fincontrol.model;

import java.time.LocalDateTime;
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

    // Módulos escolhidos pela conta pessoal.
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "usuario_modulo", joinColumns = @JoinColumn(name = "usuario_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "modulo", length = 20, nullable = false)
    private Set<Modulo> modulos = new HashSet<>();

    // Senhas erradas seguidas (login ou confirmação de senha); zera ao acertar.
    @Column(name = "tentativas_login", nullable = false)
    private int tentativasLogin;

    // Bloqueio temporário depois de muitas tentativas erradas.
    @Column(name = "bloqueado_ate")
    private LocalDateTime bloqueadoAte;

    // Vai no token (claim "sv"). Sobe ao trocar senha/e-mail ou em "sair de todos os dispositivos":
    // tokens com a versão antiga deixam de valer.
    @Column(name = "versao_sessao", nullable = false)
    private int versaoSessao;

    // Último login com sucesso (o painel do admin mostra; a renovação do token não conta).
    @Column(name = "ultimo_acesso")
    private LocalDateTime ultimoAcesso;

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

    public Set<Modulo> getModulos() {
        return modulos;
    }

    public void setModulos(Set<Modulo> modulos) {
        this.modulos = modulos;
    }

    public int getTentativasLogin() {
        return tentativasLogin;
    }

    public void setTentativasLogin(int tentativasLogin) {
        this.tentativasLogin = tentativasLogin;
    }

    public LocalDateTime getBloqueadoAte() {
        return bloqueadoAte;
    }

    public void setBloqueadoAte(LocalDateTime bloqueadoAte) {
        this.bloqueadoAte = bloqueadoAte;
    }

    public int getVersaoSessao() {
        return versaoSessao;
    }

    public void setVersaoSessao(int versaoSessao) {
        this.versaoSessao = versaoSessao;
    }

    public LocalDateTime getUltimoAcesso() {
        return ultimoAcesso;
    }

    public void setUltimoAcesso(LocalDateTime ultimoAcesso) {
        this.ultimoAcesso = ultimoAcesso;
    }
}
