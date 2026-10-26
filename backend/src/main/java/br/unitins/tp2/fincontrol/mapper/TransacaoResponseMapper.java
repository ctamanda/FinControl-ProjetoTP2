package br.unitins.tp2.fincontrol.mapper;

import br.unitins.tp2.fincontrol.dto.ContaResumoDTO;
import br.unitins.tp2.fincontrol.dto.TransacaoResponseDTO;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Transacao;

public final class TransacaoResponseMapper {

    private TransacaoResponseMapper() {
    }

    public static TransacaoResponseDTO toResponse(Transacao transacao) {
        ContaFinanceira conta = transacao.getConta();
        return new TransacaoResponseDTO(
                transacao.getId(),
                transacao.getDescricao(),
                transacao.getValor(),
                transacao.getData(),
                transacao.getTipo(),
                transacao.getEscopo(),
                CategoriaResponseMapper.toResponse(transacao.getCategoria()),
                AdminMapper.pessoa(transacao.getUsuario()),
                new ContaResumoDTO(conta.getId(), conta.getNome(), conta.getTipo(), conta.getCor()),
                transacao.isPago(),
                transacao.getDataPagamento(),
                transacao.getStatus());
    }
}
