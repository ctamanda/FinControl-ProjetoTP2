package br.unitins.tp2.fincontrol.repository;

import br.unitins.tp2.fincontrol.model.Empresa;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmpresaRepository implements PanacheRepository<Empresa> {

    public Empresa findByCnpj(String cnpj) {
        return find("cnpj", cnpj).firstResult();
    }
}
