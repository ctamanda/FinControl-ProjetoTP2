package br.unitins.tp2.fincontrol.repository;

import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.panache.common.Parameters;

// Dono dos dados financeiros: sempre o próprio usuário. Usado no "where" de categorias,
// contas e transações; dado de outro usuário simplesmente não é encontrado (404).
final class Dono {

    private Dono() {
    }

    static String filtro(Usuario usuario) {
        return "usuario.id = :dono";
    }

    static Parameters parametros(Usuario usuario) {
        return Parameters.with("dono", usuario.getId());
    }
}
