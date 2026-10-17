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

// CNPJ com os dois dígitos verificadores conferidos. Aceita com ou sem pontuação.
// Nulo/vazio é tratado por @NotBlank.
@Documented
@Constraint(validatedBy = Cnpj.Validador.class)
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
public @interface Cnpj {

    String message() default "Informe um CNPJ válido.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class Validador implements ConstraintValidator<Cnpj, String> {

        private static final int[] PESOS_1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        private static final int[] PESOS_2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        @Override
        public boolean isValid(String valor, ConstraintValidatorContext context) {
            if (valor == null || valor.isBlank()) {
                return true;
            }
            if (!valor.matches("[\\d\\s./-]+")) {
                return false;
            }
            return valido(Documentos.soDigitos(valor));
        }

        static boolean valido(String cnpj) {
            // 00.000.000/0000-00, 11.111.111/1111-11... passam no cálculo mas não existem.
            if (cnpj.length() != 14 || cnpj.chars().distinct().count() == 1) {
                return false;
            }
            return digito(cnpj, PESOS_1) == cnpj.charAt(12) - '0'
                    && digito(cnpj, PESOS_2) == cnpj.charAt(13) - '0';
        }

        private static int digito(String cnpj, int[] pesos) {
            int soma = 0;
            for (int i = 0; i < pesos.length; i++) {
                soma += (cnpj.charAt(i) - '0') * pesos[i];
            }
            int resto = soma % 11;
            return resto < 2 ? 0 : 11 - resto;
        }
    }
}
