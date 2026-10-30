package br.unitins.tp2.fincontrol.dto;

// Resposta de POST /admin/usuarios/{id}/senha-provisoria. A senha aparece só nesta resposta:
// o banco guarda apenas o hash e a auditoria não registra a senha.
public record SenhaProvisoriaDTO(String senhaProvisoria) {
}
