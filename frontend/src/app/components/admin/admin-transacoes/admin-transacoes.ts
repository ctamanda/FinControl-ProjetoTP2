import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { AdminTransacao, FiltroTransacoes } from '../../../models/admin.model';
import { Usuario } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';
import { Valor } from '../../shared/valor/valor';

// Todas as transações do sistema, só para consulta. Cada nova pesquisa fica na auditoria.
@Component({
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    Valor,
  ],
  selector: 'app-admin-transacoes',
  styleUrls: ['../admin-lista.css', './admin-transacoes.css'],
  templateUrl: './admin-transacoes.html',
})
export class AdminTransacoes implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly snack = inject(MatSnackBar);

  protected readonly colunas = ['data', 'descricao', 'categoria', 'usuario', 'valor'];
  protected readonly transacoes = signal<AdminTransacao[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly total = signal(0);
  protected readonly pagina = signal(0);
  protected readonly tamanho = signal(20);
  protected readonly carregando = signal(false);

  protected filtro: FiltroTransacoes = {
    inicio: '',
    fim: '',
    // Vindo da lista de usuários (?usuario=ID): já abre filtrado.
    idUsuario: Number(inject(ActivatedRoute).snapshot.queryParamMap.get('usuario')) || null,
    categoria: '',
    tipo: '',
    descricao: '',
  };
  private consulta?: Subscription;

  ngOnInit(): void {
    this.carregarUsuarios();
    this.pesquisar();
  }

  pesquisar(): void {
    this.pagina.set(0);
    this.carregar();
  }

  limpar(): void {
    this.filtro = { inicio: '', fim: '', idUsuario: null, categoria: '', tipo: '', descricao: '' };
    this.pesquisar();
  }

  mudarPagina(event: PageEvent): void {
    this.pagina.set(event.pageIndex);
    this.tamanho.set(event.pageSize);
    this.carregar();
  }

  private carregar(): void {
    this.consulta?.unsubscribe();
    this.carregando.set(true);
    this.consulta = this.adminService.listarTransacoes(this.filtro, this.pagina(), this.tamanho()).subscribe({
      next: (res) => {
        this.transacoes.set(res.items);
        this.total.set(res.totalItems);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.snack.open(mensagemDeErro(error, 'Erro ao buscar as transações.'), 'Ok', { duration: 4000, verticalPosition: 'top' });
      },
    });
  }

  // Contas pessoais (até 100) para o filtro de usuário.
  private carregarUsuarios(): void {
    this.adminService.listarUsuarios({ role: 'PESSOAL' }, 0, 100).subscribe({
      next: (r) => this.usuarios.set(r.items),
    });
  }
}
