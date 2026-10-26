package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;

import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.TipoContaFinanceira;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

// Toda conta pessoal (no cadastro) e toda empresa (ao ser cadastrada) já nasce pronta para lançar:
//  - uma cópia das categorias padrão ativas, que o SUPER_ADMIN administra (tabela categoria_padrao);
//  - uma conta financeira inicial ("Carteira" na pessoal, "Caixa" na empresa), com saldo zero.
@ApplicationScoped
public class DadosIniciais {

    @Inject
    EntityManager entityManager;

    @Inject
    CategoriaPadraoRepository padraoRepository;

    // "empresa" nula = dados da conta pessoal do usuário.
    public void criar(Usuario usuario, Empresa empresa) {
        for (CategoriaPadrao padrao : padraoRepository.listarAtivas()) {
            Categoria categoria = new Categoria();
            categoria.setNome(padrao.getNome());
            categoria.setTipo(padrao.getTipo());
            categoria.setCor(padrao.getCor());
            categoria.setIcone(padrao.getIcone());
            categoria.setUsuario(usuario);
            categoria.setEmpresa(empresa);
            entityManager.persist(categoria);
        }

        ContaFinanceira conta = new ContaFinanceira();
        conta.setNome(empresa == null ? "Carteira" : "Caixa");
        conta.setTipo(TipoContaFinanceira.CARTEIRA);
        conta.setSaldoInicial(BigDecimal.ZERO);
        conta.setCor("#3B1478");
        conta.setUsuario(usuario);
        conta.setEmpresa(empresa);
        entityManager.persist(conta);
    }
}
