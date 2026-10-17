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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { formatarCnpj } from '../../../core/validadores';
import { AdminEmpresa } from '../../../models/admin.model';
import { ROTULOS_TIPO_EMPRESA } from '../../../models/usuario.model';
import { AdminService } from '../../../services/admin.service';

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
    MatTooltipModule,
    MatProgressBarModule,
  ],
  selector: 'app-admin-empresa-list',
  styleUrl: '../admin-lista.css',
  templateUrl: './admin-empresa-list.html',
})
export class AdminEmpresaList implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly snack = inject(MatSnackBar);

  protected readonly colunas = ['empresa', 'tipo', 'responsavel', 'usuarios', 'transacoes', 'situacao', 'acoes'];
  protected readonly rotulosTipo: Record<string, string> = ROTULOS_TIPO_EMPRESA;
  protected readonly formatarCnpj = formatarCnpj;

  protected readonly empresas = signal<AdminEmpresa[]>([]);
  protected readonly total = signal(0);
  protected readonly pagina = signal(0);
  protected readonly tamanho = signal(20);
  protected readonly carregando = signal(false);

  private busca = '';
  protected ativo: '' | 'true' | 'false' = '';
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
      .listarEmpresas({ busca: this.busca, ativo: this.ativo === '' ? null : this.ativo === 'true' }, this.pagina(), this.tamanho())
      .subscribe({
        next: (res) => {
          this.empresas.set(res.items);
          this.total.set(res.totalItems);
          this.carregando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.carregando.set(false);
          this.snack.open(mensagemDeErro(error, 'Erro ao carregar as empresas.'), 'Ok', { duration: 4000, verticalPosition: 'top' });
        },
      });
  }

  buscar(event: Event): void {
    this.digitacao.next((event.target as HTMLInputElement).value.trim());
  }

  filtrar(): void {
    this.pagina.set(0);
    this.carregar();
  }

  mudarPagina(event: PageEvent): void {
    this.pagina.set(event.pageIndex);
    this.tamanho.set(event.pageSize);
    this.carregar();
  }
}
