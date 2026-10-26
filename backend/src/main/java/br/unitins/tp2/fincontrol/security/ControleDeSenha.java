package br.unitins.tp2.fincontrol.security;

import java.time.Duration;
import java.time.LocalDateTime;

import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.service.AuditoriaService;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.WebApplicationException;

// Confere a senha (no login e na confirmação de ações sensíveis) e bloqueia a conta
// por alguns minutos depois de muitas senhas erradas seguidas (força bruta).
// Falhas e sucessos são gravados em transação própria (REQUIRES_NEW): a exceção
// lançada por quem chamou não pode desfazer a contagem.
@ApplicationScoped
public class ControleDeSenha {

    public static final int MAX_TENTATIVAS = 5;
    public static final Duration BLOQUEIO = Duration.ofMinutes(15);

    @Inject
    UsuarioRepository repository;

    @Inject
    AuditoriaService auditoria;

    // 429 se a conta está bloqueada agora.
    public void exigirDesbloqueado(Usuario usuario) {
        LocalDateTime ate = usuario.getBloqueadoAte();
        if (ate != null && ate.isAfter(LocalDateTime.now())) {
            long minutos = Math.max(1, Duration.between(LocalDateTime.now(), ate).toMinutes() + 1);
            throw new WebApplicationException(
                    "Muitas tentativas com senha errada. Tente novamente em " + minutos + " minuto(s).", 429);
        }
    }

    // true se a senha confere; registra a tentativa (e bloqueia ao atingir o limite).
    public boolean conferir(Usuario usuario, String senha) {
        exigirDesbloqueado(usuario);
        boolean ok = senha != null && BcryptUtil.matches(senha, usuario.getPassword());
        if (ok) {
            registrarSucesso(usuario.getId());
            // Quem chamou pode ter o usuário carregado na própria transação: sem isto,
            // o flush dela gravaria de volta a contagem antiga.
            usuario.setTentativasLogin(0);
            usuario.setBloqueadoAte(null);
        } else {
            registrarFalha(usuario.getId());
        }
        return ok;
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    void registrarFalha(Long id) {
        Usuario usuario = repository.findById(id);
        int tentativas = usuario.getTentativasLogin() + 1;
        if (tentativas >= MAX_TENTATIVAS) {
            usuario.setTentativasLogin(0);
            usuario.setBloqueadoAte(LocalDateTime.now().plus(BLOQUEIO));
            auditoria.registrar(usuario, "CONTA_BLOQUEADA", AuditoriaService.alvo(usuario),
                    MAX_TENTATIVAS + " senhas erradas seguidas; bloqueada por " + BLOQUEIO.toMinutes() + " minutos");
        } else {
            usuario.setTentativasLogin(tentativas);
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    void registrarSucesso(Long id) {
        Usuario usuario = repository.findById(id);
        if (usuario.getTentativasLogin() != 0 || usuario.getBloqueadoAte() != null) {
            usuario.setTentativasLogin(0);
            usuario.setBloqueadoAte(null);
        }
    }
}
