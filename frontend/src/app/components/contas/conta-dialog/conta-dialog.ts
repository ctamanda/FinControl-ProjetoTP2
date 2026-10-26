import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { ContaFinanceira, TIPOS_CONTA, TipoContaFinanceira } from '../../../models/conta.model';
import { ContaService } from '../../../services/conta.service';

// Cores sugeridas (bancos conhecidos e as da marca).
export const CORES_CONTA = ['#3B1478', '#820AD1', '#FF7A00', '#EC7000', '#CC092F', '#004B8D', '#15803D', '#F5C518', '#2563C9', '#0F172A'];

// Cadastro/edição de conta num diálogo. Fecha devolvendo a conta salva.
@Component({
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-conta-dialog',
  template: `
    <h2 mat-dialog-title>{{ conta ? 'Editar conta' : 'Nova conta' }}</h2>
    <form [formGroup]="form" (ngSubmit)="salvar()" novalidate>
      <mat-dialog-content>
        <div class="campo" [class.invalido]="form.controls.nome.invalid && form.controls.nome.touched">
          <label for="conta-nome">Nome</label>
          <input id="conta-nome" formControlName="nome" placeholder="Ex.: Nubank, Banco Inter, Carteira" cdkFocusInitial />
          @if (form.controls.nome.invalid && form.controls.nome.touched) {
            <span class="erro">Informe um nome entre 2 e 60 caracteres.</span>
          }
        </div>

        <div class="campo">
          <label for="conta-tipo">Tipo</label>
          <select id="conta-tipo" formControlName="tipo">
            @for (t of tipos; track t[0]) {
              <option [value]="t[0]">{{ t[1].rotulo }}</option>
            }
          </select>
        </div>

        <div class="campo">
          <label for="conta-saldo">Saldo inicial (R$)</label>
          <input id="conta-saldo" type="number" step="0.01" formControlName="saldoInicial" />
          <span class="ajuda">Quanto havia na conta antes dos lançamentos registrados aqui. Pode ser negativo.</span>
        </div>

        <div class="campo">
          <span class="rotulo">Cor</span>
          <div class="cores" role="radiogroup" aria-label="Cor da conta">
            @for (c of cores; track c) {
              <button
                type="button"
                class="cor"
                role="radio"
                [style.background]="c"
                [class.escolhida]="form.controls.cor.value === c"
                [attr.aria-checked]="form.controls.cor.value === c"
                [attr.aria-label]="c"
                (click)="form.controls.cor.setValue(c)"
              ></button>
            }
          </div>
        </div>

        @if (erro()) {
          <div class="aviso erro" role="alert"><mat-icon>error_outline</mat-icon> {{ erro() }}</div>
        }
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="salvando()">Salvar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .cores {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .cor {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 0 1px var(--fc-border);
      cursor: pointer;
    }
    .cor.escolhida {
      box-shadow: 0 0 0 2px var(--fc-roxo);
    }
  `,
})
export class ContaDialog {
  protected readonly conta = inject<ContaFinanceira | null>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ContaDialog, ContaFinanceira>);
  private readonly contaService = inject(ContaService);
  private readonly fb = inject(FormBuilder);

  protected readonly tipos = Object.entries(TIPOS_CONTA) as [TipoContaFinanceira, { rotulo: string }][];
  protected readonly cores = CORES_CONTA;
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');

  protected readonly form = this.fb.nonNullable.group({
    nome: [this.conta?.nome ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    tipo: [this.conta?.tipo ?? ('CONTA_CORRENTE' as TipoContaFinanceira), Validators.required],
    saldoInicial: [Number(this.conta?.saldoInicial ?? 0), Validators.required],
    cor: [this.conta?.cor ?? CORES_CONTA[0]],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set('');
    const dados = this.form.getRawValue();
    const requisicao = this.conta ? this.contaService.alterar(this.conta.id, dados) : this.contaService.criar(dados);
    requisicao.subscribe({
      next: (salva) => this.ref.close(salva),
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.erro.set(mensagemDeErro(error, 'Não foi possível salvar a conta.'));
      },
    });
  }
}

export function abrirConta(dialog: MatDialog, conta: ContaFinanceira | null = null): Observable<ContaFinanceira | undefined> {
  return dialog.open(ContaDialog, { data: conta, width: '440px' }).afterClosed();
}
