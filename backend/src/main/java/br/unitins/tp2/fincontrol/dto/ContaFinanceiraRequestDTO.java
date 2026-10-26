package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

// Saldo inicial pode ser negativo (conta no cheque especial).
public record ContaFinanceiraRequestDTO(

        @NotBlank(message = "O nome da conta deve ser informado.")
        @Length(min = 2, max = 60, message = "O nome deve conter entre 2 e 60 caracteres.")
        String nome,

        @NotNull(message = "O tipo da conta deve ser informado.")
        TipoContaFinanceira tipo,

        @NotNull(message = "O saldo inicial deve ser informado.")
        @Digits(integer = 13, fraction = 2, message = "O saldo deve ter no máximo 13 dígitos inteiros e 2 casas decimais.")
        BigDecimal saldoInicial,

        @Pattern(regexp = "^$|^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
                message = "A cor deve estar no formato hexadecimal (ex: #FFFFFF).")
        String cor

) {
}
