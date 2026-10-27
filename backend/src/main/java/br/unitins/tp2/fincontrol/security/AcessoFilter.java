package br.unitins.tp2.fincontrol.security;

import java.lang.reflect.Method;

import org.eclipse.microprofile.jwt.JsonWebToken;

import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.json.JsonNumber;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.ext.Provider;

// Roda em toda requisição autenticada, antes do endpoint:
//  1. o usuário do token ainda existe e está ativo (desativar corta o acesso na hora),
//     o perfil do token ainda é o atual e a versão da sessão do token ainda é a atual
//     (troca de senha/e-mail encerra as sessões);
//  2. se o endpoint tem @RequerModulo, o usuário precisa de pelo menos um daqueles módulos.
// O perfil (SUPER_ADMIN ou PESSOAL) continua sendo checado pelo @RolesAllowed.
@Provider
@Priority(Priorities.AUTHORIZATION + 10)
public class AcessoFilter implements ContainerRequestFilter {

    @Inject
    SecurityIdentity identity;

    @Inject
    UsuarioRepository usuarioRepository;

    @Context
    ResourceInfo resourceInfo;

    // Token sem a claim (emitido antes deste controle) vale como versão 0.
    private boolean sessaoEncerrada(Usuario usuario) {
        if (!(identity.getPrincipal() instanceof JsonWebToken token)) {
            return false;
        }
        Object claim = token.getClaim(Tokens.CLAIM_VERSAO_SESSAO);
        int versao = claim instanceof JsonNumber n ? n.intValue() : claim instanceof Number n ? n.intValue() : 0;
        return versao != usuario.getVersaoSessao();
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        if (identity == null || identity.isAnonymous()) {
            return;
        }

        Usuario usuario = usuarioRepository.findByEmail(identity.getPrincipal().getName());
        if (usuario == null) {
            throw new NotAuthorizedException("Usuário do token não encontrado.", "Bearer");
        }
        String bloqueio = Permissoes.motivoBloqueio(usuario);
        if (bloqueio != null) {
            throw new NotAuthorizedException(bloqueio, "Bearer");
        }
        // O perfil vai no token: se mudou depois do login (ex.: admin rebaixado), o token antigo deixa de valer.
        if (!identity.hasRole(usuario.getRole().name())) {
            throw new NotAuthorizedException("Seu perfil de acesso mudou. Entre novamente.", "Bearer");
        }
        // Senha/e-mail trocados ou "sair de todos os dispositivos": tokens da versão anterior não valem.
        if (sessaoEncerrada(usuario)) {
            throw new NotAuthorizedException("Sua sessão foi encerrada. Entre novamente.", "Bearer");
        }

        Method metodo = resourceInfo.getResourceMethod();
        Class<?> classe = resourceInfo.getResourceClass();
        if (metodo == null || classe == null) {
            return;
        }

        RequerModulo requer = metodo.isAnnotationPresent(RequerModulo.class)
                ? metodo.getAnnotation(RequerModulo.class)
                : classe.getAnnotation(RequerModulo.class);
        if (requer != null && !Permissoes.temAlgum(usuario, requer.value())) {
            throw new ForbiddenException("Você não tem acesso a esta funcionalidade.");
        }
    }
}
