package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

// Toda conta pessoal (no cadastro) e toda empresa (ao ser cadastrada) recebe uma cópia
// das categorias padrão ativas, que o SUPER_ADMIN administra (tabela categoria_padrao).
@ApplicationScoped
public class CategoriasIniciais {

    @Inject
    EntityManager entityManager;

    @Inject
    CategoriaPadraoRepository padraoRepository;

    // "empresa" nula = categorias da conta pessoal do usuário.
    public void criar(Usuario usuario, Empresa empresa) {
        for (CategoriaPadrao padrao : padraoRepository.listarAtivas()) {
            Categoria categoria = new Categoria();
            categoria.setNome(padrao.getNome());
            categoria.setTipo(padrao.getTipo());
            categoria.setCor(padrao.getCor());
            categoria.setUsuario(usuario);
            categoria.setEmpresa(empresa);
            entityManager.persist(categoria);
        }
    }
}
