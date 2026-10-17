package br.unitins.tp2.fincontrol.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.unitins.tp2.fincontrol.dto.CategoriaRankingDTO;
import br.unitins.tp2.fincontrol.exception.Problem;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.TipoCategoria;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.EmpresaRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

// Consultas do painel do SUPER_ADMIN que atravessam todas as contas e empresas.
// Só leitura: nada aqui altera dados de clientes.
@ApplicationScoped
public class AdminConsultaService {

    public static final int PAGE_SIZE_MAX = 100;

    @Inject
    EntityManager entityManager;

    @Inject
    EmpresaRepository empresaRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    AuditoriaService auditoria;

    // ---------------------------------------------------------- empresas

    // "busca" procura na razão social, no nome fantasia e no CNPJ.
    public PanacheQuery<Empresa> pesquisarEmpresas(String busca, Boolean ativo) {
        StringBuilder where = new StringBuilder("1 = 1");
        Parameters params = new Parameters();
        if (busca != null && !busca.isBlank()) {
            String termo = busca.trim().toLowerCase();
            where.append(" and (lower(razaoSocial) like :busca or lower(nomeFantasia) like :busca");
            params.and("busca", "%" + termo + "%");
            String digitos = termo.replaceAll("\\D", "");
            if (!digitos.isEmpty()) {
                where.append(" or cnpj like :cnpj");
                params.and("cnpj", "%" + digitos + "%");
            }
            where.append(")");
        }
        if (ativo != null) {
            where.append(" and ativo = :ativo");
            params.and("ativo", ativo);
        }
        return empresaRepository.find(where + " order by razaoSocial, id", params);
    }

    // id da empresa -> quantidade (uma consulta para a página inteira).
    public Map<Long, Long> contarUsuariosPorEmpresa(List<Long> ids) {
        return contarPorEmpresa("select u.empresa.id, count(u) from Usuario u where u.empresa.id in :ids group by u.empresa.id", ids);
    }

    public Map<Long, Long> contarTransacoesPorEmpresa(List<Long> ids) {
        return contarPorEmpresa("select t.empresa.id, count(t) from Transacao t where t.empresa.id in :ids group by t.empresa.id", ids);
    }

    private Map<Long, Long> contarPorEmpresa(String jpql, List<Long> ids) {
        Map<Long, Long> contagem = new HashMap<>();
        if (ids.isEmpty()) {
            return contagem;
        }
        List<Object[]> linhas = entityManager.createQuery(jpql, Object[].class).setParameter("ids", ids).getResultList();
        for (Object[] linha : linhas) {
            contagem.put((Long) linha[0], (Long) linha[1]);
        }
        return contagem;
    }

    // ---------------------------------------------------------- transações

    public record FiltroTransacoes(
            LocalDate inicio,
            LocalDate fim,
            Long idEmpresa,
            Long idUsuario,
            String categoria,
            TipoTransacao tipo,
            Escopo escopo,
            String descricao) {
    }

    // Cada nova pesquisa (página 0) fica registrada na auditoria: o admin está vendo dados de clientes.
    public PanacheQuery<Transacao> pesquisarTransacoes(FiltroTransacoes f, int page, int pageSize, Usuario autor) {
        validarPaginacao(page, pageSize);
        if (f.inicio() != null && f.fim() != null && f.fim().isBefore(f.inicio())) {
            throw ValidationException.of("fim", "A data final deve ser igual ou posterior à data inicial.");
        }

        StringBuilder where = new StringBuilder("1 = 1");
        Parameters params = new Parameters();
        if (f.inicio() != null) {
            where.append(" and data >= :inicio");
            params.and("inicio", f.inicio());
        }
        if (f.fim() != null) {
            where.append(" and data <= :fim");
            params.and("fim", f.fim());
        }
        if (f.idEmpresa() != null) {
            where.append(" and empresa.id = :empresa");
            params.and("empresa", f.idEmpresa());
        }
        if (f.idUsuario() != null) {
            where.append(" and usuario.id = :usuario");
            params.and("usuario", f.idUsuario());
        }
        if (f.categoria() != null && !f.categoria().isBlank()) {
            where.append(" and lower(categoria.nome) like :categoria");
            params.and("categoria", "%" + f.categoria().trim().toLowerCase() + "%");
        }
        if (f.tipo() != null) {
            where.append(" and tipo = :tipo");
            params.and("tipo", f.tipo());
        }
        if (f.escopo() != null) {
            where.append(" and escopo = :escopo");
            params.and("escopo", f.escopo());
        }
        if (f.descricao() != null && !f.descricao().isBlank()) {
            where.append(" and lower(descricao) like :descricao");
            params.and("descricao", "%" + f.descricao().trim().toLowerCase() + "%");
        }

        if (page == 0) {
            auditoria.registrar(autor, "CONSULTA_TRANSACOES", "Transações do sistema", descreverFiltro(f));
        }

        return transacaoRepository.find(where + " order by data desc, id desc", params);
    }

    private static String descreverFiltro(FiltroTransacoes f) {
        StringBuilder texto = new StringBuilder();
        if (f.inicio() != null) texto.append("de ").append(f.inicio()).append(' ');
        if (f.fim() != null) texto.append("até ").append(f.fim()).append(' ');
        if (f.idEmpresa() != null) texto.append("empresa #").append(f.idEmpresa()).append(' ');
        if (f.idUsuario() != null) texto.append("usuário #").append(f.idUsuario()).append(' ');
        if (f.categoria() != null && !f.categoria().isBlank()) texto.append("categoria \"").append(f.categoria().trim()).append("\" ");
        if (f.tipo() != null) texto.append(f.tipo()).append(' ');
        if (f.escopo() != null) texto.append(f.escopo()).append(' ');
        if (f.descricao() != null && !f.descricao().isBlank()) texto.append("descrição \"").append(f.descricao().trim()).append("\" ");
        return texto.isEmpty() ? "Sem filtros" : "Filtros: " + texto.toString().trim();
    }

    // ---------------------------------------------------------- categorias

    // Soma as categorias de mesmo nome e tipo de todas as contas e empresas.
    public List<CategoriaRankingDTO> rankingCategorias(int limite) {
        return entityManager.createQuery("""
                select min(c.nome), c.tipo, count(t.id), count(distinct c.id)
                from Transacao t join t.categoria c
                group by lower(c.nome), c.tipo
                order by count(t.id) desc, min(c.nome)
                """, Object[].class)
                .setMaxResults(limite)
                .getResultList()
                .stream()
                .map(l -> new CategoriaRankingDTO((String) l[0], (TipoCategoria) l[1], (Long) l[2], (Long) l[3]))
                .toList();
    }

    public static void validarPaginacao(int page, int pageSize) {
        if (page < 0 || pageSize < 1 || pageSize > PAGE_SIZE_MAX) {
            throw new ValidationException("Parâmetros de paginação inválidos", List.of(new Problem.FieldError(
                    "pageSize", "A página deve ser maior ou igual a 0 e o tamanho entre 1 e " + PAGE_SIZE_MAX + ".")));
        }
    }
}
