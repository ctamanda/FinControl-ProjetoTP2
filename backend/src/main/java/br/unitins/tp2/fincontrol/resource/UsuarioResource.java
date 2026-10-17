package br.unitins.tp2.fincontrol.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.mapper.UsuarioResponseMapper;
import br.unitins.tp2.fincontrol.security.PermiteEmpresaPendente;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

// O próprio perfil fica liberado mesmo com a empresa pendente:
// é por ele que o front descobre que precisa mandar para o cadastro da empresa.
@Path("usuarios")
@RolesAllowed({"SUPER_ADMIN", "PESSOAL", "ADMIN_EMPRESA", "USUARIO_EMPRESA"})
@PermiteEmpresaPendente
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("me")
    public UsuarioResponseDTO buscarMeuPerfil() {
        return UsuarioResponseMapper.toResponse(usuarioService.buscarLogado(jwt.getName()));
    }

    @PUT
    @Path("me")
    public UsuarioResponseDTO atualizarMeuPerfil(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") UsuarioUpdateDTO dto) {
        return UsuarioResponseMapper.toResponse(usuarioService.atualizarPerfil(jwt.getName(), dto));
    }
}
