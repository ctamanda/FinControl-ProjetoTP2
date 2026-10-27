import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { chaveMes, MesService } from '../../../core/mes.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { hojeIso, PainelAdmin, RegistroAuditoria } from '../../../models/admin.model';
import { MODULOS, ROTULOS_ROLE, Role, Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { escalaDoGrafico, variacao } from '../../dashboard/resumo';
import { iniciais } from '../../layout/shell/shell';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { IconeCategoria } from '../../shared/icone-categoria/icone-categoria';
import { Indicador } from '../../shared/indicador/indicador';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Até quantos meses para trás o seletor do topo vai (o back calcula qualquer mês).
const MESES_ANTERIORES = 23;

type Aba = 'TODOS' | 'ATIVOS' | 'INATIVOS' | 'ADMINS';

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'TODOS', rotulo: 'Todos' },
  { id: 'ATIVOS', rotulo: 'Ativos' },
  { id: 'INATIVOS', rotulo: 'Inativos' },
  { id: 'ADMINS', rotulo: 'Administradores' },
];

// Frase de cada ação da auditoria ("admin@… desativou o usuário …").
const VERBOS: Record<string, string> = {
  USUARIO_CRIADO: 'criou',
  USUARIO_ALTERADO: 'alterou',
  PERFIL_ALTERADO: 'alterou o perfil de',
  USUARIO_ATIVADO: 'reativou',
  USUARIO_DESATIVADO: 'desativou',
  USUARIO_EXCLUIDO: 'excluiu',
  CATEGORIA_PADRAO_CRIADA: 'criou a categoria padrão',
  CATEGORIA_PADRAO_ALTERADA: 'alterou a categoria padrão',
  CATEGORIA_PADRAO_ATIVADA: 'ativou a categoria padrão',
  CATEGORIA_PADRAO_DESATIVADA: 'desativou a categoria padrão',
  CONSULTA_TRANSACOES: 'consultou',
  DADOS_PESSOAIS_ALTERADOS: 'alterou os dados pessoais de',
  SENHA_ALTERADA: 'trocou a senha de',
  EMAIL_ALTERADO: 'trocou o e-mail de acesso de',
  SESSOES_ENCERRADAS: 'encerrou as sessões de',
  CONTA_BLOQUEADA: 'errou a senha várias vezes; bloqueado temporariamente:',
};

// Quando a própria pessoa fez a ação na conta dela ("ana trocou a própria senha").
const VERBOS_PROPRIOS: Record<string, string> = {
  DADOS_PESSOAIS_ALTERADOS: 'alterou os próprios dados pessoais',
  SENHA_ALTERADA: 'trocou a própria senha',
  EMAIL_ALTERADO: 'trocou o e-mail de acesso',
  SESSOES_ENCERRADAS: 'saiu de todos os dispositivos',
  CONTA_BLOQUEADA: 'errou a senha 5 vezes e teve a conta bloqueada por 15 minutos',
};

// Visão geral do sistema (SUPER_ADMIN) no mês escolhido no topo. Todos os números vêm de
// GET /admin/painel (cadastros, lançamentos e auditoria); nada é estimado na tela.
@Component({
  imports: [
    RouterLink,
    DecimalPipe,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTooltipModule,
    Indicador,
    IconeCategoria,
  ],
  selector: 'app-admin-painel',
  styleUrls: ['../../shared/painel.css', './admin-painel.css'],
  templateUrl: './admin-painel.html',
})
export class AdminPainel implements OnDestroy {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly router = inject(Router);
  protected readonly mes = inject(MesService);
  protected readonly eu = inject(UsuarioService).perfil;

  protected readonly iniciais = iniciais;
  protected readonly abas = ABAS;
  protected readonly rotulosRole = ROTULOS_ROLE;

