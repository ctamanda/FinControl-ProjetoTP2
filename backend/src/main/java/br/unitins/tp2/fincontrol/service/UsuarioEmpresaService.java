package br.unitins.tp2.fincontrol.service;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import br.unitins.tp2.fincontrol.dto.UsuarioEmpresaRequestDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioEmpresaUpdateDTO;
import br.unitins.tp2.fincontrol.exception.ResourceNotFoundException;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaRepository;
import br.unitins.tp2.fincontrol.repository.TransacaoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
import br.unitins.tp2.fincontrol.validation.Documentos;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;

// Administração dos usuários de uma empresa, feita por um ADMIN_EMPRESA.
// Só enxerga e altera usuários da própria empresa (os de outra empresa dão 404).
@ApplicationScoped
public class UsuarioEmpresaService {

    @Inject
    UsuarioRepository repository;

    @Inject
    CategoriaRepository categoriaRepository;

    @Inject
    TransacaoRepository transacaoRepository;

    @Inject
    AuditoriaService auditoria;

    public List<Usuario> listar(Usuario admin) {
        return repository.findByEmpresa(admin.getEmpresa().getId());
    }

    public Usuario buscar(Usuario admin, Long id) {
        Usuario usuario = repository.findByEmpresaAndId(admin.getEmpresa().getId(), id);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuário não encontrado.");
        }
        return usuario;
    }

    @Transactional
    public Usuario criar(Usuario admin, UsuarioEmpresaRequestDTO dto) {
        String email = dto.email().trim().toLowerCase();
        if (repository.findByEmail(email) != null) {
            throw new BadRequestException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setPassword(BcryptUtil.bcryptHash(dto.password()));
        usuario.setEmpresa(admin.getEmpresa());
        usuario.setAtivo(true);
        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.role(), dto.modulos());

        repository.persist(usuario);
        auditoria.registrar(admin, "USUARIO_CRIADO", AuditoriaService.alvo(usuario),
                "Perfil " + usuario.getRole() + " na empresa; módulos " + usuario.getModulos());
        return usuario;
    }

    @Transactional
    public Usuario atualizar(Usuario admin, Long id, UsuarioEmpresaUpdateDTO dto) {
        Usuario usuario = buscar(admin, id);

        if (dto.role() != usuario.getRole()) {
            if (usuario.getId().equals(admin.getId())) {
                throw ValidationException.of("role", "Você não pode alterar o seu próprio perfil de acesso.");
            }
            if (ehResponsavel(usuario)) {
                throw ValidationException.of("role",
                        "O administrador principal da empresa não pode deixar de ser administrador.");
            }
        }

        Role perfilAnterior = usuario.getRole();
        aplicarDados(usuario, dto.nome(), dto.telefone(), dto.role(), dto.modulos());
        auditoria.registrar(admin, "USUARIO_ALTERADO", AuditoriaService.alvo(usuario),
                (perfilAnterior != usuario.getRole() ? "Perfil " + perfilAnterior + " → " + usuario.getRole() + "; " : "")
                        + "módulos " + usuario.getModulos());
        return usuario;
    }

    // Remove o acesso sem apagar o cadastro nem o histórico.
    @Transactional
    public Usuario alterarAtivo(Usuario admin, Long id, boolean ativo) {
        Usuario usuario = buscar(admin, id);
        if (!ativo) {
            exigirOutroUsuario(admin, usuario, "desativar");
        }
        usuario.setAtivo(ativo);
        auditoria.registrar(admin, ativo ? "USUARIO_ATIVADO" : "USUARIO_DESATIVADO", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    // Só exclui quem nunca registrou nada; quem já tem histórico deve ser desativado.
    @Transactional
    public void excluir(Usuario admin, Long id) {
        Usuario usuario = buscar(admin, id);
        exigirOutroUsuario(admin, usuario, "excluir");

        if (AdminUsuarioService.temHistorico(transacaoRepository, categoriaRepository, usuario)) {
            throw ValidationException.of("usuario",
                    "Este usuário já registrou lançamentos ou categorias. Desative-o para remover o acesso sem perder o histórico.");
        }

        auditoria.registrar(admin, "USUARIO_EXCLUIDO", AuditoriaService.alvo(usuario), null);
        repository.delete(usuario);
    }

    private void exigirOutroUsuario(Usuario admin, Usuario usuario, String acao) {
        if (usuario.getId().equals(admin.getId())) {
            throw ValidationException.of("usuario", "Você não pode " + acao + " o seu próprio usuário.");
        }
        if (ehResponsavel(usuario)) {
            throw ValidationException.of("usuario", "Não é possível " + acao + " o administrador principal da empresa.");
        }
    }

    private boolean ehResponsavel(Usuario usuario) {
        return usuario.getEmpresa().getResponsavel().getId().equals(usuario.getId());
    }

    private void aplicarDados(Usuario usuario, String nome, String telefone, Role role,
            Set<Modulo> modulos) {
        if (role != Role.ADMIN_EMPRESA && role != Role.USUARIO_EMPRESA) {
            throw ValidationException.of("role", "O perfil deve ser ADMIN_EMPRESA ou USUARIO_EMPRESA.");
        }

        usuario.setNome(nome.trim());
        usuario.setTelefone(Documentos.soDigitos(telefone));
        usuario.setRole(role);

        // Admin tem todos os módulos pelo perfil; o usuário comum só os que forem liberados.
        usuario.setModulos(role == Role.ADMIN_EMPRESA || modulos == null
                ? EnumSet.noneOf(Modulo.class)
                : Permissoes.exigirPermitidos(modulos, Modulo::isLiberavelNaEmpresa,
                        "Estes módulos não podem ser liberados para um usuário comum: "));
    }
}
