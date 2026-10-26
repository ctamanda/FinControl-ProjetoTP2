import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tiposEditaveis } from '../../core/acesso';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { hojeIso } from '../../models/admin.model';
import { TipoTransacao, Transacao } from '../../models/transacao.model';
import { TransacaoService } from '../../services/transacao.service';
import { IconeCategoria } from '../shared/icone-categoria/icone-categoria';
import { abrirPagamento } from '../shared/pagar-dialog/pagar-dialog';

const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

interface Grupo {
  titulo: string;
  classe: 'atrasadas' | 'semana' | 'depois';
  itens: Transacao[];
  total: number;
}

// Contas a pagar (despesas pendentes) e a receber (receitas pendentes), agrupadas pelo vencimento.
@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule, IconeCategoria],
  selector: 'app-a-pagar',
  styleUrl: './a-pagar.css',
  templateUrl: './a-pagar.html',
})
export class APagar {
  private readonly transacaoService = inject(TransacaoService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly perfil = inject(UsuarioService).perfil;

  protected readonly tiposPermitidos = computed(() => tiposEditaveis(this.perfil()));
  // ?tipo=RECEITA abre direto em "A receber".
  protected readonly tipo = signal<TipoTransacao>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('tipo') === 'RECEITA' ? 'RECEITA' : 'DESPESA',
  );
  protected readonly receita = computed(() => this.tipo() === 'RECEITA');

  protected readonly pendentes = signal<Transacao[]>([]);
  protected readonly pagosNoMes = signal<Transacao[]>([]);
  protected readonly carregando = signal(true);

  protected readonly grupos = computed<Grupo[]>(() => {
    const hoje = hojeIso();
    const emSete = somarDias(hoje, 7);
    const grupos: Grupo[] = [
      { titulo: 'Atrasadas', classe: 'atrasadas', itens: [], total: 0 },
      { titulo: 'Hoje e próximos 7 dias', classe: 'semana', itens: [], total: 0 },
      { titulo: 'Mais adiante', classe: 'depois', itens: [], total: 0 },
    ];
    for (const t of this.pendentes()) {
      const g = t.data < hoje ? grupos[0] : t.data <= emSete ? grupos[1] : grupos[2];
      g.itens.push(t);
      g.total += Number(t.valor);
    }
    return grupos;
  });

  protected readonly totalPendente = computed(() => this.pendentes().reduce((s, t) => s + Number(t.valor), 0));

  constructor() {
    // Se a pessoa só pode lançar um dos tipos, abre nele.
    effect(() => {
      const tipos = this.tiposPermitidos();
      if (tipos.length === 1 && tipos[0] !== this.tipo()) this.tipo.set(tipos[0]);
    });
    effect(() => this.carregar(this.tipo()));
  }

  carregar(tipo = this.tipo()): void {
    this.carregando.set(true);
    this.transacaoService.findTodas(5, { status: 'PENDENTE', tipo }).subscribe({
      next: (lista) => {
        this.pendentes.set(lista.map((t) => ({ ...t, valor: Number(t.valor) })));
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.avisar(mensagemDeErro(error, 'Erro ao carregar as contas.'));
      },
    });
    this.transacaoService.findAll(0, 6, { status: 'PAGO', tipo, mes: hojeIso().slice(0, 7) }).subscribe({
      next: (res) => this.pagosNoMes.set(res.items),
      error: () => this.pagosNoMes.set([]),
    });
  }

  pagar(t: Transacao): void {
    abrirPagamento(this.dialog, t).subscribe((paga) => {
      if (!paga) return;
      this.avisar(this.receita() ? 'Recebimento registrado.' : 'Pagamento registrado.');
      this.carregar();
    });
  }

  desfazer(t: Transacao): void {
    this.transacaoService.reabrir(t.id).subscribe({
      next: () => {
        this.avisar('Voltou para a lista de pendentes.');
        this.carregar();
      },
      error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível desfazer.')),
    });
  }

  protected dia(iso: string): string {
    return iso.slice(8, 10);
  }

  protected mesCurto(iso: string): string {
    return MESES_CURTOS[Number(iso.slice(5, 7)) - 1];
  }

  // "Vence hoje", "Vence amanhã", "Em 5 dias", "Venceu há 3 dias".
  protected quando(iso: string): string {
    const dias = Math.round((new Date(iso + 'T12:00').getTime() - new Date(hojeIso() + 'T12:00').getTime()) / 86_400_000);
    if (dias === 0) return 'Vence hoje';
    if (dias === 1) return 'Vence amanhã';
    if (dias > 1) return `Em ${dias} dias`;
    return dias === -1 ? 'Venceu ontem' : `Venceu há ${-dias} dias`;
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3500, verticalPosition: 'top' });
  }
}

function somarDias(iso: string, dias: number): string {
  const d = new Date(iso + 'T12:00');
  d.setDate(d.getDate() + dias);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
