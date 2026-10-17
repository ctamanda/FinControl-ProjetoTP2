package br.unitins.tp2.fincontrol.repository;

import java.util.List;

import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CategoriaRepository implements PanacheRepository<Categoria> {

    public List<Categoria> findByDono(Usuario usuario) {
        return find(Dono.filtro(usuario) + " order by nome", Dono.parametros(usuario)).list();
    }

    public Categoria findByDonoAndId(Usuario usuario, Long id) {
        return find(Dono.filtro(usuario) + " and id = :id",
                Dono.parametros(usuario).and("id", id)).firstResult();
    }

    public Categoria findByDonoAndNome(Usuario usuario, String nome) {
        return find(Dono.filtro(usuario) + " and lower(nome) = lower(:nome)",
                Dono.parametros(usuario).and("nome", nome)).firstResult();
    }

    public long countByDono(Usuario usuario) {
        return count(Dono.filtro(usuario), Dono.parametros(usuario));
    }
}
