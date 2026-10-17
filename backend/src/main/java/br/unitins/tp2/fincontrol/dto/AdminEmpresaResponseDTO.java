package br.unitins.tp2.fincontrol.dto;

import java.time.LocalDateTime;

import br.unitins.tp2.fincontrol.model.TipoEmpresa;

// Empresa vista pelo SUPER_ADMIN, com o responsável e os números vinculados.
public record AdminEmpresaResponseDTO(
        Long id,
        String razaoSocial,
        String nomeFantasia,
        String cnpj,
        TipoEmpresa tipo,
        String telefone,
        String email,
        boolean ativo,
        PessoaDTO responsavel,
        long totalUsuarios,
        long totalTransacoes,
        LocalDateTime dataCadastro
) {
}
