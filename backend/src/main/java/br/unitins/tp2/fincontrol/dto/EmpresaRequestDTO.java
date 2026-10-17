package br.unitins.tp2.fincontrol.dto;

import org.hibernate.validator.constraints.Length;

import br.unitins.tp2.fincontrol.model.TipoEmpresa;
import br.unitins.tp2.fincontrol.validation.Cnpj;
import br.unitins.tp2.fincontrol.validation.Telefone;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EmpresaRequestDTO(

        @NotBlank(message = "O nome da empresa deve ser informado.")
        @Length(max = 150, message = "O nome da empresa deve conter no máximo 150 caracteres.")
        String razaoSocial,

        @Length(max = 150, message = "O nome fantasia deve conter no máximo 150 caracteres.")
        String nomeFantasia,

        @NotBlank(message = "O CNPJ deve ser informado.")
        @Cnpj
        String cnpj,

        @NotNull(message = "Escolha o tipo da empresa: MEI ou MICROEMPRESA.")
        TipoEmpresa tipo,

        @NotBlank(message = "O telefone da empresa deve ser informado.")
        @Telefone
        String telefone,

        @NotBlank(message = "O e-mail da empresa deve ser informado.")
        @Email(message = "Informe um endereço de e-mail válido.")
        @Length(max = 254, message = "O e-mail deve conter no máximo 254 caracteres.")
        String email

) {
}
