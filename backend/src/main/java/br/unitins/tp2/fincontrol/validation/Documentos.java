package br.unitins.tp2.fincontrol.validation;

public final class Documentos {

    private Documentos() {
    }

    // "(63) 99999-0000" -> "63999990000"; "12.345.678/0001-95" -> "12345678000195".
    public static String soDigitos(String valor) {
        return valor == null ? null : valor.replaceAll("\\D", "");
    }

    // Campo opcional: vazio vira null, preenchido fica só com os dígitos.
    public static String soDigitosOuNulo(String valor) {
        return valor == null || valor.isBlank() ? null : soDigitos(valor);
    }
}
