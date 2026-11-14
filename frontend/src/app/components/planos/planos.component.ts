import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { mensagemDeErro } from '../../core/api';
import { Assinatura, Plano } from '../../models/assinatura.model';
import { AssinaturaService } from '../../services/assinatura.service';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css',
})
export class PlanosComponent implements OnInit {
  private readonly assinaturaService = inject(AssinaturaService);
  private readonly snackBar = inject(MatSnackBar);

  // Estados
  readonly carregando = signal(true);
  readonly fazendoUpgrade = signal(false);
  readonly erro = signal<string | null>(null);
  readonly planos = signal<Plano[]>([]);
  readonly assinatura = signal<Assinatura | null>(null);

  readonly planoAtualId = computed(() => this.assinatura()?.plano?.id ?? null);
  readonly planoAtualNome = computed(() => this.assinatura()?.plano?.nome ?? 'Free');

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    this.erro.set(null);

    // Carrega assinatura do usuário
    this.assinaturaService.buscarMinhaAssinatura().subscribe({
      next: (minhaAssinatura) => {
        this.assinatura.set(minhaAssinatura);
      },
      error: () => {
        // Se ainda não existir ou falhar, fallback suave
      },
    });

    // Carrega planos disponíveis
    this.assinaturaService.listarPlanos().subscribe({
      next: (listaPlanos) => {
        this.planos.set(listaPlanos);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(mensagemDeErro(err, 'Não foi possível carregar os planos disponíveis.'));
        this.carregando.set(false);
      },
    });
  }

  realizarUpgrade(plano: Plano): void {
    if (this.fazendoUpgrade() || this.planoAtualId() === plano.id) {
      return;
    }

    this.fazendoUpgrade.set(true);

    this.assinaturaService.fazerUpgrade(plano.id).subscribe({
      next: (novaAssinatura) => {
        this.assinatura.set(novaAssinatura);
        this.fazendoUpgrade.set(false);
        this.snackBar.open(
          `Parabéns! Upgrade para o plano ${plano.nome} realizado com sucesso!`,
          'OK',
          { duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' }
        );
      },
      error: (err) => {
        this.fazendoUpgrade.set(false);
        const msg = mensagemDeErro(err, 'Erro ao realizar upgrade de plano.');
        this.snackBar.open(msg, 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  ehPlanoAtual(plano: Plano): boolean {
    return this.planoAtualId() === plano.id ||
      (!this.planoAtualId() && plano.nome.toLowerCase() === 'free');
  }
}
