package br.unitins.tp2.fincontrol.service;

import java.util.List;

import br.unitins.tp2.fincontrol.dto.AssinaturaResponseDTO;
import br.unitins.tp2.fincontrol.dto.PlanoResponseDTO;
import br.unitins.tp2.fincontrol.model.Assinatura;
import br.unitins.tp2.fincontrol.model.Usuario;

public interface AssinaturaService {
    Assinatura buscarAssinaturaAtiva(Usuario usuario);
    AssinaturaResponseDTO alterarPlano(Usuario usuario, Long planoId);
    List<PlanoResponseDTO> listarPlanos();
    AssinaturaResponseDTO obterAssinaturaDoUsuario(Usuario usuario);

    // Fase 3: Gating de Recursos — lança LimitePlanoException se o limite for atingido.
    void validarLimiteTransacoes(Usuario usuario);
    void validarLimiteContas(Usuario usuario);
}
