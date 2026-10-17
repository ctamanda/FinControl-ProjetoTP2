package br.unitins.tp2.fincontrol.validation;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// Regras de senha usadas no cadastro e na criação de usuários da empresa.
// Cada regra tem a sua mensagem, então a resposta 400 lista tudo o que falta.
@NotBlank(message = "A senha deve ser informada.")
@Length(min = 6, max = 100, message = "A senha deve conter entre 6 e 100 caracteres.")
@Pattern(regexp = "(?s).*\\p{Lu}.*", message = "A senha deve conter pelo menos uma letra maiúscula.")
@Pattern(regexp = "(?s).*\\p{Ll}.*", message = "A senha deve conter pelo menos uma letra minúscula.")
@Pattern(regexp = "(?s).*\\p{Nd}.*", message = "A senha deve conter pelo menos um número.")
@Pattern(regexp = "(?s).*[^\\p{L}\\p{Nd}\\s].*",
        message = "A senha deve conter pelo menos um caractere especial (ex.: ! @ # $ %).")
@Documented
@Constraint(validatedBy = {})
@Target({ FIELD, METHOD, PARAMETER, ANNOTATION_TYPE })
@Retention(RUNTIME)
public @interface SenhaForte {

    String message() default "Senha fraca.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
