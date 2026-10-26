package br.unitins.tp2.fincontrol.repository;

import java.time.LocalDate;
import java.util.Set;

import br.unitins.tp2.fincontrol.model.StatusPagamento;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TransacaoRepository implements PanacheRepository<Transacao> {

    // "tipos": só os tipos que o usuário pode ver (ver Permissoes.tiposVisiveis).
    public PanacheQuery<Transacao> buscar(Usuario usuario, Set<TipoTransacao> tipos, TransacaoFiltro filtro) {
        StringBuilder where = new StringBuilder(Dono.filtro(usuario)).append(" and tipo in :tipos");
        Parameters params = Dono.parametros(usuario).and("tipos", tipos);

        if (filtro.descricao() != null && !filtro.descricao().isBlank()) {
            where.append(" and lower(descricao) like lower(:descricao)");
            params.and("descricao", "%" + filtro.descricao().trim() + "%");
        }
        if (filtro.tipo() != null) {
            where.append(" and tipo = :tipo");
            params.and("tipo", filtro.tipo());
        }
        if (filtro.mes() != null) {
            where.append(" and data between :inicio and :fim");
            params.and("inicio", filtro.mes().atDay(1)).and("fim", filtro.mes().atEndOfMonth());
        }
        if (filtro.idConta() != null) {
            where.append(" and conta.id = :conta");
            params.and("conta", filtro.idConta());
        }
        if (filtro.status() == StatusPagamento.PAGO) {
            where.append(" and pago = true");
        } else if (filtro.status() == StatusPagamento.PENDENTE) {
            where.append(" and pago = false");
        } else if (filtro.status() == StatusPagamento.ATRASADO) {
            where.append(" and pago = false and data < :hoje");
            params.and("hoje", LocalDate.now());
        }

        where.append(filtro.soPendentes() ? " order by data, id" : " order by data desc, id desc");
        return find(where.toString(), params);
    }

    public Transacao findByDonoAndId(Usuario usuario, Set<TipoTransacao> tipos, Long id) {
        return find(Dono.filtro(usuario) + " and tipo in :tipos and id = :id",
                Dono.parametros(usuario).and("tipos", tipos).and("id", id)).firstResult();
    }
}
