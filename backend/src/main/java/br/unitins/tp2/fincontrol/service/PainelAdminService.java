package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.unitins.tp2.fincontrol.dto.PainelAdminDTO;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.CadastrosMes;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.Engajamento;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.Indicador;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.IndicadorValor;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.Seguranca;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.Totais;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.UsoCategoriaPadrao;
import br.unitins.tp2.fincontrol.dto.PainelAdminDTO.UsoModulo;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

// Números da visão geral do painel do SUPER_ADMIN. Tudo sai do que está gravado
// (cadastros, lançamentos e auditoria): nenhum valor é estimado.
@ApplicationScoped
public class PainelAdminService {

    private static final int MESES_GRAFICO = 6;

    @Inject
    EntityManager entityManager;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    CategoriaPadraoRepository padraoRepository;

    @Inject
    AuditoriaRepository auditoriaRepository;

    public PainelAdminDTO montar(YearMonth mes) {
        YearMonth anterior = mes.minusMonths(1);
        return new PainelAdminDTO(
                mes.toString(),
                new Indicador(usuariosComLancamento(mes), usuariosComLancamento(anterior)),
                new Indicador(novosCadastros(mes), novosCadastros(anterior)),
                new Indicador(lancamentos(mes), lancamentos(anterior)),
                new IndicadorValor(volume(mes), volume(anterior)),
                totais(),
                cadastrosPorMes(mes),
                usoDosModulos(),
                usoDasCategoriasPadrao(mes),
                seguranca(),
                engajamento());
    }

    private long usuariosComLancamento(YearMonth mes) {
        return entityManager.createQuery("""
                select count(distinct t.usuario.id) from Transacao t
                where t.usuario.role = :role and t.data between :inicio and :fim
                """, Long.class)
                .setParameter("role", Role.PESSOAL)
                .setParameter("inicio", mes.atDay(1))
                .setParameter("fim", mes.atEndOfMonth())
                .getSingleResult();
    }

    private long novosCadastros(YearMonth mes) {
        return usuarioRepository.count("role = ?1 and dataCadastro >= ?2 and dataCadastro < ?3",
                Role.PESSOAL, mes.atDay(1).atStartOfDay(), mes.plusMonths(1).atDay(1).atStartOfDay());
    }

    private long lancamentos(YearMonth mes) {
        return entityManager.createQuery("select count(t) from Transacao t where t.data between :inicio and :fim", Long.class)
                .setParameter("inicio", mes.atDay(1))
                .setParameter("fim", mes.atEndOfMonth())
                .getSingleResult();
    }

    private BigDecimal volume(YearMonth mes) {
        BigDecimal soma = entityManager
                .createQuery("select sum(t.valor) from Transacao t where t.data between :inicio and :fim", BigDecimal.class)
                .setParameter("inicio", mes.atDay(1))
                .setParameter("fim", mes.atEndOfMonth())
                .getSingleResult();
        return soma == null ? BigDecimal.ZERO : soma;
    }

    private Totais totais() {
        long usuarios = usuarioRepository.count();
        long ativos = usuarioRepository.count("ativo = true");
        return new Totais(usuarios, ativos, usuarios - ativos,
                usuarioRepository.count("role = ?1", Role.SUPER_ADMIN),
                usuarioRepository.count("role = ?1 and ativo = true", Role.PESSOAL));
    }

    private List<CadastrosMes> cadastrosPorMes(YearMonth ultimo) {
        List<CadastrosMes> resultado = new ArrayList<>();
        for (int i = MESES_GRAFICO - 1; i >= 0; i--) {
            YearMonth mes = ultimo.minusMonths(i);
            resultado.add(new CadastrosMes(mes.toString(), novosCadastros(mes)));
        }
        return resultado;
    }

