import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { FichaUsuario } from '../../../models/admin.model';
import { ROTULOS_ROLE } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { iniciais } from '../../layout/shell/shell';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';
import { SenhaProvisoriaDialog } from './senha-provisoria-dialog';

// Ficha do usuário para o suporte: cadastro, acesso e quantidades (nunca valores ou descrições)
// e as ações de suporte. Cada ação fica registrada na auditoria pelo back.
@Component({
  imports: [RouterLink, DatePipe, DecimalPipe, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule],
  selector: 'app-admin-usuario-ficha',
  styleUrl: './admin-usuario-ficha.css',
  templateUrl: './admin-usuario-ficha.html',
})
export class AdminUsuarioFicha {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  private readonly eu = inject(UsuarioService).perfil;
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  protected readonly iniciais = iniciais;
  protected readonly rotulosRole = ROTULOS_ROLE;
  protected readonly ficha = signal<FichaUsuario | null>(null);
  protected readonly carregando = signal(true);
  protected readonly ocupado = signal(false);
  protected readonly erro = signal('');

  protected readonly souEu = computed(() => this.ficha()?.id === this.eu()?.id);

  constructor() {
    this.carregar();
  }

  private carregar(): void {
    this.carregando.set(true);
    this.adminService.fichaUsuario(this.id).subscribe({
      next: (f) => {
        this.ficha.set(f);
        this.erro.set('');
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar a ficha do usuário.'));
        this.carregando.set(false);
      },
    });
  }

  desbloquear(f: FichaUsuario): void {
    this.executar(this.adminService.desbloquearUsuario(f.id), 'Conta desbloqueada. As tentativas foram zeradas.');
  }

  encerrarSessoes(f: FichaUsuario): void {
    confirmar(this.dialog, {
      titulo: 'Encerrar sessões',
      mensagem: `${f.nome} sai de todos os dispositivos agora e precisa entrar de novo com a senha.`,
      confirmar: 'Encerrar sessões',
    }).subscribe((ok) => ok && this.executar(this.adminService.encerrarSessoesUsuario(f.id), 'Sessões encerradas.'));
  }

  gerarSenha(f: FichaUsuario): void {
    confirmar(this.dialog, {
      titulo: 'Gerar senha provisória',
      mensagem:
        `A senha atual de ${f.nome} deixa de valer e as sessões abertas caem. ` +
        'A senha provisória aparece uma única vez, e a pessoa terá de trocá-la no próximo login.',
      confirmar: 'Gerar senha',
    }).subscribe((ok) => {
      if (!ok) return;
      this.ocupado.set(true);
      this.adminService.gerarSenhaProvisoria(f.id).subscribe({
        next: ({ senhaProvisoria }) => {
          this.ocupado.set(false);
          this.dialog.open(SenhaProvisoriaDialog, {
            data: { nome: f.nome, email: f.email, senha: senhaProvisoria },
            width: '440px',
            disableClose: true,
          });
          this.carregar();
        },
        error: (error: HttpErrorResponse) => {
          this.ocupado.set(false);
          this.avisar(mensagemDeErro(error, 'Não foi possível gerar a senha.'));
        },
      });
    });
  }

  alterarAtivo(f: FichaUsuario): void {
    const ativar = !f.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar usuário' : 'Desativar usuário',
      mensagem: ativar
        ? `${f.nome} volta a entrar no FinControl.`
        : `${f.nome} perde o acesso na hora, inclusive nas sessões já abertas. O cadastro e o histórico continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Desativar',
    }).subscribe(
      (ok) =>
        ok &&
        this.executar(this.adminService.alterarAtivoUsuario(f.id, ativar), ativar ? 'Usuário reativado.' : 'Usuário desativado.'),
    );
  }

  private executar(acao: Observable<unknown>, sucesso: string): void {
    this.ocupado.set(true);
    acao.subscribe({
      next: () => {
        this.ocupado.set(false);
        this.avisar(sucesso);
        this.carregar();
      },
      error: (error: HttpErrorResponse) => {
        this.ocupado.set(false);
        this.avisar(mensagemDeErro(error, 'Não foi possível concluir a ação.'));
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
