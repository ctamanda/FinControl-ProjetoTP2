package br.unitins.tp2.fincontrol.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.EmpresaRequestDTO;
import br.unitins.tp2.fincontrol.dto.EmpresaResponseDTO;
import br.unitins.tp2.fincontrol.mapper.EmpresaResponseMapper;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.security.PermiteEmpresaPendente;
import br.unitins.tp2.fincontrol.service.EmpresaService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

// Empresa do usuário logado. Só o admin cadastra e edita; os usuários comuns só consultam.
@Path("empresa")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmpresaResource {

    @Inject
    EmpresaService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    @RolesAllowed({"ADMIN_EMPRESA", "USUARIO_EMPRESA"})
    public EmpresaResponseDTO buscar() {
        return EmpresaResponseMapper.toResponse(service.buscar(getUsuarioLogado()));
    }

    @POST
    @RolesAllowed("ADMIN_EMPRESA")
    @PermiteEmpresaPendente
    public Response cadastrar(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") EmpresaRequestDTO dto) {
        Empresa empresa = service.criar(dto, getUsuarioLogado());
        return Response.status(Response.Status.CREATED)
                .entity(EmpresaResponseMapper.toResponse(empresa))
                .build();
    }

    @PUT
    @RolesAllowed("ADMIN_EMPRESA")
    public EmpresaResponseDTO alterar(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") EmpresaRequestDTO dto) {
        return EmpresaResponseMapper.toResponse(service.atualizar(dto, getUsuarioLogado()));
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
