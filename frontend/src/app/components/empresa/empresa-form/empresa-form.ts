import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { cnpj, formatarCnpj, formatarTelefone, telefone } from '../../../core/validadores';
import { TipoEmpresa } from '../../../models/usuario.model';
import { EmpresaService } from '../../../services/empresa.service';
import { FundoAuth } from '../../shared/fundo-auth/fundo-auth';
import { Logo } from '../../shared/logo/logo';
import { EtapasCadastro } from '../../shared/etapas-cadastro/etapas-cadastro';
import { Mascara } from '../../shared/mascara/mascara';

type Campo = 'razaoSocial' | 'nomeFantasia' | 'cnpj' | 'telefone' | 'email';

// Mesma tela em dois lugares (data.modo da rota):
//  - "cadastro": última etapa do cadastro de MEI/Microempresa, fora do layout, antes de usar o sistema;
//  - "dados": "Minha empresa" dentro do sistema. O admin edita; o usuário comum só consulta.
@Component({
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    FundoAuth,
    Logo,
    Mascara,
    EtapasCadastro,
  ],
  selector: 'app-empresa-form',
  styleUrl: './empresa-form.css',
  templateUrl: './empresa-form.html',
})
export class EmpresaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly empresaService = inject(EmpresaService);
  private readonly usuarios = inject(UsuarioService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  protected readonly cadastro = inject(ActivatedRoute).snapshot.data['modo'] === 'cadastro';
  protected readonly podeEditar = computed(() => this.cadastro || this.usuarios.perfil()?.role === 'ADMIN_EMPRESA');

  protected readonly form = this.fb.nonNullable.group({
    tipo: ['MEI' as TipoEmpresa, Validators.required],
    razaoSocial: ['', [Validators.required, Validators.maxLength(150)]],
    nomeFantasia: ['', [Validators.maxLength(150)]],
    cnpj: ['', [Validators.required, cnpj]],
    telefone: ['', [Validators.required, telefone]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });

  protected readonly tipo = toSignal(this.form.controls.tipo.valueChanges, {
    initialValue: this.form.controls.tipo.value,
  });

  protected readonly carregando = signal(!this.cadastro);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');
  private readonly enviado = signal(false);

  ngOnInit(): void {
    if (this.cadastro) {
      // Sugere o e-mail e o telefone do responsável; podem ser trocados.
      const u = this.usuarios.perfil();
      this.form.patchValue({ email: u?.email ?? '', telefone: formatarTelefone(u?.telefone) });
      return;
    }

    this.empresaService.buscar().subscribe({
      next: (e) => {
        this.form.patchValue({
          ...e,
          nomeFantasia: e.nomeFantasia ?? '',
          cnpj: formatarCnpj(e.cnpj),
          telefone: formatarTelefone(e.telefone),
        });
        if (!this.podeEditar()) this.form.disable();
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar a empresa.'));
        this.carregando.set(false);
      },
    });
  }

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  escolherTipo(tipo: TipoEmpresa): void {
    if (this.form.disabled) return;
    this.form.controls.tipo.setValue(tipo);
    this.form.markAsDirty();
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }

    this.salvando.set(true);
    this.erro.set('');
    const dados = { ...this.form.getRawValue(), nomeFantasia: this.form.controls.nomeFantasia.value || null };

    if (this.cadastro) {
      // Com a empresa criada, o perfil deixa de estar pendente e libera o sistema.
      this.empresaService
        .cadastrar(dados)
        .pipe(switchMap(() => this.usuarios.carregarPerfil()))
        .subscribe({
          next: () => {
            this.avisar('Empresa cadastrada!');
            this.router.navigateByUrl('/bem-vindo');
          },
          error: (error: HttpErrorResponse) => this.falhou(error),
        });
      return;
    }

    this.empresaService
      .alterar(dados)
      .pipe(switchMap(() => this.usuarios.carregarPerfil()))
      .subscribe({
        next: () => {
          this.avisar('Dados da empresa atualizados.');
          this.salvando.set(false);
          this.form.markAsPristine();
        },
        error: (error: HttpErrorResponse) => this.falhou(error),
      });
  }

  sair(): void {
    this.auth.logout();
  }

  private falhou(error: HttpErrorResponse): void {
    this.erro.set(mensagemDeErro(error, 'Não foi possível salvar a empresa.'));
    this.salvando.set(false);
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3000, verticalPosition: 'top' });
  }
}
