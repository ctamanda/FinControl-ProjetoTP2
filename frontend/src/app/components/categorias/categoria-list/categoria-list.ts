import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { confirmar } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, MatProgressBarModule],
  selector: 'app-categoria-list',
  styleUrl: './categoria-list.css',
  templateUrl: './categoria-list.html',
})
export class CategoriaList implements OnInit {
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  protected readonly grupos = computed(() => {
    const ordenar = (lista: Categoria[]) => [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
    return [
      {
        titulo: 'Despesas',
        icone: 'trending_down',
        cor: 'red',
        itens: ordenar(this.categorias().filter((c) => c.tipo === 'DESPESA')),
      },
      {
        titulo: 'Receitas',
        icone: 'trending_up',
        cor: 'green',
        itens: ordenar(this.categorias().filter((c) => c.tipo === 'RECEITA')),
      },
    ];
  });

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.categoriaService.findAll().subscribe({
      next: (lista) => {
        this.categorias.set(lista);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Erro ao carregar as categorias.'));
        this.carregando.set(false);
      },
    });
  }

  excluir(c: Categoria): void {
    confirmar(this.dialog, {
      titulo: 'Excluir categoria',
      mensagem: `Deseja excluir a categoria "${c.nome}"?`,
    }).subscribe((ok) => {
      if (!ok) return;
      this.categoriaService.delete(c.id).subscribe({
        next: () => {
          this.categorias.update((lista) => lista.filter((x) => x.id !== c.id));
          this.avisar('Categoria excluída.');
        },
        error: (error: HttpErrorResponse) =>
          this.avisar(
            mensagemDeErro(error, 'Não foi possível excluir. Verifique se há transações nesta categoria.'),
          ),
      });
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3500, verticalPosition: 'top' });
  }
}
