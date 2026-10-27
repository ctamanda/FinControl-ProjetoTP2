package br.unitins.tp2.fincontrol.service;

import br.unitins.tp2.fincontrol.dto.ConfirmacaoSenhaDTO;
import br.unitins.tp2.fincontrol.dto.EmailUpdateDTO;
import br.unitins.tp2.fincontrol.dto.ModulosUpdateDTO;
import br.unitins.tp2.fincontrol.dto.RegisterRequestDTO;
import br.unitins.tp2.fincontrol.dto.SenhaUpdateDTO;
import br.unitins.tp2.fincontrol.dto.UsuarioUpdateDTO;
import br.unitins.tp2.fincontrol.exception.ValidationException;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import br.unitins.tp2.fincontrol.security.ControleDeSenha;
import br.unitins.tp2.fincontrol.security.Permissoes;
import br.unitins.tp2.fincontrol.validation.Documentos;
import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotAuthorizedException;

@ApplicationScoped
public class UsuarioService {

    @Inject
    UsuarioRepository repository;

    @Inject
    DadosIniciais dadosIniciais;

    @Inject
    ControleDeSenha controleDeSenha;

    @Inject
    AuditoriaService auditoria;

    // A conta pessoal já sai pronta para usar: todos os módulos, as categorias padrão e a Carteira.
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

        usuario.setRole(Role.PESSOAL);
        usuario.setProfissao(dto.profissao().trim());
        usuario.setModulos(Permissoes.todos());

        repository.persist(usuario);
        dadosIniciais.criar(usuario);

        return usuario;
    }

    // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
    // Depois de várias senhas erradas seguidas a conta fica bloqueada por alguns minutos (429).
    public Usuario autenticar(String email, String password) {
        Usuario usuario = repository.findByEmail(email);

        if (usuario == null || !controleDeSenha.conferir(usuario, password)) {
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

    // Usuário dono do token (upn). Se a conta não existe mais ou foi desativada,
    // o token deixa de valer: 401.
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

    // ---------------------------------------------------------- a própria conta
    // Tudo que mexe em dados pessoais ou credenciais pede a senha atual de novo.

    @Transactional
    public Usuario atualizarPerfil(String email, UsuarioUpdateDTO dto) {
        Usuario usuario = buscarLogado(email);
        exigirSenhaAtual(usuario, dto.senhaAtual());

        if (usuario.getRole() == Role.PESSOAL && (dto.profissao() == null || dto.profissao().isBlank())) {
            throw ValidationException.of("profissao", "A profissão deve ser informada na conta pessoal.");
        }

        usuario.setNome(dto.nome().trim());
        usuario.setTelefone(Documentos.soDigitos(dto.telefone()));
        if (usuario.getRole() == Role.PESSOAL) {
            usuario.setProfissao(dto.profissao().trim());
        }

        auditoria.registrar(usuario, "DADOS_PESSOAIS_ALTERADOS", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    // Funcionalidades da conta pessoal: preferência de uso, não dado pessoal (sem senha).
    @Transactional
    public Usuario atualizarModulos(String email, ModulosUpdateDTO dto) {
        Usuario usuario = buscarLogado(email);
        if (usuario.getRole() != Role.PESSOAL) {
            throw new ForbiddenException("Só a conta pessoal escolhe as próprias funcionalidades.");
        }
        usuario.setModulos(Permissoes.escolhidos(dto.modulos()));
        return usuario;
    }

    // Troca a senha e encerra as outras sessões (quem chamou recebe um token novo).
    @Transactional
    public Usuario alterarSenha(String email, SenhaUpdateDTO dto) {
        Usuario usuario = buscarLogado(email);
        exigirSenhaAtual(usuario, dto.senhaAtual());

        if (BcryptUtil.matches(dto.novaSenha(), usuario.getPassword())) {
            throw ValidationException.of("novaSenha", "A nova senha deve ser diferente da atual.");
        }

        usuario.setPassword(BcryptUtil.bcryptHash(dto.novaSenha()));
        encerrarSessoes(usuario);
        auditoria.registrar(usuario, "SENHA_ALTERADA", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    // Troca o e-mail de acesso; o token antigo (com o e-mail velho) deixa de valer.
    @Transactional
    public Usuario alterarEmail(String email, EmailUpdateDTO dto) {
        Usuario usuario = buscarLogado(email);
        exigirSenhaAtual(usuario, dto.senhaAtual());

        String novo = normalizarEmail(dto.novoEmail());
        if (novo.equals(usuario.getEmail())) {
            throw ValidationException.of("novoEmail", "Este já é o seu e-mail de acesso.");
        }
        if (repository.findByEmail(novo) != null) {
            throw ValidationException.of("novoEmail", "E-mail já cadastrado.");
        }

        String anterior = usuario.getEmail();
        usuario.setEmail(novo);
        encerrarSessoes(usuario);
        auditoria.registrar(usuario, "EMAIL_ALTERADO", AuditoriaService.alvo(usuario), "Antes: " + anterior);
        return usuario;
    }

    // "Sair de todos os dispositivos": invalida todos os tokens emitidos até agora.
    @Transactional
    public Usuario encerrarOutrasSessoes(String email, ConfirmacaoSenhaDTO dto) {
        Usuario usuario = buscarLogado(email);
        exigirSenhaAtual(usuario, dto.senhaAtual());
        encerrarSessoes(usuario);
        auditoria.registrar(usuario, "SESSOES_ENCERRADAS", AuditoriaService.alvo(usuario), null);
        return usuario;
    }

    private void exigirSenhaAtual(Usuario usuario, String senha) {
        if (!controleDeSenha.conferir(usuario, senha)) {
            throw ValidationException.of("senhaAtual", "Senha atual incorreta.");
        }
    }

    // Os tokens em uso ficam com a versão antiga; o token novo (emitido depois) leva a atual.
    private static void encerrarSessoes(Usuario usuario) {
        usuario.setVersaoSessao(usuario.getVersaoSessao() + 1);
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
