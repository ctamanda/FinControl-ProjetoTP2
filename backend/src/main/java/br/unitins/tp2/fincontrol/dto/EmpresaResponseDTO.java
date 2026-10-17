package br.unitins.tp2.fincontrol.dto;

import br.unitins.tp2.fincontrol.model.TipoEmpresa;

public record EmpresaResponseDTO(
        Long id,
        String razaoSocial,
        String nomeFantasia,
        String cnpj,
        TipoEmpresa tipo,
        String telefone,
        String email,
        Long idResponsavel
) {
}
