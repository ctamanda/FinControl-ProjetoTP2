import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import {
  AtividadeMei,
  PerfilFiscal,
  ROTULOS_ATIVIDADE_MEI,
  ROTULOS_PERFIL_FISCAL,
} from '../../models/usuario.model';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly snack = inject(MatSnackBar);

  protected readonly usuario = this.usuarioService.perfil;
  protected readonly perfis: { valor: PerfilFiscal; icone: string; titulo: string; sub: string }[] = [
    { valor: 'PF', icone: 'person_outline', titulo: 'PF', sub: ROTULOS_PERFIL_FISCAL.PF },
    { valor: 'MEI', icone: 'storefront', titulo: 'MEI', sub: 'Microempreendedor' },
    { valor: 'ME', icone: 'domain', titulo: 'ME', sub: 'Microempresa' },
  ];
  protected readonly atividades = Object.entries(ROTULOS_ATIVIDADE_MEI) as [AtividadeMei, string][];

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    perfilFiscal: ['PF' as PerfilFiscal, Validators.required],
    atividadeMei: [null as AtividadeMei | null],
  });

  protected readonly perfilFiscal = toSignal(this.form.controls.perfilFiscal.valueChanges, {
    initialValue: this.form.controls.perfilFiscal.value,
  });

  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);

  ngOnInit(): void {
    this.form.controls.perfilFiscal.valueChanges.subscribe((perfil) => {
      const atividade = this.form.controls.atividadeMei;
      if (perfil === 'MEI') {
        atividade.setValidators(Validators.required);
      } else {
        atividade.clearValidators();
        atividade.setValue(null);
      }
      atividade.updateValueAndValidity();
    });

    this.usuarioService.carregarPerfil().subscribe({
      next: (u) => {
        this.form.patchValue(u);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Erro ao carregar o perfil.'));
        this.carregando.set(false);
      },
    });
  }

  selecionarPerfil(perfil: PerfilFiscal): void {
    this.form.controls.perfilFiscal.setValue(perfil);
    this.form.markAsDirty();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.usuarioService.atualizarPerfil(this.form.getRawValue()).subscribe({
      next: () => {
        this.avisar('Perfil atualizado.');
        this.salvando.set(false);
        this.form.markAsPristine();
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Erro ao salvar o perfil.'));
        this.salvando.set(false);
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3000, verticalPosition: 'top' });
  }
}
