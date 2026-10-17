package br.unitins.tp2.fincontrol.dto;

// Identificação curta de um usuário em listagens administrativas.
public record PessoaDTO(
        Long id,
        String nome,
        String email
) {
}
