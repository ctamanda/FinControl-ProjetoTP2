import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { formatarTelefone, telefone } from '../../core/validadores';
import { MODULOS, ROTULOS_ROLE, ROTULOS_TIPO_EMPRESA } from '../../models/usuario.model';
import { Mascara } from '../shared/mascara/mascara';

// Meu perfil: cartão de identidade (quem sou, onde, com que acesso) + dados editáveis.
// As funcionalidades da conta pessoal ficam em /configuracoes.
@Component({
  imports: [ReactiveFormsModule, RouterLink, DatePipe, MatButtonModule, MatIconModule, MatProgressBarModule, Mascara],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly snack = inject(MatSnackBar);

  protected readonly usuario = this.usuarioService.perfil;
  protected readonly pessoal = computed(() => this.usuario()?.role === 'PESSOAL');
  protected readonly rotulosRole = ROTULOS_ROLE;
  protected readonly rotulosTipoEmpresa = ROTULOS_TIPO_EMPRESA;
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

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    const v = this.form.getRawValue();
    this.usuarioService
      .atualizarPerfil({ ...v, profissao: this.pessoal() ? v.profissao : null, modulos: null })
      .subscribe({
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
