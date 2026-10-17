import { UpperCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { AtividadeMei, PerfilFiscal, ROTULOS_ATIVIDADE_MEI } from '../../../models/usuario.model';
import { FundoAuth } from '../../shared/fundo-auth/fundo-auth';
import { Logo } from '../../shared/logo/logo';

type TipoConta = 'MIM' | 'EMPRESA';
type Campo = 'nome' | 'email' | 'password' | 'confirmacao' | 'atividadeMei';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    UpperCasePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    Logo,
    FundoAuth,
  ],
  selector: 'app-register',
  styleUrl: '../auth.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly atividades = Object.entries(ROTULOS_ATIVIDADE_MEI) as [AtividadeMei, string][];

  // "Para mim" vira perfil PF; "Para minha empresa" vira MEI ou ME (escolhido na etapa 2).
  protected readonly tipoConta = signal<TipoConta>(
    inject(ActivatedRoute).snapshot.queryParamMap.get('perfil') === 'empresa' ? 'EMPRESA' : 'MIM',
  );

  protected readonly form = this.fb.nonNullable.group({
    perfilFiscal: [(this.tipoConta() === 'EMPRESA' ? 'MEI' : 'PF') as PerfilFiscal, Validators.required],
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    atividadeMei: [null as AtividadeMei | null],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    confirmacao: ['', Validators.required],
  });

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly perfil = computed(() => this.valores().perfilFiscal);
  protected readonly primeiroNome = computed(() => (this.valores().nome ?? '').trim().split(' ')[0]);
  protected readonly senhaTamanhoOk = computed(() => (this.valores().password ?? '').length >= 6);
  protected readonly senhasIguais = computed(
    () => !!this.valores().password && this.valores().password === this.valores().confirmacao,
  );

  // Etapa 1: tipo de conta + nome + e-mail. Etapa 2: dados de acesso.
  protected readonly etapa = signal<1 | 2>(1);
  protected readonly tentouAvancar = signal(false);
  protected readonly carregando = signal(false);
  protected readonly erro = signal('');
  protected readonly mostrarSenha = signal(false);

  constructor() {
    // O back exige atividade quando o perfil é MEI (e a ignora nos demais).
    this.form.controls.perfilFiscal.valueChanges.subscribe((perfil) => this.ajustarAtividade(perfil));
    this.ajustarAtividade(this.form.controls.perfilFiscal.value);
  }

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.tentouAvancar());
  }

  escolherTipo(tipo: TipoConta): void {
    this.tipoConta.set(tipo);
    this.form.controls.perfilFiscal.setValue(tipo === 'EMPRESA' ? 'MEI' : 'PF');
  }

  escolherPerfilEmpresa(perfil: 'MEI' | 'ME'): void {
    this.form.controls.perfilFiscal.setValue(perfil);
  }

  continuar(): void {
    this.tentouAvancar.set(true);
    const { nome, email } = this.form.controls;
    if (nome.invalid || email.invalid) {
      return;
    }
    this.tentouAvancar.set(false);
    this.etapa.set(2);
  }

  voltar(): void {
    this.erro.set('');
    this.etapa.set(1);
  }

  cadastrar(): void {
    this.tentouAvancar.set(true);
    if (this.form.invalid || !this.senhasIguais()) {
      return;
    }

    this.carregando.set(true);
    this.erro.set('');
    const { confirmacao, ...dados } = this.form.getRawValue();

    this.auth.register(dados).subscribe({
      next: () =>
        this.router.navigate(['/login'], { queryParams: { cadastrado: 1, email: dados.email } }),
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.erro.set(mensagemDeErro(error, 'Não foi possível concluir o cadastro.'));
        // E-mail repetido é problema da etapa 1.
        if (error.status === 400 && /e-mail/i.test(this.erro())) {
          this.etapa.set(1);
        }
      },
    });
  }

  private ajustarAtividade(perfil: PerfilFiscal): void {
    const atividade = this.form.controls.atividadeMei;
    atividade.setValidators(perfil === 'MEI' ? Validators.required : null);
    if (perfil !== 'MEI') atividade.setValue(null);
    atividade.updateValueAndValidity({ emitEvent: false });
  }
}
