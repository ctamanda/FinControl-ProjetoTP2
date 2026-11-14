package br.unitins.tp2.fincontrol.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.unitins.tp2.fincontrol.model.Assinatura;
import br.unitins.tp2.fincontrol.model.StatusAssinatura;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AssinaturaRepository implements PanacheRepositoryBase<Assinatura, Long> {

    public BigDecimal calcularMrr() {
        BigDecimal soma = getEntityManager().createQuery("""
                select sum(a.plano.valorMensal)
                from Assinatura a
                where a.status = :status and lower(a.plano.nome) = 'pro'
                """, BigDecimal.class)
                .setParameter("status", StatusAssinatura.ATIVA)
                .getSingleResult();
        return soma != null ? soma : BigDecimal.ZERO;
    }

    public long countAtivasPorNomePlano(String nomePlano) {
        return count("status = ?1 and lower(plano.nome) = lower(?2)", StatusAssinatura.ATIVA, nomePlano);
    }

    public long countCanceladasNoMes(LocalDate inicio, LocalDate fim) {
        return count("status = ?1 and ((dataFim is not null and dataFim between ?2 and ?3) or (dataFim is null and dataAlteracao between ?4 and ?5))",
                StatusAssinatura.CANCELADA,
                inicio,
                fim,
                inicio.atStartOfDay(),
                fim.atTime(23, 59, 59, 999999999));
    }

    public long countNovasProNoMes(LocalDate inicio, LocalDate fim) {
        return count("lower(plano.nome) = 'pro' and dataInicio between ?1 and ?2", inicio, fim);
    }

    public java.util.Map<Long, String> buscarPlanosPorUsuarioIds(java.util.List<Long> usuarioIds) {
        if (usuarioIds == null || usuarioIds.isEmpty()) {
            return java.util.Collections.emptyMap();
        }
        java.util.List<Object[]> rows = getEntityManager().createQuery("""
                select a.usuario.id, a.plano.nome
                from Assinatura a
                where a.status = :status and a.usuario.id in :ids
                """, Object[].class)
                .setParameter("status", StatusAssinatura.ATIVA)
                .setParameter("ids", usuarioIds)
                .getResultList();

        java.util.Map<Long, String> mapa = new java.util.HashMap<>();
        for (Object[] r : rows) {
            mapa.put((Long) r[0], (String) r[1]);
        }
        return mapa;
    }
}
