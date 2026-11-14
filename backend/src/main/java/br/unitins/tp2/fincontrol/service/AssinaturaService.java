package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.model.Assinatura;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.dto.AssinaturaResponseDTO;
import br.unitins.tp2.fincontrol.dto.PlanoResponseDTO;

import java.util.List;

public interface AssinaturaService {
    Assinatura buscarAssinaturaAtiva(Usuario usuario);
    AssinaturaResponseDTO alterarPlano(Usuario usuario, Long planoId);
    List<PlanoResponseDTO> listarPlanos();
    AssinaturaResponseDTO obterAssinaturaDoUsuario(Usuario usuario);
}
