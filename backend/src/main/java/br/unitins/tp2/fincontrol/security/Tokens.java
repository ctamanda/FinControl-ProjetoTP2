package br.unitins.tp2.fincontrol.security;

import java.time.Duration;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.LoginResponseDTO;
import br.unitins.tp2.fincontrol.model.Usuario;
import io.smallrye.jwt.build.Jwt;

// Emite o JWT de acesso. Usado no login e quando a própria pessoa troca senha/e-mail
// ou encerra as outras sessões (o token antigo deixa de valer e ela recebe um novo).
public final class Tokens {

    // Claim com a versão da sessão do usuário (ver AcessoFilter).
    public static final String CLAIM_VERSAO_SESSAO = "sv";

    public static final long EXPIRES_IN_SECONDS = 3600;

    private Tokens() {
    }

    public static LoginResponseDTO emitir(Usuario usuario) {
        String token = Jwt.issuer("fincontrol")
                .upn(usuario.getEmail())
                .groups(Set.of(usuario.getRole().name()))
                .claim(CLAIM_VERSAO_SESSAO, usuario.getVersaoSessao())
                .expiresIn(Duration.ofSeconds(EXPIRES_IN_SECONDS))
                .sign();
        return new LoginResponseDTO(token, EXPIRES_IN_SECONDS);
    }
}
