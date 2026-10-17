import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { rotaInicial } from '../../../core/acesso';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
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
  private readonly usuarios = inject(UsuarioService);

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
  protected readonly desativado = this.params.get('motivo') === 'desativado';
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

    // A tela inicial depende do perfil (módulos liberados, empresa pendente).
    this.auth
      .login(this.form.getRawValue())
      .pipe(switchMap(() => this.usuarios.carregarPerfil()))
      .subscribe({
        next: (usuario) => {
          const voltar = this.params.get('voltar');
          this.router.navigateByUrl(voltar && !usuario.empresaPendente ? voltar : rotaInicial(usuario));
        },
        error: (error: HttpErrorResponse) => {
          this.carregando.set(false);
          const detalhe: string = error.error?.detail ?? '';
          this.erro.set(
            error.status === 401
              ? /desativad/i.test(detalhe)
                ? detalhe
                : 'E-mail ou senha inválidos.'
              : mensagemDeErro(error, 'Não foi possível entrar. Tente novamente.'),
          );
        },
      });
  }
}
