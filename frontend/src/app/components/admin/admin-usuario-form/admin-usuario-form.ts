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
import { AdminEmpresa } from '../../../models/admin.model';
import { MODULOS, Modulo, ROTULOS_ROLE, Role, Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { Mascara } from '../../shared/mascara/mascara';
import { RequisitosSenha } from '../../shared/requisitos-senha/requisitos-senha';
import { SeletorModulos } from '../../shared/seletor-modulos/seletor-modulos';

type Campo = 'nome' | 'email' | 'telefone' | 'profissao' | 'idEmpresa' | 'password' | 'confirmacao';

const TODOS = Object.keys(MODULOS) as Modulo[];
const MODULOS_PESSOAIS = TODOS.filter((m) => MODULOS[m].pessoal);
const MODULOS_EMPRESA = TODOS.filter((m) => MODULOS[m].empresa);

// "Usuário" e "Administrador" de cada tipo de conta (regra do back: o perfil só troca dentro do par).
const PAR: Record<Role, Role[]> = {
  PESSOAL: ['PESSOAL', 'SUPER_ADMIN'],
  SUPER_ADMIN: ['PESSOAL', 'SUPER_ADMIN'],
  USUARIO_EMPRESA: ['USUARIO_EMPRESA', 'ADMIN_EMPRESA'],
  ADMIN_EMPRESA: ['USUARIO_EMPRESA', 'ADMIN_EMPRESA'],
};

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
    USUARIO_EMPRESA: 'Funcionário: só o que for liberado',
    ADMIN_EMPRESA: 'Gerencia a empresa e a equipe',
  };

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telefone: ['', [Validators.required, telefone]],
    profissao: ['', [Validators.maxLength(100)]],
    role: ['PESSOAL' as Role, Validators.required],
    idEmpresa: [null as number | null],
    password: ['', [Validators.required, Validators.maxLength(100), senhaForte]],
    confirmacao: ['', Validators.required],
  });

  protected readonly editando = signal<Usuario | null>(null);
  protected readonly empresas = signal<AdminEmpresa[]>([]);
  protected readonly modulos = signal<Modulo[]>(MODULOS_PESSOAIS);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly mostrarSenha = signal(false);
  private readonly enviado = signal(false);

  private readonly valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  protected readonly role = computed(() => this.valores().role as Role);
  protected readonly senha = computed(() => this.valores().password ?? '');
  protected readonly confirmacao = computed(() => this.valores().confirmacao ?? '');

  // Na criação, qualquer perfil; na edição, só o par do tipo de conta (e nunca o próprio perfil).
  protected readonly perfisPossiveis = computed<Role[]>(() => {
    const u = this.editando();
    return u ? PAR[u.role] : ['PESSOAL', 'USUARIO_EMPRESA', 'ADMIN_EMPRESA', 'SUPER_ADMIN'];
  });
  protected readonly perfilTravado = computed(() => {
    const u = this.editando();
    return !!u && (u.id === this.eu()?.id || !!u.empresa?.responsavel);
  });
  protected readonly opcoesModulos = computed(() =>
    this.role() === 'PESSOAL' ? MODULOS_PESSOAIS : this.role() === 'USUARIO_EMPRESA' ? MODULOS_EMPRESA : [],
  );
  protected readonly ehEmpresa = computed(() => this.role() === 'USUARIO_EMPRESA' || this.role() === 'ADMIN_EMPRESA');

  ngOnInit(): void {
    this.form.controls.role.valueChanges.subscribe((role) => this.ajustarCampos(role));

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.adminService.listarEmpresas({ ativo: null }, 0, 100).subscribe({ next: (r) => this.empresas.set(r.items) });
      const empresa = Number(this.route.snapshot.queryParamMap.get('empresa'));
      if (empresa) {
        this.form.patchValue({ role: 'USUARIO_EMPRESA', idEmpresa: empresa });
      }
      this.ajustarCampos(this.form.controls.role.value);
      return;
    }

    this.form.controls.email.disable();
    this.form.controls.idEmpresa.disable();
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
          idEmpresa: u.empresa?.id ?? null,
        });
        this.modulos.set(u.role === 'PESSOAL' || u.role === 'USUARIO_EMPRESA' ? u.modulos : []);
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
      modulos: role === 'PESSOAL' || role === 'USUARIO_EMPRESA' ? this.modulos() : [],
    };
    const atual = this.editando();
    const requisicao: Observable<Usuario> = atual
      ? this.adminService.alterarUsuario(atual.id, comum)
      : this.adminService.criarUsuario({
          ...comum,
          email: v.email,
          idEmpresa: this.ehEmpresa() ? v.idEmpresa : null,
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

  // Profissão só na conta pessoal; empresa obrigatória para usuário comum de empresa.
  private ajustarCampos(role: Role): void {
    const { profissao, idEmpresa } = this.form.controls;
    profissao.setValidators(role === 'PESSOAL' ? [Validators.required, Validators.maxLength(100)] : [Validators.maxLength(100)]);
    profissao.updateValueAndValidity({ emitEvent: false });
    if (!this.editando()) {
      idEmpresa.setValidators(role === 'USUARIO_EMPRESA' ? Validators.required : null);
      idEmpresa.updateValueAndValidity({ emitEvent: false });
      this.modulos.set(role === 'PESSOAL' ? MODULOS_PESSOAIS : role === 'USUARIO_EMPRESA' ? ['DASHBOARD', 'LANCAMENTOS'] : []);
    }
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
