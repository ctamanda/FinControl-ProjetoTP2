package br.unitins.tp2.fincontrol.repository;

import java.util.List;

import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ContaFinanceiraRepository implements PanacheRepository<ContaFinanceira> {

    // Ativas primeiro; a mais antiga ativa é a conta padrão dos lançamentos.
    public List<ContaFinanceira> findByDono(Usuario usuario, boolean incluirInativas) {
        return find(Dono.filtro(usuario) + (incluirInativas ? "" : " and ativa = true")
                + " order by ativa desc, id", Dono.parametros(usuario)).list();
    }

    public ContaFinanceira findByDonoAndId(Usuario usuario, Long id) {
        return find(Dono.filtro(usuario) + " and id = :id", Dono.parametros(usuario).and("id", id)).firstResult();
    }

    public ContaFinanceira findByDonoAndNome(Usuario usuario, String nome) {
        return find(Dono.filtro(usuario) + " and lower(nome) = lower(:nome)",
                Dono.parametros(usuario).and("nome", nome)).firstResult();
    }

    public ContaFinanceira findPadrao(Usuario usuario) {
        return find(Dono.filtro(usuario) + " and ativa = true order by id", Dono.parametros(usuario)).firstResult();
    }

    public long countAtivas(Usuario usuario) {
        return count(Dono.filtro(usuario) + " and ativa = true", Dono.parametros(usuario));
    }
}
