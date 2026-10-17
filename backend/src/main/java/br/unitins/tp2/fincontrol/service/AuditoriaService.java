package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.RegistroAuditoria;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

// Registra quem fez cada alteração administrativa importante.
// Roda dentro da transação de quem chama: se a alteração falhar, o registro também não fica.
@ApplicationScoped
public class AuditoriaService {

    @Inject
    AuditoriaRepository repository;

    @Transactional
    public void registrar(Usuario autor, String acao, String alvo, String detalhe) {
        RegistroAuditoria registro = new RegistroAuditoria();
        registro.setAutorId(autor.getId());
        registro.setAutorEmail(autor.getEmail());
        registro.setAcao(acao);
        registro.setAlvo(cortar(alvo, 200));
        registro.setDetalhe(cortar(detalhe, 500));
        repository.persist(registro);
    }

    public static String alvo(Usuario usuario) {
        return "Usuário #" + usuario.getId() + " (" + usuario.getEmail() + ")";
    }

    public static String alvo(Empresa empresa) {
        String nome = empresa.getNomeFantasia() != null ? empresa.getNomeFantasia() : empresa.getRazaoSocial();
        return "Empresa #" + empresa.getId() + " (" + nome + ")";
    }

    private static String cortar(String texto, int max) {
        return texto == null || texto.length() <= max ? texto : texto.substring(0, max - 1) + "…";
    }
}
