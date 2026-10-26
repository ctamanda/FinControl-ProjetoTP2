import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { chaveMes, MesService } from '../../../core/mes.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { formatarCnpj } from '../../../core/validadores';
import {
  AdminEmpresa,
  Estatisticas,
  hojeIso,
  ParametroFiscal,
  RegistroAuditoria,
  situacaoVigencia,
} from '../../../models/admin.model';
import { Role, Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { escalaDoGrafico, variacao } from '../../dashboard/resumo';
import { iniciais } from '../../layout/shell/shell';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { Indicador } from '../../shared/indicador/indicador';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// O back guarda até 6 meses de série (transacoesPorMes / cadastrosPorMes).
const MESES_COM_DADOS = 5;

type Aba = 'TODOS' | 'PESSOAL' | 'ADMIN_EMPRESA' | 'USUARIO_EMPRESA' | 'INATIVOS';

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'TODOS', rotulo: 'Todos' },
  { id: 'PESSOAL', rotulo: 'Pessoais' },
  { id: 'ADMIN_EMPRESA', rotulo: 'Empresas' },
  { id: 'USUARIO_EMPRESA', rotulo: 'Colaboradores' },
  { id: 'INATIVOS', rotulo: 'Inativos' },
];

// Frase de cada ação da auditoria ("Rafael desativou o usuário …").
const VERBOS: Record<string, string> = {
  USUARIO_CRIADO: 'criou',
  USUARIO_ALTERADO: 'alterou',
  PERFIL_ALTERADO: 'alterou o perfil de',
  USUARIO_ATIVADO: 'reativou',
  USUARIO_DESATIVADO: 'desativou',
  USUARIO_EXCLUIDO: 'excluiu',
  EMPRESA_CADASTRADA: 'cadastrou',
  EMPRESA_ALTERADA: 'alterou os dados de',
  EMPRESA_ATIVADA: 'reativou',
  EMPRESA_DESATIVADA: 'desativou',
  CATEGORIA_PADRAO_CRIADA: 'criou a categoria padrão',
  CATEGORIA_PADRAO_ALTERADA: 'alterou a categoria padrão',
  CATEGORIA_PADRAO_ATIVADA: 'ativou a categoria padrão',
  CATEGORIA_PADRAO_DESATIVADA: 'desativou a categoria padrão',
  PARAMETRO_CRIADO: 'criou o parâmetro',
  PARAMETRO_ALTERADO: 'alterou o parâmetro',
  PARAMETRO_ATIVADO: 'ativou o parâmetro',
  PARAMETRO_DESATIVADO: 'desativou o parâmetro',
  PARAMETRO_EXCLUIDO: 'excluiu o parâmetro',
  CONSULTA_TRANSACOES: 'consultou',
  DADOS_PESSOAIS_ALTERADOS: 'alterou os dados pessoais de',
  SENHA_ALTERADA: 'trocou a senha de',
  EMAIL_ALTERADO: 'trocou o e-mail de acesso de',
  SESSOES_ENCERRADAS: 'encerrou as sessões de',
  CONTA_BLOQUEADA: 'errou a senha várias vezes; bloqueado temporariamente:',
};

// Visão geral do sistema (SUPER_ADMIN): indicadores, novos cadastros, usuários, empresas,
// auditoria recente e parâmetros fiscais vigentes.
@Component({
  imports: [RouterLink, DecimalPipe, MatIconModule, MatProgressBarModule, MatSlideToggleModule, Indicador],
  selector: 'app-admin-painel',
  styleUrls: ['../../shared/painel.css', './admin-painel.css'],
  templateUrl: './admin-painel.html',
})
export class AdminPainel implements OnInit, OnDestroy {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  protected readonly mes = inject(MesService);
  protected readonly eu = inject(UsuarioService).perfil;

  protected readonly iniciais = iniciais;
  protected readonly formatarCnpj = formatarCnpj;
  protected readonly abas = ABAS;

