package br.unitins.tp2.fincontrol.service;

import java.util.EnumSet;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.AdminUsuarioRequestDTO;
import br.unitins.tp2.fincontrol.dto.AdminUsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Empresa;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.EmpresaRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
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
//  - o administrador principal de uma empresa só sai junto com a empresa (desative a empresa);
//  - o perfil troca só entre USUÁRIO e ADMINISTRADOR do mesmo tipo de conta
//    (PESSOAL <-> SUPER_ADMIN, USUARIO_EMPRESA <-> ADMIN_EMPRESA), para os dados não ficarem órfãos.
@ApplicationScoped
public class AdminUsuarioService {

    @Inject
    UsuarioRepository repository;

    @Inject
    EmpresaRepository empresaRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    CategoriasIniciais categoriasIniciais;

    @Inject
    AuditoriaService auditoria;

    // "busca" procura no nome e no e-mail; os demais filtros são opcionais.
    public PanacheQuery<Usuario> pesquisar(String busca, Role role, Boolean ativo, Long idEmpresa) {
        StringBuilder where = new StringBuilder("1 = 1");
        Parameters params = new Parameters();
        if (busca != null && !busca.isBlank()) {
            where.append(" and (lower(nome) like :busca or lower(email) like :busca)");
            params.and("busca", "%" + busca.trim().toLowerCase() + "%");
        }
        if (role != null) {
            where.append(" and role = :role");
            params.and("role", role);
        }
        if (ativo != null) {
            where.append(" and ativo = :ativo");
            params.and("ativo", ativo);
        }
        if (idEmpresa != null) {
            where.append(" and empresa.id = :empresa");
            params.and("empresa", idEmpresa);
        }
        return repository.find(where + " order by nome, id", params);
    }

