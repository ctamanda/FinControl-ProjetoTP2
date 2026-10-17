package br.unitins.tp2.fincontrol.model;

// Funcionalidades liberadas por usuário ("tem acesso / não tem acesso").
// Contas pessoais escolhem entre os módulos pessoais; o admin da empresa libera
// os módulos de empresa para cada usuário comum.
public enum Modulo {
    DASHBOARD(true, true),
    CONTAS(true, true),
    RECEITAS(true, true),
    DESPESAS(true, true),
    LANCAMENTOS(true, true),
    RECORRENTES(true, true),
    CARTOES(true, true),
    CATEGORIAS(true, true),
    CLIENTES(false, true),
    FORNECEDORES(false, true),
    TAGS(true, true),
    ORCAMENTOS(true, true),
    RELATORIOS(true, true),
    IMPORTACAO(true, true),
    EXPORTACAO(true, true),
    // Administração de usuários: vem do perfil ADMIN_EMPRESA, não é liberada a usuário comum.
    USUARIOS(false, false);

    private final boolean pessoal;
    private final boolean liberavelNaEmpresa;

    Modulo(boolean pessoal, boolean liberavelNaEmpresa) {
        this.pessoal = pessoal;
        this.liberavelNaEmpresa = liberavelNaEmpresa;
    }

    public boolean isPessoal() {
        return pessoal;
    }

    public boolean isLiberavelNaEmpresa() {
        return liberavelNaEmpresa;
    }
}
