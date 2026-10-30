package br.unitins.tp2.fincontrol.resource;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.dto.ConfirmacaoSenhaDTO;
import br.unitins.tp2.fincontrol.dto.EmailUpdateDTO;
import br.unitins.tp2.fincontrol.dto.LoginResponseDTO;
import br.unitins.tp2.fincontrol.dto.ModulosUpdateDTO;
import br.unitins.tp2.fincontrol.dto.SenhaUpdateDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.mapper.UsuarioResponseMapper;
import br.unitins.tp2.fincontrol.security.PermiteSenhaProvisoria;
import br.unitins.tp2.fincontrol.security.Tokens;
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

// A própria conta.
// Alterar dados pessoais, senha ou e-mail exige a senha atual (reautenticação).
@Path("usuarios")
@RolesAllowed({"SUPER_ADMIN", "PESSOAL"})
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsuarioResource {

    private static final String CORPO_OBRIGATORIO = "O corpo da requisição deve ser informado.";

    @Inject
    UsuarioService usuarioService;

    @Inject
    JsonWebToken jwt;

    @GET
    @Path("me")
    @PermiteSenhaProvisoria
    public UsuarioResponseDTO buscarMeuPerfil() {
        return UsuarioResponseMapper.toResponse(usuarioService.buscarLogado(jwt.getName()));
    }

    @PUT
    @Path("me")
    public UsuarioResponseDTO atualizarMeuPerfil(@Valid @NotNull(message = CORPO_OBRIGATORIO) UsuarioUpdateDTO dto) {
        return UsuarioResponseMapper.toResponse(usuarioService.atualizarPerfil(jwt.getName(), dto));
    }

    @PUT
    @Path("me/modulos")
    @RolesAllowed("PESSOAL")
    public UsuarioResponseDTO atualizarMeusModulos(@Valid @NotNull(message = CORPO_OBRIGATORIO) ModulosUpdateDTO dto) {
        return UsuarioResponseMapper.toResponse(usuarioService.atualizarModulos(jwt.getName(), dto));
    }

    // Os três abaixo invalidam os tokens antigos e devolvem um novo para esta sessão continuar.

    @PUT
    @Path("me/senha")
    @PermiteSenhaProvisoria
    public LoginResponseDTO alterarMinhaSenha(@Valid @NotNull(message = CORPO_OBRIGATORIO) SenhaUpdateDTO dto) {
        return Tokens.emitir(usuarioService.alterarSenha(jwt.getName(), dto));
    }

    @PUT
    @Path("me/email")
    public LoginResponseDTO alterarMeuEmail(@Valid @NotNull(message = CORPO_OBRIGATORIO) EmailUpdateDTO dto) {
        return Tokens.emitir(usuarioService.alterarEmail(jwt.getName(), dto));
    }

    @POST
    @Path("me/encerrar-sessoes")
    public LoginResponseDTO encerrarOutrasSessoes(@Valid @NotNull(message = CORPO_OBRIGATORIO) ConfirmacaoSenhaDTO dto) {
        return Tokens.emitir(usuarioService.encerrarOutrasSessoes(jwt.getName(), dto));
    }
}
