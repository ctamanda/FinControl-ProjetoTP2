import { TipoTransacao } from '../models/transacao.model';
import { Modulo, Usuario } from '../models/usuario.model';

// Regras de acesso do lado do front: só decidem o que aparece na tela.
// Quem barra de verdade é o back (AcessoFilter + Permissoes), em toda requisição.

export function temModulo(usuario: Usuario | null, ...modulos: Modulo[]): boolean {
  return !!usuario && modulos.some((m) => usuario.modulos.includes(m));
}

// Lançamentos libera os dois tipos; Receitas/Despesas, só o seu.
export function tiposEditaveis(usuario: Usuario | null): TipoTransacao[] {
  if (temModulo(usuario, 'LANCAMENTOS')) {
    return ['DESPESA', 'RECEITA'];
  }
  const tipos: TipoTransacao[] = [];
  if (temModulo(usuario, 'DESPESAS')) tipos.push('DESPESA');
  if (temModulo(usuario, 'RECEITAS')) tipos.push('RECEITA');
  return tipos;
}

export const MODULOS_TRANSACOES: Modulo[] = ['LANCAMENTOS', 'RECEITAS', 'DESPESAS'];
export const MODULOS_LER_CATEGORIAS: Modulo[] = ['CATEGORIAS', 'DASHBOARD', ...MODULOS_TRANSACOES];

// Primeira tela que o usuário pode abrir.
export function rotaInicial(usuario: Usuario | null): string {
  if (!usuario) return '/login';
  if (usuario.role === 'SUPER_ADMIN') return '/admin/painel';
  if (usuario.empresaPendente) return '/empresa/cadastro';
  if (temModulo(usuario, 'DASHBOARD')) return '/dashboard';
  if (temModulo(usuario, ...MODULOS_TRANSACOES)) return '/transacoes';
  if (temModulo(usuario, 'CATEGORIAS')) return '/categorias';
  if (temModulo(usuario, 'USUARIOS')) return '/empresa/usuarios';
  return '/perfil';
}
