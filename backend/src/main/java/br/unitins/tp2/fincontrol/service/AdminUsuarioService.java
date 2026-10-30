package br.unitins.tp2.fincontrol.service;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.AdminUsuarioRequestDTO;
import br.unitins.tp2.fincontrol.dto.AdminUsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.dto.FichaUsuarioDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.SituacaoUsuario;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.AuditoriaRepository;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.ContaFinanceiraRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
import br.unitins.tp2.fincontrol.security.SenhaProvisoria;
import br.unitins.tp2.fincontrol.validation.Documentos;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Parameters;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

// Gerenciamento de todos os usuários do sistema pelo SUPER_ADMIN.
// Regras de segurança:
//  - sempre existe pelo menos um SUPER_ADMIN ativo;
//  - ninguém altera o próprio perfil nem se desativa/exclui;
//  - o perfil alterna entre PESSOAL e SUPER_ADMIN (os dados financeiros continuam do usuário).
@ApplicationScoped
public class AdminUsuarioService {

    @Inject
    UsuarioRepository repository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    ContaFinanceiraRepository contaRepository;

    @Inject
    AuditoriaRepository auditoriaRepository;

    @Inject
    DadosIniciais dadosIniciais;

    @Inject
    AuditoriaService auditoria;

    // Conta pessoal sem login há este tempo "parou de usar" (painel e filtro da lista).
    public static final int DIAS_SEM_ACESSO = 30;

    // "busca" procura no nome e no e-mail; os demais filtros são opcionais.
    public PanacheQuery<Usuario> pesquisar(String busca, Role role, Boolean ativo, SituacaoUsuario situacao) {
        StringBuilder where = new StringBuilder("1 = 1");
        Parameters params = new Parameters();
        if (busca != null && !busca.isBlank()) {
            where.append(" and (lower(u.nome) like :busca or lower(u.email) like :busca)");
            params.and("busca", "%" + busca.trim().toLowerCase() + "%");
        }
        if (role != null) {
            where.append(" and u.role = :role");
            params.and("role", role);
        }
        if (ativo != null) {
            where.append(" and u.ativo = :ativo");
            params.and("ativo", ativo);
        }
        if (situacao == SituacaoUsuario.BLOQUEADO) {
            where.append(" and u.bloqueadoAte > :agora");
            params.and("agora", LocalDateTime.now());
        } else if (situacao == SituacaoUsuario.SEM_ACESSO_30_DIAS) {
            where.append(" and u.role = :pessoal and u.ativo = true and u.ultimoAcesso < :limite");
            params.and("pessoal", Role.PESSOAL).and("limite", LocalDateTime.now().minusDays(DIAS_SEM_ACESSO));
        } else if (situacao == SituacaoUsuario.SEM_LANCAMENTO) {
            where.append(" and u.role = :pessoal and u.ativo = true"
                    + " and not exists (select t.id from Transacao t where t.usuario = u)");
            params.and("pessoal", Role.PESSOAL);
        }
        return repository.find("from Usuario u where " + where + " order by u.nome, u.id", params);
    }

