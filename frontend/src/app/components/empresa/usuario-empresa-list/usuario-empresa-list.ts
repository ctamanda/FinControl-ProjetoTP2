import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { formatarTelefone } from '../../../core/validadores';
import { MODULOS, Usuario } from '../../../models/usuario.model';
import { EmpresaService } from '../../../services/empresa.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressBarModule],
  selector: 'app-usuario-empresa-list',
  styleUrl: './usuario-empresa-list.css',
  templateUrl: './usuario-empresa-list.html',
})
export class UsuarioEmpresaList implements OnInit {
  private readonly empresaService = inject(EmpresaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  protected readonly eu = inject(UsuarioService).perfil;

  protected readonly colunas = ['nome', 'perfil', 'acessos', 'situacao', 'acoes'];
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');
  protected readonly formatarTelefone = formatarTelefone;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.empresaService.listarUsuarios().subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar os usuários.'));
        this.carregando.set(false);
      },
    });
  }

  // O próprio usuário e o administrador principal não podem ser desativados nem excluídos.
  protected protegido(u: Usuario): boolean {
    return u.id === this.eu()?.id || this.ehPrincipal(u);
  }

  protected ehPrincipal(u: Usuario): boolean {
    return !!u.empresa?.responsavel;
  }

  protected resumoAcessos(u: Usuario): string {
    if (u.role === 'ADMIN_EMPRESA') return 'Todas as funcionalidades';
    if (!u.modulos.length) return 'Nenhuma funcionalidade liberada';
    return u.modulos.map((m) => MODULOS[m].rotulo).join(', ');
  }

  alterarAtivo(u: Usuario): void {
    const ativar = !u.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar acesso' : 'Remover acesso',
      mensagem: ativar
        ? `${u.nome} volta a entrar no FinControl com as mesmas permissões.`
        : `${u.nome} não conseguirá mais entrar. O cadastro e o histórico de lançamentos continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Remover acesso',
    }).subscribe((ok) => {
      if (!ok) return;
      this.empresaService.alterarAtivo(u.id, ativar).subscribe({
        next: (atualizado) => {
          this.usuarios.update((lista) => lista.map((x) => (x.id === atualizado.id ? atualizado : x)));
          this.avisar(ativar ? 'Acesso reativado.' : 'Acesso removido.');
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar o acesso.')),
      });
    });
  }

  excluir(u: Usuario): void {
    confirmar(this.dialog, {
      titulo: 'Excluir usuário',
      mensagem: `Excluir ${u.nome}? Só é possível para quem ainda não registrou nada; caso contrário, remova o acesso.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.empresaService.excluirUsuario(u.id).subscribe({
        next: () => {
          this.usuarios.update((lista) => lista.filter((x) => x.id !== u.id));
          this.avisar('Usuário excluído.');
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível excluir.')),
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
