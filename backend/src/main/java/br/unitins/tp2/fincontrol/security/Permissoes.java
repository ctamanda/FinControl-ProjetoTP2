package br.unitins.tp2.fincontrol.security;

import java.util.Arrays;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Set;
import java.util.function.Predicate;

import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Usuario;

// Quem pode usar o quê. Toda regra de acesso por módulo passa por aqui.
public final class Permissoes {

    private Permissoes() {
    }

    public static Set<Modulo> pessoais() {
        return filtrar(EnumSet.allOf(Modulo.class), Modulo::isPessoal);
    }

    public static Set<Modulo> liberaveisNaEmpresa() {
        return filtrar(EnumSet.allOf(Modulo.class), Modulo::isLiberavelNaEmpresa);
    }

    // Módulos que o usuário pode usar de fato.
    //  - SUPER_ADMIN: os pessoais, para os próprios lançamentos.
    //  - PESSOAL: os que escolheu (dentre os pessoais).
    //  - ADMIN_EMPRESA: todos, depois de cadastrar a empresa.
    //  - USUARIO_EMPRESA: os que o admin liberou.
    public static Set<Modulo> efetivos(Usuario usuario) {
        return switch (usuario.getRole()) {
            case SUPER_ADMIN -> pessoais();
            case PESSOAL -> filtrar(usuario.getModulos(), Modulo::isPessoal);
            case ADMIN_EMPRESA -> usuario.getEmpresa() == null
                    ? EnumSet.noneOf(Modulo.class)
                    : EnumSet.allOf(Modulo.class);
            case USUARIO_EMPRESA -> filtrar(usuario.getModulos(), Modulo::isLiberavelNaEmpresa);
        };
    }

    public static boolean temAlgum(Usuario usuario, Modulo... modulos) {
        Set<Modulo> efetivos = efetivos(usuario);
        return Arrays.stream(modulos).anyMatch(efetivos::contains);
    }

    // Motivo para não deixar o usuário entrar/usar o sistema, ou null se estiver liberado.
    public static String motivoBloqueio(Usuario usuario) {
        if (!usuario.isAtivo()) {
            return usuario.getEmpresa() != null
                    ? "Usuário desativado. Fale com o administrador da empresa."
                    : "Usuário desativado. Fale com o suporte do FinControl.";
        }
        if (usuario.getEmpresa() != null && !usuario.getEmpresa().isAtivo()) {
            return "Empresa desativada. Fale com o suporte do FinControl.";
        }
        return null;
    }

    public static boolean empresaPendente(Usuario usuario) {
        return usuario.getRole() == Role.ADMIN_EMPRESA && usuario.getEmpresa() == null;
    }

    // Dashboard e Lançamentos mostram tudo; sem eles, Receitas/Despesas mostram só o seu tipo.
    public static Set<TipoTransacao> tiposVisiveis(Usuario usuario) {
        if (temAlgum(usuario, Modulo.DASHBOARD, Modulo.LANCAMENTOS)) {
            return EnumSet.allOf(TipoTransacao.class);
        }
        return tiposEditaveis(usuario);
    }

    // Lançamentos edita qualquer tipo; Receitas/Despesas, só o seu.
    public static Set<TipoTransacao> tiposEditaveis(Usuario usuario) {
        if (temAlgum(usuario, Modulo.LANCAMENTOS)) {
            return EnumSet.allOf(TipoTransacao.class);
        }
        Set<TipoTransacao> tipos = EnumSet.noneOf(TipoTransacao.class);
        if (temAlgum(usuario, Modulo.RECEITAS)) {
            tipos.add(TipoTransacao.RECEITA);
        }
        if (temAlgum(usuario, Modulo.DESPESAS)) {
            tipos.add(TipoTransacao.DESPESA);
        }
        return tipos;
    }

    // Confere módulos vindos do cliente: qualquer um fora da regra vira 400 listando os inválidos.
    public static Set<Modulo> exigirPermitidos(Collection<Modulo> pedidos, Predicate<Modulo> permitido,
            String mensagem) {
        Set<Modulo> aceitos = EnumSet.noneOf(Modulo.class);
        Set<Modulo> invalidos = EnumSet.noneOf(Modulo.class);
        for (Modulo modulo : pedidos) {
            if (modulo != null) {
                (permitido.test(modulo) ? aceitos : invalidos).add(modulo);
            }
        }
        if (!invalidos.isEmpty()) {
            throw ValidationException.of("modulos", mensagem + invalidos + ".");
        }
        return aceitos;
    }

    private static Set<Modulo> filtrar(Collection<Modulo> modulos, Predicate<Modulo> regra) {
        Set<Modulo> resultado = EnumSet.noneOf(Modulo.class);
        modulos.stream().filter(regra).forEach(resultado::add);
        return resultado;
    }
}
