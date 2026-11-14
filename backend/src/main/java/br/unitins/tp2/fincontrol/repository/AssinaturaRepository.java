package br.unitins.tp2.fincontrol.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import br.unitins.tp2.fincontrol.model.Assinatura;

@ApplicationScoped
public class AssinaturaRepository implements PanacheRepositoryBase<Assinatura, Long> {
    // Additional query methods can be added as needed.
}
