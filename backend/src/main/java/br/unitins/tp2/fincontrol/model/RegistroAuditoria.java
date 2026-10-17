package br.unitins.tp2.fincontrol.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

// Quem fez qual alteração administrativa importante, em quê e quando (dataCadastro).
// Autor gravado como id + e-mail, sem chave estrangeira: o registro continua
// legível mesmo que o usuário seja excluído depois.
@Entity
@Table(name = "auditoria")
public class RegistroAuditoria extends DefaultEntity {

    @Column(name = "autor_id")
    private Long autorId;

    @Column(name = "autor_email", length = 254, nullable = false)
    private String autorEmail;

    @Column(length = 40, nullable = false)
    private String acao;

    // Ex.: "Usuário #12 (ana@x.com)", "Empresa #3 (Doces da Joana)".
    @Column(length = 200, nullable = false)
    private String alvo;

    @Column(length = 500)
    private String detalhe;

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public String getAutorEmail() {
        return autorEmail;
    }

    public void setAutorEmail(String autorEmail) {
        this.autorEmail = autorEmail;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public String getAlvo() {
        return alvo;
    }

    public void setAlvo(String alvo) {
        this.alvo = alvo;
    }

    public String getDetalhe() {
        return detalhe;
    }

    public void setDetalhe(String detalhe) {
        this.detalhe = detalhe;
    }
}
