package br.unitins.tp2.fincontrol.mapper;

import br.unitins.tp2.fincontrol.dto.EmpresaResumoDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioResponseDTO;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.security.Permissoes;

public final class UsuarioResponseMapper {

    private UsuarioResponseMapper() {
    }

    public static UsuarioResponseDTO toResponse(Usuario usuario) {
        Empresa empresa = usuario.getEmpresa();
        EmpresaResumoDTO resumo = empresa == null
                ? null
                : new EmpresaResumoDTO(
                        empresa.getId(),
                        empresa.getNomeFantasia() != null ? empresa.getNomeFantasia() : empresa.getRazaoSocial(),
                        empresa.getTipo(),
                        empresa.getResponsavel().getId().equals(usuario.getId()));

        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNome(),
                usuario.getTelefone(),
                usuario.getProfissao(),
                usuario.getRole(),
                usuario.isAtivo(),
                Permissoes.efetivos(usuario),
                resumo,
                Permissoes.empresaPendente(usuario),
                usuario.getDataCadastro()
        );
    }
}
