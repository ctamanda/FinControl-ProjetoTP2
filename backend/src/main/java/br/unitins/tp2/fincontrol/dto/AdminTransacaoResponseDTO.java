package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.TipoTransacao;

// Transação vista pelo SUPER_ADMIN (só leitura), com o dono identificado:
// a empresa (nula na conta pessoal) e quem lançou.
public record AdminTransacaoResponseDTO(
        Long id,
        LocalDate data,
        String descricao,
        BigDecimal valor,
        TipoTransacao tipo,
        Escopo escopo,
        CategoriaResponseDTO categoria,
        EmpresaResumoDTO empresa,
        PessoaDTO usuario
) {
}
