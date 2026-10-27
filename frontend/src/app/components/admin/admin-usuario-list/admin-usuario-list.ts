import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { UsuarioService } from '../../../core/usuario/usuario.service';
import { ROTULOS_ROLE, Role, Usuario } from '../../../models/usuario.model';

type Filtro = 'TODOS' | 'ATIVOS' | 'INATIVOS' | 'ADMINS';
import { AdminService } from '../../../services/admin.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [
    RouterLink,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  selector: 'app-admin-usuario-list',
  styleUrl: '../admin-lista.css',
  templateUrl: './admin-usuario-list.html',
})
export class AdminUsuarioList implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);
  protected readonly eu = inject(UsuarioService).perfil;

  protected readonly colunas = ['usuario', 'perfil', 'situacao', 'acesso', 'cadastro', 'acoes'];
  protected readonly rotulosRole: Record<string, string> = ROTULOS_ROLE;
  protected readonly filtros: { valor: Filtro; rotulo: string }[] = [
    { valor: 'TODOS', rotulo: 'Todos' },
    { valor: 'ATIVOS', rotulo: 'Ativos' },
    { valor: 'INATIVOS', rotulo: 'Inativos' },
    { valor: 'ADMINS', rotulo: 'Administradores' },
  ];

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly total = signal(0);
  protected readonly pagina = signal(0);
  protected readonly tamanho = signal(20);
  protected readonly carregando = signal(false);

  // Busca e aba podem vir do painel (?busca=, ?filtro=ATIVOS).
  private readonly params = inject(ActivatedRoute).snapshot.queryParamMap;
  protected busca = this.params.get('busca') ?? '';
  protected readonly filtro = signal<Filtro>((this.params.get('filtro') as Filtro) || 'TODOS');
  private readonly digitacao = new Subject<string>();
  private consulta?: Subscription;

  ngOnInit(): void {
    this.digitacao.pipe(debounceTime(300), distinctUntilChanged()).subscribe((valor) => {
      this.busca = valor;
      this.pagina.set(0);
      this.carregar();
    });
    this.carregar();
  }

  carregar(): void {
    this.consulta?.unsubscribe();
    this.carregando.set(true);
    this.consulta = this.adminService
      .listarUsuarios(
        {
          busca: this.busca,
          role: this.filtro() === 'ADMINS' ? 'SUPER_ADMIN' : '',
          ativo: this.filtro() === 'ATIVOS' ? true : this.filtro() === 'INATIVOS' ? false : null,
        },
        this.pagina(),
        this.tamanho(),
      )
      .subscribe({
        next: (res) => {
          this.usuarios.set(res.items);
          this.total.set(res.totalItems);
          this.carregando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.carregando.set(false);
          this.avisar(mensagemDeErro(error, 'Erro ao carregar os usuários.'));
        },
      });
  }

  buscar(event: Event): void {
    this.digitacao.next((event.target as HTMLInputElement).value.trim());
  }

  filtrar(filtro: Filtro): void {
    this.filtro.set(filtro);
    this.pagina.set(0);
    this.carregar();
  }

  mudarPagina(event: PageEvent): void {
    this.pagina.set(event.pageIndex);
    this.tamanho.set(event.pageSize);
    this.carregar();
  }

  protected corPerfil(role: Role): string {
    return role === 'SUPER_ADMIN' ? 'purple' : 'green';
  }

  alterarAtivo(u: Usuario): void {
    const ativar = !u.ativo;
    confirmar(this.dialog, {
      titulo: ativar ? 'Reativar usuário' : 'Desativar usuário',
      mensagem: ativar
        ? `${u.nome} volta a entrar no FinControl.`
        : `${u.nome} perde o acesso na hora, inclusive nas sessões já abertas. O cadastro e o histórico continuam guardados.`,
      confirmar: ativar ? 'Reativar' : 'Desativar',
    }).subscribe((ok) => {
      if (!ok) return;
      this.adminService.alterarAtivoUsuario(u.id, ativar).subscribe({
        next: (atualizado) => {
          this.usuarios.update((lista) => lista.map((x) => (x.id === atualizado.id ? atualizado : x)));
          this.avisar(ativar ? 'Usuário reativado.' : 'Usuário desativado.');
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar o usuário.')),
      });
    });
  }

  excluir(u: Usuario): void {
    confirmar(this.dialog, {
      titulo: 'Excluir usuário',
      mensagem: `Excluir ${u.nome}? Só é possível para quem não tem histórico (lançamentos ou ações na auditoria); nesse caso, desative.`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.adminService.excluirUsuario(u.id).subscribe({
        next: () => {
          this.avisar('Usuário excluído.');
          this.carregar();
        },
        error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível excluir.')),
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
