package br.unitins.tp2.fincontrol.dev;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.RegistroAuditoria;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoCategoria;
import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.service.AuditoriaService;
import br.unitins.tp2.fincontrol.service.DadosIniciais;
import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

// Dados de demonstração para apresentar o painel do administrador. SÓ EXISTE NO PERFIL DEV
// (./mvnw quarkus:dev): nos testes e no build de produção esta classe nem é carregada.
//
// Propriedade fincontrol.demo (application.properties ou -Dfincontrol.demo=...):
//   carregar   (padrão no dev) cria os dados se ainda não existirem; não mexe em mais nada;
//   zerar      apaga só os dados de demonstração (e-mails @fincontrol.demo);
//   recarregar zera e cria de novo (as datas acompanham o dia de hoje);
//   nada       não faz nada.
//
// Cria contas pessoais com cadastros espalhados nos últimos 6 meses, contas financeiras,
// categorias próprias, lançamentos pagos e a pagar de vários meses e eventos de auditoria
// (senhas trocadas, bloqueios por senha errada, sessões encerradas, ações do admin).
// Tudo é gerado com semente fixa: a mesma carga dá os mesmos números.
@IfBuildProfile("dev")
@ApplicationScoped
public class CargaDemonstracao {

    private static final Logger LOG = Logger.getLogger(CargaDemonstracao.class);

    public static final String DOMINIO = "@fincontrol.demo";
    public static final String SENHA = "Demo@123";

    // Contas para os indicadores de engajamento: parou de entrar há mais de 30 dias e
    // cadastrou-se mas nunca lançou nada.
    private static final Set<String> PAROU_DE_USAR = Set.of("rafael.moura");
    private static final Set<String> NUNCA_LANCOU = Set.of("otavio.pires", "paula.teixeira");

    @ConfigProperty(name = "fincontrol.demo", defaultValue = "nada")
    String modo;

    @Inject
    EntityManager em;

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    DadosIniciais dadosIniciais;

    @Inject
    AuditoriaService auditoria;

    private record Pessoa(String nome, String email, String profissao, int mesesAtras, boolean ativo,
            BigDecimal salario, BigDecimal aluguel, Set<Modulo> modulos, List<String> extras) {
    }

    void aoIniciar(@Observes StartupEvent evento) {
        switch (modo.trim().toLowerCase()) {
            case "carregar" -> carregarSeVazio();
            case "zerar" -> LOG.infof("Demonstração: %d usuários apagados.", zerar());
            case "recarregar" -> {
                zerar();
                carregarSeVazio();
            }
            default -> {
            }
        }
    }

    void carregarSeVazio() {
        if (usuarioRepository.count("lower(email) like ?1", "%" + DOMINIO) > 0) {
            LOG.info("Demonstração: dados já carregados (use fincontrol.demo=recarregar para gerar de novo).");
            return;
        }
        int total = carregar();
        LOG.infof("Demonstração: %d contas pessoais criadas (senha %s).", total, SENHA);
    }

    @Transactional
    int zerar() {
        @SuppressWarnings("unchecked")
        List<Number> ids = em.createNativeQuery("select id from usuario where lower(email) like :d")
                .setParameter("d", "%" + DOMINIO).getResultList();
        if (!ids.isEmpty()) {
            List<Long> lista = ids.stream().map(Number::longValue).toList();
            for (String tabela : List.of("transacao", "categoria", "conta_financeira", "usuario_modulo")) {
                em.createNativeQuery("delete from " + tabela + " where usuario_id in (:ids)")
                        .setParameter("ids", lista).executeUpdate();
            }
            em.createNativeQuery("delete from usuario where id in (:ids)").setParameter("ids", lista).executeUpdate();
        }
        // Só os registros de auditoria gerados pela carga (autor ou alvo de demonstração).
        em.createNativeQuery("delete from auditoria where lower(autor_email) like :d or lower(alvo) like :a")
                .setParameter("d", "%" + DOMINIO).setParameter("a", "%" + DOMINIO + "%").executeUpdate();
        return ids.size();
    }