    public Usuario buscar(Long id) {
        Usuario usuario = repository.findById(id);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }
        return usuario;
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
        usuario.setEmpresa(empresaDoPerfil(dto.role(), dto.idEmpresa()));
        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.profissao(), dto.modulos());

        repository.persist(usuario);

        if (usuario.getRole() == Role.PESSOAL) {
            categoriasIniciais.criar(usuario, null);
        }

        auditoria.registrar(autor, "USUARIO_CRIADO", AuditoriaService.alvo(usuario),
                "Perfil " + usuario.getRole()
                        + (usuario.getEmpresa() != null ? " na " + AuditoriaService.alvo(usuario.getEmpresa()) : ""));
        return usuario;
    }

    @Transactional
    public Usuario atualizar(Long id, AdminUsuarioUpdateDTO dto, Usuario autor) {
        Usuario usuario = buscar(id);
        Role anterior = usuario.getRole();

        if (dto.role() != anterior) {
            exigirTrocaDePerfilPermitida(usuario, dto.role(), autor);
            usuario.setRole(dto.role());
        }

        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.profissao(), dto.modulos());

        auditoria.registrar(autor, anterior != usuario.getRole() ? "PERFIL_ALTERADO" : "USUARIO_ALTERADO",
                AuditoriaService.alvo(usuario),
                (anterior != usuario.getRole() ? "Perfil " + anterior + " → " + usuario.getRole() + "; " : "")
                        + "módulos " + Permissoes.efetivos(usuario));
        return usuario;
    }

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

    // Só exclui quem nunca registrou nada; quem já tem histórico deve ser desativado.
    @Transactional
    public void excluir(Long id, Usuario autor) {
        Usuario usuario = buscar(id);
        exigirOutroUsuario(usuario, autor, "excluir");
        exigirOutroSuperAdminAtivo(usuario);

        if (temHistorico(transacaoRepository, categoriaRepository, usuario)) {
            throw ValidationException.of("usuario",
                    "Este usuário já registrou lançamentos ou categorias. Desative-o para remover o acesso sem perder o histórico.");
        }

        auditoria.registrar(autor, "USUARIO_EXCLUIDO", AuditoriaService.alvo(usuario), "Perfil " + usuario.getRole());
        // Categorias da conta pessoal (as iniciais, sem lançamentos) vão junto com a conta.
        categoriaRepository.delete("usuario = ?1 and empresa is null", usuario);
        repository.delete(usuario);
    }

    // Histórico = lançamentos feitos pelo usuário ou categorias que ele criou numa empresa
    // (compartilhadas com a equipe). As categorias iniciais da conta pessoal não contam.
    static boolean temHistorico(TransacaoRepository transacoes, CategoriaRepository categorias, Usuario usuario) {
        return transacoes.count("usuario", usuario) > 0
                || categorias.count("usuario = ?1 and empresa is not null", usuario) > 0;
    }

    private Empresa empresaDoPerfil(Role role, Long idEmpresa) {
        if (role == Role.SUPER_ADMIN || role == Role.PESSOAL) {
            return null;
        }
        if (idEmpresa == null) {
            if (role == Role.USUARIO_EMPRESA) {
                throw ValidationException.of("idEmpresa", "Escolha a empresa do usuário.");
            }
            return null; // ADMIN_EMPRESA sem empresa: cadastra a própria no primeiro acesso
        }
        Empresa empresa = empresaRepository.findById(idEmpresa);
        if (empresa == null) {
            throw ValidationException.of("idEmpresa", "Empresa não encontrada.");
        }
        return empresa;
    }

    private void aplicarDados(Usuario usuario, String nome, String telefone, String profissao,
            Set<Modulo> modulos) {
        usuario.setNome(nome.trim());
        usuario.setTelefone(Documentos.soDigitos(telefone));

        switch (usuario.getRole()) {
            case PESSOAL -> {
                if (profissao == null || profissao.isBlank()) {
                    throw ValidationException.of("profissao", "A profissão deve ser informada na conta pessoal.");
                }
                usuario.setProfissao(profissao.trim());
                usuario.setModulos(modulos == null
                        ? (usuario.getModulos().isEmpty() ? Permissoes.pessoais() : usuario.getModulos())
                        : Permissoes.exigirPermitidos(modulos, Modulo::isPessoal,
                                "Estes módulos não existem na conta pessoal: "));
            }
            case USUARIO_EMPRESA -> usuario.setModulos(modulos == null
                    ? usuario.getModulos()
                    : Permissoes.exigirPermitidos(modulos, Modulo::isLiberavelNaEmpresa,
                            "Estes módulos não podem ser liberados para um usuário comum: "));
            // Administradores têm os módulos pelo perfil.
            case SUPER_ADMIN, ADMIN_EMPRESA -> usuario.setModulos(EnumSet.noneOf(Modulo.class));
        }
    }

    private void exigirTrocaDePerfilPermitida(Usuario usuario, Role novo, Usuario autor) {
        if (usuario.getId().equals(autor.getId())) {
            throw ValidationException.of("role", "Você não pode alterar o seu próprio perfil de acesso.");
        }

        boolean contaPessoal = usuario.getRole() == Role.PESSOAL || usuario.getRole() == Role.SUPER_ADMIN;
        boolean novoPessoal = novo == Role.PESSOAL || novo == Role.SUPER_ADMIN;
        if (contaPessoal != novoPessoal) {
            throw ValidationException.of("role", contaPessoal
                    ? "Conta pessoal só alterna entre Usuário (PESSOAL) e Administrador (SUPER_ADMIN)."
                    : "Usuário de empresa só alterna entre Usuário (USUARIO_EMPRESA) e Administrador (ADMIN_EMPRESA).");
        }

        if (novo == Role.USUARIO_EMPRESA && usuario.getEmpresa() == null) {
            throw ValidationException.of("role", "Este administrador ainda não tem empresa cadastrada.");
        }
        if (ehResponsavel(usuario)) {
            throw ValidationException.of("role",
                    "O administrador principal da empresa não pode deixar de ser administrador.");
        }
        if (usuario.getRole() == Role.SUPER_ADMIN) {
            exigirOutroSuperAdminAtivo(usuario);
        }
    }

    private void exigirOutroUsuario(Usuario usuario, Usuario autor, String acao) {
        if (usuario.getId().equals(autor.getId())) {
            throw ValidationException.of("usuario", "Você não pode " + acao + " o seu próprio usuário.");
        }
        if (ehResponsavel(usuario)) {
            throw ValidationException.of("usuario", "Não é possível " + acao
                    + " o administrador principal de uma empresa. Para bloquear o acesso, desative a empresa.");
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

    private boolean ehResponsavel(Usuario usuario) {
        return usuario.getEmpresa() != null
                && usuario.getEmpresa().getResponsavel().getId().equals(usuario.getId());
    }
}
