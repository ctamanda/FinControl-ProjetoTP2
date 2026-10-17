import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { Transacao } from '../../../models/transacao.model';
import { TransacaoService } from '../../../services/transacao.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { Valor } from '../../shared/valor/valor';

@Component({
  imports: [
    RouterLink,
    DatePipe,
    Valor,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  selector: 'app-transacao-list',
  styleUrl: './transacao-list.css',
  templateUrl: './transacao-list.html',
})
export class TransacaoList implements OnInit {
  private readonly transacaoService = inject(TransacaoService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected readonly displayedColumns = ['data', 'descricao', 'categoria', 'escopo', 'valor', 'acoes'];
  protected readonly transacoes = signal<Transacao[]>([]);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);
  protected readonly totalItems = signal(0);
  protected readonly carregando = signal(false);
  protected readonly carregou = signal(false); // evita mostrar "nenhuma transação" antes da 1ª resposta

  protected readonly rotulosEscopo: Record<string, string> = { PESSOAL: 'Pessoal', EMPRESA: 'Empresa' };

  private filtro = '';
  private readonly digitacao = new Subject<string>();
  private consulta?: Subscription;

  ngOnInit(): void {
    // Filtro feito no servidor (LIKE, case-insensitive); espera o usuário parar de digitar.
    this.digitacao.pipe(debounceTime(300), distinctUntilChanged()).subscribe((valor) => {
      this.filtro = valor;
      this.pageIndex.set(0);
      this.loadTransacoes();
    });
    this.loadTransacoes();
  }

  loadTransacoes(): void {
    // Cancela a consulta anterior: só a resposta da última página/filtro pedido vale.
    this.consulta?.unsubscribe();
    this.carregando.set(true);

    this.consulta = this.transacaoService
      .findAll(this.pageIndex(), this.pageSize(), this.filtro)
      .subscribe({
        next: (response) => {
          this.transacoes.set(response.items);
          this.pageIndex.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalItems.set(response.totalItems);
          this.carregando.set(false);
          this.carregou.set(true);
        },
        error: (error: HttpErrorResponse) => {
          this.transacoes.set([]);
          this.totalItems.set(0);
          this.carregando.set(false);
          this.exibirMensagem(mensagemDeErro(error, 'Erro ao buscar transações!'));
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransacoes();
  }

  applyFilter(event: Event): void {
    this.digitacao.next((event.target as HTMLInputElement).value.trim());
  }

  excluir(t: Transacao): void {
    confirmar(this.dialog, {
      titulo: 'Excluir transação',
      mensagem: `Deseja excluir "${t.descricao}"? Esta ação não pode ser desfeita.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.transacaoService.delete(t.id).subscribe({
        next: () => {
          this.exibirMensagem('Transação excluída.');
          // Se apagou o último item da página, volta uma página.
          if (this.transacoes().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((p) => p - 1);
          }
          this.loadTransacoes();
        },
        error: (error: HttpErrorResponse) =>
          this.exibirMensagem(mensagemDeErro(error, 'Erro ao excluir a transação.')),
      });
    });
  }

  exibirMensagem(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
