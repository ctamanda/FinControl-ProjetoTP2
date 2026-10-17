import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { cnpj, formatarCnpj, formatarTelefone, telefone } from '../../../core/validadores';
import { AdminEmpresa } from '../../../models/admin.model';
import { ROTULOS_ROLE, TipoEmpresa, Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { Mascara } from '../../shared/mascara/mascara';

// Empresa vista pelo administrador do FinControl: dados (editáveis), situação,
// números vinculados e os usuários que têm acesso a ela.
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    Mascara,
  ],
  selector: 'app-admin-empresa-detalhe',
  styleUrl: './admin-empresa-detalhe.css',
  templateUrl: './admin-empresa-detalhe.html',
})
export class AdminEmpresaDetalhe implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  protected readonly rotulosRole: Record<string, string> = ROTULOS_ROLE;
  protected readonly empresa = signal<AdminEmpresa | null>(null);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  private readonly enviado = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    tipo: ['MEI' as TipoEmpresa, Validators.required],
    razaoSocial: ['', [Validators.required, Validators.maxLength(150)]],
    nomeFantasia: ['', [Validators.maxLength(150)]],
    cnpj: ['', [Validators.required, cnpj]],
    telefone: ['', [Validators.required, telefone]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });
  protected readonly tipo = toSignal(this.form.controls.tipo.valueChanges, { initialValue: this.form.controls.tipo.value });

  ngOnInit(): void {
    this.adminService.buscarEmpresa(this.id).subscribe({
      next: (e) => {
        this.preencher(e);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Empresa não encontrada.'));
        this.carregando.set(false);
      },
    });
    this.carregarUsuarios();
  }

  invalido(campo: 'razaoSocial' | 'nomeFantasia' | 'cnpj' | 'telefone' | 'email'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  escolherTipo(tipo: TipoEmpresa): void {
    this.form.controls.tipo.setValue(tipo);
    this.form.markAsDirty();
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid) return;
    this.salvando.set(true);
    const v = this.form.getRawValue();
    this.adminService.alterarEmpresa(this.id, { ...v, nomeFantasia: v.nomeFantasia || null }).subscribe({
      next: (e) => {
        this.preencher(e);
        this.salvando.set(false);
        this.avisar('Dados da empresa atualizados.');
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.avisar(mensagemDeErro(error, 'Não foi possível salvar a empresa.'));
      },
    });
  }

  alterarAtivoEmpresa(): void {
    const e = this.empresa();
    if (!e) return;
    const ativar = !e.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar empresa' : 'Desativar empresa',
      mensagem: ativar
        ? `Os usuários de ${e.nomeFantasia || e.razaoSocial} voltam a entrar no FinControl.`
        : `Nenhum usuário de ${e.nomeFantasia || e.razaoSocial} conseguirá entrar. Os dados continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Desativar',
    }).subscribe((ok) => {
      if (!ok) return;
      this.adminService.alterarAtivoEmpresa(e.id, ativar).subscribe({
        next: (atualizada) => {
          this.empresa.set(atualizada);
          this.avisar(ativar ? 'Empresa reativada.' : 'Empresa desativada.');
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar a empresa.')),
      });
    });
  }

  // Remover o acesso de um usuário à empresa = desativá-lo (o histórico fica).
  alterarAtivoUsuario(u: Usuario): void {
    this.adminService.alterarAtivoUsuario(u.id, !u.ativo).subscribe({
      next: (atualizado) => {
        this.usuarios.update((lista) => lista.map((x) => (x.id === atualizado.id ? atualizado : x)));
        this.avisar(atualizado.ativo ? 'Acesso reativado.' : 'Acesso removido.');
      },
      error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar o acesso.')),
    });
  }

  private carregarUsuarios(): void {
    this.adminService.listarUsuarios({ idEmpresa: this.id }, 0, 100).subscribe({
      next: (r) => this.usuarios.set(r.items),
    });
  }

  private preencher(e: AdminEmpresa): void {
    this.empresa.set(e);
    this.form.patchValue({
      tipo: e.tipo,
      razaoSocial: e.razaoSocial,
      nomeFantasia: e.nomeFantasia ?? '',
      cnpj: formatarCnpj(e.cnpj),
      telefone: formatarTelefone(e.telefone),
      email: e.email,
    });
    this.form.markAsPristine();
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
