package br.unitins.tp2.fincontrol.security;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

// Gera a senha provisória que o admin repassa ao usuário. Cumpre as regras de @SenhaForte
// e evita caracteres fáceis de confundir ao ditar ou copiar (I, l, O, 0, 1).
public final class SenhaProvisoria {

    private static final String MAIUSCULAS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String MINUSCULAS = "abcdefghijkmnpqrstuvwxyz";
    private static final String NUMEROS = "23456789";
    private static final String ESPECIAIS = "@#$%&*!?";
    private static final int TAMANHO = 10;

    private static final SecureRandom RANDOM = new SecureRandom();

    private SenhaProvisoria() {
    }

    public static String gerar() {
        List<Character> letras = new ArrayList<>();
        letras.add(sortear(MAIUSCULAS));
        letras.add(sortear(MINUSCULAS));
        letras.add(sortear(NUMEROS));
        letras.add(sortear(ESPECIAIS));
        String todos = MAIUSCULAS + MINUSCULAS + NUMEROS + ESPECIAIS;
        while (letras.size() < TAMANHO) {
            letras.add(sortear(todos));
        }
        Collections.shuffle(letras, RANDOM);
        StringBuilder senha = new StringBuilder();
        letras.forEach(senha::append);
        return senha.toString();
    }

    private static char sortear(String caracteres) {
        return caracteres.charAt(RANDOM.nextInt(caracteres.length()));
    }
}
