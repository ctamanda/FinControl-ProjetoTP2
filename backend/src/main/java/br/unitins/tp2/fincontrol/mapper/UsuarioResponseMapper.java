package br.unitins.tp2.fincontrol.mapper;

import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.security.Permissoes;

public final class UsuarioResponseMapper {

    private UsuarioResponseMapper() {
    }

    public static UsuarioResponseDTO toResponse(Usuario usuario) {
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getTelefone(),
                usuario.getProfissao(),
                usuario.getRole(),
                usuario.isAtivo(),
                Permissoes.efetivos(usuario),
                usuario.getDataCadastro(),
                usuario.getUltimoAcesso(),
                usuario.isBloqueado() ? usuario.getBloqueadoAte() : null,
                usuario.isTrocarSenha()
        );
    }
}
