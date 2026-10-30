package br.unitins.tp2.fincontrol.dto;

import java.math.BigDecimal;
import java.util.List;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.TipoCategoria;

// Visão geral do painel do SUPER_ADMIN para um mês ("mes" no formato yyyy-MM).
// Todo indicador traz o mês anterior para a tela calcular a variação.
//  - usuariosAtivos: contas pessoais com pelo menos um lançamento (pela data) no mês;
//  - novosCadastros: contas pessoais criadas no mês;
//  - lancamentos / volume: quantidade e soma (receitas + despesas) dos lançamentos do mês.
public record PainelAdminDTO(
        String mes,
        Indicador usuariosAtivos,
        Indicador novosCadastros,
        Indicador lancamentos,
        IndicadorValor volume,
        Totais totais,
        List<CadastrosMes> cadastrosPorMes,
        List<UsoModulo> modulos,
        List<UsoCategoriaPadrao> categoriasPadrao,
        Seguranca seguranca,
        Engajamento engajamento
) {

    public record Indicador(long atual, long anterior) {
    }

    public record IndicadorValor(BigDecimal atual, BigDecimal anterior) {
    }

    // Situação atual dos cadastros (abas da tabela de usuários).
    public record Totais(long usuarios, long ativos, long inativos, long administradores, long contasPessoaisAtivas) {
    }

    // Os 6 meses até o mês escolhido.
    public record CadastrosMes(String mes, long contasPessoais) {
    }

    // Dentre as contas pessoais ativas: quantas deixam o módulo ligado e quantas já têm dados nele.
    // "comDados" é nulo quando o módulo não guarda nada que dê para contar (ex.: Dashboard,
    // módulos ainda sem tela).
    public record UsoModulo(Modulo modulo, long ligados, Long comDados) {
    }

    // Uso de cada categoria padrão no mês, somando as cópias de todas as contas (mesmo nome e tipo).
    public record UsoCategoriaPadrao(Long id, String nome, TipoCategoria tipo, String cor, String icone,
            boolean ativo, long lancamentos, long usuarios) {
    }

    // Situação de hoje das contas pessoais ativas (não depende do mês escolhido):
    //  - semAcesso30Dias: último login registrado há 30 dias ou mais;
    //  - nuncaLancaram: nenhum lançamento desde o cadastro;
    //  - semAcessoRegistrado: ainda sem login gravado (o último acesso é gravado desde a V19),
    //    por isso fica fora de "semAcesso30Dias".
    public record Engajamento(long semAcesso30Dias, long nuncaLancaram, long semAcessoRegistrado) {
    }

    // Eventos de segurança registrados na auditoria.
    public record Seguranca(long contasBloqueadasHoje, long senhasTrocadasSemana, long sessoesEncerradasSemana,
            long emailsTrocadosSemana) {
    }
}
