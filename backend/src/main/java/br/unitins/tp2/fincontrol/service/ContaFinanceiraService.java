package br.unitins.tp2.fincontrol.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import br.unitins.tp2.fincontrol.dto.ContaFinanceiraRequestDTO;
import br.unitins.tp2.fincontrol.dto.ContaFinanceiraResponseDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.ContaFinanceira;
import br.unitins.tp2.fincontrol.model.TipoTransacao;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.ContaFinanceiraRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

// Contas financeiras da conta pessoal ou da empresa (ver repository.Dono).
// Os saldos não são gravados: saem dos lançamentos a cada consulta.
@ApplicationScoped
public class ContaFinanceiraService {

    @Inject
    ContaFinanceiraRepository repository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    EntityManager entityManager;

    @Transactional
    public ContaFinanceira criar(ContaFinanceiraRequestDTO dto, Usuario usuario) {
        ContaFinanceira conta = new ContaFinanceira();
        conta.setUsuario(usuario);
        conta.setEmpresa(usuario.getEmpresa());
        aplicarDados(conta, dto, usuario);
        repository.persist(conta);
        return conta;
    }

    @Transactional
    public ContaFinanceira atualizar(Long id, ContaFinanceiraRequestDTO dto, Usuario usuario) {
        ContaFinanceira conta = buscar(id, usuario);
        aplicarDados(conta, dto, usuario);
        return conta;
    }

    // Arquivar some com a conta das escolhas sem apagar o histórico.
    @Transactional
    public ContaFinanceira alterarAtiva(Long id, boolean ativa, Usuario usuario) {
        ContaFinanceira conta = buscar(id, usuario);
        if (!ativa && conta.isAtiva()) {
            exigirOutraAtiva(usuario);
        }
        conta.setAtiva(ativa);
        return conta;
    }

    @Transactional
    public void excluir(Long id, Usuario usuario) {
        ContaFinanceira conta = buscar(id, usuario);
        if (transacaoRepository.count("conta.id", conta.getId()) > 0) {
            throw ValidationException.of("conta",
                    "Esta conta tem lançamentos e não pode ser excluída. Arquive-a para escondê-la.");
        }
        if (conta.isAtiva()) {
            exigirOutraAtiva(usuario);
        }
        repository.delete(conta);
    }

    public ContaFinanceira buscar(Long id, Usuario usuario) {
        ContaFinanceira conta = repository.findByDonoAndId(usuario, id);
        if (conta == null) {
            throw new ResourceNotFoundException("Conta não encontrada.");
        }
        return conta;
    }

    public List<ContaFinanceira> listar(Usuario usuario, boolean incluirInativas) {
        return repository.findByDono(usuario, incluirInativas);
    }

    // Conta usada quando o lançamento não informa uma (a ativa mais antiga).
    public ContaFinanceira padrao(Usuario usuario) {
        ContaFinanceira conta = repository.findPadrao(usuario);
        if (conta == null) {
            throw ValidationException.of("idConta", "Cadastre uma conta antes de lançar.");
        }
        return conta;
    }

    // ---------------------------------------------------------- saldos

    public List<ContaFinanceiraResponseDTO> comSaldos(List<ContaFinanceira> contas, YearMonth mes) {
        if (contas.isEmpty()) {
            return List.of();
        }
        List<Long> ids = contas.stream().map(ContaFinanceira::getId).toList();
        LocalDate inicio = mes.atDay(1);
        LocalDate fim = mes.atEndOfMonth();

        // Pagos (todas as datas): saldo atual e total de lançamentos.
        Map<Long, Somas> pagos = somar("t.pago = true", ids, null, null);
        Map<Long, Somas> doMes = somar("t.data between :inicio and :fim", ids, inicio, fim);
        Map<Long, Somas> pendentesAteFim = somar("t.pago = false and t.data <= :fim", ids, null, fim);
        Map<Long, Long> quantidades = contar(ids);

        return contas.stream().map(c -> {
            Somas p = pagos.getOrDefault(c.getId(), Somas.ZERO);
            Somas m = doMes.getOrDefault(c.getId(), Somas.ZERO);
            Somas pend = pendentesAteFim.getOrDefault(c.getId(), Somas.ZERO);
            BigDecimal saldoAtual = c.getSaldoInicial().add(p.saldo());
            return new ContaFinanceiraResponseDTO(c.getId(), c.getNome(), c.getTipo(), c.getCor(), c.isAtiva(),
                    c.getSaldoInicial(), saldoAtual, m.receitas(), m.despesas(), saldoAtual.add(pend.saldo()),
                    quantidades.getOrDefault(c.getId(), 0L));
        }).toList();
    }

    private record Somas(BigDecimal receitas, BigDecimal despesas) {
        static final Somas ZERO = new Somas(BigDecimal.ZERO, BigDecimal.ZERO);

        BigDecimal saldo() {
            return receitas.subtract(despesas);
        }
    }

    private Map<Long, Somas> somar(String condicao, List<Long> ids, LocalDate inicio, LocalDate fim) {
        var query = entityManager.createQuery(
                "select t.conta.id, t.tipo, sum(t.valor) from Transacao t where t.conta.id in :ids and "
                        + condicao + " group by t.conta.id, t.tipo", Object[].class)
                .setParameter("ids", ids);
        if (inicio != null) {
            query.setParameter("inicio", inicio);
        }
        if (fim != null) {
            query.setParameter("fim", fim);
        }
        Map<Long, Somas> resultado = new HashMap<>();
        for (Object[] linha : query.getResultList()) {
            Long id = (Long) linha[0];
            BigDecimal valor = (BigDecimal) linha[2];
            Somas atual = resultado.getOrDefault(id, Somas.ZERO);
            resultado.put(id, linha[1] == TipoTransacao.RECEITA
                    ? new Somas(atual.receitas().add(valor), atual.despesas())
                    : new Somas(atual.receitas(), atual.despesas().add(valor)));
        }
        return resultado;
    }

    private Map<Long, Long> contar(List<Long> ids) {
        Map<Long, Long> resultado = new HashMap<>();
        entityManager.createQuery(
                "select t.conta.id, count(t) from Transacao t where t.conta.id in :ids group by t.conta.id", Object[].class)
                .setParameter("ids", ids)
                .getResultList()
                .forEach(linha -> resultado.put((Long) linha[0], (Long) linha[1]));
        return resultado;
    }

    // ---------------------------------------------------------- regras

    private void aplicarDados(ContaFinanceira conta, ContaFinanceiraRequestDTO dto, Usuario usuario) {
        String nome = dto.nome().trim();
        ContaFinanceira mesmoNome = repository.findByDonoAndNome(usuario, nome);
        if (mesmoNome != null && !mesmoNome.getId().equals(conta.getId())) {
            throw ValidationException.of("nome", "Já existe uma conta com esse nome.");
        }
        conta.setNome(nome);
        conta.setTipo(dto.tipo());
        conta.setSaldoInicial(dto.saldoInicial());
        conta.setCor(dto.cor() == null || dto.cor().isBlank() ? null : dto.cor().toUpperCase());
    }

    // Todo lançamento precisa de uma conta ativa para cair.
    private void exigirOutraAtiva(Usuario usuario) {
        if (repository.countAtivas(usuario) <= 1) {
            throw ValidationException.of("conta", "Mantenha pelo menos uma conta ativa.");
        }
    }
}
