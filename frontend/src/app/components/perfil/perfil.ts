import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../core/api';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { formatarTelefone, senhaForte, telefone } from '../../core/validadores';
import { MODULOS, ROTULOS_ROLE } from '../../models/usuario.model';
import { pedirSenha } from '../shared/confirmar-senha/confirmar-senha';
import { Mascara } from '../shared/mascara/mascara';
import { RequisitosSenha } from '../shared/requisitos-senha/requisitos-senha';

// Meu perfil: cartão de identidade (quem sou, onde, com que acesso), dados pessoais e segurança.
// Tudo que altera dados pessoais ou credenciais pede a senha atual de novo (o back confere).
// As funcionalidades da conta pessoal ficam em /configuracoes.
@Component({
  imports: [ReactiveFormsModule, RouterLink, DatePipe, MatButtonModule, MatIconModule, MatProgressBarModule, Mascara, RequisitosSenha],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly usuario = this.usuarioService.perfil;
  protected readonly pessoal = computed(() => this.usuario()?.role === 'PESSOAL');
  protected readonly rotulosRole = ROTULOS_ROLE;
  protected readonly formatarTelefone = formatarTelefone;

  protected readonly iniciais = computed(() =>
    (this.usuario()?.nome ?? '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join(''),
  );

  // O que a pessoa pode usar hoje (só os que já têm tela).
  protected readonly acessos = computed(() =>
    (this.usuario()?.modulos ?? []).filter((m) => MODULOS[m].disponivel).map((m) => MODULOS[m]),
  );

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.required, telefone]],
    profissao: ['', [Validators.maxLength(100)]],
  });

  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);

  // ---------------------------------------------------------- segurança

  protected readonly formSenha = this.fb.nonNullable.group(
    {
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, senhaForte]],
      confirmacaoSenha: ['', Validators.required],
    },
    { validators: senhasIguais },
  );
  protected readonly novaSenha = toSignal(this.formSenha.controls.novaSenha.valueChanges, { initialValue: '' });
  protected readonly confirmacao = toSignal(this.formSenha.controls.confirmacaoSenha.valueChanges, { initialValue: '' });
  protected readonly mostrarSenhas = signal(false);
  protected readonly trocandoSenha = signal(false);

  protected readonly formEmail = this.fb.nonNullable.group({
    novoEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });
  protected readonly editandoEmail = signal(false);
  protected readonly trocandoEmail = signal(false);
  protected readonly encerrando = signal(false);

  ngOnInit(): void {
    this.usuarioService.carregarPerfil().subscribe({
      next: (u) => {
        this.form.patchValue({
          nome: u.nome,
          telefone: formatarTelefone(u.telefone),
          profissao: u.profissao ?? '',
        });
        if (u.role === 'PESSOAL') {
          this.form.controls.profissao.addValidators(Validators.required);
          this.form.controls.profissao.updateValueAndValidity();
        }
        this.form.markAsPristine();
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Erro ao carregar o perfil.'));
        this.carregando.set(false);
      },
    });
  }

  invalido(campo: 'nome' | 'telefone' | 'profissao'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }

  invalidoSenha(campo: 'senhaAtual' | 'novaSenha' | 'confirmacaoSenha'): boolean {
    const c = this.formSenha.controls[campo];
    return c.touched && (c.invalid || (campo === 'confirmacaoSenha' && this.formSenha.hasError('senhasDiferentes')));
  }

  // Dados pessoais: pede a senha de novo antes de gravar.
  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    pedirSenha(this.dialog, {
      titulo: 'Confirme que é você',
      mensagem: 'Para alterar seus dados pessoais, digite a sua senha atual.',
      confirmar: 'Salvar alterações',
    }).subscribe((senhaAtual) => {
      if (!senhaAtual) return;
      this.salvando.set(true);
      const v = this.form.getRawValue();
      this.usuarioService
        .atualizarPerfil({ nome: v.nome, telefone: v.telefone, profissao: this.pessoal() ? v.profissao : null, senhaAtual })
        .subscribe({
          next: () => {
            this.avisar('Dados atualizados.');
            this.salvando.set(false);
            this.form.markAsPristine();
          },
          error: (error: HttpErrorResponse) => {
            this.avisar(mensagemDeErro(error, 'Erro ao salvar os dados.'));
            this.salvando.set(false);
          },
        });
    });
  }

  // A troca de senha já pede a senha atual no próprio formulário.
  alterarSenha(): void {
    if (this.formSenha.invalid) {
      this.formSenha.markAllAsTouched();
      return;
    }
    this.trocandoSenha.set(true);
    this.auth.alterarSenha(this.formSenha.getRawValue()).subscribe({
      next: () => {
        this.trocandoSenha.set(false);
        this.formSenha.reset();
        this.avisar('Senha alterada. As sessões abertas em outros aparelhos foram encerradas.');
      },
      error: (error: HttpErrorResponse) => {
        this.trocandoSenha.set(false);
        this.avisar(mensagemDeErro(error, 'Não foi possível alterar a senha.'));
      },
    });
  }

  alterarEmail(): void {
    if (this.formEmail.invalid) {
      this.formEmail.markAllAsTouched();
      return;
    }
    const novoEmail = this.formEmail.getRawValue().novoEmail.trim();
    pedirSenha(this.dialog, {
      titulo: 'Confirme que é você',
      mensagem: 'O e-mail de acesso passará a ser ' + novoEmail + '. Digite a sua senha atual para confirmar.',
      confirmar: 'Alterar e-mail',
    }).subscribe((senhaAtual) => {
      if (!senhaAtual) return;
      this.trocandoEmail.set(true);
      this.auth.alterarEmail(novoEmail, senhaAtual).subscribe({
        next: () => {
          this.trocandoEmail.set(false);
          this.editandoEmail.set(false);
          this.formEmail.reset();
          this.avisar('E-mail alterado. Use o novo e-mail para entrar.');
        },
        error: (error: HttpErrorResponse) => {
          this.trocandoEmail.set(false);
          this.avisar(mensagemDeErro(error, 'Não foi possível alterar o e-mail.'));
        },
      });
    });
  }

  encerrarOutrasSessoes(): void {
    pedirSenha(this.dialog, {
      titulo: 'Sair dos outros aparelhos',
      mensagem: 'As sessões abertas em outros computadores e celulares serão encerradas. Esta continua aberta.',
      confirmar: 'Encerrar sessões',
    }).subscribe((senhaAtual) => {
      if (!senhaAtual) return;
      this.encerrando.set(true);
      this.auth.encerrarOutrasSessoes(senhaAtual).subscribe({
        next: () => {
          this.encerrando.set(false);
          this.avisar('Pronto: as outras sessões foram encerradas.');
        },
        error: (error: HttpErrorResponse) => {
          this.encerrando.set(false);
          this.avisar(mensagemDeErro(error, 'Não foi possível encerrar as sessões.'));
        },
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}

function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const { novaSenha, confirmacaoSenha } = grupo.value as { novaSenha: string; confirmacaoSenha: string };
  return confirmacaoSenha && novaSenha !== confirmacaoSenha ? { senhasDiferentes: true } : null;
}