    // Base: contas pessoais ativas. "Ligado" = módulo escolhido pelo usuário;
    // "com dados" = já usou de fato (lançou, criou conta além da Carteira, criou categoria própria).
    private List<UsoModulo> usoDosModulos() {
        Map<Modulo, Long> ligados = new HashMap<>();
        entityManager.createQuery("""
                select m, count(u) from Usuario u join u.modulos m
                where u.role = :role and u.ativo = true group by m
                """, Object[].class)
                .setParameter("role", Role.PESSOAL)
                .getResultList()
                .forEach(l -> ligados.put((Modulo) l[0], (Long) l[1]));

        Map<Modulo, Long> comDados = new HashMap<>();
        comDados.put(Modulo.LANCAMENTOS, comLancamento(null));
        comDados.put(Modulo.RECEITAS, comLancamento(TipoTransacao.RECEITA));
        comDados.put(Modulo.DESPESAS, comLancamento(TipoTransacao.DESPESA));
        comDados.put(Modulo.CONTAS, (long) entityManager.createQuery("""
                select c.usuario.id from ContaFinanceira c
                where c.usuario.role = :role and c.usuario.ativo = true
                group by c.usuario.id having count(c) > 1
                """, Long.class)
                .setParameter("role", Role.PESSOAL)
                .getResultList().size());
        comDados.put(Modulo.CATEGORIAS, entityManager.createQuery("""
                select count(distinct c.usuario.id) from Categoria c
                where c.usuario.role = :role and c.usuario.ativo = true
                  and lower(c.nome) not in (select lower(p.nome) from CategoriaPadrao p)
                """, Long.class)
                .setParameter("role", Role.PESSOAL)
                .getSingleResult());

        List<UsoModulo> resultado = new ArrayList<>();
        for (Modulo modulo : Modulo.values()) {
            resultado.add(new UsoModulo(modulo, ligados.getOrDefault(modulo, 0L), comDados.get(modulo)));
        }
        resultado.sort((a, b) -> Long.compare(b.ligados(), a.ligados()));
        return resultado;
    }

    private long comLancamento(TipoTransacao tipo) {
        var query = entityManager.createQuery("""
                select count(distinct t.usuario.id) from Transacao t
                where t.usuario.role = :role and t.usuario.ativo = true
                """ + (tipo == null ? "" : " and t.tipo = :tipo"), Long.class)
                .setParameter("role", Role.PESSOAL);
        if (tipo != null) {
            query.setParameter("tipo", tipo);
        }
        return query.getSingleResult();
    }

    private List<UsoCategoriaPadrao> usoDasCategoriasPadrao(YearMonth mes) {
        Map<String, long[]> uso = new HashMap<>();
        entityManager.createQuery("""
                select lower(c.nome), c.tipo, count(t), count(distinct t.usuario.id)
                from Transacao t join t.categoria c
                where t.data between :inicio and :fim
                group by lower(c.nome), c.tipo
                """, Object[].class)
                .setParameter("inicio", mes.atDay(1))
                .setParameter("fim", mes.atEndOfMonth())
                .getResultList()
                .forEach(l -> uso.put(l[0] + "|" + l[1], new long[] { (Long) l[2], (Long) l[3] }));

        List<UsoCategoriaPadrao> resultado = new ArrayList<>();
        for (CategoriaPadrao p : padraoRepository.listarTodas()) {
            long[] u = uso.getOrDefault(p.getNome().toLowerCase() + "|" + p.getTipo(), new long[2]);
            resultado.add(new UsoCategoriaPadrao(p.getId(), p.getNome(), p.getTipo(), p.getCor(), p.getIcone(),
                    p.isAtivo(), u[0], u[1]));
        }
        resultado.sort((a, b) -> Long.compare(b.lancamentos(), a.lancamentos()));
        return resultado;
    }

    private Engajamento engajamento() {
        return new Engajamento(
                usuarioRepository.count("role = ?1 and ativo = true and ultimoAcesso < ?2",
                        Role.PESSOAL, LocalDateTime.now().minusDays(AdminUsuarioService.DIAS_SEM_ACESSO)),
                entityManager.createQuery("""
                        select count(u) from Usuario u where u.role = :role and u.ativo = true
                          and not exists (select t.id from Transacao t where t.usuario = u)
                        """, Long.class)
                        .setParameter("role", Role.PESSOAL)
                        .getSingleResult(),
                usuarioRepository.count("role = ?1 and ativo = true and ultimoAcesso is null", Role.PESSOAL));
    }

    private Seguranca seguranca() {
        LocalDateTime hoje = LocalDate.now().atStartOfDay();
        LocalDateTime semana = hoje.minusDays(6);
        return new Seguranca(
                eventos("CONTA_BLOQUEADA", hoje),
                eventos("SENHA_ALTERADA", semana),
                eventos("SESSOES_ENCERRADAS", semana),
                eventos("EMAIL_ALTERADO", semana));
    }

    private long eventos(String acao, LocalDateTime desde) {
        return auditoriaRepository.count("acao = ?1 and dataCadastro >= ?2", acao, desde);
    }
}
