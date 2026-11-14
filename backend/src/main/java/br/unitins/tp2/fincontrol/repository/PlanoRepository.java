package br.unitins.tp2.fincontrol.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import br.unitins.tp2.fincontrol.model.Plano;

@ApplicationScoped
public class PlanoRepository implements PanacheRepositoryBase<Plano, Long> {
    // No additional methods needed; Panache provides basic CRUD.
}
