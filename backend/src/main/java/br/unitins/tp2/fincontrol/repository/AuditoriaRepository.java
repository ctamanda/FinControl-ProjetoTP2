package br.unitins.tp2.fincontrol.repository;

import br.unitins.tp2.fincontrol.model.RegistroAuditoria;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AuditoriaRepository implements PanacheRepository<RegistroAuditoria> {

    // "busca" procura no autor, no alvo e no detalhe; "acao" filtra pela ação exata.
    public PanacheQuery<RegistroAuditoria> pesquisar(String busca, String acao) {
        StringBuilder where = new StringBuilder("1 = 1");
        Parameters params = new Parameters();
        if (busca != null && !busca.isBlank()) {
            where.append(" and (lower(autorEmail) like :busca or lower(alvo) like :busca or lower(detalhe) like :busca)");
            params.and("busca", "%" + busca.trim().toLowerCase() + "%");
        }
        if (acao != null && !acao.isBlank()) {
            where.append(" and acao = :acao");
            params.and("acao", acao.trim().toUpperCase());
        }
        return find(where + " order by dataCadastro desc, id desc", params);
    }
}
