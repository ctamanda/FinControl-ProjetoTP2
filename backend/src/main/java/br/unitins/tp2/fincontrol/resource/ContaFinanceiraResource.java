package br.unitins.tp2.fincontrol.resource;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.ContaFinanceiraRequestDTO;
import br.unitins.tp2.fincontrol.dto.ContaFinanceiraResponseDTO;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.security.RequerModulo;
import br.unitins.tp2.fincontrol.service.ContaFinanceiraService;
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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

// Contas financeiras (bancos, carteira...). Ver a lista serve a quem lança (para escolher
// a conta) e ao dashboard; cadastrar, alterar, arquivar e excluir exige o módulo Contas.
@Path("contas")
@RolesAllowed({"PESSOAL", "ADMIN_EMPRESA", "USUARIO_EMPRESA"})
@RequerModulo(Modulo.CONTAS)
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContaFinanceiraResource {

    private static final String CORPO_OBRIGATORIO = "O corpo da requisição deve ser informado.";

    @Inject
    ContaFinanceiraService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    // mes = 'yyyy-MM' (padrão: mês atual); inativas = true inclui as arquivadas.
    @GET
    @RequerModulo({Modulo.CONTAS, Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS, Modulo.DASHBOARD})
    public List<ContaFinanceiraResponseDTO> listar(@QueryParam("mes") String mes, @QueryParam("inativas") boolean inativas) {
        Usuario usuario = getUsuarioLogado();
        return service.comSaldos(service.listar(usuario, inativas), mes(mes));
    }

    @GET
    @Path("/{id}")
    @RequerModulo({Modulo.CONTAS, Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS, Modulo.DASHBOARD})
    public ContaFinanceiraResponseDTO buscar(@PathParam("id") Long id, @QueryParam("mes") String mes) {
        return comSaldo(service.buscar(id, getUsuarioLogado()), mes);
    }

    @POST
    public Response criar(@Valid @NotNull(message = CORPO_OBRIGATORIO) ContaFinanceiraRequestDTO dto) {
        ContaFinanceira conta = service.criar(dto, getUsuarioLogado());
        return Response.status(Response.Status.CREATED).entity(comSaldo(conta, null)).build();
    }

    @PUT
    @Path("/{id}")
    public ContaFinanceiraResponseDTO alterar(@PathParam("id") Long id,
            @Valid @NotNull(message = CORPO_OBRIGATORIO) ContaFinanceiraRequestDTO dto) {
        return comSaldo(service.atualizar(id, dto, getUsuarioLogado()), null);
    }

    @PATCH
    @Path("/{id}/arquivar")
    public ContaFinanceiraResponseDTO arquivar(@PathParam("id") Long id) {
        return comSaldo(service.alterarAtiva(id, false, getUsuarioLogado()), null);
    }

    @PATCH
    @Path("/{id}/reativar")
    public ContaFinanceiraResponseDTO reativar(@PathParam("id") Long id) {
        return comSaldo(service.alterarAtiva(id, true, getUsuarioLogado()), null);
    }

    @DELETE
    @Path("/{id}")
    public Response excluir(@PathParam("id") Long id) {
        service.excluir(id, getUsuarioLogado());
        return Response.noContent().build();
    }

    private ContaFinanceiraResponseDTO comSaldo(ContaFinanceira conta, String mes) {
        return service.comSaldos(List.of(conta), mes(mes)).get(0);
    }

    private static YearMonth mes(String mes) {
        if (mes == null || mes.isBlank()) {
            return YearMonth.now();
        }
        try {
            return YearMonth.parse(mes.trim());
        } catch (DateTimeParseException e) {
            throw ValidationException.of("mes", "Informe o mês no formato aaaa-mm (ex.: 2026-10).");
        }
    }

    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
