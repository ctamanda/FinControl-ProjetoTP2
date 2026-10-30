import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SenhaProvisoriaData {
  nome: string;
  email: string;
  senha: string;
}

// Mostra a senha provisória uma única vez: o back não guarda a senha em texto
// e não há como consultá-la de novo (só gerar outra).
@Component({
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'app-senha-provisoria-dialog',
  template: `
    <h2 mat-dialog-title class="titulo">
      <mat-icon>key</mat-icon>
      Senha provisória
    </h2>
    <mat-dialog-content>
      <p>Repasse para <strong>{{ data.nome }}</strong> ({{ data.email }}) por um canal seguro.</p>
      <div class="senha">
        <code>{{ data.senha }}</code>
        <button mat-icon-button type="button" (click)="copiar()" [matTooltip]="copiada() ? 'Copiada' : 'Copiar'" aria-label="Copiar senha">
          <mat-icon>{{ copiada() ? 'check' : 'content_copy' }}</mat-icon>
        </button>
      </div>
      <p class="aviso">
        Esta senha não será mostrada de novo. No próximo login, a pessoa terá de trocá-la antes de usar o FinControl.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button class="btn-primario" mat-dialog-close cdkFocusInitial>Já repassei</button>
    </mat-dialog-actions>
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
    .senha {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin: 12px 0;
      padding: 6px 6px 6px 16px;
      border-radius: var(--fc-radius-campo);
      background: var(--fc-campo);
    }
    .senha code {
      font-size: 22px;
      letter-spacing: 0.08em;
      color: var(--fc-text);
      user-select: all;
    }
    .aviso {
      font-size: 13px;
      color: var(--fc-muted);
    }
  `,
})
export class SenhaProvisoriaDialog {
  protected readonly data = inject<SenhaProvisoriaData>(MAT_DIALOG_DATA);
  protected readonly copiada = signal(false);

  copiar(): void {
    navigator.clipboard?.writeText(this.data.senha).then(() => this.copiada.set(true), () => {});
  }
}
