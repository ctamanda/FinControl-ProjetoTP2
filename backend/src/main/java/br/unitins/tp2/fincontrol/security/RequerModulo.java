package br.unitins.tp2.fincontrol.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import br.unitins.tp2.fincontrol.model.Modulo;

// O endpoint exige pelo menos um destes módulos (checado pelo AcessoFilter).
// Na classe vale para todos os métodos; no método, substitui o da classe.
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.TYPE, ElementType.METHOD })
public @interface RequerModulo {
    Modulo[] value();
}
