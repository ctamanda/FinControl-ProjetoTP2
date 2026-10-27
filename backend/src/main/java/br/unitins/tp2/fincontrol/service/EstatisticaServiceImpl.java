package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.jboss.logging.Logger;

import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO;
import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO.CadastrosMesDTO;
import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO.TransacoesMesDTO;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoEmpresa;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.EmpresaRepository;
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
        long totalAdminsEmpresa = usuarioRepository.count("role = ?1", Role.ADMIN_EMPRESA);
        long totalEmpresas = empresaRepository.count();
        long totalMeis = empresaRepository.count("tipo = ?1", TipoEmpresa.MEI);
        long empresasAtivas = empresaRepository.count("ativo = true");
        long totalTransacoes = transacaoRepository.count();
        long totalCategorias = categoriaRepository.count();

        LocalDateTime ha30Dias = LocalDateTime.now().minusDays(30);
        long novosUsuarios30Dias = usuarioRepository.count("dataCadastro >= ?1", ha30Dias);
        long transacoes30Dias = transacaoRepository.count("dataCadastro >= ?1", ha30Dias);

        long totalRegistros = totalUsuarios + totalEmpresas + totalTransacoes + totalCategorias
                + auditoriaRepository.count();

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
                totalAdminsEmpresa,
                totalUsuariosEmpresa - totalAdminsEmpresa,
                totalMeis,
                totalEmpresas - totalMeis,
                totalTransacoes,
                totalCategorias,
                mediaTransacoesPorUsuario,
                tamanhoDoBanco(),
                totalRegistros,
                novosUsuarios30Dias,
                transacoes30Dias,
                consultas.rankingCategorias(5),
                transacoesPorMes(6),
                cadastrosPorMes(6)
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

    // Quantidade e valor movimentado das transações (pela data da transação) nos últimos
    // "meses" meses, incluindo o atual.
    private List<TransacoesMesDTO> transacoesPorMes(int meses) {
        Map<YearMonth, Long> quantidades = mesesZerados(meses);
        Map<YearMonth, BigDecimal> valores = new LinkedHashMap<>();
        quantidades.keySet().forEach(mes -> valores.put(mes, BigDecimal.ZERO));

        List<Object[]> linhas = entityManager
                .createQuery("select t.data, t.valor from Transacao t where t.data >= :inicio", Object[].class)
                .setParameter("inicio", primeiroDia(meses))
                .getResultList();
        for (Object[] linha : linhas) {
            YearMonth mes = YearMonth.from((LocalDate) linha[0]);
            quantidades.computeIfPresent(mes, (m, total) -> total + 1);
            valores.computeIfPresent(mes, (m, total) -> total.add((BigDecimal) linha[1]));
        }

        List<TransacoesMesDTO> resultado = new ArrayList<>();
        quantidades.forEach((mes, total) -> resultado.add(new TransacoesMesDTO(mes.toString(), total, valores.get(mes))));
        return resultado;
    }

    // Contas pessoais e empresas criadas em cada um dos últimos "meses" meses.
    private List<CadastrosMesDTO> cadastrosPorMes(int meses) {
        LocalDateTime inicio = primeiroDia(meses).atStartOfDay();
        Map<YearMonth, Long> pessoais = contarPorMes(meses, entityManager
                .createQuery("select u.dataCadastro from Usuario u where u.role = :role and u.dataCadastro >= :inicio",
                        LocalDateTime.class)
                .setParameter("role", Role.PESSOAL)
                .setParameter("inicio", inicio)
                .getResultList());
        Map<YearMonth, Long> empresas = contarPorMes(meses, entityManager
                .createQuery("select e.dataCadastro from Empresa e where e.dataCadastro >= :inicio", LocalDateTime.class)
                .setParameter("inicio", inicio)
                .getResultList());

        List<CadastrosMesDTO> resultado = new ArrayList<>();
        pessoais.forEach((mes, total) -> resultado.add(new CadastrosMesDTO(mes.toString(), total, empresas.get(mes))));
        return resultado;
    }

    private Map<YearMonth, Long> contarPorMes(int meses, List<LocalDateTime> datas) {
        Map<YearMonth, Long> porMes = mesesZerados(meses);
        for (LocalDateTime data : datas) {
            porMes.computeIfPresent(YearMonth.from(data), (mes, total) -> total + 1);
        }
        return porMes;
    }

    private Map<YearMonth, Long> mesesZerados(int meses) {
        YearMonth atual = YearMonth.now();
        Map<YearMonth, Long> porMes = new LinkedHashMap<>();
        for (int i = meses - 1; i >= 0; i--) {
            porMes.put(atual.minusMonths(i), 0L);
        }
        return porMes;
    }

    private LocalDate primeiroDia(int meses) {
        return YearMonth.now().minusMonths(meses - 1L).atDay(1);
    }
}
