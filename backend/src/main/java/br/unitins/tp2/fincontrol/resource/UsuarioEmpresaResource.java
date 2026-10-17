package br.unitins.tp2.fincontrol.resource;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.UsuarioEmpresaRequestDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioEmpresaUpdateDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.mapper.UsuarioResponseMapper;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.security.RequerModulo;
import br.unitins.tp2.fincontrol.service.UsuarioEmpresaService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

// Usuários da empresa: só o administrador da empresa gerencia.
@Path("empresa/usuarios")
@RolesAllowed("ADMIN_EMPRESA")
@RequerModulo(Modulo.USUARIOS)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioEmpresaResource {

    @Inject
    UsuarioEmpresaService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    public List<UsuarioResponseDTO> listar() {
        return service.listar(getUsuarioLogado()).stream()
                .map(UsuarioResponseMapper::toResponse)
                .toList();
    }

    @GET
    @Path("{id}")
    public UsuarioResponseDTO buscar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.buscar(getUsuarioLogado(), id));
    }

    @POST
    public Response incluir(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") UsuarioEmpresaRequestDTO dto) {
        Usuario usuario = service.criar(getUsuarioLogado(), dto);
        return Response.status(Response.Status.CREATED)
                .entity(UsuarioResponseMapper.toResponse(usuario))
                .build();
    }

    @PUT
    @Path("{id}")
    public UsuarioResponseDTO alterar(@PathParam("id") Long id,
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") UsuarioEmpresaUpdateDTO dto) {
        return UsuarioResponseMapper.toResponse(service.atualizar(getUsuarioLogado(), id, dto));
    }

    @PATCH
    @Path("{id}/ativar")
    public UsuarioResponseDTO ativar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.alterarAtivo(getUsuarioLogado(), id, true));
    }

    @PATCH
    @Path("{id}/desativar")
    public UsuarioResponseDTO desativar(@PathParam("id") Long id) {
        return UsuarioResponseMapper.toResponse(service.alterarAtivo(getUsuarioLogado(), id, false));
    }

    @DELETE
    @Path("{id}")
    public Response excluir(@PathParam("id") Long id) {
        service.excluir(getUsuarioLogado(), id);
        return Response.noContent().build();
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
