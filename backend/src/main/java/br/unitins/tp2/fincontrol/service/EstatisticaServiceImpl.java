package br.unitins.tp2.fincontrol.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Logger;

import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO;
import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO.TransacoesMesDTO;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.EmpresaRepository;
import br.unitins.tp2.fincontrol.repository.ParametroFiscalRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;

@ApplicationScoped
public class EstatisticaServiceImpl implements EstatisticaService {

    private static final Logger LOG = Logger.getLogger(EstatisticaServiceImpl.class);

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    EmpresaRepository empresaRepository;

    @Inject
    ParametroFiscalRepository parametroRepository;

    @Inject
    AuditoriaRepository auditoriaRepository;

    @Inject
    AdminConsultaService consultas;

    @Inject
    EntityManager entityManager;

    @Override
    public EstatisticaResponseDTO obterEstatisticas() {
        long totalUsuarios = usuarioRepository.count();
        long usuariosAtivos = usuarioRepository.count("ativo = true");
        long totalAdmins = usuarioRepository.count("role = ?1", Role.SUPER_ADMIN);
        long totalContasPessoais = usuarioRepository.count("role = ?1", Role.PESSOAL);
        long totalUsuariosEmpresa = usuarioRepository.count("role in ?1",
                List.of(Role.ADMIN_EMPRESA, Role.USUARIO_EMPRESA));
        long totalEmpresas = empresaRepository.count();
        long empresasAtivas = empresaRepository.count("ativo = true");
        long totalTransacoes = transacaoRepository.count();
        long totalCategorias = categoriaRepository.count();

        LocalDateTime ha30Dias = LocalDateTime.now().minusDays(30);
        long novosUsuarios30Dias = usuarioRepository.count("dataCadastro >= ?1", ha30Dias);
        long transacoes30Dias = transacaoRepository.count("dataCadastro >= ?1", ha30Dias);

        long totalRegistros = totalUsuarios + totalEmpresas + totalTransacoes + totalCategorias
                + parametroRepository.count() + auditoriaRepository.count();

        double mediaTransacoesPorUsuario = totalUsuarios == 0
                ? 0.0
                : (double) totalTransacoes / totalUsuarios;

        return new EstatisticaResponseDTO(
                totalUsuarios,
                usuariosAtivos,
                totalUsuarios - usuariosAtivos,
                totalAdmins,
                totalUsuarios - totalAdmins,
                totalContasPessoais,
                totalEmpresas,
                empresasAtivas,
                totalUsuariosEmpresa,
                totalTransacoes,
                totalCategorias,
                mediaTransacoesPorUsuario,
                tamanhoDoBanco(),
                totalRegistros,
                novosUsuarios30Dias,
                transacoes30Dias,
                consultas.rankingCategorias(5),
                transacoesPorMes(6)
        );
    }

    // Tamanho real do banco no PostgreSQL; outros bancos (H2 nos testes) não informam: null.
    private Long tamanhoDoBanco() {
        try {
            Object bytes = entityManager.createNativeQuery("select pg_database_size(current_database())")
                    .getSingleResult();
            return ((Number) bytes).longValue();
        } catch (PersistenceException e) {
            LOG.debug("Tamanho do banco indisponível: " + e.getMessage());
            return null;
        }
    }

    // Quantidade de transações (pela data da transação) nos últimos "meses" meses, incluindo o atual.
    private List<TransacoesMesDTO> transacoesPorMes(int meses) {
        YearMonth atual = YearMonth.now();
        LocalDate inicio = atual.minusMonths(meses - 1L).atDay(1);

        Map<YearMonth, Long> porMes = new LinkedHashMap<>();
        for (int i = meses - 1; i >= 0; i--) {
            porMes.put(atual.minusMonths(i), 0L);
        }

        List<LocalDate> datas = entityManager
                .createQuery("select t.data from Transacao t where t.data >= :inicio", LocalDate.class)
                .setParameter("inicio", inicio)
                .getResultList();
        for (LocalDate data : datas) {
            porMes.computeIfPresent(YearMonth.from(data), (mes, total) -> total + 1);
        }

        List<TransacoesMesDTO> resultado = new ArrayList<>();
        porMes.forEach((mes, total) -> resultado.add(new TransacoesMesDTO(mes.toString(), total)));
        return resultado;
    }
}
