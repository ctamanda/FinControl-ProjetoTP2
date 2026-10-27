import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Mesmas regras do back (validation/SenhaForte e Telefone).
// Aqui servem para guiar quem digita; o back valida de novo em toda requisição.

export const REGRAS_SENHA: { rotulo: string; atende: (senha: string) => boolean }[] = [
  { rotulo: 'No mínimo 6 caracteres', atende: (s) => s.length >= 6 },
  { rotulo: 'Uma letra maiúscula', atende: (s) => /\p{Lu}/u.test(s) },
  { rotulo: 'Uma letra minúscula', atende: (s) => /\p{Ll}/u.test(s) },
  { rotulo: 'Um número', atende: (s) => /\p{Nd}/u.test(s) },
  { rotulo: 'Um caractere especial (ex.: ! @ # $ %)', atende: (s) => /[^\p{L}\p{Nd}\s]/u.test(s) },
];

export const senhaForte: ValidatorFn = (c: AbstractControl): ValidationErrors | null =>
  REGRAS_SENHA.every((r) => r.atende(c.value ?? '')) ? null : { senhaFraca: true };

export function soDigitos(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\D/g, '');
}

// DDD + número: 10 dígitos (fixo) ou 11 (celular, com 9 na frente). Vazio fica para o "required".
export const telefone: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const d = soDigitos(c.value);
  if (!d) return null;
  const ok = d[0] !== '0' && (d.length === 10 || (d.length === 11 && d[2] === '9'));
  return ok ? null : { telefone: true };
};

// (63) 99999-0000 / (63) 3215-0000
export function formatarTelefone(valor: string | null | undefined): string {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  const meio = d.length === 11 ? 7 : 6;
  if (d.length <= meio) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, meio)}-${d.slice(meio)}`;
}