  protected readonly painel = signal<PainelAdmin | null>(null);
  protected readonly auditoria = signal<RegistroAuditoria[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly totalUsuarios = signal(0);
  protected readonly aba = signal<Aba>('TODOS');
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  private consulta?: Subscription;

  constructor() {
    // O painel olha para o passado: o seletor para no mês atual.
    this.mes.mesesAnteriores.set(MESES_ANTERIORES);
    if (this.mes.chave() < chaveMes(new Date(), -MESES_ANTERIORES) || this.mes.chave() > chaveMes(new Date())) {
      this.mes.irParaAtual();
    }
    effect(() => this.carregarPainel(this.mes.chave()));
    effect(() => this.carregarUsuarios(this.aba()));
    this.recarregarAuditoria();
  }

  ngOnDestroy(): void {
    this.mes.mesesAnteriores.set(null);
  }

  // ---------------------------------------------------------- indicadores

  protected readonly indicadores = computed(() => {
    const p = this.painel();
    if (!p) return null;
    const mes = this.mes.nome().toLowerCase();
    return {
      ativos: { valor: p.usuariosAtivos.atual, variacao: variacao(p.usuariosAtivos.atual, p.usuariosAtivos.anterior) },
      novos: { valor: p.novosCadastros.atual, variacao: variacao(p.novosCadastros.atual, p.novosCadastros.anterior) },
      lancamentos: { valor: p.lancamentos.atual, variacao: variacao(p.lancamentos.atual, p.lancamentos.anterior) },
      volume: {
        valor: formatarVolume(Number(p.volume.atual)),
        variacao: variacao(Number(p.volume.atual), Number(p.volume.anterior)),
      },
      mes,
    };
  });

  // Gráfico de novos cadastros: 6 meses até o escolhido.
  protected readonly cadastros = computed(() => {
    const serie = this.painel()?.cadastrosPorMes ?? [];
    const maior = escalaDoGrafico(Math.max(0, ...serie.map((m) => m.contasPessoais)));
    return {
      maior,
      meses: serie.map((m) => ({
        ...m,
        rotulo: MESES[Number(m.mes.slice(5, 7)) - 1],
        altura: (m.contasPessoais / maior) * 100,
        atual: m.mes === this.mes.chave(),
      })),
    };
  });

  // Uso de cada módulo pelas contas pessoais ativas (em % da base).
  protected readonly modulos = computed(() => {
    const p = this.painel();
    if (!p) return [];
    const base = Math.max(1, p.totais.contasPessoaisAtivas);
    return p.modulos.map((m) => ({
      ...m,
      info: MODULOS[m.modulo],
      pctLigados: (m.ligados / base) * 100,
      pctDados: m.comDados === null ? null : (m.comDados / base) * 100,
    }));
  });

  // Categorias padrão por lançamentos no mês (barra relativa à mais usada).
  protected readonly categorias = computed(() => {
    const lista = (this.painel()?.categoriasPadrao ?? []).filter((c) => c.ativo || c.lancamentos > 0).slice(0, 6);
    const maior = Math.max(1, ...lista.map((c) => c.lancamentos));
    return lista.map((c) => ({ ...c, pct: (c.lancamentos / maior) * 100 }));
  });

  protected readonly seguranca = computed(() => {
    const s = this.painel()?.seguranca;
    if (!s) return [];
    return [
      { valor: s.contasBloqueadasHoje, rotulo: 'Contas bloqueadas hoje', icone: 'lock_clock', acao: 'CONTA_BLOQUEADA', alerta: true },
      { valor: s.senhasTrocadasSemana, rotulo: 'Senhas trocadas (7 dias)', icone: 'password', acao: 'SENHA_ALTERADA', alerta: false },
      { valor: s.sessoesEncerradasSemana, rotulo: 'Sessões encerradas (7 dias)', icone: 'devices_off', acao: 'SESSOES_ENCERRADAS', alerta: false },
      { valor: s.emailsTrocadosSemana, rotulo: 'E-mails trocados (7 dias)', icone: 'alternate_email', acao: 'EMAIL_ALTERADO', alerta: false },
    ];
  });

  // ---------------------------------------------------------- carga

  private carregarPainel(mes: string): void {
    this.consulta?.unsubscribe();
    this.carregando.set(true);
    this.consulta = this.adminService.painel(mes).subscribe({
      next: (p) => {
        this.painel.set(p);
        this.erro.set('');
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar os indicadores.'));
        this.carregando.set(false);
      },
    });
  }

  private carregarUsuarios(aba: Aba): void {
    const filtro: { role?: Role; ativo?: boolean } =
      aba === 'ADMINS' ? { role: 'SUPER_ADMIN' } : aba === 'ATIVOS' ? { ativo: true } : aba === 'INATIVOS' ? { ativo: false } : {};
    this.adminService.listarUsuarios(filtro, 0, 5).subscribe({
      next: (r) => {
        this.usuarios.set(r.items);
        this.totalUsuarios.set(r.totalItems);
      },
      error: () => this.usuarios.set([]),
    });
  }

  private recarregarAuditoria(): void {
    this.adminService.listarAuditoria({}, 0, 5).subscribe({ next: (r) => this.auditoria.set(r.items), error: () => {} });
  }

  // ---------------------------------------------------------- ações

  buscar(termo: string): void {
    const t = termo.trim();
    if (t) {
      this.router.navigate(['/admin/usuarios'], { queryParams: { busca: t } });
    }
  }

  alterarAtivo(u: Usuario, toggle: MatSlideToggle): void {
    const ativar = !u.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar usuário' : 'Desativar usuário',
      mensagem: ativar
        ? `${u.nome} volta a entrar no FinControl.`
        : `${u.nome} perde o acesso na hora, inclusive nas sessões já abertas. O cadastro e o histórico continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Desativar',
    }).subscribe((ok) => {
      if (!ok) {
        toggle.checked = u.ativo; // cancelou: o toggle volta à posição anterior
        return;
      }
      this.adminService.alterarAtivoUsuario(u.id, ativar).subscribe({
        next: () => {
          this.avisar(ativar ? 'Usuário reativado.' : 'Usuário desativado.');
          this.carregarUsuarios(this.aba());
          this.carregarPainel(this.mes.chave());
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
      mensagem: `Excluir ${u.nome}? Só é possível para quem não tem histórico (lançamentos ou ações na auditoria); nesse caso, desative.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.adminService.excluirUsuario(u.id).subscribe({
        next: () => {
          this.avisar('Usuário excluído.');
          this.carregarUsuarios(this.aba());
          this.carregarPainel(this.mes.chave());
          this.recarregarAuditoria();
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível excluir.')),
      });
    });
  }

