package br.unitins.tp2.fincontrol.resource;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.AdminUsuarioRequestDTO;
import br.unitins.tp2.fincontrol.dto.AdminUsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.dto.PageResponse;
import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.mapper.UsuarioResponseMapper;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.service.AdminConsultaService;
import br.unitins.tp2.fincontrol.service.AdminUsuarioService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
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

// Todos os usuários do sistema, gerenciados pelo SUPER_ADMIN.
@Path("admin/usuarios")
@RolesAllowed("SUPER_ADMIN")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminUsuarioResource {

    @Inject
    AdminUsuarioService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    public PageResponse<UsuarioResponseDTO> listar(@QueryParam("busca") String busca,
            @QueryParam("role") Role role,
            @QueryParam("ativo") Boolean ativo,
            @QueryParam("idEmpresa") Long idEmpresa,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("20") int pageSize) {
        AdminConsultaService.validarPaginacao(page, pageSize);
        PanacheQuery<Usuario> query = service.pesquisar(busca, role, ativo, idEmpresa);
        List<Usuario> usuarios = query.page(page, pageSize).list();
        return PageResponse.of(usuarios, page, pageSize, query.count(), UsuarioResponseMapper::toResponse);
    }

    @GET
    @Path("{id}")
    public UsuarioResponseDTO buscar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.buscar(id));
    }

    @POST
    public Response incluir(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") AdminUsuarioRequestDTO dto) {
        return Response.status(Response.Status.CREATED)
                .entity(UsuarioResponseMapper.toResponse(service.criar(dto, getUsuarioLogado())))
                .build();
    }

    @PUT
    @Path("{id}")
    public UsuarioResponseDTO alterar(@PathParam("id") Long id,
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") AdminUsuarioUpdateDTO dto) {
        return UsuarioResponseMapper.toResponse(service.atualizar(id, dto, getUsuarioLogado()));
    }

    @PATCH
    @Path("{id}/ativar")
    public UsuarioResponseDTO ativar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.alterarAtivo(id, true, getUsuarioLogado()));
    }

    @PATCH
    @Path("{id}/desativar")
    public UsuarioResponseDTO desativar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.alterarAtivo(id, false, getUsuarioLogado()));
    }

    @DELETE
    @Path("{id}")
    public Response excluir(@PathParam("id") Long id) {
        service.excluir(id, getUsuarioLogado());
        return Response.noContent().build();
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
