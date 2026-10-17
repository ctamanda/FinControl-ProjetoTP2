package br.unitins.tp2.fincontrol.mapper;

import br.unitins.tp2.fincontrol.dto.EmpresaResponseDTO;
import br.unitins.tp2.fincontrol.model.Empresa;

public final class EmpresaResponseMapper {

    private EmpresaResponseMapper() {
    }

    public static EmpresaResponseDTO toResponse(Empresa empresa) {
        return new EmpresaResponseDTO(
                empresa.getId(),
                empresa.getRazaoSocial(),
                empresa.getNomeFantasia(),
                empresa.getCnpj(),
                empresa.getTipo(),
                empresa.getTelefone(),
                empresa.getEmail(),
                empresa.getResponsavel().getId()
        );
    }
}
