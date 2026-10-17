import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

export interface ConfirmData {
  titulo: string;
  mensagem: string;
  confirmar?: string;
}

@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title class="titulo">
      <mat-icon>warning_amber</mat-icon>
      {{ data.titulo }}
    </h2>
    <mat-dialog-content>{{ data.mensagem }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button class="perigo" [mat-dialog-close]="true" cdkFocusInitial>
        {{ data.confirmar ?? 'Excluir' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .titulo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .titulo mat-icon {
      color: var(--fc-danger);
    }
    .perigo {
      --mat-button-filled-container-color: var(--fc-danger);
    }
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmData>(MAT_DIALOG_DATA);
}

export function confirmar(dialog: MatDialog, data: ConfirmData): Observable<boolean | undefined> {
  return dialog.open(ConfirmDialog, { data, width: '420px' }).afterClosed();
}
