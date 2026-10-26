import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { hojeIso } from '../../../models/admin.model';
import { ContaFinanceira } from '../../../models/conta.model';
import { Transacao } from '../../../models/transacao.model';
import { ContaService } from '../../../services/conta.service';
import { TransacaoService } from '../../../services/transacao.service';

// "Marcar como pago": escolhe a data e a conta e chama PATCH /transacoes/{id}/pagar.
// Fecha devolvendo a transação atualizada (ou undefined se cancelou).
@Component({
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatIconModule, CurrencyPipe, DatePipe],
  selector: 'app-pagar-dialog',
  template: `
    <h2 mat-dialog-title class="titulo">
      <mat-icon>check_circle</mat-icon> {{ receita ? 'Confirmar recebimento' : 'Confirmar pagamento' }}
    </h2>
    <form (ngSubmit)="confirmar()">
      <mat-dialog-content>
        <div class="resumo">
          <strong>{{ t.descricao }}</strong>
          <span>{{ t.valor | currency: 'BRL' }} · vence {{ t.data | date: 'dd/MM/yyyy' }}</span>
        </div>
        <div class="campo">
          <label for="pg-data">{{ receita ? 'Recebido em' : 'Pago em' }}</label>
          <input id="pg-data" name="data" type="date" [max]="hoje" [(ngModel)]="data" required />
        </div>
        <div class="campo">
          <label for="pg-conta">{{ receita ? 'Entrou na conta' : 'Saiu da conta' }}</label>
          <select id="pg-conta" name="conta" [(ngModel)]="idConta">
            @for (c of contas(); track c.id) {
              <option [ngValue]="c.id">{{ c.nome }}</option>
            }
          </select>
        </div>
        @if (erro()) {
          <div class="aviso erro" role="alert"><mat-icon>error_outline</mat-icon> {{ erro() }}</div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="salvando() || !data">
          {{ receita ? 'Marcar como recebido' : 'Marcar como pago' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .titulo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .titulo mat-icon {
      color: #15803d;
    }
    .resumo {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 12px 14px;
      margin-bottom: 18px;
      border-radius: 14px;
      background: var(--fc-campo);
    }
    .resumo span {
      font-size: 13px;
      color: var(--fc-muted);
    }
  `,
})
export class PagarDialog implements OnInit {
  protected readonly t = inject<Transacao>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<PagarDialog, Transacao>);
  private readonly contaService = inject(ContaService);
  private readonly transacaoService = inject(TransacaoService);

  protected readonly receita = this.t.tipo === 'RECEITA';
  protected readonly hoje = hojeIso();
  protected readonly contas = signal<ContaFinanceira[]>([]);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  // Vencimento no passado: sugere que foi pago no dia; senão, hoje.
  protected data = this.t.data < this.hoje ? this.t.data : this.hoje;
  protected idConta = this.t.conta?.id ?? null;

  ngOnInit(): void {
    this.contaService.listar().subscribe({
      next: (lista) => {
        // A conta do lançamento continua na lista mesmo se foi arquivada.
        const temAtual = lista.some((c) => c.id === this.idConta);
        this.contas.set(temAtual || !this.t.conta ? lista : [this.t.conta as ContaFinanceira, ...lista]);
        this.idConta ??= lista[0]?.id ?? null;
      },
      error: () => {},
    });
  }

  confirmar(): void {
    this.salvando.set(true);
    this.erro.set('');
    this.transacaoService.pagar(this.t.id, { dataPagamento: this.data, idConta: this.idConta ?? undefined }).subscribe({
      next: (atualizada) => this.ref.close(atualizada),
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.erro.set(mensagemDeErro(error, 'Não foi possível registrar o pagamento.'));
      },
    });
  }
}

export function abrirPagamento(dialog: MatDialog, transacao: Transacao): Observable<Transacao | undefined> {
  return dialog.open(PagarDialog, { data: transacao, width: '420px' }).afterClosed();
}
