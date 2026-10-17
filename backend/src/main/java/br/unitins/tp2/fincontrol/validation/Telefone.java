package br.unitins.tp2.fincontrol.validation;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

// Telefone brasileiro com DDD: 10 dígitos (fixo) ou 11 (celular, começando com 9).
// Aceita pontuação na entrada, ex.: (63) 99999-0000. Nulo/vazio é tratado por @NotBlank.
@Documented
@Constraint(validatedBy = Telefone.Validador.class)
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
public @interface Telefone {

    String message() default "Informe um telefone válido com DDD, ex.: (63) 99999-0000.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class Validador implements ConstraintValidator<Telefone, String> {

        @Override
        public boolean isValid(String valor, ConstraintValidatorContext context) {
            if (valor == null || valor.isBlank()) {
                return true;
            }
            if (!valor.matches("[\\d\\s()+.-]+")) {
                return false;
            }
            return valido(Documentos.soDigitos(valor));
        }

        static boolean valido(String digitos) {
            if (digitos.length() == 10) {
                return digitos.charAt(0) != '0';
            }
            return digitos.length() == 11 && digitos.charAt(0) != '0' && digitos.charAt(2) == '9';
        }
    }
}
