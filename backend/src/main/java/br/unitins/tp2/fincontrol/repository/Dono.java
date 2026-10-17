package br.unitins.tp2.fincontrol.repository;

import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.panache.common.Parameters;

// Dono dos dados financeiros: a empresa (todos os usuários dela enxergam o mesmo)
// ou, numa conta pessoal, o próprio usuário. Usado no "where" de categorias e transações.
final class Dono {

    private Dono() {
    }

    static String filtro(Usuario usuario) {
        return usuario.getEmpresa() != null
                ? "empresa.id = :dono"
                : "usuario.id = :dono and empresa is null";
    }

    static Parameters parametros(Usuario usuario) {
        return Parameters.with("dono",
                usuario.getEmpresa() != null ? usuario.getEmpresa().getId() : usuario.getId());
    }
}
