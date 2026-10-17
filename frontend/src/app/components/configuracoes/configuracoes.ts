import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { MODULOS, Modulo } from '../../models/usuario.model';
import { SeletorModulos } from '../shared/seletor-modulos/seletor-modulos';

export const MODULOS_PESSOAIS = (Object.keys(MODULOS) as Modulo[]).filter((m) => MODULOS[m].pessoal);

// Conta pessoal: escolhe quais funcionalidades quer usar (o menu lateral mostra só essas).
@Component({
  imports: [MatButtonModule, MatIconModule, SeletorModulos],
  selector: 'app-configuracoes',
  template: `
    <div class="page-header">
      <div>
        <h1>Funcionalidades</h1>
        <p>Escolha o que você quer usar no FinControl. O menu mostra só o que estiver ligado.</p>
      </div>
      <button mat-flat-button class="btn-primario" (click)="salvar()" [disabled]="salvando() || !mudou()">
        <mat-icon>check</mat-icon> Salvar
      </button>
    </div>

    <section class="fc-card">
      <app-seletor-modulos [opcoes]="opcoes" [(selecionados)]="modulos" />
    </section>
  `,
})
export class Configuracoes implements OnInit {
  private readonly usuarios = inject(UsuarioService);
  private readonly snack = inject(MatSnackBar);

  protected readonly opcoes = MODULOS_PESSOAIS;
  protected readonly modulos = signal<Modulo[]>([]);
  private readonly original = signal('');
  protected readonly mudou = computed(() => [...this.modulos()].sort().join() !== this.original());
  protected readonly salvando = signal(false);

  ngOnInit(): void {
    this.usuarios.carregarPerfil().subscribe((u) => {
      this.modulos.set(u.modulos);
      this.original.set([...u.modulos].sort().join());
    });
  }

  salvar(): void {
    const u = this.usuarios.perfil();
    if (!u) return;
    this.salvando.set(true);
    this.usuarios
      .atualizarPerfil({ nome: u.nome, telefone: u.telefone ?? '', profissao: u.profissao, modulos: this.modulos() })
      .subscribe({
        next: (atualizado) => {
          this.original.set([...atualizado.modulos].sort().join());
          this.salvando.set(false);
          this.snack.open('Funcionalidades atualizadas.', 'Ok', { duration: 3000, verticalPosition: 'top' });
        },
        error: (error: HttpErrorResponse) => {
          this.salvando.set(false);
          this.snack.open(mensagemDeErro(error, 'Não foi possível salvar.'), 'Ok', { duration: 4000, verticalPosition: 'top' });
        },
      });
  }
}
