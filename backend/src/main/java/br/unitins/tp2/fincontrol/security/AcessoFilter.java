package br.unitins.tp2.fincontrol.security;

import java.lang.reflect.Method;

import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.ext.Provider;

// Roda em toda requisição autenticada, antes do endpoint:
//  1. o usuário do token ainda existe e está ativo, assim como a empresa dele
//     (desativar corta o acesso na hora), e o perfil do token ainda é o atual;
//  2. ADMIN_EMPRESA sem empresa só usa o que tem @PermiteEmpresaPendente;
//  3. se o endpoint tem @RequerModulo, o usuário precisa de pelo menos um daqueles módulos.
// O perfil (SUPER_ADMIN, PESSOAL...) continua sendo checado pelo @RolesAllowed.
@Provider
@Priority(Priorities.AUTHORIZATION + 10)
public class AcessoFilter implements ContainerRequestFilter {

    @Inject
    SecurityIdentity identity;

    @Inject
    UsuarioRepository usuarioRepository;

    @Context
    ResourceInfo resourceInfo;

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

        Method metodo = resourceInfo.getResourceMethod();
        Class<?> classe = resourceInfo.getResourceClass();
        if (metodo == null || classe == null) {
            return;
        }

        if (Permissoes.empresaPendente(usuario)
                && !metodo.isAnnotationPresent(PermiteEmpresaPendente.class)
                && !classe.isAnnotationPresent(PermiteEmpresaPendente.class)) {
            throw new ForbiddenException("Cadastre a empresa para continuar.");
        }

        RequerModulo requer = metodo.isAnnotationPresent(RequerModulo.class)
                ? metodo.getAnnotation(RequerModulo.class)
                : classe.getAnnotation(RequerModulo.class);
        if (requer != null && !Permissoes.temAlgum(usuario, requer.value())) {
            throw new ForbiddenException("Você não tem acesso a esta funcionalidade.");
        }
    }
}
