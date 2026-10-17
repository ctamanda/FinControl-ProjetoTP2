package br.unitins.tp2.fincontrol.repository;

import java.util.List;

import br.unitins.tp2.fincontrol.model.Usuario;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    // E-mail não diferencia maiúsculas: "Maria@x.com" e "maria@x.com" são a mesma conta.
    public Usuario findByEmail(String email) {
        if (email == null) {
            return null;
        }
        return find("lower(email) = ?1", email.trim().toLowerCase()).firstResult();
    }

    public List<Usuario> findByEmpresa(Long empresaId) {
        return find("empresa.id = ?1 order by nome", empresaId).list();
    }

    public Usuario findByEmpresaAndId(Long empresaId, Long id) {
        return find("empresa.id = ?1 and id = ?2", empresaId, id).firstResult();
    }
}
