import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { mensagemDeErro } from '../../../core/api';
import { RegistroAuditoria } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

// Ações gravadas pelo back (AuditoriaService), com o rótulo da tela.
const ACOES: Record<string, string> = {
  USUARIO_CRIADO: 'Usuário criado',
  USUARIO_ALTERADO: 'Usuário alterado',
  PERFIL_ALTERADO: 'Perfil alterado',
  USUARIO_ATIVADO: 'Usuário ativado',
  USUARIO_DESATIVADO: 'Usuário desativado',
  USUARIO_EXCLUIDO: 'Usuário excluído',
  EMPRESA_CADASTRADA: 'Empresa cadastrada',
  EMPRESA_ALTERADA: 'Empresa alterada',
  EMPRESA_ATIVADA: 'Empresa ativada',
  EMPRESA_DESATIVADA: 'Empresa desativada',
  CATEGORIA_PADRAO_CRIADA: 'Categoria padrão criada',
  CATEGORIA_PADRAO_ALTERADA: 'Categoria padrão alterada',
  CATEGORIA_PADRAO_ATIVADA: 'Categoria padrão ativada',
  CATEGORIA_PADRAO_DESATIVADA: 'Categoria padrão desativada',
  PARAMETRO_CRIADO: 'Parâmetro criado',
  PARAMETRO_ALTERADO: 'Parâmetro alterado',
  PARAMETRO_ATIVADO: 'Parâmetro ativado',
  PARAMETRO_DESATIVADO: 'Parâmetro desativado',
  PARAMETRO_EXCLUIDO: 'Parâmetro excluído',
  CONSULTA_TRANSACOES: 'Consulta de transações',
};

@Component({
  imports: [FormsModule, DatePipe, MatTableModule, MatPaginatorModule, MatIconModule, MatProgressBarModule],
  selector: 'app-admin-auditoria',
  styleUrl: '../admin-lista.css',
  templateUrl: './admin-auditoria.html',
})
export class AdminAuditoria implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly snack = inject(MatSnackBar);

  protected readonly colunas = ['dataHora', 'autor', 'acao', 'alvo'];
  protected readonly acoes = Object.entries(ACOES);
  protected readonly registros = signal<RegistroAuditoria[]>([]);
  protected readonly total = signal(0);
  protected readonly pagina = signal(0);
  protected readonly tamanho = signal(20);
  protected readonly carregando = signal(false);

  private busca = '';
  protected acao = '';
  private readonly digitacao = new Subject<string>();
  private consulta?: Subscription;

  ngOnInit(): void {
    this.digitacao.pipe(debounceTime(300), distinctUntilChanged()).subscribe((valor) => {
      this.busca = valor;
      this.filtrar();
    });
    this.carregar();
  }

  rotulo(acao: string): string {
    return ACOES[acao] ?? acao;
  }

  cor(acao: string): string {
    if (acao.includes('EXCLUI') || acao.includes('DESATIVAD')) return 'red';
    if (acao.includes('CRIAD') || acao.includes('CADASTRAD') || acao.includes('ATIVAD')) return 'green';
    if (acao.startsWith('CONSULTA')) return 'blue';
    return 'orange';
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

  private carregar(): void {
    this.consulta?.unsubscribe();
    this.carregando.set(true);
    this.consulta = this.adminService
      .listarAuditoria({ busca: this.busca, acao: this.acao }, this.pagina(), this.tamanho())
      .subscribe({
        next: (res) => {
          this.registros.set(res.items);
          this.total.set(res.totalItems);
          this.carregando.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.carregando.set(false);
          this.snack.open(mensagemDeErro(error, 'Erro ao carregar a auditoria.'), 'Ok', { duration: 4000, verticalPosition: 'top' });
        },
      });
  }
}
