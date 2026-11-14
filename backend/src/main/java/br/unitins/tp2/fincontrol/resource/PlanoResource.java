package br.unitins.tp2.fincontrol.resource;

import java.util.List;

import br.unitins.tp2.fincontrol.dto.PlanoResponseDTO;
import br.unitins.tp2.fincontrol.service.AssinaturaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("planos")
@RolesAllowed({"SUPER_ADMIN", "PESSOAL"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlanoResource {

    @Inject
    AssinaturaService service;

    @GET
    public List<PlanoResponseDTO> listar() {
        return service.listarPlanos();
    }
}
