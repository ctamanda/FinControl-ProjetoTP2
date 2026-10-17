package br.unitins.tp2.fincontrol;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.unitins.tp2.fincontrol.model.CategoriaPadrao;
import br.unitins.tp2.fincontrol.model.Role;
import br.unitins.tp2.fincontrol.model.TipoCategoria;
import br.unitins.tp2.fincontrol.model.Usuario;
import br.unitins.tp2.fincontrol.repository.CategoriaPadraoRepository;
import br.unitins.tp2.fincontrol.repository.UsuarioRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.narayana.jta.QuarkusTransaction;
import io.quarkus.test.common.WithTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;

// Testes de ponta a ponta da API (H2 em memória, chaves JWT geradas pelo Quarkus).
@QuarkusTest
@WithTestResource(ChavesJwtTeste.class)
class ApiTest {

    private static final String ADMIN_EMAIL = "admin@teste.local";
    private static final String SENHA = "Senha@123";

    private static final List<String> PADRAO = List.of("Alimentação", "Moradia", "Transporte", "Lazer", "Salário", "Vendas");

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    CategoriaPadraoRepository categoriaPadraoRepository;

    @BeforeEach
    void garantirAdminECategoriasPadrao() {
        // No perfil de teste o Flyway está desligado: a V10 (admin) e a V13 (categorias padrão) não rodam.
        QuarkusTransaction.requiringNew().run(() -> {
            for (String nome : PADRAO) {
                CategoriaPadrao padrao = categoriaPadraoRepository.findByNome(nome);
                if (padrao == null) {
                    padrao = new CategoriaPadrao();
                    padrao.setNome(nome);
                    padrao.setTipo(nome.equals("Salário") || nome.equals("Vendas") ? TipoCategoria.RECEITA : TipoCategoria.DESPESA);
                    categoriaPadraoRepository.persist(padrao);
                }
                padrao.setAtivo(true);
            }
            // Categorias padrão criadas por outros testes não podem mudar as 6 iniciais.
            categoriaPadraoRepository.update("ativo = false where nome not in ?1", PADRAO);
        });
        QuarkusTransaction.requiringNew().run(() -> {
            if (usuarioRepository.findByEmail(ADMIN_EMAIL) == null) {
                Usuario admin = new Usuario();
                admin.setEmail(ADMIN_EMAIL);
                admin.setNome("Admin");
                admin.setPassword(BcryptUtil.bcryptHash(SENHA));
                admin.setRole(Role.SUPER_ADMIN);
                usuarioRepository.persist(admin);
            }
        });
    }

    // ------------------------------------------------------------------ cadastro e login

    @Test
    void cadastroPessoalDevolveJsonComEmailEmMinusculas() {
        String email = novoEmail();
        given().contentType(ContentType.JSON)
                .body(cadastroPessoal(email.toUpperCase()))
                .when().post("/auth/register")
                .then().statusCode(201)
                .body("email", equalTo(email))
                .body("role", equalTo("PESSOAL"))
                .body("telefone", equalTo("63999990000"))
                .body("profissao", equalTo("Analista"))
                .body("modulos", hasItem("DASHBOARD"))
                .body("modulos", not(hasItem("CLIENTES")))
                .body("empresaPendente", equalTo(false))
                .body("id", notNullValue());
    }

    @Test
    void naoPermiteEmailRepetidoMesmoComMaiusculas() {
        String email = novoEmail();
        registrar(email);
        given().contentType(ContentType.JSON)
                .body(cadastroPessoal(email.toUpperCase()))
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("detail", equalTo("E-mail já cadastrado."));
    }

    @Test
    void loginIgnoraMaiusculasNoEmail() {
        String email = novoEmail();
        registrar(email);
        given().contentType(ContentType.JSON)
                .body(Map.of("email", email.toUpperCase(), "password", SENHA))
                .when().post("/auth/login")
                .then().statusCode(200)
                .body("token", notNullValue())
                .body("expiresIn", equalTo(3600));
    }

    @Test
    void senhaErradaDevolve401ComMensagem() {
        String email = novoEmail();
        registrar(email);
        given().contentType(ContentType.JSON)
                .body(Map.of("email", email, "password", "errada1"))
                .when().post("/auth/login")
                .then().statusCode(401)
                .body("detail", equalTo("Credenciais inválidas."));
    }

