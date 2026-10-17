package br.unitins.tp2.fincontrol.repository;

import java.util.Set;

import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TransacaoRepository implements PanacheRepository<Transacao> {

    // "tipos": só os tipos que o usuário pode ver (ver Permissoes.tiposVisiveis).
    public PanacheQuery<Transacao> findByDono(Usuario usuario, Set<TipoTransacao> tipos) {
        return find(Dono.filtro(usuario) + " and tipo in :tipos order by data desc, id desc",
                Dono.parametros(usuario).and("tipos", tipos));
    }

    public PanacheQuery<Transacao> findByDonoAndDescricao(Usuario usuario, Set<TipoTransacao> tipos,
            String descricao) {
        return find(Dono.filtro(usuario)
                + " and tipo in :tipos and lower(descricao) like lower(:descricao) order by data desc, id desc",
                Dono.parametros(usuario).and("tipos", tipos).and("descricao", "%" + descricao + "%"));
    }

    public Transacao findByDonoAndId(Usuario usuario, Set<TipoTransacao> tipos, Long id) {
        return find(Dono.filtro(usuario) + " and tipo in :tipos and id = :id",
                Dono.parametros(usuario).and("tipos", tipos).and("id", id)).firstResult();
    }
}