    @Transactional
    int carregar() {
        Random random = new Random(2026);
        String hash = BcryptUtil.bcryptHash(SENHA);
        Usuario admin = usuarioRepository.find("role = ?1 and ativo = true order by id", Role.SUPER_ADMIN).firstResult();
        LocalDate hoje = LocalDate.now();

        Set<Modulo> todos = EnumSet.allOf(Modulo.class);
        Set<Modulo> basico = EnumSet.of(Modulo.DASHBOARD, Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS,
                Modulo.CATEGORIAS);
        Set<Modulo> semPlanejamento = EnumSet.complementOf(EnumSet.of(Modulo.ORCAMENTOS, Modulo.RELATORIOS,
                Modulo.IMPORTACAO, Modulo.EXPORTACAO, Modulo.TAGS));

        List<Pessoa> pessoas = List.of(
                new Pessoa("Ana Souza", "ana.souza", "Professora", 5, true, valor(4800), valor(1300), todos, List.of("Educação", "Nubank")),
                new Pessoa("Bruno Lima", "bruno.lima", "Engenheiro civil", 5, true, valor(9200), valor(2600), todos, List.of("Banco Inter", "Poupança", "Assinaturas")),
                new Pessoa("Carla Mendes", "carla.mendes", "Designer", 4, true, valor(5600), valor(1500), semPlanejamento, List.of("Nubank", "Freelance", "Pet")),
                new Pessoa("Diego Alves", "diego.alves", "Estudante", 4, true, valor(1500), valor(600), basico, List.of()),
                new Pessoa("Eduarda Rocha", "eduarda.rocha", "Enfermeira", 3, true, valor(6100), valor(1700), todos, List.of("Banco Inter", "Saúde")),
                new Pessoa("Felipe Costa", "felipe.costa", "Analista de sistemas", 3, true, valor(7800), valor(2100), semPlanejamento, List.of("Nubank", "Assinaturas")),
                new Pessoa("Gabriela Nunes", "gabriela.nunes", "Advogada", 2, true, valor(8500), valor(2400), todos, List.of("Poupança")),
                new Pessoa("Henrique Dias", "henrique.dias", "Motorista", 2, false, valor(3200), valor(900), basico, List.of()),
                new Pessoa("Isabela Martins", "isabela.martins", "Arquiteta", 1, true, valor(6900), valor(1900), todos, List.of("Nubank", "Pet")),
                new Pessoa("João Pedro Silva", "joao.silva", "Vendedor", 1, true, valor(2800), valor(850), semPlanejamento, List.of("Freelance")),
                new Pessoa("Larissa Freitas", "larissa.freitas", "Contadora", 0, true, valor(5300), valor(1400), todos, List.of("Banco Inter")),
                new Pessoa("Marcos Ribeiro", "marcos.ribeiro", "Autônomo", 0, false, valor(2400), valor(700), basico, List.of()),
                new Pessoa("Natália Castro", "natalia.castro", "Psicóloga", 0, true, valor(6400), valor(1600), todos, List.of("Nubank", "Saúde")),
                new Pessoa("Otávio Pires", "otavio.pires", "Bancário", 1, true, valor(4200), valor(1100), basico, List.of()),
                new Pessoa("Paula Teixeira", "paula.teixeira", "Fisioterapeuta", 0, true, valor(5000), valor(1200), todos, List.of()),
                new Pessoa("Rafael Moura", "rafael.moura", "Técnico em eletrônica", 4, true, valor(3900), valor(1000), basico, List.of()));

        for (Pessoa p : pessoas) {
            LocalDateTime cadastro = YearMonth.now().minusMonths(p.mesesAtras())
                    .atDay(1 + random.nextInt(p.mesesAtras() == 0 ? Math.max(1, hoje.getDayOfMonth() - 1) : 27))
                    .atTime(8 + random.nextInt(12), random.nextInt(60));

            Usuario u = new Usuario();
            u.setNome(p.nome());
            u.setEmail(p.email() + DOMINIO);
            u.setPassword(hash);
            u.setTelefone("6399" + (1000000 + random.nextInt(8999999)));
            u.setProfissao(p.profissao());
            u.setRole(Role.PESSOAL);
            u.setModulos(EnumSet.copyOf(p.modulos()));
            u.setAtivo(true);
            em.persist(u);
            dadosIniciais.criar(u);
            em.flush();

            Map<String, Categoria> categorias = new HashMap<>();
            em.createQuery("from Categoria where usuario = :u", Categoria.class).setParameter("u", u)
                    .getResultList().forEach(c -> categorias.put(c.getNome(), c));
            ContaFinanceira carteira = em.createQuery("from ContaFinanceira where usuario = :u", ContaFinanceira.class)
                    .setParameter("u", u).getSingleResult();
            carteira.setSaldoInicial(valor(50 + random.nextInt(300)));
            ContaFinanceira principal = carteira;

            for (String extra : p.extras()) {
                switch (extra) {
                    case "Nubank" -> principal = conta(u, "Nubank", TipoContaFinanceira.CONTA_CORRENTE, "#820AD1", random);
                    case "Banco Inter" -> principal = conta(u, "Banco Inter", TipoContaFinanceira.CONTA_CORRENTE, "#FF7A00", random);
                    case "Poupança" -> conta(u, "Poupança", TipoContaFinanceira.POUPANCA, "#005CA9", random);
                    case "Educação" -> categorias.put(extra, categoria(u, extra, TipoCategoria.DESPESA, "#1E88E5", "school"));
                    case "Assinaturas" -> categorias.put(extra, categoria(u, extra, TipoCategoria.DESPESA, "#8E24AA", "subscriptions"));
                    case "Pet" -> categorias.put(extra, categoria(u, extra, TipoCategoria.DESPESA, "#6D4C41", "pets"));
                    case "Saúde" -> categorias.put(extra, categoria(u, extra, TipoCategoria.DESPESA, "#E53935", "favorite"));
                    case "Freelance" -> categorias.put(extra, categoria(u, extra, TipoCategoria.RECEITA, "#00897B", "work"));
                    default -> throw new IllegalStateException(extra);
                }
            }

            // Lançamentos do mês do cadastro até o mês que vem (os futuros ficam a pagar/receber).
            // Conta desativada (ou que parou de usar) parou de lançar há 2 meses.
            boolean parou = !p.ativo() || PAROU_DE_USAR.contains(p.email());
            YearMonth fimLancamentos = NUNCA_LANCOU.contains(p.email()) ? YearMonth.from(cadastro).minusMonths(1)
                    : parou ? YearMonth.now().minusMonths(2) : YearMonth.now();
            for (YearMonth mes = YearMonth.from(cadastro); !mes.isAfter(fimLancamentos); mes = mes.plusMonths(1)) {
                int primeiroDia = mes.equals(YearMonth.from(cadastro)) ? cadastro.getDayOfMonth() : 1;
                lancar(u, principal, categorias.get("Salário"), "Salário", p.salario(), dia(mes, 5, primeiroDia), hoje);
                lancar(u, principal, categorias.get("Moradia"), "Aluguel", p.aluguel(), dia(mes, 10, primeiroDia), hoje);
                lancar(u, principal, categorias.get("Moradia"), "Conta de luz", valor(90 + random.nextInt(160)),
                        dia(mes, 15, primeiroDia), hoje);
                for (int i = 0; i < 2 + random.nextInt(3); i++) {
                    lancar(u, random.nextBoolean() ? principal : carteira, categorias.get("Alimentação"),
                            random.nextBoolean() ? "Mercado" : "Restaurante", valor(60 + random.nextInt(480)),
                            dia(mes, 1 + random.nextInt(28), primeiroDia), hoje);
                }
                for (int i = 0; i < 1 + random.nextInt(3); i++) {
                    lancar(u, carteira, categorias.get("Transporte"), random.nextBoolean() ? "Combustível" : "Aplicativo de transporte",
                            valor(25 + random.nextInt(230)), dia(mes, 1 + random.nextInt(28), primeiroDia), hoje);
                }
                if (random.nextInt(3) > 0) {
                    lancar(u, principal, categorias.get("Lazer"), random.nextBoolean() ? "Cinema" : "Passeio",
                            valor(40 + random.nextInt(260)), dia(mes, 1 + random.nextInt(28), primeiroDia), hoje);
                }
                for (String extra : p.extras()) {
                    Categoria c = categorias.get(extra);
                    if (c != null) {
                        BigDecimal v = c.getTipo() == TipoCategoria.RECEITA ? valor(400 + random.nextInt(1800)) : valor(35 + random.nextInt(320));
                        lancar(u, principal, c, extra, v, dia(mes, 1 + random.nextInt(28), primeiroDia), hoje);
                    }
                }
            }
            // Uma conta esquecida no mês passado: aparece como atrasada.
            if (!parou && !NUNCA_LANCOU.contains(p.email()) && p.mesesAtras() > 0 && random.nextBoolean()) {
                Transacao atrasada = lancar(u, principal, categorias.get("Moradia"), "Internet", valor(119),
                        hoje.minusMonths(1).withDayOfMonth(20), hoje);
                atrasada.setPago(false);
                atrasada.setDataPagamento(null);
            }
            em.flush();

            // Datas de cadastro e de acesso "do passado" (as colunas de data não têm setter público).
            LocalDateTime ultimoAcesso = PAROU_DE_USAR.contains(p.email()) ? LocalDateTime.now().minusDays(41)
                    : p.ativo() ? LocalDateTime.now().minusHours(1 + random.nextInt(24 * 9))
                    : fimLancamentos.atDay(20).atTime(19, 30);
            if (ultimoAcesso.isBefore(cadastro)) {
                ultimoAcesso = cadastro.plusHours(1);
            }
            em.createNativeQuery("update usuario set datacadastro = :c, ultimo_acesso = :a, ativo = :ativo where id = :id")
                    .setParameter("c", cadastro).setParameter("a", ultimoAcesso).setParameter("ativo", p.ativo())
                    .setParameter("id", u.getId()).executeUpdate();
            em.createNativeQuery("update categoria set datacadastro = :c where usuario_id = :id")
                    .setParameter("c", cadastro).setParameter("id", u.getId()).executeUpdate();
            em.createNativeQuery("update conta_financeira set datacadastro = :c where usuario_id = :id")
                    .setParameter("c", cadastro).setParameter("id", u.getId()).executeUpdate();
            em.createNativeQuery("update transacao set datacadastro = data + time '09:00' where usuario_id = :id")
                    .setParameter("id", u.getId()).executeUpdate();

            auditar(u, admin, p, cadastro, random);
        }
        return pessoas.size();
    }