  // ---------------------------------------------------------- apresentação

  protected frase(r: RegistroAuditoria): string {
    if (VERBOS_PROPRIOS[r.acao] && r.alvo?.includes(`(${r.autorEmail})`)) {
      return VERBOS_PROPRIOS[r.acao];
    }
    const alvo = r.alvo ? r.alvo.charAt(0).toLowerCase() + r.alvo.slice(1) : '';
    return `${VERBOS[r.acao] ?? r.acao.toLowerCase().replaceAll('_', ' ')} ${alvo}`.trim();
  }

  protected corAuditoria(acao: string): string {
    if (/DESATIV|EXCLU|BLOQUEADA/.test(acao)) return '#d0343f';
    if (acao.startsWith('CONSULTA')) return '#2563c9';
    if (acao.startsWith('CATEGORIA')) return '#3b1478';
    return '#f5c518';
  }

  // "Hoje, 15:02", "Ontem, 18:20" ou "20/10/2026".
  protected quando(iso: string | undefined | null): string {
    if (!iso) return '—';
    const dia = iso.slice(0, 10);
    const hora = iso.slice(11, 16);
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    if (dia === hojeIso()) return hora ? `Hoje, ${hora}` : 'Hoje';
    if (dia === `${chaveMes(ontem)}-${String(ontem.getDate()).padStart(2, '0')}`) return hora ? `Ontem, ${hora}` : 'Ontem';
    return `${dia.slice(8, 10)}/${dia.slice(5, 7)}/${dia.slice(0, 4)}`;
  }

  protected corPerfil(role: Role): string {
    return role === 'SUPER_ADMIN' ? '#f5c518' : '#3b1478';
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
