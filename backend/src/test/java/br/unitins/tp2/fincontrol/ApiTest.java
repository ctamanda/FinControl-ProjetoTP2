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
                .body("modulos", hasItem("CONTAS"))
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
                .body("errors.message", contains("A profissão deve ser informada."));
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
        given().auth().oauth2(registrarELogar()).contentType(ContentType.JSON)
                .body(Map.of("nome", "Qualquer", "tipo", "XYZ"))
                .when().post("/categorias")
                .then().statusCode(400)
                .body("errors[0].field", equalTo("tipo"))
                .body("errors[0].message", equalTo("Valor inválido. Use um destes: RECEITA, DESPESA."));
    }

    @Test
    void semTokenDevolve401() {
        given().when().get("/transacoes").then().statusCode(401);
    }

    // ------------------------------------------------------------------ módulos e acesso

    @Test
    void moduloReceitasNaoLancaNemVeDespesas() {
        String usuario = registrarELogar();
        criarTransacao(usuario, "DESPESA");
        given().auth().oauth2(usuario).contentType(ContentType.JSON)
                .body(Map.of("modulos", List.of("RECEITAS")))
                .when().put("/usuarios/me/modulos").then().statusCode(200);

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
    void desativarCortaOAcessoNaHoraEAtivarDevolve() {
        String admin = logar(ADMIN_EMAIL);
        String email = novoEmail();
        registrar(email);
        String token = logar(email);
        long id = idDoUsuario(token);

        given().auth().oauth2(admin).when().patch("/admin/usuarios/" + id + "/desativar")
                .then().statusCode(200).body("ativo", equalTo(false));

        given().auth().oauth2(token).when().get("/usuarios/me").then().statusCode(401);
        given().contentType(ContentType.JSON)
                .body(Map.of("email", email, "password", SENHA))
                .when().post("/auth/login")
                .then().statusCode(401)
                .body("detail", equalTo("Usuário desativado. Fale com o suporte do FinControl."));

        given().auth().oauth2(admin).when().patch("/admin/usuarios/" + id + "/ativar")
                .then().statusCode(200).body("ativo", equalTo(true));
        logar(email);
    }

    // ------------------------------------------------------------------ conta pessoal

    @Test
    void contaPessoalPersonalizaOsModulos() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("modulos", List.of("DASHBOARD", "LANCAMENTOS")))
                .when().put("/usuarios/me/modulos")
                .then().statusCode(200)
                .body("modulos", contains("DASHBOARD", "LANCAMENTOS"));

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "Nova", "tipo", "DESPESA"))
                .when().post("/categorias")
                .then().statusCode(403);

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("modulos", List.of("CLIENTES")))
                .when().put("/usuarios/me/modulos")
                .then().statusCode(400);

        given().auth().oauth2(logar(ADMIN_EMAIL)).contentType(ContentType.JSON)
                .body(Map.of("modulos", List.of("DASHBOARD")))
                .when().put("/usuarios/me/modulos")
                .then().statusCode(403);
    }

    @Test
    void atualizaPerfilComTelefoneSoComDigitos() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(perfil(SENHA))
                .when().put("/usuarios/me")
                .then().statusCode(200)
                .body("nome", equalTo("Novo Nome"))
                .body("telefone", equalTo("6332150000"));
    }

    // ------------------------------------------------------------------ segurança da conta

    @Test
    void alterarDadosPessoaisExigeASenhaAtual() {
        String token = registrarELogar();
        var semSenha = perfil(null);
        semSenha.remove("senhaAtual");
        given().auth().oauth2(token).contentType(ContentType.JSON).body(semSenha)
                .when().put("/usuarios/me")
                .then().statusCode(400).body("errors.field", hasItem("senhaAtual"));
        given().auth().oauth2(token).contentType(ContentType.JSON).body(perfil("Errada@123"))
                .when().put("/usuarios/me")
                .then().statusCode(400).body("errors[0].field", equalTo("senhaAtual"));
        given().auth().oauth2(token).when().get("/usuarios/me")
                .then().body("nome", equalTo("Pessoa Teste"));
    }

    @Test
    void trocarSenhaEncerraAsOutrasSessoes() {
        String email = novoEmail();
        registrar(email);
        String tokenAntigo = logar(email);

        given().auth().oauth2(tokenAntigo).contentType(ContentType.JSON)
                .body(Map.of("senhaAtual", SENHA, "novaSenha", SENHA, "confirmacaoSenha", SENHA))
                .when().put("/usuarios/me/senha")
                .then().statusCode(400).body("errors[0].field", equalTo("novaSenha"));

        String novaSenha = "Outra#456";
        String tokenNovo = given().auth().oauth2(tokenAntigo).contentType(ContentType.JSON)
                .body(Map.of("senhaAtual", SENHA, "novaSenha", novaSenha, "confirmacaoSenha", novaSenha))
                .when().put("/usuarios/me/senha")
                .then().statusCode(200)
                .extract().path("token");

        given().auth().oauth2(tokenAntigo).when().get("/usuarios/me").then().statusCode(401);
        given().auth().oauth2(tokenNovo).when().get("/usuarios/me").then().statusCode(200);
        given().contentType(ContentType.JSON).body(Map.of("email", email, "password", SENHA))
                .when().post("/auth/login").then().statusCode(401);
        given().contentType(ContentType.JSON).body(Map.of("email", email, "password", novaSenha))
                .when().post("/auth/login").then().statusCode(200);
    }

    @Test
    void trocarEmailExigeSenhaENaoAceitaEmailDeOutraConta() {
        String email = novoEmail();
        registrar(email);
        String token = logar(email);
        String outro = novoEmail();
        registrar(outro);

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("novoEmail", outro, "senhaAtual", SENHA))
                .when().put("/usuarios/me/email")
                .then().statusCode(400).body("errors[0].field", equalTo("novoEmail"));

        String novo = novoEmail().toUpperCase();
        String tokenNovo = given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("novoEmail", novo, "senhaAtual", SENHA))
                .when().put("/usuarios/me/email")
                .then().statusCode(200)
                .extract().path("token");

        given().auth().oauth2(token).when().get("/usuarios/me").then().statusCode(401);
        given().auth().oauth2(tokenNovo).when().get("/usuarios/me")
                .then().statusCode(200).body("email", equalTo(novo.toLowerCase()));
        logar(novo.toLowerCase());
    }

    @Test
    void encerrarSessoesDerrubaOsTokensAntigos() {
        String email = novoEmail();
        registrar(email);
        String outroDispositivo = logar(email);
        String esteDispositivo = logar(email);

        String novo = given().auth().oauth2(esteDispositivo).contentType(ContentType.JSON)
                .body(Map.of("senhaAtual", SENHA))
                .when().post("/usuarios/me/encerrar-sessoes")
                .then().statusCode(200)
                .extract().path("token");

        given().auth().oauth2(outroDispositivo).when().get("/usuarios/me").then().statusCode(401);
        given().auth().oauth2(esteDispositivo).when().get("/usuarios/me").then().statusCode(401);
        given().auth().oauth2(novo).when().get("/usuarios/me").then().statusCode(200);
    }

    @Test
    void bloqueiaOLoginDepoisDeCincoSenhasErradas() {
        String email = novoEmail();
        registrar(email);
        for (int i = 0; i < 5; i++) {
            given().contentType(ContentType.JSON).body(Map.of("email", email, "password", "Errada@123"))
                    .when().post("/auth/login").then().statusCode(401);
        }
        // Bloqueada: nem a senha certa entra até passar o tempo.
        given().contentType(ContentType.JSON).body(Map.of("email", email, "password", SENHA))
                .when().post("/auth/login")
                .then().statusCode(429).body("detail", containsString("Tente novamente"));
    }

    @Test
    void senhaCertaZeraAsTentativas() {
        String email = novoEmail();
        registrar(email);
        for (int rodada = 0; rodada < 2; rodada++) {
            for (int i = 0; i < 4; i++) {
                given().contentType(ContentType.JSON).body(Map.of("email", email, "password", "Errada@123"))
                        .when().post("/auth/login").then().statusCode(401);
            }
            logar(email);
        }
    }

    // ------------------------------------------------------------------ contas e pagamentos

    @Test
    void contaNovaJaTemCarteiraESaldosSaemDosLancamentosPagos() {
        String token = registrarELogar();
        given().auth().oauth2(token).when().get("/contas")
                .then().statusCode(200)
                .body("size()", equalTo(1))
                .body("[0].nome", equalTo("Carteira"))
                .body("[0].saldoAtual", equalTo(0.0f));

        long idCarteira = idConta(token, "Carteira");
        long idBanco = criarConta(token, "Nubank", 1000);

        lancar(token, Map.of("descricao", "Freela", "valor", 500, "data", HOJE, "tipo", "RECEITA",
                "idCategoria", categoria(token, "RECEITA"), "idConta", idBanco));
        lancar(token, Map.of("descricao", "Luz", "valor", 200, "data", HOJE, "tipo", "DESPESA",
                "idCategoria", categoria(token, "DESPESA"), "idConta", idBanco, "pago", false));
        criarTransacao(token, "DESPESA"); // 10,50 na conta padrão (Carteira), paga

        given().auth().oauth2(token).when().get("/contas/" + idBanco)
                .then().statusCode(200)
                .body("saldoAtual", equalTo(1500.0f))
                .body("receitasMes", equalTo(500.0f))
                .body("despesasMes", equalTo(200.0f))
                .body("saldoPrevisto", equalTo(1300.0f))
                .body("totalLancamentos", equalTo(2));
        given().auth().oauth2(token).when().get("/contas/" + idCarteira)
                .then().body("saldoAtual", equalTo(-10.5f));
    }

    @Test
    void contaAPagarViraPagaEPodeSerReaberta() {
        String token = registrarELogar();
        long id = lancar(token, Map.of("descricao", "Internet", "valor", 99.9, "data", HOJE, "tipo", "DESPESA",
                "idCategoria", categoria(token, "DESPESA"), "pago", false));

        given().auth().oauth2(token).when().get("/transacoes?status=PENDENTE")
                .then().statusCode(200)
                .body("items.id", hasItem((int) id))
                .body("items[0].status", equalTo("PENDENTE"))
                .body("items[0].conta.nome", equalTo("Carteira"));

        given().auth().oauth2(token).contentType(ContentType.JSON).body(Map.of())
                .when().patch("/transacoes/" + id + "/pagar")
                .then().statusCode(200)
                .body("status", equalTo("PAGO"))
                .body("dataPagamento", equalTo(HOJE));
        given().auth().oauth2(token).contentType(ContentType.JSON).body(Map.of())
                .when().patch("/transacoes/" + id + "/pagar")
                .then().statusCode(400);
        given().auth().oauth2(token).when().get("/contas")
                .then().body("[0].saldoAtual", equalTo(-99.9f));

        given().auth().oauth2(token).when().patch("/transacoes/" + id + "/reabrir")
                .then().statusCode(200).body("status", equalTo("PENDENTE")).body("dataPagamento", equalTo(null));
    }

    @Test
    void pendenteVencidoApareceComoAtrasadoEDataFuturaNaoPodeEstarPaga() {
        String token = registrarELogar();
        String ontem = java.time.LocalDate.now().minusDays(1).toString();
        String amanha = java.time.LocalDate.now().plusDays(1).toString();
        long idDespesa = categoria(token, "DESPESA");

        long atrasada = lancar(token, Map.of("descricao", "Boleto", "valor", 50, "data", ontem, "tipo", "DESPESA",
                "idCategoria", idDespesa, "pago", false));
        // Sem "pago": data futura vira pendente (agendado).
        long agendada = lancar(token, Map.of("descricao", "Aluguel", "valor", 900, "data", amanha, "tipo", "DESPESA",
                "idCategoria", idDespesa));

        given().auth().oauth2(token).when().get("/transacoes?status=ATRASADO")
                .then().statusCode(200).body("items.id", contains((int) atrasada));
        given().auth().oauth2(token).when().get("/transacoes/" + agendada)
                .then().body("status", equalTo("PENDENTE")).body("pago", equalTo(false));

        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("descricao", "Aluguel", "valor", 900, "data", amanha, "tipo", "DESPESA",
                        "idCategoria", idDespesa, "pago", true, "dataPagamento", amanha))
                .when().post("/transacoes")
                .then().statusCode(400).body("errors[0].field", equalTo("dataPagamento"));
    }

    @Test
    void regrasDeContaArquivadaEExclusao() {
        String token = registrarELogar();
        long idCarteira = idConta(token, "Carteira");

        // Precisa sobrar uma conta ativa.
        given().auth().oauth2(token).when().patch("/contas/" + idCarteira + "/arquivar")
                .then().statusCode(400);

        long idBanco = criarConta(token, "Inter", 0);
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "inter", "tipo", "POUPANCA", "saldoInicial", 0))
                .when().post("/contas").then().statusCode(400).body("errors[0].field", equalTo("nome"));

        lancar(token, Map.of("descricao", "Pix", "valor", 10, "data", HOJE, "tipo", "RECEITA",
                "idCategoria", categoria(token, "RECEITA"), "idConta", idBanco));
        given().auth().oauth2(token).when().delete("/contas/" + idBanco).then().statusCode(400);

        given().auth().oauth2(token).when().patch("/contas/" + idBanco + "/arquivar")
                .then().statusCode(200).body("ativa", equalTo(false));
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("descricao", "Pix", "valor", 10, "data", HOJE, "tipo", "RECEITA",
                        "idCategoria", categoria(token, "RECEITA"), "idConta", idBanco))
                .when().post("/transacoes")
                .then().statusCode(400).body("errors[0].field", equalTo("idConta"));
        given().auth().oauth2(token).when().get("/contas").then().body("size()", equalTo(1));
        given().auth().oauth2(token).when().get("/contas?inativas=true").then().body("size()", equalTo(2));

        long vazia = criarConta(token, "Vazia", 0);
        given().auth().oauth2(token).when().delete("/contas/" + vazia).then().statusCode(204);
    }

    @Test
    void contaDeOutroDonoNaoServe() {
        String tokenA = registrarELogar();
        String tokenB = registrarELogar();
        long contaDeB = idConta(tokenB, "Carteira");

        given().auth().oauth2(tokenA).when().get("/contas/" + contaDeB).then().statusCode(404);
        given().auth().oauth2(tokenA).contentType(ContentType.JSON)
                .body(Map.of("descricao", "Teste", "valor", 10, "data", HOJE, "tipo", "DESPESA",
                        "idCategoria", categoria(tokenA, "DESPESA"), "idConta", contaDeB))
                .when().post("/transacoes")
                .then().statusCode(400).body("errors[0].field", equalTo("idConta"));
    }

    @Test
    void categoriaGuardaOIcone() {
        String token = registrarELogar();
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "Pet", "tipo", "DESPESA", "icone", "pets"))
                .when().post("/categorias")
                .then().statusCode(201).body("icone", equalTo("pets"));
        given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", "Outra", "tipo", "DESPESA", "icone", "Ícone!"))
                .when().post("/categorias")
                .then().statusCode(400).body("errors[0].field", equalTo("icone"));
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
                .body("conta.nome", equalTo("Carteira"));

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
        given().auth().oauth2(registrarELogar()).when().get("/admin/estatisticas").then().statusCode(403);
    }

    @Test
    void superAdminVeOsIndicadoresDoSistema() {
        criarTransacao(registrarELogar(), "DESPESA");
        given().auth().oauth2(logar(ADMIN_EMAIL))
                .when().get("/admin/estatisticas")
                .then().statusCode(200)
                .body("totalAdmins", greaterThanOrEqualTo(1))
                .body("usuariosAtivos", greaterThanOrEqualTo(2))
                .body("totalRegistros", greaterThan(0))
                .body("categoriasMaisUtilizadas.size()", greaterThan(0))
                .body("transacoesPorMes.size()", equalTo(6))
                .body("transacoesPorMes[5].valor", greaterThan(0f))
                .body("cadastrosPorMes.size()", equalTo(6))
                .body("cadastrosPorMes[5].contasPessoais", greaterThanOrEqualTo(1));
    }

    @Test
    void transacaoInformaQuemLancou() {
        String token = registrarELogar();
        long id = criarTransacao(token, "RECEITA");
        given().auth().oauth2(token).when().get("/transacoes/" + id)
                .then().statusCode(200)
                .body("usuario.id", equalTo((int) idDoUsuario(token)));
    }

    // ------------------------------------------------------------------ painel do SUPER_ADMIN

    @Test
    void quemNaoESuperAdminNaoAcessaOPainel() {
        String pessoal = registrarELogar();
        for (String rota : List.of("/admin/usuarios", "/admin/transacoes",
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
    void superAdminCriaContaPessoalEOutroAdministrador() {
        String admin = logar(ADMIN_EMAIL);

        var pessoal = usuarioAdmin(novoEmail(), "PESSOAL");
        pessoal.put("profissao", "Contadora");
        String emailPessoal = (String) pessoal.get("email");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(pessoal)
                .when().post("/admin/usuarios").then().statusCode(201).body("role", equalTo("PESSOAL"));
        given().auth().oauth2(logar(emailPessoal)).when().get("/categorias")
                .then().statusCode(200).body("size()", equalTo(6));

        var semProfissao = usuarioAdmin(novoEmail(), "PESSOAL");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(semProfissao)
                .when().post("/admin/usuarios").then().statusCode(400)
                .body("errors[0].field", equalTo("profissao"));

        var perfilExtinto = usuarioAdmin(novoEmail(), "ADMIN_EMPRESA");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(perfilExtinto)
                .when().post("/admin/usuarios").then().statusCode(400);

        var outroAdmin = usuarioAdmin(novoEmail(), "SUPER_ADMIN");
        given().auth().oauth2(admin).contentType(ContentType.JSON).body(outroAdmin)
                .when().post("/admin/usuarios").then().statusCode(201);
        given().auth().oauth2(logar((String) outroAdmin.get("email"))).when().get("/admin/estatisticas")
                .then().statusCode(200);
    }

    @Test
    void perfilAlternaEntrePessoalEAdministrador() {
        String admin = logar(ADMIN_EMAIL);
        String email = novoEmail();
        registrar(email);
        String tokenAntigo = logar(email);
        long id = idDoUsuario(tokenAntigo);

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
    void superAdminVeTransacoesDeTodosComFiltrosEFicaNaAuditoria() {
        String admin = logar(ADMIN_EMAIL);
        String pessoal = registrarELogar();
        long idUsuario = idDoUsuario(pessoal);
        criarTransacao(pessoal, "DESPESA");

        given().auth().oauth2(admin).queryParam("idUsuario", idUsuario).queryParam("tipo", "DESPESA")
                .when().get("/admin/transacoes")
                .then().statusCode(200)
                .body("totalItems", equalTo(1))
                .body("items[0].usuario.id", equalTo((int) idUsuario));
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

    // ------------------------------------------------------------------ apoio

    private static String novoEmail() {
        return "teste-" + UUID.randomUUID().toString().substring(0, 8) + "@teste.local";
    }

    private static Map<String, Object> cadastroPessoal(String email) {
        var corpo = new HashMap<String, Object>();
        corpo.put("email", email);
        corpo.put("nome", "Pessoa Teste");
        corpo.put("telefone", "(63) 99999-0000");
        corpo.put("profissao", "Analista");
        corpo.put("password", SENHA);
        corpo.put("confirmPassword", SENHA);
        return corpo;
    }

    private static Map<String, Object> perfil(String senhaAtual) {
        var corpo = new HashMap<String, Object>();
        corpo.put("nome", "  Novo Nome  ");
        corpo.put("telefone", "(63) 3215-0000");
        corpo.put("profissao", "Professora");
        corpo.put("senhaAtual", senhaAtual);
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

    private static final String HOJE = java.time.LocalDate.now().toString();

    private static long lancar(String token, Map<String, Object> corpo) {
        Number id = given().auth().oauth2(token).contentType(ContentType.JSON).body(corpo)
                .when().post("/transacoes")
                .then().statusCode(201)
                .extract().path("id");
        return id.longValue();
    }

    private static long criarConta(String token, String nome, double saldoInicial) {
        Number id = given().auth().oauth2(token).contentType(ContentType.JSON)
                .body(Map.of("nome", nome, "tipo", "CONTA_CORRENTE", "saldoInicial", saldoInicial))
                .when().post("/contas")
                .then().statusCode(201)
                .extract().path("id");
        return id.longValue();
    }

    private static long idConta(String token, String nome) {
        List<Map<String, Object>> contas = given().auth().oauth2(token)
                .when().get("/contas?inativas=true")
                .then().statusCode(200)
                .extract().jsonPath().getList("$");
        return contas.stream()
                .filter(c -> nome.equals(c.get("nome")))
                .map(c -> ((Number) c.get("id")).longValue())
                .findFirst()
                .orElseThrow();
    }

}
