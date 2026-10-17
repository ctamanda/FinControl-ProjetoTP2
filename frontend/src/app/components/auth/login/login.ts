import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { Logo } from '../../shared/logo/logo';
import { FundoAuth } from '../../shared/fundo-auth/fundo-auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, Logo, FundoAuth],
  selector: 'app-login',
  styleUrl: '../auth.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected readonly carregando = signal(false);
  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);
  protected readonly enviado = signal(false);

  private readonly params = this.route.snapshot.queryParamMap;
  protected readonly sessaoExpirou = this.params.get('motivo') === 'expirou';
  protected readonly cadastrado = this.params.get('cadastrado') === '1';

  constructor() {
    const email = this.params.get('email');
    if (email) {
      this.form.patchValue({ email });
    }
  }

  invalido(campo: 'email' | 'password'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  entrar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        const voltar = this.params.get('voltar');
        this.router.navigateByUrl(voltar || this.auth.rotaInicial());
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(
          error.status === 401
            ? 'E-mail ou senha inválidos.'
            : mensagemDeErro(error, 'Não foi possível entrar. Tente novamente.'),
        );
      },
    });
  }
}
