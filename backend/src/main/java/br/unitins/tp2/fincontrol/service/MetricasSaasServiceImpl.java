package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

import br.unitins.tp2.fincontrol.dto.MetricasSaasResponseDTO;
import br.unitins.tp2.fincontrol.repository.AssinaturaRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MetricasSaasServiceImpl implements MetricasSaasService {

    @Inject
    AssinaturaRepository assinaturaRepository;

    @Inject
    UsuarioRepository usuarioRepository;

    @Override
    public MetricasSaasResponseDTO calcularMetricas() {
        BigDecimal mrr = assinaturaRepository.calcularMrr();

        long totalUsuariosPro = assinaturaRepository.countAtivasPorNomePlano("Pro");
        long totalUsuariosFree = assinaturaRepository.countAtivasPorNomePlano("Free");

        long totalUsuarios = usuarioRepository.countTotalUsuarios();

        double taxaConversao = totalUsuarios > 0
                ? ((double) totalUsuariosPro / totalUsuarios) * 100.0
                : 0.0;

        YearMonth mesAtual = YearMonth.now();
        LocalDate inicioMes = mesAtual.atDay(1);
        LocalDate fimMes = mesAtual.atEndOfMonth();
        long churn = assinaturaRepository.countCanceladasNoMes(inicioMes, fimMes);

        return new MetricasSaasResponseDTO(
                mrr,
                taxaConversao,
                churn,
                totalUsuariosPro,
                totalUsuariosFree
        );
    }
}
