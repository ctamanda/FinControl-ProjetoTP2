package br.unitins.tp2.fincontrol.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.PagamentoRequestDTO;
import br.unitins.tp2.fincontrol.dto.TransacaoRequestDTO;
import br.unitins.tp2.fincontrol.exception.Problem;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Categoria;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.Escopo;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Transacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.ContaFinanceiraRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoFiltro;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;

// Transações da conta pessoal ou da empresa do usuário (ver repository.Dono).
// Com os módulos Receitas/Despesas, o usuário só vê e altera o tipo liberado;
// Lançamentos libera os dois tipos.
// Todo lançamento cai numa conta financeira; os pendentes (não pagos) são as contas
// a pagar e a receber e só entram no saldo da conta quando são pagos.
@ApplicationScoped
public class TransacaoServiceImpl implements TransacaoService {

    private static final int PAGE_SIZE_MAX = 100;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    ContaFinanceiraRepository contaRepository;

    @Inject
    ContaFinanceiraService contaService;

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
    public List<Transacao> buscar(TransacaoFiltro filtro, int page, int pageSize, Usuario usuario) {
        validarPaginacao(page, pageSize);
        return transacaoRepository.buscar(usuario, tiposVisiveis(usuario), filtro).page(page, pageSize).list();
    }

    @Override
    public long contar(TransacaoFiltro filtro, Usuario usuario) {
        return transacaoRepository.buscar(usuario, tiposVisiveis(usuario), filtro).count();
    }

    @Override
    @Transactional
    public Transacao pagar(long id, PagamentoRequestDTO pagamento, Usuario usuario) {
        Transacao transacao = buscarTransacaoOuFalhar(id, usuario);
        exigirTipoEditavel(transacao.getTipo(), usuario);
        if (transacao.isPago()) {
            throw ValidationException.of("pago", "Este lançamento já está pago.");
        }
        if (pagamento != null && pagamento.idConta() != null) {
            transacao.setConta(buscarContaOuFalhar(pagamento.idConta(), usuario, transacao.getConta()));
        }
        LocalDate data = pagamento != null && pagamento.dataPagamento() != null ? pagamento.dataPagamento() : LocalDate.now();
        exigirDataPagamentoValida(data);
        transacao.setPago(true);
        transacao.setDataPagamento(data);
        return transacao;
    }

    @Override
    @Transactional
    public Transacao reabrir(long id, Usuario usuario) {
        Transacao transacao = buscarTransacaoOuFalhar(id, usuario);
        exigirTipoEditavel(transacao.getTipo(), usuario);
        if (!transacao.isPago()) {
            throw ValidationException.of("pago", "Este lançamento ainda não foi pago.");
        }
        transacao.setPago(false);
        transacao.setDataPagamento(null);
        return transacao;
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

        // Sem conta informada: mantém a atual (edição) ou usa a conta padrão (novo lançamento).
        ContaFinanceira conta = origem.idConta() != null
                ? buscarContaOuFalhar(origem.idConta(), usuario, destino.getConta())
                : destino.getConta() != null ? destino.getConta() : contaService.padrao(usuario);

        LocalDate hoje = LocalDate.now();
        boolean pago = origem.pago() != null ? origem.pago() : !origem.data().isAfter(hoje);
        LocalDate dataPagamento = null;
        if (pago) {
            dataPagamento = origem.dataPagamento() != null
                    ? origem.dataPagamento()
                    : origem.data().isAfter(hoje) ? hoje : origem.data();
            exigirDataPagamentoValida(dataPagamento);
        }

        destino.setDescricao(origem.descricao().trim());
        destino.setValor(origem.valor());
        destino.setData(origem.data());
        destino.setTipo(origem.tipo());
        destino.setCategoria(categoria);
        destino.setConta(conta);
        destino.setPago(pago);
        destino.setDataPagamento(dataPagamento);
    }

    // Pago = o dinheiro já saiu/entrou: a data de pagamento não pode estar no futuro.
    private void exigirDataPagamentoValida(LocalDate dataPagamento) {
        if (dataPagamento.isAfter(LocalDate.now())) {
            throw ValidationException.of("dataPagamento",
                    "A data de pagamento não pode ser futura. Deixe o lançamento como pendente.");
        }
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

    // Mesma regra para a conta; conta arquivada só vale se o lançamento já estava nela.
    private ContaFinanceira buscarContaOuFalhar(Long idConta, Usuario usuario, ContaFinanceira atual) {
        ContaFinanceira conta = contaRepository.findByDonoAndId(usuario, idConta);
        if (conta == null)
            throw ValidationException.of("idConta", "Conta não encontrada.");
        if (!conta.isAtiva() && (atual == null || !atual.getId().equals(conta.getId())))
            throw ValidationException.of("idConta", "Esta conta está arquivada.");

        return conta;
    }

    private Transacao buscarTransacaoOuFalhar(long id, Usuario usuario) {
        Transacao transacao = transacaoRepository.findByDonoAndId(usuario, tiposVisiveis(usuario), id);

        if (transacao == null)
            throw new ResourceNotFoundException("Transação não encontrada.");

        return transacao;
    }
}