    public Usuario buscar(Long id) {
        Usuario usuario = repository.findById(id);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }
        return usuario;
    }

    // Cadastro, acesso e quantidades; nenhum valor, saldo ou descrição de lançamento.
    public FichaUsuarioDTO ficha(Long id) {
        Usuario u = buscar(id);
        return new FichaUsuarioDTO(u.getId(), u.getNome(), u.getEmail(), u.getTelefone(), u.getProfissao(),
                u.getRole(), u.isAtivo(), u.getDataCadastro(), u.getUltimoAcesso(),
                u.isBloqueado() ? u.getBloqueadoAte() : null, u.getTentativasLogin(), u.isTrocarSenha(),
                transacaoRepository.count("usuario", u), contaRepository.count("usuario", u),
                categoriaRepository.count("usuario", u));
    }

    @Transactional
    public Usuario criar(AdminUsuarioRequestDTO dto, Usuario autor) {
        String email = dto.email().trim().toLowerCase();
        if (repository.findByEmail(email) != null) {
            throw new BadRequestException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setPassword(BcryptUtil.bcryptHash(dto.password()));
        usuario.setRole(dto.role());
        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.profissao(), dto.modulos());

        repository.persist(usuario);
        prepararContaPessoal(usuario);

        auditoria.registrar(autor, "USUARIO_CRIADO", AuditoriaService.alvo(usuario), "Perfil " + usuario.getRole());
        return usuario;
    }

    @Transactional
    public Usuario atualizar(Long id, AdminUsuarioUpdateDTO dto, Usuario autor) {
        Usuario usuario = buscar(id);
        Role anterior = usuario.getRole();

        if (dto.role() != anterior) {
            exigirTrocaDePerfilPermitida(usuario, autor);
            usuario.setRole(dto.role());
        }

        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.profissao(), dto.modulos());
        prepararContaPessoal(usuario);

        auditoria.registrar(autor, anterior != usuario.getRole() ? "PERFIL_ALTERADO" : "USUARIO_ALTERADO",
                AuditoriaService.alvo(usuario),
                (anterior != usuario.getRole() ? "Perfil " + anterior + " → " + usuario.getRole() + "; " : "")
                        + "módulos " + Permissoes.efetivos(usuario));
        return usuario;
    }

    // Desativar corta o acesso na hora: o AcessoFilter recusa o token já emitido.
    @Transactional
    public Usuario alterarAtivo(Long id, boolean ativo, Usuario autor) {
        Usuario usuario = buscar(id);
        if (!ativo) {
            exigirOutroUsuario(usuario, autor, "desativar");
            exigirOutroSuperAdminAtivo(usuario);
        }
        usuario.setAtivo(ativo);
        auditoria.registrar(autor, ativo ? "USUARIO_ATIVADO" : "USUARIO_DESATIVADO", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    // Libera a conta bloqueada por senhas erradas: zera as tentativas e o bloqueio.
    @Transactional
    public Usuario desbloquear(Long id, Usuario autor) {
        Usuario usuario = buscar(id);
        if (!usuario.isBloqueado() && usuario.getTentativasLogin() == 0) {
            throw ValidationException.of("usuario", "Esta conta não está bloqueada.");
        }
        usuario.setBloqueadoAte(null);
        usuario.setTentativasLogin(0);
        auditoria.registrar(autor, "CONTA_DESBLOQUEADA", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    // Derruba todas as sessões abertas do usuário: os tokens já emitidos deixam de valer.
    @Transactional
    public Usuario encerrarSessoes(Long id, Usuario autor) {
        Usuario usuario = buscar(id);
        exigirOutraConta(usuario, autor, "Para encerrar as suas sessões, use Meu perfil.");
        usuario.setVersaoSessao(usuario.getVersaoSessao() + 1);
        auditoria.registrar(autor, "SESSOES_ENCERRADAS", AuditoriaService.alvo(usuario), "Pelo administrador");
        return usuario;
    }

    // Gera uma senha provisória (devolvida só nesta chamada), encerra as sessões, tira o
    // bloqueio e obriga a troca no próximo login. A auditoria registra o fato, nunca a senha.
    @Transactional
    public String gerarSenhaProvisoria(Long id, Usuario autor) {
        Usuario usuario = buscar(id);
        exigirOutraConta(usuario, autor, "Para trocar a sua senha, use Meu perfil.");
        String senha = SenhaProvisoria.gerar();
        usuario.setPassword(BcryptUtil.bcryptHash(senha));
        usuario.setTrocarSenha(true);
        usuario.setBloqueadoAte(null);
        usuario.setTentativasLogin(0);
        usuario.setVersaoSessao(usuario.getVersaoSessao() + 1);
        auditoria.registrar(autor, "SENHA_PROVISORIA_GERADA", AuditoriaService.alvo(usuario),
                "Troca obrigatória no próximo login");
        return senha;
    }

    // Só exclui quem nunca registrou nada; quem já tem histórico deve ser desativado.
    @Transactional
    public void excluir(Long id, Usuario autor) {
        Usuario usuario = buscar(id);
        exigirOutroUsuario(usuario, autor, "excluir");
        exigirOutroSuperAdminAtivo(usuario);

        if (temHistorico(usuario)) {
            throw ValidationException.of("usuario",
                    "Este usuário já tem histórico (lançamentos ou ações registradas na auditoria). "
                            + "Desative-o para remover o acesso sem perder o histórico.");
        }

        auditoria.registrar(autor, "USUARIO_EXCLUIDO", AuditoriaService.alvo(usuario), "Perfil " + usuario.getRole());
        // As categorias e a conta iniciais (sem lançamentos) vão junto com o usuário.
        categoriaRepository.delete("usuario", usuario);
        contaRepository.delete("usuario", usuario);
        repository.delete(usuario);
    }

    // Histórico = lançamentos do usuário ou ações dele registradas na auditoria.
    // As categorias e a conta criadas no cadastro não contam.
    public boolean temHistorico(Usuario usuario) {
        return transacaoRepository.count("usuario", usuario) > 0
                || auditoriaRepository.count("autorId", usuario.getId()) > 0;
    }

    // Conta pessoal precisa das categorias e da Carteira para lançar (ex.: admin rebaixado a PESSOAL).
    private void prepararContaPessoal(Usuario usuario) {
        if (usuario.getRole() == Role.PESSOAL && contaRepository.count("usuario", usuario) == 0) {
            dadosIniciais.criar(usuario);
        }
    }

    private void aplicarDados(Usuario usuario, String nome, String telefone, String profissao,
            Set<Modulo> modulos) {
        usuario.setNome(nome.trim());
        usuario.setTelefone(Documentos.soDigitos(telefone));

        if (usuario.getRole() == Role.PESSOAL) {
            if (profissao == null || profissao.isBlank()) {
                throw ValidationException.of("profissao", "A profissão deve ser informada na conta pessoal.");
            }
            usuario.setProfissao(profissao.trim());
            usuario.setModulos(modulos == null
                    ? (usuario.getModulos().isEmpty() ? Permissoes.todos() : usuario.getModulos())
                    : Permissoes.escolhidos(modulos));
        } else {
            // O administrador tem os módulos pelo perfil.
            usuario.setModulos(EnumSet.noneOf(Modulo.class));
        }
    }

    private void exigirTrocaDePerfilPermitida(Usuario usuario, Usuario autor) {
        if (usuario.getId().equals(autor.getId())) {
            throw ValidationException.of("role", "Você não pode alterar o seu próprio perfil de acesso.");
        }
        if (usuario.getRole() == Role.SUPER_ADMIN) {
            exigirOutroSuperAdminAtivo(usuario);
        }
    }

    private void exigirOutroUsuario(Usuario usuario, Usuario autor, String acao) {
        if (usuario.getId().equals(autor.getId())) {
            throw ValidationException.of("usuario", "Você não pode " + acao + " o seu próprio usuário.");
        }
    }

    private void exigirOutraConta(Usuario usuario, Usuario autor, String mensagem) {
        if (usuario.getId().equals(autor.getId())) {
            throw ValidationException.of("usuario", mensagem);
        }
    }

    // Garante pelo menos um administrador do FinControl ativo.
    private void exigirOutroSuperAdminAtivo(Usuario usuario) {
        if (usuario.getRole() != Role.SUPER_ADMIN || !usuario.isAtivo()) {
            return;
        }
        long outrosAtivos = repository.count("role = ?1 and ativo = true and id <> ?2", Role.SUPER_ADMIN, usuario.getId());
        if (outrosAtivos == 0) {
            throw ValidationException.of("usuario", "O sistema precisa de pelo menos um administrador ativo.");
        }
    }
}
