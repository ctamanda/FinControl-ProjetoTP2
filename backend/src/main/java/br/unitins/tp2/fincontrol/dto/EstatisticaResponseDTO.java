package br.unitins.tp2.fincontrol.dto;

import java.util.List;

// Indicadores do sistema para o SUPER_ADMIN.
// totalAdmins = administradores do FinControl (SUPER_ADMIN); totalUsers = todos os demais.
// volumeDadosBytes = tamanho do banco (nulo se o banco não informar, ex.: H2 nos testes).
public record EstatisticaResponseDTO(
        long totalUsuarios,
        long usuariosAtivos,
        long usuariosInativos,
        long totalAdmins,
        long totalUsers,
        long totalContasPessoais,
        long totalEmpresas,
        long empresasAtivas,
        long totalUsuariosEmpresa,
        long totalTransacoes,
        long totalCategorias,
        double mediaTransacoesPorUsuario,
        Long volumeDadosBytes,
        long totalRegistros,
        long novosUsuarios30Dias,
        long transacoes30Dias,
        List<CategoriaRankingDTO> categoriasMaisUtilizadas,
        List<TransacoesMesDTO> transacoesPorMes
) {

    // "mes" no formato yyyy-MM.
    public record TransacoesMesDTO(String mes, long quantidade) {
    }
}
