package br.unitins.tp2.fincontrol.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// Endpoints que o ADMIN_EMPRESA pode usar antes de cadastrar a empresa
// (ver o próprio perfil e cadastrar a empresa). Todo o resto responde 403.
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.METHOD })
public @interface PermiteEmpresaPendente {
}
