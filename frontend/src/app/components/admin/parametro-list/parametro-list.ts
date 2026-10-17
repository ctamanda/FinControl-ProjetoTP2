import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import {
  ParametroFiscal,
  SituacaoVigencia,
  situacaoVigencia,
} from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';

type FiltroSituacao = SituacaoVigencia | 'TODOS';

@Component({
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  selector: 'app-parametro-list',
  styleUrl: './parametro-list.css',
  templateUrl: './parametro-list.html',
})
export class ParametroList implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly colunas = ['chave', 'valor', 'vigencia', 'situacao', 'acoes'];
  protected readonly parametros = signal<ParametroFiscal[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly busca = signal('');
  protected readonly situacao = signal<FiltroSituacao>('TODOS');

  protected readonly rotulosSituacao: Record<SituacaoVigencia, { texto: string; cor: string }> = {
    VIGENTE: { texto: 'Vigente', cor: 'green' },
    FUTURO: { texto: 'Futuro', cor: 'blue' },
    ENCERRADO: { texto: 'Encerrado', cor: '' },
  };

  protected readonly contagem = computed(() => {
    const c = { TODOS: 0, VIGENTE: 0, FUTURO: 0, ENCERRADO: 0 };
    for (const p of this.parametros()) {
      c.TODOS++;
      c[situacaoVigencia(p)]++;
    }
    return c;
  });

  protected readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const situacao = this.situacao();
    return this.parametros()
      .map((p) => {
        const s = situacaoVigencia(p);
        return { ...p, situacao: s, rotulo: this.rotulosSituacao[s] };
      })
      .filter((p) => situacao === 'TODOS' || p.situacao === situacao)
      .filter((p) => !termo || p.chave.toLowerCase().includes(termo));
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.adminService.listarParametros().subscribe({
      next: (lista) => {
        this.parametros.set(lista);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar os parâmetros.'));
        this.carregando.set(false);
      },
    });
  }

  filtrar(event: Event): void {
    this.busca.set((event.target as HTMLInputElement).value);
  }

  excluir(p: ParametroFiscal): void {
    confirmar(this.dialog, {
      titulo: 'Excluir parâmetro',
      mensagem: `Deseja excluir o parâmetro ${p.chave} (vigência a partir de ${formatarData(p.vigenciaInicio)})?`,
    }).subscribe((ok) => {
      if (!ok || p.id == null) {
        return;
      }
      this.adminService.excluirParametro(p.id).subscribe({
        next: () => {
          this.parametros.update((lista) => lista.filter((x) => x.id !== p.id));
          this.avisar('Parâmetro excluído.');
        },
        error: (error: HttpErrorResponse) =>
          this.avisar(mensagemDeErro(error, 'Erro ao excluir o parâmetro.')),
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3000, verticalPosition: 'top' });
  }
}

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}
