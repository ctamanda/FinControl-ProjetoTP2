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

        long contasPessoaisAtivas = usuarioRepository.count("role = ?1 and ativo = true", br.unitins.tp2.fincontrol.model.Role.PESSOAL);
        if (contasPessoaisAtivas == 0) {
            contasPessoaisAtivas = totalUsuariosPro + totalUsuariosFree;
        }

        double taxaConversao = contasPessoaisAtivas > 0
                ? ((double) totalUsuariosPro / contasPessoaisAtivas) * 100.0
                : 0.0;

        YearMonth mesAtual = YearMonth.now();
        LocalDate inicioMes = mesAtual.atDay(1);
        LocalDate fimMes = mesAtual.atEndOfMonth();
        long churn = assinaturaRepository.countCanceladasNoMes(inicioMes, fimMes);
        long novasNoMes = assinaturaRepository.countNovasProNoMes(inicioMes, fimMes);

        long assinantesInicioMes = (totalUsuariosPro - novasNoMes) + churn;
        if (assinantesInicioMes <= 0 && totalUsuariosPro > 0) {
            assinantesInicioMes = totalUsuariosPro;
        }

        double taxaChurn = assinantesInicioMes > 0
                ? ((double) churn / assinantesInicioMes) * 100.0
                : 0.0;

        BigDecimal ticketMedio = totalUsuariosPro > 0
                ? mrr.divide(BigDecimal.valueOf(totalUsuariosPro), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.valueOf(29.90);

        return new MetricasSaasResponseDTO(
                mrr,
                taxaConversao,
                churn,
                totalUsuariosPro,
                totalUsuariosFree,
                taxaChurn,
                assinantesInicioMes,
                novasNoMes,
                ticketMedio
        );
    }
}
