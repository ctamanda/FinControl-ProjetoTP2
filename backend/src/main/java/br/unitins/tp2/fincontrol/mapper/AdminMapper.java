package br.unitins.tp2.fincontrol.mapper;

import br.unitins.tp2.fincontrol.dto.AdminEmpresaResponseDTO;
import br.unitins.tp2.fincontrol.dto.AdminTransacaoResponseDTO;
import br.unitins.tp2.fincontrol.dto.AuditoriaResponseDTO;
import br.unitins.tp2.fincontrol.dto.CategoriaPadraoResponseDTO;
import br.unitins.tp2.fincontrol.dto.EmpresaResumoDTO;
import br.unitins.tp2.fincontrol.dto.PessoaDTO;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.RegistroAuditoria;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;

// Conversões das telas do SUPER_ADMIN.
public final class AdminMapper {

    private AdminMapper() {
    }

    public static PessoaDTO pessoa(Usuario usuario) {
        return new PessoaDTO(usuario.getId(), usuario.getNome(), usuario.getEmail());
    }

    public static AdminEmpresaResponseDTO empresa(Empresa empresa, long totalUsuarios, long totalTransacoes) {
        return new AdminEmpresaResponseDTO(
                empresa.getId(),
                empresa.getRazaoSocial(),
                empresa.getNomeFantasia(),
                empresa.getCnpj(),
                empresa.getTipo(),
                empresa.getTelefone(),
                empresa.getEmail(),
                empresa.isAtivo(),
                pessoa(empresa.getResponsavel()),
                totalUsuarios,
                totalTransacoes,
                empresa.getDataCadastro());
    }

    public static AdminTransacaoResponseDTO transacao(Transacao t) {
        Empresa e = t.getEmpresa();
        return new AdminTransacaoResponseDTO(
                t.getId(),
                t.getData(),
                t.getDescricao(),
                t.getValor(),
                t.getTipo(),
                t.getEscopo(),
                CategoriaResponseMapper.toResponse(t.getCategoria()),
                e == null ? null : new EmpresaResumoDTO(e.getId(),
                        e.getNomeFantasia() != null ? e.getNomeFantasia() : e.getRazaoSocial(), e.getTipo(), false),
                pessoa(t.getUsuario()));
    }

    public static CategoriaPadraoResponseDTO categoriaPadrao(CategoriaPadrao c) {
        return new CategoriaPadraoResponseDTO(
                c.getId(),
                c.getNome(),
                c.getTipo(),
                c.getCor(),
                c.isAtivo(),
                c.getDataAlteracao() != null ? c.getDataAlteracao() : c.getDataCadastro());
    }

    public static AuditoriaResponseDTO auditoria(RegistroAuditoria r) {
        return new AuditoriaResponseDTO(
                r.getId(),
                r.getDataCadastro(),
                r.getAutorId(),
                r.getAutorEmail(),
                r.getAcao(),
                r.getAlvo(),
                r.getDetalhe());
    }
}
