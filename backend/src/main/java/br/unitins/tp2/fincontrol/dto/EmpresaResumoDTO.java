package br.unitins.tp2.fincontrol.dto;

import br.unitins.tp2.fincontrol.model.TipoEmpresa;

// Dados da empresa que vão junto com o usuário (para o cabeçalho do front).
public record EmpresaResumoDTO(
        Long id,
        String nome,
        TipoEmpresa tipo,
        boolean responsavel
) {
}
