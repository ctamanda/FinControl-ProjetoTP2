package br.unitins.tp2.fincontrol.dto;

import br.unitins.tp2.fincontrol.model.TipoCategoria;

// Uso de uma categoria no sistema todo, somando as categorias de mesmo nome e tipo
// de todas as contas e empresas.
public record CategoriaRankingDTO(
        String nome,
        TipoCategoria tipo,
        long totalTransacoes,
        long totalContas
) {
}
