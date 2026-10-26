import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

export interface ConfirmarSenhaData {
  titulo: string;
  mensagem: string;
  confirmar?: string;
}

// Reautenticação: antes de alterar dados pessoais ou credenciais, a pessoa digita a senha de novo.
// Devolve a senha digitada (ou undefined se cancelou); quem confere é o back.
@Component({
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-confirmar-senha',
  template: `
    <h2 mat-dialog-title class="titulo"><mat-icon>lock</mat-icon> {{ data.titulo }}</h2>
    <form (ngSubmit)="confirmar()">
      <mat-dialog-content>
        <p class="mensagem">{{ data.mensagem }}</p>
        <div class="campo">
          <label for="senha-confirmacao">Sua senha atual</label>
          <div class="caixa-input">
            <input
              id="senha-confirmacao"
              name="senha"
              [type]="mostrar() ? 'text' : 'password'"
              autocomplete="current-password"
              [(ngModel)]="senha"
              cdkFocusInitial
              required
            />
            <button type="button" class="btn-olho" (click)="mostrar.set(!mostrar())" [attr.aria-label]="mostrar() ? 'Ocultar senha' : 'Mostrar senha'">
              <mat-icon>{{ mostrar() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="undefined">Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="!senha">{{ data.confirmar ?? 'Confirmar' }}</button>
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
      color: var(--fc-roxo);
    }
    .mensagem {
      margin: 0 0 16px;
      color: var(--fc-muted);
    }
    .campo {
      margin-bottom: 0;
    }
  `,
})
export class ConfirmarSenha {
  protected readonly data = inject<ConfirmarSenhaData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmarSenha, string>);
  protected readonly mostrar = signal(false);
  protected senha = '';

  confirmar(): void {
    if (this.senha) {
      this.ref.close(this.senha);
    }
  }
}

export function pedirSenha(dialog: MatDialog, data: ConfirmarSenhaData): Observable<string | undefined> {
  return dialog.open(ConfirmarSenha, { data, width: '420px' }).afterClosed();
}
