package br.unitins.tp2.fincontrol.security;

import java.util.Arrays;
import java.util.Collection;
import java.util.EnumSet;
import java.util.Set;

import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Usuario;

// Quem pode usar o quê. Toda regra de acesso por módulo passa por aqui.
public final class Permissoes {

    private Permissoes() {
    }

    public static Set<Modulo> todos() {
        return EnumSet.allOf(Modulo.class);
    }

    // Módulos que o usuário pode usar de fato.
    //  - SUPER_ADMIN: todos, para os próprios lançamentos.
    //  - PESSOAL: os que escolheu.
    public static Set<Modulo> efetivos(Usuario usuario) {
        if (usuario.getRole() == Role.SUPER_ADMIN) {
            return todos();
        }
        Set<Modulo> escolhidos = EnumSet.noneOf(Modulo.class);
        escolhidos.addAll(usuario.getModulos());
        return escolhidos;
    }

    public static boolean temAlgum(Usuario usuario, Modulo... modulos) {
        Set<Modulo> efetivos = efetivos(usuario);
        return Arrays.stream(modulos).anyMatch(efetivos::contains);
    }

    // Motivo para não deixar o usuário entrar/usar o sistema, ou null se estiver liberado.
    public static String motivoBloqueio(Usuario usuario) {
        return usuario.isAtivo() ? null : "Usuário desativado. Fale com o suporte do FinControl.";
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

    // Módulos vindos do cliente (nome desconhecido já vira 400 na leitura do JSON).
    public static Set<Modulo> escolhidos(Collection<Modulo> pedidos) {
        Set<Modulo> aceitos = EnumSet.noneOf(Modulo.class);
        pedidos.stream().filter(m -> m != null).forEach(aceitos::add);
        return aceitos;
    }
}
