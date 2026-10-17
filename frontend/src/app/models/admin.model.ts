export interface Estatisticas {
  totalUsuarios: number;
  totalAdmins: number;
  totalUsers: number;
  totalTransacoes: number;
  totalCategorias: number;
  mediaTransacoesPorUsuario: number;
}

export interface ParametroFiscal {
  id?: number;
  chave: string;
  valor: number;
  vigenciaInicio: string; // 'yyyy-MM-dd'
  vigenciaFim: string; // 'yyyy-MM-dd'
}

export type SituacaoVigencia = 'VIGENTE' | 'FUTURO' | 'ENCERRADO';

export function situacaoVigencia(p: ParametroFiscal, hoje = hojeIso()): SituacaoVigencia {
  if (hoje < p.vigenciaInicio) return 'FUTURO';
  if (hoje > p.vigenciaFim) return 'ENCERRADO';
  return 'VIGENTE';
}

// Data local no formato do back (LocalDate); toISOString() usaria UTC e erraria o dia à noite.
export function hojeIso(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
