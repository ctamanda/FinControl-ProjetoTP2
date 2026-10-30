import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { rotaInicial } from '../../../core/acesso';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { senhaForte } from '../../../core/validadores';
import { FundoAuth } from '../../shared/fundo-auth/fundo-auth';
import { Logo } from '../../shared/logo/logo';
import { RequisitosSenha } from '../../shared/requisitos-senha/requisitos-senha';

// Primeiro acesso com a senha provisória gerada pelo admin: a pessoa troca antes de
// usar o sistema (o back recusa as outras rotas com 403 até a troca).
@Component({
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, Logo, FundoAuth, RequisitosSenha],
  selector: 'app-trocar-senha',
  styleUrl: '../auth.css',
  templateUrl: './trocar-senha.html',
})
export class TrocarSenha {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group(
    {
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, senhaForte]],
      confirmacaoSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );
  protected readonly novaSenha = toSignal(this.form.controls.novaSenha.valueChanges, { initialValue: '' });
  protected readonly confirmacao = toSignal(this.form.controls.confirmacaoSenha.valueChanges, { initialValue: '' });

  protected readonly carregando = signal(false);
  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);
  protected readonly enviado = signal(false);

  invalido(campo: 'senhaAtual' | 'novaSenha' | 'confirmacaoSenha'): boolean {
    const c = this.form.controls[campo];
    const diferente = campo === 'confirmacaoSenha' && this.form.hasError('senhasDiferentes');
    return (c.invalid || diferente) && (c.touched || this.enviado());
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }
    this.carregando.set(true);
    this.erro.set('');
    this.auth.alterarSenha(this.form.getRawValue()).subscribe({
      next: (usuario) => this.router.navigateByUrl(rotaInicial(usuario)),
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(mensagemDeErro(error, 'Não foi possível trocar a senha.'));
      },
    });
  }

  sair(): void {
    this.auth.logout();
  }
}

function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const { novaSenha, confirmacaoSenha } = grupo.value as { novaSenha: string; confirmacaoSenha: string };
  return confirmacaoSenha && novaSenha !== confirmacaoSenha ? { senhasDiferentes: true } : null;
}
