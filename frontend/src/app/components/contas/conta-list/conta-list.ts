import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { temModulo } from '../../../core/acesso';
import { mensagemDeErro } from '../../../core/api';
import { MesService } from '../../../core/mes.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { ContaFinanceira, siglaConta, TIPOS_CONTA } from '../../../models/conta.model';
import { ContaService } from '../../../services/conta.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { abrirConta } from '../conta-dialog/conta-dialog';

// Contas financeiras: saldo atual e previsto de cada uma no mês escolhido no topo.
@Component({
  imports: [CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatProgressBarModule],
  selector: 'app-conta-list',
  styleUrl: './conta-list.css',
  templateUrl: './conta-list.html',
})
export class ContaList implements OnDestroy {
  private readonly contaService = inject(ContaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  protected readonly mes = inject(MesService);
  private readonly perfil = inject(UsuarioService).perfil;

  protected readonly tipos = TIPOS_CONTA;
  protected readonly sigla = siglaConta;
  // Quem só lança vê os saldos, mas cadastrar/alterar exige o módulo Contas.
  protected readonly podeEditar = computed(() => temModulo(this.perfil(), 'CONTAS'));

  protected readonly contas = signal<ContaFinanceira[]>([]);
  protected readonly mostrarArquivadas = signal(false);
  protected readonly carregando = signal(true);

  protected readonly ativas = computed(() => this.contas().filter((c) => c.ativa));
  protected readonly arquivadas = computed(() => this.contas().filter((c) => !c.ativa));
  protected readonly total = computed(() => ({
    atual: this.ativas().reduce((s, c) => s + Number(c.saldoAtual), 0),
    previsto: this.ativas().reduce((s, c) => s + Number(c.saldoPrevisto), 0),
    receitas: this.ativas().reduce((s, c) => s + Number(c.receitasMes), 0),
    despesas: this.ativas().reduce((s, c) => s + Number(c.despesasMes), 0),
  }));

  constructor() {
    this.mes.mesesAnteriores.set(null);
    effect(() => this.carregar(this.mes.chave()));
  }

  ngOnDestroy(): void {
    this.mes.mesesAnteriores.set(null);
  }

  carregar(mes = this.mes.chave()): void {
    this.carregando.set(true);
    this.contaService.listar(mes, true).subscribe({
      next: (lista) => {
        this.contas.set(lista);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.avisar(mensagemDeErro(error, 'Erro ao carregar as contas.'));
      },
    });
  }

  nova(): void {
    abrirConta(this.dialog).subscribe((salva) => {
      if (salva) {
        this.avisar('Conta cadastrada.');
        this.carregar();
      }
    });
  }

  editar(c: ContaFinanceira): void {
    abrirConta(this.dialog, c).subscribe((salva) => {
      if (salva) {
        this.avisar('Conta atualizada.');
        this.carregar();
      }
    });
  }

  alterarAtiva(c: ContaFinanceira): void {
    this.contaService.alterarAtiva(c.id, !c.ativa).subscribe({
      next: () => {
        this.avisar(c.ativa ? 'Conta arquivada.' : 'Conta reativada.');
        this.carregar();
      },
      error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar a conta.')),
    });
  }

  excluir(c: ContaFinanceira): void {
    confirmar(this.dialog, {
      titulo: 'Excluir conta',
      mensagem: `Excluir "${c.nome}"? Só é possível em contas sem lançamentos; as demais podem ser arquivadas.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.contaService.excluir(c.id).subscribe({
        next: () => {
          this.avisar('Conta excluída.');
          this.carregar();
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível excluir.')),
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3500, verticalPosition: 'top' });
  }
}