  protected readonly estatisticas = signal<Estatisticas | null>(null);
  protected readonly parametros = signal<ParametroFiscal[]>([]);
  protected readonly auditoria = signal<RegistroAuditoria[]>([]);
  protected readonly empresas = signal<AdminEmpresa[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly aba = signal<Aba>('TODOS');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  constructor() {
    // O seletor de mês do topo só vai até onde o back tem série.
    this.mes.mesesAnteriores.set(MESES_COM_DADOS);
    if (this.mes.chave() < chaveMes(new Date(), -MESES_COM_DADOS) || this.mes.chave() > chaveMes(new Date())) {
      this.mes.irParaAtual();
    }
    effect(() => this.carregarUsuarios(this.aba()));
  }

  // Transações e volume do mês escolhido, comparados com o mês anterior.
  protected readonly doMes = computed(() => {
    const serie = this.estatisticas()?.transacoesPorMes ?? [];
    const i = serie.findIndex((m) => m.mes === this.mes.chave());
    const atual = serie[i];
    const anterior = i > 0 ? serie[i - 1] : undefined;
    return {
      quantidade: atual?.quantidade ?? 0,
      valor: Number(atual?.valor ?? 0),
      variacaoQuantidade: anterior ? variacao(atual?.quantidade ?? 0, anterior.quantidade) : null,
      variacaoValor: anterior ? variacao(Number(atual?.valor ?? 0), Number(anterior.valor)) : null,
    };
  });

  protected readonly volume = computed(() => formatarVolume(this.doMes().valor));

  protected readonly cadastros = computed(() => {
    const serie = this.estatisticas()?.cadastrosPorMes ?? [];
    const maior = escalaDoGrafico(Math.max(0, ...serie.flatMap((m) => [m.contasPessoais, m.empresas])));
    return {
      maior,
      meses: serie.map((m) => ({
        ...m,
        rotulo: MESES[Number(m.mes.slice(5, 7)) - 1],
        altPessoais: (m.contasPessoais / maior) * 100,
        altEmpresas: (m.empresas / maior) * 100,
      })),
    };
  });

  // Fatias da rosca "Usuários por perfil".
  protected readonly perfis = computed(() => {
    const e = this.estatisticas();
    if (!e) return [];
    const total = Math.max(1, e.totalUsuarios);
    let acumulado = 0;
    return [
      { rotulo: 'Pessoal', valor: e.totalContasPessoais, cor: '#3b1478' },
      { rotulo: 'Colaboradores de empresa', valor: e.totalColaboradores, cor: '#a78be8' },
      { rotulo: 'Administradores de empresa', valor: e.totalAdminsEmpresa, cor: '#f5c518' },
      { rotulo: 'Super admins', valor: e.totalAdmins, cor: '#1c0f33' },
    ].map((p) => {
      const inicio = acumulado;
      acumulado += (p.valor / total) * 100;
      return { ...p, inicio, fim: acumulado };
    });
  });

  protected readonly rosca = computed(() =>
    'conic-gradient(' + this.perfis().map((p) => `${p.cor} ${p.inicio}% ${p.fim}%`).join(', ') + ')',
  );

  protected readonly vigentes = computed(() =>
    this.parametros()
      .filter((p) => p.ativo !== false && situacaoVigencia(p) === 'VIGENTE')
      .slice(0, 5),
  );

  ngOnInit(): void {
    this.adminService.estatisticas().subscribe({
      next: (e) => {
        this.estatisticas.set(e);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar os indicadores.'));
        this.carregando.set(false);
      },
    });
    this.adminService.listarParametros().subscribe({ next: (p) => this.parametros.set(p), error: () => {} });
    this.adminService.listarAuditoria({}, 0, 5).subscribe({ next: (r) => this.auditoria.set(r.items), error: () => {} });
    this.adminService.listarEmpresas({}, 0, 4).subscribe({ next: (r) => this.empresas.set(r.items), error: () => {} });
  }

  ngOnDestroy(): void {
    this.mes.mesesAnteriores.set(null);
  }

  private carregarUsuarios(aba: Aba): void {
    const filtro: { role?: Role; ativo?: boolean } =
      aba === 'TODOS' ? {} : aba === 'INATIVOS' ? { ativo: false } : { role: aba };
    this.adminService.listarUsuarios(filtro, 0, 5).subscribe({
      next: (r) => this.usuarios.set(r.items),
      error: () => this.usuarios.set([]),
    });
  }

  buscar(termo: string): void {
    const t = termo.trim();
    if (!t) return;
    // Só números (ou com pontuação de CNPJ): procura empresa; senão, usuário.
    const ehCnpj = /^[\d./-]{4,}$/.test(t);
    this.router.navigate([ehCnpj ? '/admin/empresas' : '/admin/usuarios'], {
      queryParams: { busca: ehCnpj ? t.replace(/\D/g, '') : t },
    });
  }

  alterarAtivo(u: Usuario, toggle: MatSlideToggle): void {
    const ativar = !u.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar usuário' : 'Desativar usuário',
      mensagem: ativar
        ? `${u.nome} volta a entrar no FinControl.`
        : `${u.nome} não conseguirá mais entrar (nem com uma sessão aberta). O cadastro e o histórico continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Desativar',
    }).subscribe((ok) => {
      if (!ok) {
        toggle.checked = u.ativo; // cancelou: o toggle volta à posição anterior
        return;
      }
      this.adminService.alterarAtivoUsuario(u.id, ativar).subscribe({
        next: (atualizado) => {
          this.usuarios.update((lista) => lista.map((x) => (x.id === atualizado.id ? atualizado : x)));
          this.avisar(ativar ? 'Usuário reativado.' : 'Usuário desativado.');
          this.recarregarAuditoria();
        },
        error: (error: HttpErrorResponse) => {
          toggle.checked = u.ativo;
          this.avisar(mensagemDeErro(error, 'Não foi possível alterar o usuário.'));
        },
      });
    });
  }

  excluir(u: Usuario): void {
    confirmar(this.dialog, {
      titulo: 'Excluir usuário',
      mensagem: `Excluir ${u.nome}? Só é possível para quem ainda não registrou nada; caso contrário, desative.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.adminService.excluirUsuario(u.id).subscribe({
        next: () => {
          this.avisar('Usuário excluído.');
          this.carregarUsuarios(this.aba());
          this.recarregarAuditoria();
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível excluir.')),
      });
    });
  }

