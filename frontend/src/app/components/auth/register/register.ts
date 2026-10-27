import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { senhaForte, telefone } from '../../../core/validadores';
import { EtapasCadastro } from '../../shared/etapas-cadastro/etapas-cadastro';
import { FundoAuth } from '../../shared/fundo-auth/fundo-auth';
import { Logo } from '../../shared/logo/logo';
import { Mascara } from '../../shared/mascara/mascara';
import { RequisitosSenha } from '../../shared/requisitos-senha/requisitos-senha';

type Campo = 'nome' | 'email' | 'telefone' | 'profissao' | 'password' | 'confirmacao';
type Etapa = 0 | 1;

// Criar conta pessoal: 0) cadastro + senha; 1) completar perfil.
// Ao concluir, a conta é criada e a pessoa já entra na configuração inicial.
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Logo,
    FundoAuth,
    Mascara,
    RequisitosSenha,
    EtapasCadastro,
  ],
  selector: 'app-register',
  styleUrl: '../auth.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.maxLength(100), senhaForte]],
    confirmacao: ['', Validators.required],
    telefone: ['', [Validators.required, telefone]],
    profissao: ['', [Validators.required, Validators.maxLength(100)]],
  });

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly primeiroNome = computed(() => (this.valores().nome ?? '').trim().split(' ')[0]);
  protected readonly senha = computed(() => this.valores().password ?? '');
  protected readonly confirmacao = computed(() => this.valores().confirmacao ?? '');
  protected readonly senhasIguais = computed(() => !!this.senha() && this.senha() === this.confirmacao());

  protected readonly etapa = signal<Etapa>(0);
  protected readonly tentouAvancar = signal(false);
  protected readonly carregando = signal(false);
  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.tentouAvancar());
  }

  avancar(): void {
    this.tentouAvancar.set(true);
    if (this.etapa() === 0) {
      const { nome, email, password, confirmacao } = this.form.controls;
      if ([nome, email, password, confirmacao].some((c) => c.invalid) || !this.senhasIguais()) {
        return;
      }
    }
    this.tentouAvancar.set(false);
    this.erro.set('');
    this.etapa.update((e) => (e + 1) as Etapa);
  }

  voltar(): void {
    this.erro.set('');
    this.tentouAvancar.set(false);
    this.etapa.update((e) => (e - 1) as Etapa);
  }

  enviar(): void {
    if (this.etapa() < 1) {
      this.avancar();
    } else {
      this.cadastrar();
    }
  }

  private cadastrar(): void {
    this.tentouAvancar.set(true);
    if (this.form.invalid || !this.senhasIguais()) {
      return;
    }

    this.carregando.set(true);
    this.erro.set('');
    const { confirmacao, ...dados } = this.form.getRawValue();

    this.auth
      .register({ ...dados, confirmPassword: confirmacao })
      .pipe(
        switchMap(() => this.auth.login({ email: dados.email, password: dados.password })),
        switchMap(() => this.usuarios.carregarPerfil()),
      )
      .subscribe({
        next: () => this.router.navigateByUrl('/bem-vindo'),
        error: (error: HttpErrorResponse) => {
          this.carregando.set(false);
          this.erro.set(mensagemDeErro(error, 'Não foi possível concluir o cadastro.'));
          // E-mail repetido e senha são da etapa de cadastro.
          if (error.status === 400 && /e-mail|senha/i.test(this.erro())) {
            this.etapa.set(0);
          }
        },
      });
  }

}
