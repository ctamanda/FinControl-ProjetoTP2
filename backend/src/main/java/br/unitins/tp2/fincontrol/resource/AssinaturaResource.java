package br.unitins.tp2.fincontrol.resource;

import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.AssinaturaResponseDTO;
import br.unitins.tp2.fincontrol.dto.PlanoResponseDTO;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.service.AssinaturaService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("assinaturas")
@RolesAllowed({"SUPER_ADMIN", "PESSOAL"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AssinaturaResource {

    @Inject
    AssinaturaService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("me")
    public AssinaturaResponseDTO obterMinhaAssinatura() {
        return service.obterAssinaturaDoUsuario(getUsuarioLogado());
    }

    @GET
    @Path("planos")
    public List<PlanoResponseDTO> listarPlanosAssinatura() {
        return service.listarPlanos();
    }

    @POST
    @Path("upgrade/{planoId}")
    public AssinaturaResponseDTO alterarPlano(@PathParam("planoId") Long planoId) {
        return service.alterarPlano(getUsuarioLogado(), planoId);
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