  protected frase(r: RegistroAuditoria): string {
    const alvo = r.alvo ? r.alvo.charAt(0).toLowerCase() + r.alvo.slice(1) : '';
    return `${VERBOS[r.acao] ?? r.acao.toLowerCase().replaceAll('_', ' ')} ${alvo}`.trim();
  }

  protected corAuditoria(acao: string): string {
    if (/DESATIV|EXCLU|BLOQUEADA/.test(acao)) return '#d0343f';
    if (acao.startsWith('EMPRESA') || acao.startsWith('CONSULTA')) return '#2563c9';
    if (acao.startsWith('PARAMETRO') || acao.startsWith('CATEGORIA')) return '#3b1478';
    return '#f5c518';
  }

  // "Hoje, 15:02", "Ontem, 18:20" ou "20/10/2026".
  protected quando(iso: string | undefined | null): string {
    if (!iso) return '—';
    const dia = iso.slice(0, 10);
    const hora = iso.slice(11, 16);
    const hoje = hojeIso();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    if (dia === hoje) return hora ? `Hoje, ${hora}` : 'Hoje';
    if (dia === `${chaveMes(ontem)}-${String(ontem.getDate()).padStart(2, '0')}`) return hora ? `Ontem, ${hora}` : 'Ontem';
    return `${dia.slice(8, 10)}/${dia.slice(5, 7)}/${dia.slice(0, 4)}`;
  }

  // O parâmetro é só um número: o nome da chave diz se é dia, percentual ou valor em R$.
  protected valorParametro(p: ParametroFiscal): string {
    const valor = Number(p.valor);
    if (/DIA|VENCIMENTO/.test(p.chave)) return `Dia ${valor}`;
    if (/PERCENT|ALERTA|ALIQUOTA/.test(p.chave)) return `${valor.toLocaleString('pt-BR')}%`;
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  protected corPerfil(role: Role): string {
    return { SUPER_ADMIN: '#1c0f33', PESSOAL: '#3b1478', ADMIN_EMPRESA: '#f5c518', USUARIO_EMPRESA: '#a78be8' }[role];
  }

  private recarregarAuditoria(): void {
    this.adminService.listarAuditoria({}, 0, 5).subscribe({ next: (r) => this.auditoria.set(r.items), error: () => {} });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}

// 7 920 000 -> "R$ 7,92 mi"; 48 500 -> "R$ 48,5 mil"
function formatarVolume(valor: number): string {
  if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} mi`;
  if (valor >= 10_000) return `R$ ${(valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
