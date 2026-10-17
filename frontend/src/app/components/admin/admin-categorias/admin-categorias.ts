import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { mensagemDeErro } from '../../../core/api';
import { CategoriaPadrao, CategoriaRanking } from '../../../models/admin.model';
import { TipoCategoria } from '../../../models/categoria.model';
import { AdminService } from '../../../services/admin.service';

// Categorias padrão (o que toda conta nova recebe) + ranking de uso no sistema todo.
@Component({
  imports: [ReactiveFormsModule, DecimalPipe, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule],
  selector: 'app-admin-categorias',
  styleUrl: './admin-categorias.css',
  templateUrl: './admin-categorias.html',
})
export class AdminCategorias implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly snack = inject(MatSnackBar);

  protected readonly padrao = signal<CategoriaPadrao[]>([]);
  protected readonly ranking = signal<CategoriaRanking[]>([]);
  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly editando = signal<CategoriaPadrao | null>(null);
  protected readonly filtroRanking = signal<TipoCategoria | ''>('');

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    tipo: ['DESPESA' as TipoCategoria, Validators.required],
    cor: ['#4C1D95'],
  });

  protected readonly rankingFiltrado = computed(() => {
    const tipo = this.filtroRanking();
    const lista = this.ranking().filter((c) => !tipo || c.tipo === tipo);
    const maior = Math.max(1, ...lista.map((c) => c.totalTransacoes));
    return lista.map((c) => ({ ...c, largura: (c.totalTransacoes / maior) * 100 }));
  });

  protected readonly totais = computed(() => ({
    receitas: this.padrao().filter((c) => c.tipo === 'RECEITA' && c.ativo).length,
    despesas: this.padrao().filter((c) => c.tipo === 'DESPESA' && c.ativo).length,
  }));

  ngOnInit(): void {
    this.adminService.listarCategoriasPadrao().subscribe({
      next: (lista) => {
        this.padrao.set(lista);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.carregando.set(false);
        this.avisar(mensagemDeErro(error, 'Erro ao carregar as categorias padrão.'));
      },
    });
    this.adminService.rankingCategorias(100).subscribe({ next: (r) => this.ranking.set(r) });
  }

  editar(c: CategoriaPadrao): void {
    this.editando.set(c);
    this.form.setValue({ nome: c.nome, tipo: c.tipo, cor: c.cor ?? '#4C1D95' });
  }

  cancelar(): void {
    this.editando.set(null);
    this.form.reset({ nome: '', tipo: 'DESPESA', cor: '#4C1D95' });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    const atual = this.editando();
    this.adminService.salvarCategoriaPadrao(atual?.id ?? null, this.form.getRawValue()).subscribe({
      next: (salva) => {
        this.padrao.update((lista) =>
          atual ? lista.map((c) => (c.id === salva.id ? salva : c)) : [...lista, salva],
        );
        this.avisar(atual ? 'Categoria padrão atualizada.' : 'Categoria padrão criada. As próximas contas já a recebem.');
        this.salvando.set(false);
        this.cancelar();
      },
      error: (error: HttpErrorResponse) => {
        this.salvando.set(false);
        this.avisar(mensagemDeErro(error, 'Não foi possível salvar a categoria.'));
      },
    });
  }

  alterarAtivo(c: CategoriaPadrao): void {
    this.adminService.alterarAtivoCategoriaPadrao(c.id, !c.ativo).subscribe({
      next: (atualizada) => this.padrao.update((lista) => lista.map((x) => (x.id === atualizada.id ? atualizada : x))),
      error: (error: HttpErrorResponse) => this.avisar(mensagemDeErro(error, 'Não foi possível alterar a categoria.')),
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 4000, verticalPosition: 'top' });
  }
}
