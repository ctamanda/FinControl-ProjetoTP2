package br.unitins.tp2.fincontrol.model;

public enum Role {
    // Administração interna do FinControl (painel e parâmetros fiscais).
    SUPER_ADMIN,
    // Titular de uma conta pessoal.
    PESSOAL,
    // Administrador de um MEI/Microempresa.
    ADMIN_EMPRESA,
    // Usuário comum cadastrado pelo administrador da empresa.
    USUARIO_EMPRESA
}