    // Eventos de segurança e ações do admin, com datas espalhadas (alguns hoje e nesta semana).
    private void auditar(Usuario u, Usuario admin, Pessoa p, LocalDateTime cadastro, Random random) {
        String alvo = AuditoriaService.alvo(u);
        LocalDateTime agora = LocalDateTime.now();
        evento(u, "DADOS_PESSOAIS_ALTERADOS", alvo, null, cadastro.plusDays(2));
        if (PAROU_DE_USAR.contains(p.email()) || NUNCA_LANCOU.contains(p.email())) {
            return;
        }
        if (random.nextInt(3) == 0 || p.email().startsWith("bruno") || p.email().startsWith("diego")) {
            evento(u, "SENHA_ALTERADA", alvo, null, agora.minusDays(random.nextInt(6)).minusHours(random.nextInt(5)));
        }
        if (random.nextInt(2) == 0) {
            evento(u, "SENHA_ALTERADA", alvo, null, maxData(cadastro.plusDays(10), agora.minusDays(20 + random.nextInt(40))));
        }
        if (p.email().startsWith("carla") || p.email().startsWith("felipe")) {
            evento(u, "SESSOES_ENCERRADAS", alvo, null, agora.minusDays(1 + random.nextInt(5)));
        }
        if (p.email().startsWith("gabriela")) {
            evento(u, "EMAIL_ALTERADO", alvo, "Antes: gabriela.n" + DOMINIO, agora.minusDays(3));
        }
        if (p.email().startsWith("diego") || p.email().startsWith("joao")) {
            evento(u, "CONTA_BLOQUEADA", alvo, "5 senhas erradas seguidas; bloqueada por 15 minutos",
                    agora.minusMinutes(30 + random.nextInt(240)));
        }
        if (p.email().startsWith("eduarda")) {
            evento(u, "CONTA_BLOQUEADA", alvo, "5 senhas erradas seguidas; bloqueada por 15 minutos", agora.minusDays(12));
        }
        if (admin == null) {
            return;
        }
        if (p.email().startsWith("larissa")) {
            evento(admin, "USUARIO_CRIADO", alvo, "Perfil PESSOAL", cadastro);
        }
        if (!p.ativo()) {
            evento(admin, "USUARIO_DESATIVADO", alvo, null, maxData(cadastro.plusDays(1), agora.minusDays(4 + random.nextInt(10))));
        }
    }

