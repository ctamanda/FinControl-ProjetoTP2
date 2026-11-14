package br.unitins.tp2.fincontrol.exception;

import java.time.OffsetDateTime;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
@ApplicationScoped
public class LimitePlanoExceptionMapper implements ExceptionMapper<LimitePlanoException> {

    @Context
    UriInfo uri;

    @ConfigProperty(name = "problem.base-url")
    String baseUrl;

    @Override
    public Response toResponse(LimitePlanoException e) {
        var p = new Problem();
        p.type = baseUrl + "/errors/limite-plano";
        p.title = "Limite do plano atingido";
        p.status = 402;
        p.detail = e.getMessage();
        p.instance = (uri != null ? uri.getRequestUri().getPath() : null);
        p.timestamp = OffsetDateTime.now();
        return Response.status(402).type("application/problem+json").entity(p).build();
    }
}
