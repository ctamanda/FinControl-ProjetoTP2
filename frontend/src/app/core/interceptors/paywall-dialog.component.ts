import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  selector: 'app-paywall-dialog',
  template: `
    <h2 mat-dialog-title class="dialog-titulo">
      <mat-icon color="warn">lock</mat-icon>
      Limite do Plano Atingido
    </h2>
    <mat-dialog-content>
      <p class="dialog-msg">
        Você atingiu o limite do seu plano. Faça upgrade para o Pro para continuar.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
      <button mat-flat-button class="btn-upgrade" (click)="irParaPlanos()">
        <mat-icon>workspace_premium</mat-icon>
        Fazer Upgrade
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .dialog-titulo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
    }
    .dialog-titulo mat-icon {
      color: #e65100;
    }
    .dialog-msg {
      font-size: 1rem;
      margin: 12px 0;
      color: #333;
      line-height: 1.5;
    }
    .btn-upgrade {
      background-color: var(--fc-roxo, #6200ea);
      color: #fff;
    }
  `,
})
export class PaywallDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<PaywallDialogComponent>);
  private readonly router = inject(Router);

  irParaPlanos(): void {
    this.dialogRef.close();
    this.router.navigate(['/planos']);
  }
}
