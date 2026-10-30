package br.unitins.tp2.fincontrol.security;

import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

// Endpoint que continua liberado enquanto a pessoa está com senha provisória
// (ver o próprio perfil e trocar a senha). Os demais respondem 403 até a troca.
@Retention(RUNTIME)
@Target(METHOD)
public @interface PermiteSenhaProvisoria {
}
