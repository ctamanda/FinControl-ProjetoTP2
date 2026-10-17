import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { formatarTelefone, senhaForte, telefone } from '../../../core/validadores';
import { RoleEmpresa } from '../../../models/empresa.model';
import { MODULOS, Modulo, Usuario } from '../../../models/usuario.model';
import { EmpresaService } from '../../../services/empresa.service';
import { Mascara } from '../../shared/mascara/mascara';
import { RequisitosSenha } from '../../shared/requisitos-senha/requisitos-senha';
import { SeletorModulos } from '../../shared/seletor-modulos/seletor-modulos';

type Campo = 'nome' | 'email' | 'telefone' | 'password' | 'confirmacao';

// Módulos que o admin pode liberar a um usuário comum (Administração de usuários fica de fora).
const MODULOS_LIBERAVEIS = (Object.keys(MODULOS) as Modulo[]).filter((m) => MODULOS[m].empresa);

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    Mascara,
    RequisitosSenha,
    SeletorModulos,
  ],
  selector: 'app-usuario-empresa-form',
  styleUrl: './usuario-empresa-form.css',
  templateUrl: './usuario-empresa-form.html',
})
export class UsuarioEmpresaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly empresaService = inject(EmpresaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly eu = inject(UsuarioService).perfil;

  protected readonly opcoesModulos = MODULOS_LIBERAVEIS;

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telefone: ['', [Validators.required, telefone]],
    role: ['USUARIO_EMPRESA' as RoleEmpresa, Validators.required],
    password: ['', [Validators.required, Validators.maxLength(100), senhaForte]],
    confirmacao: ['', Validators.required],
  });

  protected readonly modulos = signal<Modulo[]>(['DASHBOARD', 'LANCAMENTOS', 'CATEGORIAS']);
  protected readonly editando = signal<Usuario | null>(null);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly mostrarSenha = signal(false);
  private readonly enviado = signal(false);

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly role = computed(() => this.valores().role);
  protected readonly senha = computed(() => this.valores().password ?? '');
  protected readonly confirmacao = computed(() => this.valores().confirmacao ?? '');

  // O próprio perfil e o do administrador principal não mudam (regra do back).
  protected readonly perfilTravado = computed(() => {
    const u = this.editando();
    return !!u && (u.id === this.eu()?.id || !!u.empresa?.responsavel);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    // Na edição, e-mail e senha não mudam.
    this.form.controls.email.disable();
    this.form.controls.password.disable();
    this.form.controls.confirmacao.disable();

    this.carregando.set(true);
    this.empresaService.buscarUsuario(id).subscribe({
      next: (u) => {
        this.editando.set(u);
        this.form.patchValue({
          nome: u.nome,
          email: u.email,
          telefone: formatarTelefone(u.telefone),
          role: u.role as RoleEmpresa,
        });
        this.modulos.set(u.role === 'USUARIO_EMPRESA' ? u.modulos : []);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Usuário não encontrado.'));
        this.router.navigate(['/empresa/usuarios']);
      },
    });
  }

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  escolherPerfil(role: RoleEmpresa): void {
    if (this.perfilTravado()) return;
    this.form.controls.role.setValue(role);
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid || (!this.editando() && this.senha() !== this.confirmacao())) {
      return;
    }

    this.salvando.set(true);
    const v = this.form.getRawValue();
    const comum = {
      nome: v.nome,
      telefone: v.telefone,
      role: v.role,
      modulos: v.role === 'USUARIO_EMPRESA' ? this.modulos() : [],
    };
    const atual = this.editando();
    const requisicao: Observable<Usuario> = atual
      ? this.empresaService.alterarUsuario(atual.id, comum)
      : this.empresaService.criarUsuario({ ...comum, email: v.email, password: v.password, confirmPassword: v.confirmacao });

    requisicao.subscribe({
      next: () => {
        this.avisar(atual ? 'Usuário atualizado.' : 'Usuário cadastrado. Passe o e-mail e a senha para ele entrar.');
        this.router.navigate(['/empresa/usuarios']);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Não foi possível salvar o usuário.'));
        this.salvando.set(false);
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
