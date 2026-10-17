package br.unitins.tp2.fincontrol.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.TransacaoRequestDTO;
import br.unitins.tp2.fincontrol.exception.Problem;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;

// Transações da conta pessoal ou da empresa do usuário (ver repository.Dono).
// Com os módulos Receitas/Despesas, o usuário só vê e altera o tipo liberado;
// Lançamentos libera os dois tipos.
@ApplicationScoped
public class TransacaoServiceImpl implements TransacaoService {

    private static final int PAGE_SIZE_MAX = 100;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Override
    @Transactional
    public Transacao create(TransacaoRequestDTO transacao, Usuario usuario) {
        exigirTipoEditavel(transacao.tipo(), usuario);

        Transacao novaTransacao = new Transacao();
        aplicarDados(novaTransacao, transacao, usuario);
        novaTransacao.setUsuario(usuario);
        novaTransacao.setEmpresa(usuario.getEmpresa());
        novaTransacao.setEscopo(usuario.getEmpresa() != null ? Escopo.EMPRESA : Escopo.PESSOAL);

        transacaoRepository.persist(novaTransacao);

        return novaTransacao;
    }

    @Override
    @Transactional
    public void update(long id, TransacaoRequestDTO transacao, Usuario usuario) {
        Transacao edicaoTransacao = buscarTransacaoOuFalhar(id, usuario);
        exigirTipoEditavel(edicaoTransacao.getTipo(), usuario);
        exigirTipoEditavel(transacao.tipo(), usuario);
        aplicarDados(edicaoTransacao, transacao, usuario);
    }

    @Override
    @Transactional
    public void delete(long id, Usuario usuario) {
        Transacao transacao = buscarTransacaoOuFalhar(id, usuario);
        exigirTipoEditavel(transacao.getTipo(), usuario);
        transacaoRepository.delete(transacao);
    }

    @Override
    public Transacao findById(long id, Usuario usuario) {
        return buscarTransacaoOuFalhar(id, usuario);
    }

    @Override
    public List<Transacao> findAll(int page, int pageSize, Usuario usuario) {
        validarPaginacao(page, pageSize);
        return transacaoRepository.findByDono(usuario, tiposVisiveis(usuario)).page(page, pageSize).list();
    }

    @Override
    public List<Transacao> findByDescricao(String descricao, int page, int pageSize, Usuario usuario) {
        validarPaginacao(page, pageSize);
        return transacaoRepository.findByDonoAndDescricao(usuario, tiposVisiveis(usuario), descricao)
                .page(page, pageSize).list();
    }

    @Override
    public long count(Usuario usuario) {
        return transacaoRepository.findByDono(usuario, tiposVisiveis(usuario)).count();
    }

    @Override
    public long count(String descricao, Usuario usuario) {
        return transacaoRepository.findByDonoAndDescricao(usuario, tiposVisiveis(usuario), descricao).count();
    }

    // O AcessoFilter já garante algum dos módulos de transação; aqui fica a regra por tipo.
    private Set<TipoTransacao> tiposVisiveis(Usuario usuario) {
        Set<TipoTransacao> tipos = Permissoes.tiposVisiveis(usuario);
        if (tipos.isEmpty()) {
            throw new ForbiddenException("Você não tem acesso a esta funcionalidade.");
        }
        return tipos;
    }

    private void exigirTipoEditavel(TipoTransacao tipo, Usuario usuario) {
        if (!Permissoes.tiposEditaveis(usuario).contains(tipo)) {
            throw new ForbiddenException(tipo == TipoTransacao.RECEITA
                    ? "Você não tem acesso para registrar ou alterar receitas."
                    : "Você não tem acesso para registrar ou alterar despesas.");
        }
    }

    private void validarPaginacao(int page, int pageSize) {
        List<Problem.FieldError> erros = new ArrayList<>();

        if (page < 0)
            erros.add(new Problem.FieldError("page", "A página deve ser maior ou igual a 0."));
        if (pageSize < 1 || pageSize > PAGE_SIZE_MAX)
            erros.add(new Problem.FieldError("pageSize", "O tamanho da página deve estar entre 1 e " + PAGE_SIZE_MAX + "."));

        if (!erros.isEmpty())
            throw new ValidationException("Parâmetros de paginação inválidos", erros);
    }

    private void aplicarDados(Transacao destino, TransacaoRequestDTO origem, Usuario usuario) {
        Categoria categoria = buscarCategoriaOuFalhar(origem.idCategoria(), usuario);

        // Despesa só em categoria de despesa; receita só em categoria de receita.
        if (!categoria.getTipo().name().equals(origem.tipo().name())) {
            throw ValidationException.of("idCategoria",
                    "A categoria escolhida é de " + categoria.getTipo().name().toLowerCase()
                            + " e não combina com uma transação de " + origem.tipo().name().toLowerCase() + ".");
        }

        destino.setDescricao(origem.descricao().trim());
        destino.setValor(origem.valor());
        destino.setData(origem.data());
        destino.setTipo(origem.tipo());
        destino.setCategoria(categoria);
    }

    // Só aceita categoria do mesmo dono (conta pessoal ou empresa): sem isso daria para
    // vincular (e ler) a categoria de outra pessoa informando o id dela.
    private Categoria buscarCategoriaOuFalhar(Long idCategoria, Usuario usuario) {
        Categoria categoria = idCategoria == null
                ? null
                : categoriaRepository.findByDonoAndId(usuario, idCategoria);
        if (categoria == null)
            throw ValidationException.of("idCategoria", "Categoria não encontrada.");

        return categoria;
    }

    private Transacao buscarTransacaoOuFalhar(long id, Usuario usuario) {
        Transacao transacao = transacaoRepository.findByDonoAndId(usuario, tiposVisiveis(usuario), id);

        if (transacao == null)
            throw new ResourceNotFoundException("Transação não encontrada.");

        return transacao;
    }
}
