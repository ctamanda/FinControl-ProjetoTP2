package br.unitins.tp2.fincontrol.service;

import java.util.List;

import br.unitins.tp2.fincontrol.dto.PagamentoRequestDTO;
import br.unitins.tp2.fincontrol.dto.TransacaoRequestDTO;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.TransacaoFiltro;
import jakarta.validation.Valid;

public interface TransacaoService {

    Transacao create(@Valid TransacaoRequestDTO transacao, Usuario usuario);
    void update(long id, @Valid TransacaoRequestDTO transacao, Usuario usuario);
    void delete(long id, Usuario usuario);
    Transacao findById(long id, Usuario usuario);
    List<Transacao> buscar(TransacaoFiltro filtro, int page, int pageSize, Usuario usuario);
    long contar(TransacaoFiltro filtro, Usuario usuario);
    // Conta a pagar/receber vira paga (sai/entra no saldo); "reabrir" desfaz.
    Transacao pagar(long id, PagamentoRequestDTO pagamento, Usuario usuario);
    Transacao reabrir(long id, Usuario usuario);
}
