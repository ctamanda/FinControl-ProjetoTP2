package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.dto.RegisterRequestDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Modulo;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoConta;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.security.Permissoes;
import br.unitins.tp2.fincontrol.validation.Documentos;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotAuthorizedException;

@ApplicationScoped
public class UsuarioService {

    @Inject
    UsuarioRepository repository;

    @Inject
    CategoriasIniciais categoriasIniciais;

    // PESSOAL já sai pronto para usar (todos os módulos pessoais e 6 categorias).
    // EMPRESA vira ADMIN_EMPRESA com a empresa pendente: só entra no sistema depois de POST /empresa.
    @Transactional
    public Usuario criar(RegisterRequestDTO dto) {
        String email = normalizarEmail(dto.email());

        if (repository.findByEmail(email) != null) {
            throw new BadRequestException("E-mail já cadastrado.");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setNome(dto.nome().trim());
        usuario.setTelefone(Documentos.soDigitos(dto.telefone()));
        usuario.setPassword(BcryptUtil.bcryptHash(dto.password()));

        if (dto.tipoConta() == TipoConta.PESSOAL) {
            usuario.setRole(Role.PESSOAL);
            usuario.setProfissao(dto.profissao().trim());
            usuario.setModulos(Permissoes.pessoais());
        } else {
            usuario.setRole(Role.ADMIN_EMPRESA);
        }

        repository.persist(usuario);

        if (usuario.getRole() == Role.PESSOAL) {
            categoriasIniciais.criar(usuario, null);
        }

        return usuario;
    }

    // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
    public Usuario autenticar(String email, String password) {
        Usuario usuario = repository.findByEmail(email);

        if (usuario == null
                || !BcryptUtil.matches(password, usuario.getPassword())) {
            // O 1º argumento é a mensagem; o 2º vira o cabeçalho WWW-Authenticate.
            throw new NotAuthorizedException("Credenciais inválidas.", "Bearer");
        }

        String bloqueio = Permissoes.motivoBloqueio(usuario);
        if (bloqueio != null) {
            throw new NotAuthorizedException(bloqueio, "Bearer");
        }

        return usuario;
    }

    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

    // Usuário dono do token (upn). Se a conta (ou a empresa dela) não existe mais ou foi
    // desativada, o token deixa de valer: 401.
    public Usuario buscarLogado(String email) {
        Usuario usuario = repository.findByEmail(email);

        if (usuario == null) {
            throw new NotAuthorizedException("Usuário do token não encontrado.", "Bearer");
        }
        String bloqueio = Permissoes.motivoBloqueio(usuario);
        if (bloqueio != null) {
            throw new NotAuthorizedException(bloqueio, "Bearer");
        }

        return usuario;
    }

    @Transactional
    public Usuario atualizarPerfil(String email, UsuarioUpdateDTO dto) {
        Usuario usuario = buscarLogado(email);

        usuario.setNome(dto.nome().trim());
        usuario.setTelefone(Documentos.soDigitos(dto.telefone()));

        if (usuario.getRole() == Role.PESSOAL) {
            if (dto.profissao() == null || dto.profissao().isBlank()) {
                throw ValidationException.of("profissao", "A profissão deve ser informada na conta pessoal.");
            }
            usuario.setProfissao(dto.profissao().trim());

            if (dto.modulos() != null) {
                usuario.setModulos(Permissoes.exigirPermitidos(dto.modulos(), Modulo::isPessoal,
                        "Estes módulos não existem na conta pessoal: "));
            }
        }

        return usuario;
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
