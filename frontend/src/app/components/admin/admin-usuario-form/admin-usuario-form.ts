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
import { MODULOS, Modulo, ROTULOS_ROLE, Role, Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { Mascara } from '../../shared/mascara/mascara';
import { RequisitosSenha } from '../../shared/requisitos-senha/requisitos-senha';
import { SeletorModulos } from '../../shared/seletor-modulos/seletor-modulos';

type Campo = 'nome' | 'email' | 'telefone' | 'profissao' | 'password' | 'confirmacao';

const TODOS = Object.keys(MODULOS) as Modulo[];
const PERFIS: Role[] = ['PESSOAL', 'SUPER_ADMIN'];

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
  selector: 'app-admin-usuario-form',
  styleUrl: './admin-usuario-form.css',
  templateUrl: './admin-usuario-form.html',
})
export class AdminUsuarioForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly eu = inject(UsuarioService).perfil;

  protected readonly rotulosRole = ROTULOS_ROLE;
  protected readonly descricoes: Record<Role, string> = {
    PESSOAL: 'Cuida das próprias finanças',
    SUPER_ADMIN: 'Administra o FinControl inteiro',
  };

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telefone: ['', [Validators.required, telefone]],
    profissao: ['', [Validators.maxLength(100)]],
    role: ['PESSOAL' as Role, Validators.required],
    password: ['', [Validators.required, Validators.maxLength(100), senhaForte]],
    confirmacao: ['', Validators.required],
  });

  protected readonly editando = signal<Usuario | null>(null);
  protected readonly modulos = signal<Modulo[]>(TODOS);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly mostrarSenha = signal(false);
  private readonly enviado = signal(false);

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly role = computed(() => this.valores().role as Role);
  protected readonly senha = computed(() => this.valores().password ?? '');
  protected readonly confirmacao = computed(() => this.valores().confirmacao ?? '');

  // Conta pessoal ou administrador do FinControl; ninguém altera o próprio perfil.
  protected readonly perfisPossiveis = PERFIS;
  protected readonly perfilTravado = computed(() => this.editando()?.id === this.eu()?.id);
  protected readonly opcoesModulos = computed(() => (this.role() === 'PESSOAL' ? TODOS : []));

  ngOnInit(): void {
    this.form.controls.role.valueChanges.subscribe((role) => this.ajustarCampos(role));

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      // Atalho "novo administrador" do painel (?perfil=SUPER_ADMIN).
      if (this.route.snapshot.queryParamMap.get('perfil') === 'SUPER_ADMIN') {
        this.form.patchValue({ role: 'SUPER_ADMIN' });
      }
      this.ajustarCampos(this.form.controls.role.value);
      return;
    }

    this.form.controls.email.disable();
    this.form.controls.password.disable();
    this.form.controls.confirmacao.disable();
    this.carregando.set(true);
    this.adminService.buscarUsuario(id).subscribe({
      next: (u) => {
        this.editando.set(u);
        this.form.patchValue({
          nome: u.nome,
          email: u.email,
          telefone: formatarTelefone(u.telefone),
          profissao: u.profissao ?? '',
          role: u.role,
        });
        this.modulos.set(u.role === 'PESSOAL' ? u.modulos : TODOS);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Usuário não encontrado.'));
        this.router.navigate(['/admin/usuarios']);
      },
    });
  }

  invalido(campo: Campo): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  escolherPerfil(role: Role): void {
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
    const role = v.role as Role;
    const comum = {
      nome: v.nome,
      telefone: v.telefone,
      profissao: role === 'PESSOAL' ? v.profissao : null,
      role,
      modulos: role === 'PESSOAL' ? this.modulos() : [],
    };
    const atual = this.editando();
    const requisicao: Observable<Usuario> = atual
      ? this.adminService.alterarUsuario(atual.id, comum)
      : this.adminService.criarUsuario({
          ...comum,
          email: v.email,
          password: v.password,
          confirmPassword: v.confirmacao,
        });

    requisicao.subscribe({
      next: () => {
        this.avisar(atual ? 'Usuário atualizado.' : 'Usuário cadastrado.');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Não foi possível salvar o usuário.'));
        this.salvando.set(false);
      },
    });
  }

  // Profissão só na conta pessoal (o back exige nesse caso).
  private ajustarCampos(role: Role): void {
    const { profissao } = this.form.controls;
    profissao.setValidators(role === 'PESSOAL' ? [Validators.required, Validators.maxLength(100)] : [Validators.maxLength(100)]);
    profissao.updateValueAndValidity({ emitEvent: false });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
