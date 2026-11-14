package br.unitins.tp2.fincontrol.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import br.unitins.tp2.fincontrol.dto.AssinaturaResponseDTO;
import br.unitins.tp2.fincontrol.dto.PlanoResponseDTO;
import br.unitins.tp2.fincontrol.exception.LimitePlanoException;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.model.Assinatura;
import br.unitins.tp2.fincontrol.model.Plano;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.StatusAssinatura;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.AssinaturaRepository;
import br.unitins.tp2.fincontrol.repository.ContaFinanceiraRepository;
import br.unitins.tp2.fincontrol.repository.PlanoRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AssinaturaServiceImpl implements AssinaturaService {

    @Inject
    AssinaturaRepository assinaturaRepository;

    @Inject
    PlanoRepository planoRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    ContaFinanceiraRepository contaRepository;

    @Override
    public Assinatura buscarAssinaturaAtiva(Usuario usuario) {
        return assinaturaRepository.find("usuario = ?1 and status = ?2", usuario, StatusAssinatura.ATIVA).firstResult();
    }

    @Override
    @Transactional
    public AssinaturaResponseDTO alterarPlano(Usuario usuario, Long planoId) {
        Plano novoPlano = planoRepository.findById(planoId);
        if (novoPlano == null) {
            throw new ResourceNotFoundException("Plano não encontrado.");
        }

        Assinatura assinatura = buscarAssinaturaAtiva(usuario);
        if (assinatura == null) {
            assinatura = new Assinatura();
            assinatura.setUsuario(usuario);
            assinatura.setDataInicio(LocalDate.now());
            assinatura.setStatus(StatusAssinatura.ATIVA);
            assinatura.setPlano(novoPlano);
            assinaturaRepository.persist(assinatura);
        } else {
            assinatura.setPlano(novoPlano);
            assinatura.setStatus(StatusAssinatura.ATIVA);
        }

        return mapToDto(assinatura);
    }

    @Override
    public List<PlanoResponseDTO> listarPlanos() {
        return planoRepository.listAll().stream()
                .map(this::mapPlanoToDto)
                .toList();
    }

    @Override
    public AssinaturaResponseDTO obterAssinaturaDoUsuario(Usuario usuario) {
        Assinatura assinatura = buscarAssinaturaAtiva(usuario);
        if (assinatura == null) {
            return null;
        }
        return mapToDto(assinatura);
    }

    @Override
    public void validarLimiteTransacoes(Usuario usuario) {
        if (usuario == null || usuario.getRole() == Role.SUPER_ADMIN) {
            return;
        }

        Assinatura assinatura = buscarAssinaturaAtiva(usuario);
        if (assinatura == null || assinatura.getPlano() == null) {
            return;
        }

        Plano plano = assinatura.getPlano();
        Integer limite = plano.getLimiteTransacoesMes();
        if (limite != null) {
            YearMonth mesAtual = YearMonth.now();
            LocalDate inicio = mesAtual.atDay(1);
            LocalDate fim = mesAtual.atEndOfMonth();
            long total = transacaoRepository.contarPorUsuarioENoMes(usuario, inicio, fim);
            if (total >= limite) {
                throw new LimitePlanoException("Limite mensal de " + limite + " transações atingido para o plano " + plano.getNome() + ". Faça upgrade para o plano Pro para transações ilimitadas.");
            }
        }
    }

    @Override
    public void validarLimiteContas(Usuario usuario) {
        if (usuario == null || usuario.getRole() == Role.SUPER_ADMIN) {
            return;
        }

        Assinatura assinatura = buscarAssinaturaAtiva(usuario);
        if (assinatura == null || assinatura.getPlano() == null) {
            return;
        }

        Plano plano = assinatura.getPlano();
        Integer limite = plano.getLimiteContas();
        if (limite != null) {
            long total = contaRepository.countAtivas(usuario);
            if (total >= limite) {
                throw new LimitePlanoException("Limite de " + limite + " conta(s) financeira(s) atingido para o plano " + plano.getNome() + ". Faça upgrade para o plano Pro para adicionar mais contas.");
            }
        }
    }

    private AssinaturaResponseDTO mapToDto(Assinatura assinatura) {
        return new AssinaturaResponseDTO(
                assinatura.getId(),
                mapPlanoToDto(assinatura.getPlano()),
                assinatura.getStatus().name(),
                assinatura.getDataInicio(),
                assinatura.getDataFim()
        );
    }

    private PlanoResponseDTO mapPlanoToDto(Plano plano) {
        return new PlanoResponseDTO(
                plano.getId(),
                plano.getNome(),
                plano.getDescricao(),
                plano.getValorMensal(),
                plano.getLimiteContas(),
                plano.getLimiteTransacoesMes(),
                plano.isAtivo()
        );
    }
}
