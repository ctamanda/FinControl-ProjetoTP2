package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;
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
        long totalTransacoes,
        long totalCategorias,
        double mediaTransacoesPorUsuario,
        Long volumeDadosBytes,
        long totalRegistros,
        long novosUsuarios30Dias,
        long transacoes30Dias,
        List<CategoriaRankingDTO> categoriasMaisUtilizadas,
        List<TransacoesMesDTO> transacoesPorMes,
        List<CadastrosMesDTO> cadastrosPorMes
) {

    // "mes" no formato yyyy-MM; valor = soma movimentada (receitas + despesas) no mês.
    public record TransacoesMesDTO(String mes, long quantidade, BigDecimal valor) {
    }

    // Novas contas pessoais cadastradas no mês ("mes" no formato yyyy-MM).
    public record CadastrosMesDTO(String mes, long contasPessoais) {
    }
}