    private void evento(Usuario autor, String acao, String alvo, String detalhe, LocalDateTime quando) {
        auditoria.registrar(autor, acao, alvo, detalhe);
        em.flush();
        em.createNativeQuery("update auditoria set datacadastro = :q where id = (select max(id) from auditoria)")
                .setParameter("q", quando.isAfter(LocalDateTime.now()) ? LocalDateTime.now() : quando).executeUpdate();
    }

    private Transacao lancar(Usuario u, ContaFinanceira conta, Categoria categoria, String descricao, BigDecimal valor,
            LocalDate data, LocalDate hoje) {
        Transacao t = new Transacao();
        t.setUsuario(u);
        t.setConta(conta);
        t.setCategoria(categoria);
        t.setTipo(categoria.getTipo() == TipoCategoria.RECEITA ? TipoTransacao.RECEITA : TipoTransacao.DESPESA);
        t.setDescricao(descricao);
        t.setValor(valor);
        t.setData(data);
        t.setPago(!data.isAfter(hoje));
        t.setDataPagamento(t.isPago() ? data : null);
        em.persist(t);
        return t;
    }

    private ContaFinanceira conta(Usuario u, String nome, TipoContaFinanceira tipo, String cor, Random random) {
        ContaFinanceira c = new ContaFinanceira();
        c.setUsuario(u);
        c.setNome(nome);
        c.setTipo(tipo);
        c.setCor(cor);
        c.setSaldoInicial(valor(200 + random.nextInt(3000)));
        em.persist(c);
        return c;
    }

    private Categoria categoria(Usuario u, String nome, TipoCategoria tipo, String cor, String icone) {
        Categoria c = new Categoria();
        c.setUsuario(u);
        c.setNome(nome);
        c.setTipo(tipo);
        c.setCor(cor);
        c.setIcone(icone);
        em.persist(c);
        return c;
    }

    private static LocalDate dia(YearMonth mes, int dia, int primeiroDia) {
        return mes.atDay(Math.min(Math.max(dia, primeiroDia), mes.lengthOfMonth()));
    }

    private static LocalDateTime maxData(LocalDateTime a, LocalDateTime b) {
        return a.isAfter(b) ? a : b;
    }

    private static BigDecimal valor(int reais) {
        return BigDecimal.valueOf(reais).setScale(2, RoundingMode.HALF_UP);
    }
}
