import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { TipoCategoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-categoria-form',
  styleUrl: './categoria-form.css',
  templateUrl: './categoria-form.html',
})
export class CategoriaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  protected readonly paleta = [
    '#E53935', '#FB8C00', '#FDD835', '#43A047', '#00897B',
    '#1E88E5', '#3949AB', '#8E24AA', '#D81B60', '#6D4C41', '#546E7A',
  ];

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    tipo: ['DESPESA' as TipoCategoria, Validators.required],
    cor: ['#1E88E5', Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)],
  });

  protected readonly cor = toSignal(this.form.controls.cor.valueChanges, {
    initialValue: this.form.controls.cor.value,
  });
  protected readonly nome = toSignal(this.form.controls.nome.valueChanges, {
    initialValue: this.form.controls.nome.value,
  });

  protected readonly tipo = toSignal(this.form.controls.tipo.valueChanges, {
    initialValue: this.form.controls.tipo.value,
  });

  protected readonly id = signal<number | null>(null);
  private readonly enviado = signal(false);

  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.id.set(Number(id));
    this.carregando.set(true);
    this.categoriaService.findById(id).subscribe({
      next: (c) => {
        this.form.patchValue({ nome: c.nome, tipo: c.tipo, cor: c.cor || '#1E88E5' });
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(mensagemDeErro(error, 'Categoria não encontrada.'));
        this.router.navigate(['/categorias']);
      },
    });
  }

  nomeInvalido(): boolean {
    const c = this.form.controls.nome;
    return c.invalid && (c.touched || this.enviado());
  }

  escolherCor(cor: string): void {
    this.form.controls.cor.setValue(cor);
  }

  salvar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }

    this.salvando.set(true);
    const dados = this.form.getRawValue();
    const id = this.id();
    const requisicao = id
      ? this.categoriaService.update(id, dados)
      : this.categoriaService.create(dados);

    requisicao.subscribe({
      next: () => {
        this.avisar(id ? 'Categoria atualizada.' : 'Categoria cadastrada.');
        this.router.navigate(['/categorias']);
      },
      error: (error: HttpErrorResponse) => {
        // Ex.: nome repetido (uk_categoria_nome_usuario).
        this.avisar(mensagemDeErro(error, 'Erro ao salvar. Já existe uma categoria com esse nome?'));
        this.salvando.set(false);
      },
    });
  }

  private avisar(mensagem: string): void {
    this.snack.open(mensagem, 'Ok', { duration: 3500, verticalPosition: 'top' });
  }
}
