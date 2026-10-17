package br.unitins.tp2.fincontrol.resource;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.AdminEmpresaResponseDTO;
import br.unitins.tp2.fincontrol.dto.AdminTransacaoResponseDTO;
import br.unitins.tp2.fincontrol.dto.AuditoriaResponseDTO;
import br.unitins.tp2.fincontrol.dto.CategoriaPadraoResponseDTO;
import br.unitins.tp2.fincontrol.dto.CategoriaRankingDTO;
import br.unitins.tp2.fincontrol.dto.CategoriaRequestDTO;
import br.unitins.tp2.fincontrol.dto.EmpresaRequestDTO;
import br.unitins.tp2.fincontrol.dto.EstatisticaResponseDTO;
import br.unitins.tp2.fincontrol.dto.PageResponse;
import br.unitins.tp2.fincontrol.mapper.AdminMapper;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import br.unitins.tp2.fincontrol.service.AdminConsultaService;
import br.unitins.tp2.fincontrol.service.AdminConsultaService.FiltroTransacoes;
import br.unitins.tp2.fincontrol.service.CategoriaPadraoService;
import br.unitins.tp2.fincontrol.service.EmpresaService;
import br.unitins.tp2.fincontrol.service.EstatisticaService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

// Painel administrativo do FinControl: só SUPER_ADMIN.
// Usuários ficam em AdminUsuarioResource e parâmetros fiscais em ParametroFiscalResource.
@Path("admin")
@RolesAllowed("SUPER_ADMIN")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject
    EstatisticaService estatisticaService;

    @Inject
    AdminConsultaService consultas;

    @Inject
    EmpresaService empresaService;

    @Inject
    CategoriaPadraoService categoriaPadraoService;

    @Inject
    AuditoriaRepository auditoriaRepository;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("estatisticas")
    public EstatisticaResponseDTO obterEstatisticas() {
        return estatisticaService.obterEstatisticas();
    }

    // ---------------------------------------------------------- empresas

    @GET
    @Path("empresas")
    public PageResponse<AdminEmpresaResponseDTO> listarEmpresas(@QueryParam("busca") String busca,
            @QueryParam("ativo") Boolean ativo,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize) {
        AdminConsultaService.validarPaginacao(page, pageSize);
        PanacheQuery<Empresa> query = consultas.pesquisarEmpresas(busca, ativo);
        List<Empresa> empresas = query.page(page, pageSize).list();
        List<Long> ids = empresas.stream().map(Empresa::getId).toList();
        Map<Long, Long> usuarios = consultas.contarUsuariosPorEmpresa(ids);
        Map<Long, Long> transacoes = consultas.contarTransacoesPorEmpresa(ids);
        return PageResponse.of(empresas, page, pageSize, query.count(),
                e -> AdminMapper.empresa(e, usuarios.getOrDefault(e.getId(), 0L), transacoes.getOrDefault(e.getId(), 0L)));
    }

    @GET
    @Path("empresas/{id}")
    public AdminEmpresaResponseDTO buscarEmpresa(@PathParam("id") Long id) {
        return comContagens(empresaService.buscarPorId(id));
    }

    @PUT
    @Path("empresas/{id}")
    public AdminEmpresaResponseDTO alterarEmpresa(@PathParam("id") Long id,
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") EmpresaRequestDTO dto) {
        return comContagens(empresaService.atualizarPorId(id, dto, getUsuarioLogado()));
    }

    @PATCH
    @Path("empresas/{id}/ativar")
    public AdminEmpresaResponseDTO ativarEmpresa(@PathParam("id") Long id) {
        return comContagens(empresaService.alterarAtivo(id, true, getUsuarioLogado()));
    }

    @PATCH
    @Path("empresas/{id}/desativar")
    public AdminEmpresaResponseDTO desativarEmpresa(@PathParam("id") Long id) {
        return comContagens(empresaService.alterarAtivo(id, false, getUsuarioLogado()));
    }

    private AdminEmpresaResponseDTO comContagens(Empresa empresa) {
        List<Long> ids = List.of(empresa.getId());
        return AdminMapper.empresa(empresa,
                consultas.contarUsuariosPorEmpresa(ids).getOrDefault(empresa.getId(), 0L),
                consultas.contarTransacoesPorEmpresa(ids).getOrDefault(empresa.getId(), 0L));
    }

    // ---------------------------------------------------------- transações (só leitura)

    @GET
    @Path("transacoes")
    public PageResponse<AdminTransacaoResponseDTO> listarTransacoes(
            @QueryParam("inicio") LocalDate inicio,
            @QueryParam("fim") LocalDate fim,
            @QueryParam("idEmpresa") Long idEmpresa,
            @QueryParam("idUsuario") Long idUsuario,
            @QueryParam("categoria") String categoria,
            @QueryParam("tipo") TipoTransacao tipo,
            @QueryParam("escopo") Escopo escopo,
            @QueryParam("descricao") String descricao,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize) {
        FiltroTransacoes filtro = new FiltroTransacoes(inicio, fim, idEmpresa, idUsuario, categoria, tipo, escopo, descricao);
        PanacheQuery<Transacao> query = consultas.pesquisarTransacoes(filtro, page, pageSize, getUsuarioLogado());
        return PageResponse.of(query.page(page, pageSize).list(), page, pageSize, query.count(), AdminMapper::transacao);
    }

    // ---------------------------------------------------------- categorias

    @GET
    @Path("categorias/ranking")
    public List<CategoriaRankingDTO> rankingCategorias(@QueryParam("limite") @DefaultValue("50") int limite) {
        return consultas.rankingCategorias(Math.max(1, Math.min(limite, 200)));
    }

    @GET
    @Path("categorias-padrao")
    public List<CategoriaPadraoResponseDTO> listarCategoriasPadrao() {
        return categoriaPadraoService.listar().stream().map(AdminMapper::categoriaPadrao).toList();
    }

    @POST
    @Path("categorias-padrao")
    public Response criarCategoriaPadrao(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") CategoriaRequestDTO dto) {
        return Response.status(Response.Status.CREATED)
                .entity(AdminMapper.categoriaPadrao(categoriaPadraoService.criar(dto, getUsuarioLogado())))
                .build();
    }

    @PUT
    @Path("categorias-padrao/{id}")
    public CategoriaPadraoResponseDTO alterarCategoriaPadrao(@PathParam("id") Long id,
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") CategoriaRequestDTO dto) {
        return AdminMapper.categoriaPadrao(categoriaPadraoService.atualizar(id, dto, getUsuarioLogado()));
    }

    @PATCH
    @Path("categorias-padrao/{id}/ativar")
    public CategoriaPadraoResponseDTO ativarCategoriaPadrao(@PathParam("id") Long id) {
        return AdminMapper.categoriaPadrao(categoriaPadraoService.alterarAtivo(id, true, getUsuarioLogado()));
    }

    @PATCH
    @Path("categorias-padrao/{id}/desativar")
    public CategoriaPadraoResponseDTO desativarCategoriaPadrao(@PathParam("id") Long id) {
        return AdminMapper.categoriaPadrao(categoriaPadraoService.alterarAtivo(id, false, getUsuarioLogado()));
    }

    // ---------------------------------------------------------- auditoria

    @GET
    @Path("auditoria")
    public PageResponse<AuditoriaResponseDTO> listarAuditoria(@QueryParam("busca") String busca,
            @QueryParam("acao") String acao,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize) {
        AdminConsultaService.validarPaginacao(page, pageSize);
        var query = auditoriaRepository.pesquisar(busca, acao);
        return PageResponse.of(query.page(page, pageSize).list(), page, pageSize, query.count(), AdminMapper::auditoria);
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
