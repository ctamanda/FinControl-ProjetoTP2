package br.unitins.tp2.fincontrol.repository;

import java.util.List;

import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CategoriaPadraoRepository implements PanacheRepository<CategoriaPadrao> {

    public List<CategoriaPadrao> listarTodas() {
        return find("order by tipo, nome").list();
    }

    public List<CategoriaPadrao> listarAtivas() {
        return find("ativo = true order by tipo, nome").list();
    }

    public CategoriaPadrao findByNome(String nome) {
        return find("lower(nome) = lower(?1)", nome).firstResult();
    }
}
