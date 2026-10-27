package br.unitins.tp2.fincontrol.resource;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.PageResponse;
import br.unitins.tp2.fincontrol.dto.PagamentoRequestDTO;
import br.unitins.tp2.fincontrol.dto.TransacaoRequestDTO;
import br.unitins.tp2.fincontrol.dto.TransacaoResponseDTO;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.mapper.TransacaoResponseMapper;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.StatusPagamento;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.TransacaoFiltro;
import br.unitins.tp2.fincontrol.security.RequerModulo;
import br.unitins.tp2.fincontrol.service.TransacaoService;
import br.unitins.tp2.fincontrol.service.UsuarioService;
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

@Path("transacoes")
@RolesAllowed({"SUPER_ADMIN", "PESSOAL"})
// Receitas/Despesas limitam ao seu tipo (regra no TransacaoServiceImpl); o Dashboard só lê.
@RequerModulo({Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransacaoResource {

    @Inject
    TransacaoService service;

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    // Filtros opcionais: descricao, tipo (RECEITA/DESPESA), status (PAGO/PENDENTE/ATRASADO),
    // mes (aaaa-mm, pela data/vencimento) e idConta. Pendentes vêm do vencimento mais próximo.
    @GET
    @RequerModulo({Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS, Modulo.DASHBOARD})
    public PageResponse<TransacaoResponseDTO> buscarTodos(@QueryParam("descricao") String descricao,
            @QueryParam("tipo") TipoTransacao tipo,
            @QueryParam("status") StatusPagamento status,
            @QueryParam("mes") String mes,
            @QueryParam("idConta") Long idConta,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("pageSize") @DefaultValue("10") int pageSize) {

        Usuario usuario = getUsuarioLogado();
        TransacaoFiltro filtro = new TransacaoFiltro(descricao, tipo, status, mes(mes), idConta);

        List<Transacao> transacoes = service.buscar(filtro, page, pageSize, usuario);
        long totalItems = service.contar(filtro, usuario);

        return PageResponse.of(transacoes, page, pageSize, totalItems, TransacaoResponseMapper::toResponse);
    }

    @GET
    @RequerModulo({Modulo.LANCAMENTOS, Modulo.RECEITAS, Modulo.DESPESAS, Modulo.DASHBOARD})
    @Path("/{id}")
    public TransacaoResponseDTO buscarPorId(@PathParam("id") Long id) {
        return TransacaoResponseMapper.toResponse(service.findById(id, getUsuarioLogado()));
    }

    @POST
    public Response incluir(
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") TransacaoRequestDTO dto) {
        Transacao transacao = service.create(dto, getUsuarioLogado());
        return Response.status(Response.Status.CREATED)
                .entity(TransacaoResponseMapper.toResponse(transacao))
                .build();
    }

    @PUT
    @Path("/{id}")
    public void alterar(@PathParam("id") Long id,
            @Valid @NotNull(message = "O corpo da requisição deve ser informado.") TransacaoRequestDTO transacao) {
        service.update(id, transacao, getUsuarioLogado());
    }

    // Corpo opcional: { "dataPagamento": "2026-10-26", "idConta": 3 }.
    @PATCH
    @Path("/{id}/pagar")
    public TransacaoResponseDTO pagar(@PathParam("id") Long id, PagamentoRequestDTO pagamento) {
        return TransacaoResponseMapper.toResponse(service.pagar(id, pagamento, getUsuarioLogado()));
    }

    @PATCH
    @Path("/{id}/reabrir")
    public TransacaoResponseDTO reabrir(@PathParam("id") Long id) {
        return TransacaoResponseMapper.toResponse(service.reabrir(id, getUsuarioLogado()));
    }

    @DELETE
    @Path("/{id}")
    public void apagar(@PathParam("id") Long id) {
        service.delete(id, getUsuarioLogado());
    }

    private static YearMonth mes(String mes) {
        if (mes == null || mes.isBlank()) {
            return null;
        }
        try {
            return YearMonth.parse(mes.trim());
        } catch (DateTimeParseException e) {
            throw ValidationException.of("mes", "Informe o mês no formato aaaa-mm (ex.: 2026-10).");
        }
    }

    // O upn do JWT contém o e-mail do usuário autenticado.
    private Usuario getUsuarioLogado() {
        return usuarioService.buscarLogado(jwt.getName());
    }
}