    @Test
    void senhaFracaListaTodasAsRegrasQueFaltam() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.put("password", "abc");
        corpo.put("confirmPassword", "abc");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.field", everyItem(equalTo("password")))
                .body("errors.message", containsInAnyOrder(
                        "A senha deve conter entre 6 e 100 caracteres.",
                        "A senha deve conter pelo menos uma letra maiúscula.",
                        "A senha deve conter pelo menos um número.",
                        "A senha deve conter pelo menos um caractere especial (ex.: ! @ # $ %)."));
    }

    @Test
    void confirmacaoDiferenteDevolve400() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.put("confirmPassword", SENHA + "x");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.message", contains("A confirmação da senha deve ser igual à senha."));
    }

    @Test
    void confirmacaoAusenteDevolve400() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.remove("confirmPassword");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.field", contains("confirmPassword"));
    }

    @Test
    void contaPessoalExigeProfissao() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.remove("profissao");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.message", contains("A profissão deve ser informada na conta pessoal."));
    }

    @Test
    void telefoneInvalidoDevolve400() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.put("telefone", "1234");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.field", contains("telefone"));
    }

    @Test
    void cadastroPessoalCriaSeisCategoriasIniciais() {
        String token = registrarELogar();
        given().auth().oauth2(token)
                .when().get("/categorias")
                .then().statusCode(200)
                .body("size()", equalTo(6))
                .body("nome", hasItem("Alimentação"));
    }

    // ------------------------------------------------------------------ erros de entrada

    @Test
    void corpoAusenteDevolve400EmVezDe500() {
        given().contentType(ContentType.JSON)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.field", contains("corpo"));
    }

    @Test
    void jsonMalformadoDevolve400() {
        given().contentType(ContentType.JSON).body("{\"email\": ")
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors.field", contains("corpo"));
    }

    @Test
    void enumInvalidoListaValoresAceitos() {
        var corpo = cadastroPessoal(novoEmail());
        corpo.put("tipoConta", "XYZ");
        given().contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/auth/register")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("tipoConta"))
                .body("errors[0].message", equalTo("Valor inválido. Use um destes: PESSOAL, EMPRESA."));
    }

    @Test
    void semTokenDevolve401() {
        given().when().get("/transacoes").then().statusCode(401);
    }

    // ------------------------------------------------------------------ empresa

    @Test
    void contaEmpresaSoUsaOSistemaDepoisDeCadastrarAEmpresa() {
        String email = novoEmail();
        given().contentType(ContentType.JSON).body(cadastroEmpresa(email))
                .when().post("/auth/register")
                .then().statusCode(201)
                .body("role", equalTo("ADMIN_EMPRESA"))
                .body("empresaPendente", equalTo(true));
        String token = logar(email);

        given().auth().oauth2(token).when().get("/usuarios/me")
                .then().statusCode(200)
                .body("empresaPendente", equalTo(true))
                .body("modulos", empty());
        given().auth().oauth2(token).when().get("/transacoes")
                .then().statusCode(403)
                .body("detail", equalTo("Cadastre a empresa para continuar."));
        given().auth().oauth2(token).when().get("/categorias").then().statusCode(403);

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(empresa(novoCnpj()))
                .when().post("/empresa")
                .then().statusCode(201)
                .body("tipo", equalTo("MEI"));

        given().auth().oauth2(token).when().get("/usuarios/me")
                .then().statusCode(200)
                .body("empresaPendente", equalTo(false))
                .body("empresa.responsavel", equalTo(true))
                .body("modulos", hasItem("USUARIOS"));
        given().auth().oauth2(token).when().get("/categorias")
                .then().statusCode(200).body("size()", equalTo(6));
    }

    @Test
    void cnpjInvalidoOuRepetidoDevolve400() {
        String tokenA = registrarEmpresaPendente();
        given().auth().oauth2(tokenA).contentType(ContentType.JSON)
                .body(empresa("11.111.111/1111-11"))
                .when().post("/empresa")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("cnpj"));

        String cnpj = novoCnpj();
        criarEmpresa(tokenA, cnpj);

        String tokenB = registrarEmpresaPendente();
        given().auth().oauth2(tokenB).contentType(ContentType.JSON)
                .body(empresa(cnpj))
                .when().post("/empresa")
                .then().statusCode(400)
                .body("errors[0].message", equalTo("Já existe uma empresa cadastrada com este CNPJ."));
    }

    @Test
    void empresaNaoECadastradaDuasVezes() {
        String token = registrarEmpresaPendente();
        criarEmpresa(token, novoCnpj());
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(empresa(novoCnpj()))
                .when().post("/empresa")
                .then().statusCode(400);
    }

    @Test
    void contaPessoalNaoCadastraEmpresa() {
        given().auth().oauth2(registrarELogar()).contentType(ContentType.JSON)
                .body(empresa(novoCnpj()))
                .when().post("/empresa")
                .then().statusCode(403);
    }

    // ------------------------------------------------------------------ usuários da empresa

    @Test
    void usuarioComumSoAcessaOsModulosLiberados() {
        String admin = registrarEmpresaCompleta();
        String usuario = logar(criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of("CATEGORIAS")));

        given().auth().oauth2(usuario).when().get("/usuarios/me")
                .then().statusCode(200)
                .body("modulos", contains("CATEGORIAS"));
        given().auth().oauth2(usuario).when().get("/categorias").then().statusCode(200);
        given().auth().oauth2(usuario).when().get("/transacoes").then().statusCode(403);
        given().auth().oauth2(usuario).when().get("/empresa/usuarios").then().statusCode(403);
        given().auth().oauth2(usuario).contentType(ContentType.JSON)
                .body(empresa(novoCnpj()))
                .when().put("/empresa").then().statusCode(403);
    }

    @Test
    void dadosDaEmpresaSaoCompartilhadosEntreOsUsuariosDela() {
        String admin = registrarEmpresaCompleta();
        String usuario = logar(criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of("LANCAMENTOS")));
        String pessoal = registrarELogar();

        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(transacao("Venda", "RECEITA", categoria(admin, "RECEITA")))
                .when().post("/transacoes")
                .then().statusCode(201)
                .body("escopo", equalTo("EMPRESA"));

        given().auth().oauth2(usuario).when().get("/transacoes")
                .then().statusCode(200).body("totalItems", equalTo(1));
        given().auth().oauth2(pessoal).when().get("/transacoes")
                .then().statusCode(200).body("totalItems", equalTo(0));
    }

    @Test
    void moduloReceitasNaoLancaNemVeDespesas() {
        String admin = registrarEmpresaCompleta();
        criarTransacao(admin, "DESPESA");
        String usuario = logar(criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of("RECEITAS")));

        given().auth().oauth2(usuario).contentType(ContentType.JSON)
                .body(transacao("Conta de luz", "DESPESA", categoria(usuario, "DESPESA")))
                .when().post("/transacoes")
                .then().statusCode(403);
        given().auth().oauth2(usuario).contentType(ContentType.JSON)
                .body(transacao("Venda", "RECEITA", categoria(usuario, "RECEITA")))
                .when().post("/transacoes")
                .then().statusCode(201);
        given().auth().oauth2(usuario).when().get("/transacoes")
                .then().statusCode(200)
                .body("totalItems", equalTo(1))
                .body("items.tipo", everyItem(equalTo("RECEITA")));
    }

    @Test
    void moduloUsuariosNaoELiberadoParaUsuarioComum() {
        String admin = registrarEmpresaCompleta();
        var corpo = usuarioEmpresa(novoEmail(), "USUARIO_EMPRESA", List.of("DASHBOARD", "USUARIOS"));
        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(corpo)
                .when().post("/empresa/usuarios")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("modulos"));
    }

    @Test
    void desativarCortaOAcessoNaHoraEAtivarDevolve() {
        String admin = registrarEmpresaCompleta();
        String email = criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of("DASHBOARD"));
        String token = logar(email);
        long id = idDoUsuario(token);

        given().auth().oauth2(admin).when().patch("/empresa/usuarios/" + id + "/desativar")
                .then().statusCode(200).body("ativo", equalTo(false));

        given().auth().oauth2(token).when().get("/usuarios/me").then().statusCode(401);
        given().contentType(ContentType.JSON)
                .body(Map.of("email", email, "password", SENHA))
                .when().post("/auth/login")
                .then().statusCode(401)
                .body("detail", equalTo("Usuário desativado. Fale com o administrador da empresa."));

        given().auth().oauth2(admin).when().patch("/empresa/usuarios/" + id + "/ativar")
                .then().statusCode(200).body("ativo", equalTo(true));
        logar(email);
    }

    @Test
    void administradorPrincipalNaoPodeSerRebaixadoDesativadoNemExcluido() {
        String principal = registrarEmpresaCompleta();
        long idPrincipal = idDoUsuario(principal);
        String outroAdmin = logar(criarUsuarioEmpresa(principal, "ADMIN_EMPRESA", List.of()));

        given().auth().oauth2(outroAdmin).when().patch("/empresa/usuarios/" + idPrincipal + "/desativar")
                .then().statusCode(400);
        given().auth().oauth2(outroAdmin).when().delete("/empresa/usuarios/" + idPrincipal)
                .then().statusCode(400);
        given().auth().oauth2(outroAdmin).contentType(ContentType.JSON)
                .body(Map.of("nome", "Principal", "telefone", "63999990000", "role", "USUARIO_EMPRESA"))
                .when().put("/empresa/usuarios/" + idPrincipal)
                .then().statusCode(400);
        given().auth().oauth2(principal).when().patch("/empresa/usuarios/" + idPrincipal + "/desativar")
                .then().statusCode(400);
    }

    @Test
    void soExcluiUsuarioSemHistorico() {
        String admin = registrarEmpresaCompleta();
        String comHistorico = logar(criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of("LANCAMENTOS")));
        criarTransacao(comHistorico, "DESPESA");
        long idSemHistorico = idDoUsuario(logar(criarUsuarioEmpresa(admin, "USUARIO_EMPRESA", List.of())));

        given().auth().oauth2(admin).when().delete("/empresa/usuarios/" + idDoUsuario(comHistorico))
                .then().statusCode(400);
        given().auth().oauth2(admin).when().delete("/empresa/usuarios/" + idSemHistorico)
                .then().statusCode(204);
    }

    @Test
    void adminNaoVeUsuarioDeOutraEmpresa() {
        String adminA = registrarEmpresaCompleta();
        String adminB = registrarEmpresaCompleta();
        long idDeB = idDoUsuario(logar(criarUsuarioEmpresa(adminB, "USUARIO_EMPRESA", List.of())));

        given().auth().oauth2(adminA).when().get("/empresa/usuarios/" + idDeB).then().statusCode(404);
        given().auth().oauth2(adminA).when().get("/empresa/usuarios")
                .then().statusCode(200).body("size()", equalTo(1));
    }

    // ------------------------------------------------------------------ conta pessoal

    @Test
    void contaPessoalPersonalizaOsModulos() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(perfil(List.of("DASHBOARD", "LANCAMENTOS")))
                .when().put("/usuarios/me")
                .then().statusCode(200)
                .body("modulos", contains("DASHBOARD", "LANCAMENTOS"));

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "Nova", "tipo", "DESPESA"))
                .when().post("/categorias")
                .then().statusCode(403);

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(perfil(List.of("CLIENTES")))
                .when().put("/usuarios/me")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("modulos"));
    }

    @Test
    void atualizaPerfilComTelefoneSoComDigitos() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(perfil(null))
                .when().put("/usuarios/me")
                .then().statusCode(200)
                .body("nome", equalTo("Novo Nome"))
                .body("telefone", equalTo("6332150000"));
    }

    // ------------------------------------------------------------------ transações

    @Test
    void criaTransacaoCom201EListaSoAsProprias() {
        String tokenA = registrarELogar();
        String tokenB = registrarELogar();

        given().auth().oauth2(tokenA).contentType(ContentType.JSON)
                .body(transacao("Mercado", "DESPESA", categoria(tokenA, "DESPESA")))
                .when().post("/transacoes")
                .then().statusCode(201)
                .body("categoria.tipo", equalTo("DESPESA"))
                .body("escopo", equalTo("PESSOAL"));

        given().auth().oauth2(tokenA).when().get("/transacoes")
                .then().statusCode(200).body("totalItems", equalTo(1));
        given().auth().oauth2(tokenB).when().get("/transacoes")
                .then().statusCode(200).body("totalItems", equalTo(0));
    }

    @Test
    void outroUsuarioNaoLeEditaNemExcluiTransacao() {
        String tokenA = registrarELogar();
        String tokenB = registrarELogar();
        long id = criarTransacao(tokenA, "DESPESA");

        given().auth().oauth2(tokenB).when().get("/transacoes/" + id).then().statusCode(404);
        given().auth().oauth2(tokenB).contentType(ContentType.JSON)
                .body(transacao("Invasão", "DESPESA", categoria(tokenB, "DESPESA")))
                .when().put("/transacoes/" + id).then().statusCode(404);
        given().auth().oauth2(tokenB).when().delete("/transacoes/" + id).then().statusCode(404);
    }

    @Test
    void naoUsaCategoriaDeOutroUsuario() {
        String tokenA = registrarELogar();
        String tokenB = registrarELogar();

        given().auth().oauth2(tokenA).contentType(ContentType.JSON)
                .body(transacao("Teste", "DESPESA", categoria(tokenB, "DESPESA")))
                .when().post("/transacoes")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("idCategoria"));
    }

    @Test
    void despesaNaoAceitaCategoriaDeReceita() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(transacao("Teste", "DESPESA", categoria(token, "RECEITA")))
                .when().post("/transacoes")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("idCategoria"));
    }

    @Test
    void validaCamposDaTransacao() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("descricao", "x", "valor", -5))
                .when().post("/transacoes")
                .then().statusCode(400)
                .body("errors.field", hasItem("valor"))
                .body("errors.field", hasItem("idCategoria"));
    }

    @Test
    void limitaTamanhoDaPagina() {
        String token = registrarELogar();
        given().auth().oauth2(token).queryParam("pageSize", 1000)
                .when().get("/transacoes")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("pageSize"));
    }

    // ------------------------------------------------------------------ categorias

    @Test
    void nomeDeCategoriaRepetidoIgnoraEspacosEMaiusculas() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "  LAZER  ", "tipo", "DESPESA"))
                .when().post("/categorias")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("nome"));
    }

    @Test
    void categoriaComTransacoesNaoPodeSerExcluidaNemMudarDeTipo() {
        String token = registrarELogar();
        long idCategoria = categoria(token, "DESPESA");
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(transacao("Conta", "DESPESA", idCategoria))
                .when().post("/transacoes").then().statusCode(201);

        given().auth().oauth2(token).when().delete("/categorias/" + idCategoria)
                .then().statusCode(400);
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "Outro nome", "tipo", "RECEITA"))
                .when().put("/categorias/" + idCategoria)
                .then().statusCode(400)
                .body("errors[0].field", equalTo("tipo"));
    }

    @Test
    void outroUsuarioNaoAcessaCategoria() {
        String tokenA = registrarELogar();
        String tokenB = registrarELogar();
        long idCategoria = categoria(tokenA, "DESPESA");
        given().auth().oauth2(tokenB).when().get("/categorias/" + idCategoria).then().statusCode(404);
        given().auth().oauth2(tokenB).when().delete("/categorias/" + idCategoria).then().statusCode(404);
    }

    // ------------------------------------------------------------------ administração do FinControl

    @Test
    void quemNaoESuperAdminNaoAcessaAdmin() {
        String pessoal = registrarELogar();
        String adminEmpresa = registrarEmpresaCompleta();
        for (String token : List.of(pessoal, adminEmpresa)) {
            given().auth().oauth2(token).when().get("/admin/estatisticas").then().statusCode(403);
            given().auth().oauth2(token).when().get("/admin/parametros").then().statusCode(403);
        }
    }

    @Test
    void superAdminVeOsIndicadoresDoSistema() {
        criarTransacao(registrarELogar(), "DESPESA");
        given().auth().oauth2(logar(ADMIN_EMAIL))
                .when().get("/admin/estatisticas")
                .then().statusCode(200)
                .body("totalAdmins", greaterThanOrEqualTo(1))
                .body("usuariosAtivos", greaterThanOrEqualTo(2))
                .body("totalEmpresas", notNullValue())
                .body("totalRegistros", greaterThan(0))
                .body("categoriasMaisUtilizadas.size()", greaterThan(0))
                .body("transacoesPorMes.size()", equalTo(6));
    }

    @Test
    void parametroFiscalNormalizaChaveENaoAceitaSobreposicao() {
        String admin = logar(ADMIN_EMAIL);
        String sufixo = UUID.randomUUID().toString().substring(0, 6);

        int id = given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(parametro("teto mei " + sufixo, "2030-01-01", "2030-12-31"))
                .when().post("/admin/parametros")
                .then().statusCode(201)
                .body("chave", equalTo(("TETO_MEI_" + sufixo).toUpperCase()))
                .extract().path("id");

        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(parametro("TETO_MEI_" + sufixo.toUpperCase(), "2030-06-01", "2031-05-31"))
                .when().post("/admin/parametros")
                .then().statusCode(400);

        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(parametro("teto mei " + sufixo, "2030-01-01", "2030-12-31"))
                .when().put("/admin/parametros/" + id)
                .then().statusCode(200);

        given().auth().oauth2(admin).when().delete("/admin/parametros/" + id).then().statusCode(204);
    }

    // ------------------------------------------------------------------ painel do SUPER_ADMIN

    @Test
    void quemNaoESuperAdminNaoAcessaOPainel() {
        String pessoal = registrarELogar();
        for (String rota : List.of("/admin/usuarios", "/admin/empresas", "/admin/transacoes",
                "/admin/categorias-padrao", "/admin/categorias/ranking", "/admin/auditoria")) {
            given().auth().oauth2(pessoal).when().get(rota).then().statusCode(403);
        }
    }

    @Test
    void superAdminPesquisaUsuariosPorNomeOuEmail() {
        String email = novoEmail();
        registrar(email);
        given().auth().oauth2(logar(ADMIN_EMAIL)).queryParam("busca", email.substring(0, 14))
                .when().get("/admin/usuarios")
                .then().statusCode(200)
                .body("totalItems", equalTo(1))
                .body("items[0].email", equalTo(email));
    }

    @Test
    void superAdminCriaContaPessoalUsuarioDeEmpresaEOutroAdministrador() {
        String admin = logar(ADMIN_EMAIL);
        String adminEmpresa = registrarEmpresaCompleta();
        long idEmpresa = given().auth().oauth2(adminEmpresa).when().get("/usuarios/me")
                .then().extract().jsonPath().getLong("empresa.id");

        var pessoal = usuarioAdmin(novoEmail(), "PESSOAL");
        pessoal.put("profissao", "Contadora");
        String emailPessoal = (String) pessoal.get("email");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(pessoal)
                .when().post("/admin/usuarios").then().statusCode(201).body("role", equalTo("PESSOAL"));
        given().auth().oauth2(logar(emailPessoal)).when().get("/categorias")
                .then().statusCode(200).body("size()", equalTo(6));

        var comum = usuarioAdmin(novoEmail(), "USUARIO_EMPRESA");
        comum.put("idEmpresa", idEmpresa);
        comum.put("modulos", List.of("DASHBOARD"));
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(comum)
                .when().post("/admin/usuarios").then().statusCode(201)
                .body("empresa.id", equalTo((int) idEmpresa));

        var semEmpresa = usuarioAdmin(novoEmail(), "USUARIO_EMPRESA");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(semEmpresa)
                .when().post("/admin/usuarios").then().statusCode(400)
                .body("errors[0].field", equalTo("idEmpresa"));

        var outroAdmin = usuarioAdmin(novoEmail(), "SUPER_ADMIN");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(outroAdmin)
                .when().post("/admin/usuarios").then().statusCode(201);
        given().auth().oauth2(logar((String) outroAdmin.get("email"))).when().get("/admin/estatisticas")
                .then().statusCode(200);
    }

    @Test
    void perfilSoAlternaEntreUsuarioEAdministradorDoMesmoTipoDeConta() {
        String admin = logar(ADMIN_EMAIL);
        String email = novoEmail();
        registrar(email);
        String tokenAntigo = logar(email);
        long id = idDoUsuario(tokenAntigo);

        given().auth().oauth2(admin).contentType(ContentType.JSON).body(edicaoAdmin("ADMIN_EMPRESA"))
                .when().put("/admin/usuarios/" + id).then().statusCode(400);

        given().auth().oauth2(admin).contentType(ContentType.JSON).body(edicaoAdmin("SUPER_ADMIN"))
                .when().put("/admin/usuarios/" + id).then().statusCode(200).body("role", equalTo("SUPER_ADMIN"));

        // O token emitido com o perfil antigo deixa de valer.
        given().auth().oauth2(tokenAntigo).when().get("/usuarios/me").then().statusCode(401);
        given().auth().oauth2(logar(email)).when().get("/admin/estatisticas").then().statusCode(200);
    }

    @Test
    void superAdminNaoAlteraODesativaASiMesmo() {
        String admin = logar(ADMIN_EMAIL);
        long id = idDoUsuario(admin);
        given().auth().oauth2(admin).when().patch("/admin/usuarios/" + id + "/desativar").then().statusCode(400);
        given().auth().oauth2(admin).when().delete("/admin/usuarios/" + id).then().statusCode(400);
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(edicaoAdmin("PESSOAL"))
                .when().put("/admin/usuarios/" + id).then().statusCode(400);
    }

    @Test
    void contaPessoalSemLancamentosPodeSerExcluidaComAsCategoriasIniciais() {
        String admin = logar(ADMIN_EMAIL);
        long semLancamentos = idDoUsuario(registrarELogar());
        String comLancamento = registrarELogar();
        criarTransacao(comLancamento, "DESPESA");

        given().auth().oauth2(admin).when().delete("/admin/usuarios/" + semLancamentos).then().statusCode(204);
        given().auth().oauth2(admin).when().delete("/admin/usuarios/" + idDoUsuario(comLancamento)).then().statusCode(400);
    }

    @Test
    void empresaDesativadaBloqueiaTodosOsUsuariosDela() {
        String admin = logar(ADMIN_EMAIL);
        String adminEmpresa = registrarEmpresaCompleta();
        long idEmpresa = given().auth().oauth2(adminEmpresa).when().get("/usuarios/me")
                .then().extract().jsonPath().getLong("empresa.id");

        given().auth().oauth2(admin).queryParam("busca", "Empresa Teste").when().get("/admin/empresas")
                .then().statusCode(200).body("items.totalUsuarios", everyItem(notNullValue()));

        given().auth().oauth2(admin).when().patch("/admin/empresas/" + idEmpresa + "/desativar")
                .then().statusCode(200).body("ativo", equalTo(false));
        given().auth().oauth2(adminEmpresa).when().get("/categorias")
                .then().statusCode(401)
                .body("detail", equalTo("Empresa desativada. Fale com o suporte do FinControl."));

        given().auth().oauth2(admin).when().patch("/admin/empresas/" + idEmpresa + "/ativar").then().statusCode(200);
        given().auth().oauth2(adminEmpresa).when().get("/categorias").then().statusCode(200);
    }

    @Test
    void superAdminVeTransacoesDeTodosComFiltrosEFicaNaAuditoria() {
        String admin = logar(ADMIN_EMAIL);
        String pessoal = registrarELogar();
        long idUsuario = idDoUsuario(pessoal);
        criarTransacao(pessoal, "DESPESA");

        given().auth().oauth2(admin).queryParam("idUsuario", idUsuario).queryParam("tipo", "DESPESA")
                .when().get("/admin/transacoes")
                .then().statusCode(200)
                .body("totalItems", equalTo(1))
                .body("items[0].usuario.id", equalTo((int) idUsuario))
                .body("items[0].empresa", equalTo(null));
        given().auth().oauth2(admin).queryParam("idUsuario", idUsuario).queryParam("tipo", "RECEITA")
                .when().get("/admin/transacoes")
                .then().statusCode(200).body("totalItems", equalTo(0));
        given().auth().oauth2(admin).queryParam("inicio", "2026-12-31").queryParam("fim", "2026-01-01")
                .when().get("/admin/transacoes").then().statusCode(400);

        given().auth().oauth2(admin).queryParam("acao", "CONSULTA_TRANSACOES")
                .when().get("/admin/auditoria")
                .then().statusCode(200)
                .body("items[0].autorEmail", equalTo(ADMIN_EMAIL))
                .body("items[0].detalhe", containsString("usuário #" + idUsuario));
    }

    @Test
    void categoriasPadraoDefinemAsCategoriasDasContasNovas() {
        String admin = logar(ADMIN_EMAIL);
        String nome = "Saúde " + UUID.randomUUID().toString().substring(0, 4);
        int id = given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(Map.of("nome", nome, "tipo", "DESPESA", "cor", "#8e24aa"))
                .when().post("/admin/categorias-padrao")
                .then().statusCode(201).body("cor", equalTo("#8E24AA"))
                .extract().path("id");

        given().auth().oauth2(registrarELogar()).when().get("/categorias")
                .then().statusCode(200).body("size()", equalTo(7)).body("nome", hasItem(nome));

        given().auth().oauth2(admin).when().patch("/admin/categorias-padrao/" + id + "/desativar").then().statusCode(200);
        given().auth().oauth2(registrarELogar()).when().get("/categorias")
                .then().statusCode(200).body("size()", equalTo(6));

        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(Map.of("nome", "lazer", "tipo", "DESPESA"))
                .when().post("/admin/categorias-padrao").then().statusCode(400);
    }

    @Test
    void rankingSomaCategoriasDeMesmoNomeDeTodasAsContas() {
        criarTransacao(registrarELogar(), "RECEITA");
        criarTransacao(registrarELogar(), "RECEITA");
        given().auth().oauth2(logar(ADMIN_EMAIL)).when().get("/admin/categorias/ranking")
                .then().statusCode(200)
                .body("find { it.nome == 'Salário' }.totalContas", greaterThanOrEqualTo(2));
    }

    @Test
    void parametroDesativadoSaiDeUsoEGuardaQuemAlterou() {
        String admin = logar(ADMIN_EMAIL);
        String chave = "TESTE_" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        int id = given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(parametro(chave, "2031-01-01", "2031-12-31"))
                .when().post("/admin/parametros")
                .then().statusCode(201)
                .body("ativo", equalTo(true))
                .body("alteradoPor", equalTo(ADMIN_EMAIL))
                .body("ultimaAlteracao", notNullValue())
                .extract().path("id");

        given().auth().oauth2(admin).when().patch("/admin/parametros/" + id + "/desativar")
                .then().statusCode(200).body("ativo", equalTo(false));
        // Desativado não bloqueia outro valor no mesmo período...
        given().auth().oauth2(admin).contentType(ContentType.JSON)
                .body(parametro(chave, "2031-06-01", "2031-12-31"))
                .when().post("/admin/parametros").then().statusCode(201);
        // ...e não pode ser reativado por cima dele.
        given().auth().oauth2(admin).when().patch("/admin/parametros/" + id + "/ativar").then().statusCode(400);
    }

    @Test
    void parametroComFimAntesDoInicioDevolve400() {
        given().auth().oauth2(logar(ADMIN_EMAIL)).contentType(ContentType.JSON)
                .body(parametro("QUALQUER", "2030-12-31", "2030-01-01"))
                .when().post("/admin/parametros")
                .then().statusCode(400);
    }

    // ------------------------------------------------------------------ apoio

    private static String novoEmail() {
        return "teste-" + UUID.randomUUID().toString().substring(0, 8) + "@teste.local";
    }

    // CNPJ aleatório com dígitos verificadores corretos (cada empresa precisa de um diferente).
    private static String novoCnpj() {
        int[] d = new int[14];
        for (int i = 0; i < 8; i++) {
            d[i] = ThreadLocalRandom.current().nextInt(10);
        }
        d[11] = 1; // filial 0001
        d[12] = digitoCnpj(d, new int[] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 });
        d[13] = digitoCnpj(d, new int[] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 });
        StringBuilder cnpj = new StringBuilder();
        for (int digito : d) {
            cnpj.append(digito);
        }
        return cnpj.toString();
    }

    private static int digitoCnpj(int[] d, int[] pesos) {
        int soma = 0;
        for (int i = 0; i < pesos.length; i++) {
            soma += d[i] * pesos[i];
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private static Map<String, Object> cadastroPessoal(String email) {
        var corpo = new HashMap<String, Object>();
        corpo.put("tipoConta", "PESSOAL");
        corpo.put("email", email);
        corpo.put("nome", "Pessoa Teste");
        corpo.put("telefone", "(63) 99999-0000");
        corpo.put("profissao", "Analista");
        corpo.put("password", SENHA);
        corpo.put("confirmPassword", SENHA);
        return corpo;
    }

    private static Map<String, Object> cadastroEmpresa(String email) {
        var corpo = cadastroPessoal(email);
        corpo.put("tipoConta", "EMPRESA");
        corpo.remove("profissao");
        return corpo;
    }

    private static Map<String, Object> empresa(String cnpj) {
        return Map.of(
                "razaoSocial", "Empresa Teste LTDA",
                "nomeFantasia", "Empresa Teste",
                "cnpj", cnpj,
                "tipo", "MEI",
                "telefone", "(63) 3215-0000",
                "email", "contato@empresa.local");
    }

    private static Map<String, Object> usuarioEmpresa(String email, String role, List<String> modulos) {
        var corpo = new HashMap<String, Object>();
        corpo.put("nome", "Colaborador");
        corpo.put("email", email);
        corpo.put("telefone", "63988887777");
        corpo.put("role", role);
        corpo.put("modulos", modulos);
        corpo.put("password", SENHA);
        corpo.put("confirmPassword", SENHA);
        return corpo;
    }

    private static Map<String, Object> perfil(List<String> modulos) {
        var corpo = new HashMap<String, Object>();
        corpo.put("nome", "  Novo Nome  ");
        corpo.put("telefone", "(63) 3215-0000");
        corpo.put("profissao", "Professora");
        corpo.put("modulos", modulos);
        return corpo;
    }

    private static Map<String, Object> usuarioAdmin(String email, String role) {
        var corpo = new HashMap<String, Object>();
        corpo.put("nome", "Criado pelo admin");
        corpo.put("email", email);
        corpo.put("telefone", "63977776666");
        corpo.put("role", role);
        corpo.put("password", SENHA);
        corpo.put("confirmPassword", SENHA);
        return corpo;
    }

    private static Map<String, Object> edicaoAdmin(String role) {
        var corpo = new HashMap<String, Object>();
        corpo.put("nome", "Editado pelo admin");
        corpo.put("telefone", "63977776666");
        corpo.put("profissao", "Analista");
        corpo.put("role", role);
        return corpo;
    }

    private static void registrar(String email) {
        given().contentType(ContentType.JSON).body(cadastroPessoal(email))
                .when().post("/auth/register").then().statusCode(201);
    }

    private static String logar(String email) {
        return given().contentType(ContentType.JSON)
                .body(Map.of("email", email, "password", SENHA))
                .when().post("/auth/login")
                .then().statusCode(200)
                .extract().path("token");
    }

    private static String registrarELogar() {
        String email = novoEmail();
        registrar(email);
        return logar(email);
    }

    // Admin de empresa logado, ainda sem a empresa cadastrada.
    private static String registrarEmpresaPendente() {
        String email = novoEmail();
        given().contentType(ContentType.JSON).body(cadastroEmpresa(email))
                .when().post("/auth/register").then().statusCode(201);
        return logar(email);
    }

    private static void criarEmpresa(String token, String cnpj) {
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(empresa(cnpj))
                .when().post("/empresa").then().statusCode(201);
    }

    // Admin de empresa logado, com a empresa já cadastrada.
    private static String registrarEmpresaCompleta() {
        String token = registrarEmpresaPendente();
        criarEmpresa(token, novoCnpj());
        return token;
    }

    // Devolve o e-mail do usuário criado (a senha é SENHA).
    private static String criarUsuarioEmpresa(String tokenAdmin, String role, List<String> modulos) {
        String email = novoEmail();
        given().auth().oauth2(tokenAdmin).contentType(ContentType.JSON)
                .body(usuarioEmpresa(email, role, modulos))
                .when().post("/empresa/usuarios")
                .then().statusCode(201);
        return email;
    }

    private static long idDoUsuario(String token) {
        Number id = given().auth().oauth2(token).when().get("/usuarios/me")
                .then().statusCode(200)
                .extract().path("id");
        return id.longValue();
    }

    // Id da primeira categoria do usuário com o tipo pedido.
    private static long categoria(String token, String tipo) {
        List<Map<String, Object>> categorias = given().auth().oauth2(token)
                .when().get("/categorias")
                .then().statusCode(200)
                .extract().jsonPath().getList("$");
        return categorias.stream()
                .filter(c -> tipo.equals(c.get("tipo")))
                .map(c -> ((Number) c.get("id")).longValue())
                .findFirst()
                .orElseThrow();
    }

    private static Map<String, Object> transacao(String descricao, String tipo, long idCategoria) {
        return Map.of(
                "descricao", descricao,
                "valor", 10.50,
                "data", "2026-10-16",
                "tipo", tipo,
                "idCategoria", idCategoria);
    }

    private static long criarTransacao(String token, String tipo) {
        Number id = given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(transacao("Teste", tipo, categoria(token, tipo)))
                .when().post("/transacoes")
                .then().statusCode(201)
                .extract().path("id");
        return id.longValue();
    }

    private static Map<String, Object> parametro(String chave, String inicio, String fim) {
        return Map.of("chave", chave, "valor", 81000.00, "vigenciaInicio", inicio, "vigenciaFim", fim);
    }
}
