package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;

import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

// Toda conta pessoal já nasce pronta para lançar:
//  - uma cópia das categorias padrão ativas, que o SUPER_ADMIN administra (tabela categoria_padrao);
//  - uma conta financeira inicial ("Carteira"), com saldo zero.
@ApplicationScoped
public class DadosIniciais {

    @Inject
    EntityManager entityManager;

    @Inject
    CategoriaPadraoRepository padraoRepository;

    public void criar(Usuario usuario) {
        for (CategoriaPadrao padrao : padraoRepository.listarAtivas()) {
            Categoria categoria = new Categoria();
            categoria.setNome(padrao.getNome());
            categoria.setTipo(padrao.getTipo());
            categoria.setCor(padrao.getCor());
            categoria.setIcone(padrao.getIcone());
            categoria.setUsuario(usuario);
            entityManager.persist(categoria);
        }

        ContaFinanceira conta = new ContaFinanceira();
        conta.setNome("Carteira");
        conta.setTipo(TipoContaFinanceira.CARTEIRA);
        conta.setSaldoInicial(BigDecimal.ZERO);
        conta.setCor("#3B1478");
        conta.setUsuario(usuario);
        entityManager.persist(conta);
    }
}
