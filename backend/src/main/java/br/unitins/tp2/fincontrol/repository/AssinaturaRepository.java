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
}
