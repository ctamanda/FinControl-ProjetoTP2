import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { mensagemDeErro } from '../../../core/api';
import { ParametroFiscal } from '../../../models/admin.model';
import { AdminService } from '../../../services/admin.service';

// Fim da vigência não pode ser antes do início (mesma regra do back).
function vigenciaValida(group: AbstractControl): ValidationErrors | null {
  const inicio = group.get('vigenciaInicio')?.value;
  const fim = group.get('vigenciaFim')?.value;
  return inicio && fim && fim < inicio ? { vigencia: true } : null;
}

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  selector: 'app-parametro-form',
  styleUrl: './parametro-form.css',
  templateUrl: './parametro-form.html',
})
export class ParametroForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  // Sugestões de chaves comuns para MEI/ME (o campo aceita qualquer texto).
  protected readonly sugestoes = [
    { chave: 'LIMITE_FATURAMENTO_MEI', descricao: 'Teto de faturamento anual do MEI' },
    { chave: 'DAS_MEI_COMERCIO', descricao: 'Valor mensal do DAS — comércio' },
    { chave: 'DAS_MEI_SERVICO', descricao: 'Valor mensal do DAS — serviço' },
    { chave: 'DAS_MEI_AMBOS', descricao: 'Valor mensal do DAS — comércio e serviço' },
    { chave: 'SALARIO_MINIMO', descricao: 'Salário mínimo nacional' },
    { chave: 'LIMITE_FATURAMENTO_ME', descricao: 'Teto de faturamento anual da ME' },
  ];

  protected readonly form = this.fb.nonNullable.group(
    {
      chave: ['', [Validators.required, Validators.maxLength(50)]],
      valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
      vigenciaInicio: ['', Validators.required],
      vigenciaFim: ['', Validators.required],
    },
    { validators: vigenciaValida },
  );

  protected readonly id = signal<number | null>(null);
  protected readonly carregando = signal(false);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');

  private readonly enviado = signal(false);

  invalido(campo: 'chave' | 'valor' | 'vigenciaInicio' | 'vigenciaFim'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  vigenciaInvalida(): boolean {
    return this.form.hasError('vigencia') && (this.form.controls.vigenciaFim.touched || this.enviado());
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.id.set(Number(id));
    this.carregando.set(true);
    this.adminService.buscarParametro(id).subscribe({
      next: (p) => {
        this.form.patchValue(p);
        this.carregando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.erro.set(mensagemDeErro(error, 'Parâmetro não encontrado.'));
        this.carregando.set(false);
      },
    });
  }

  // Chaves padronizadas em MAIÚSCULAS_COM_UNDERLINE.
  normalizarChave(): void {
    const chave = this.form.controls.chave;
    chave.setValue(chave.value.trim().toUpperCase().replace(/\s+/g, '_'));
  }

  salvar(): void {
    this.normalizarChave();
    this.enviado.set(true);
    if (this.form.invalid) {
      return;
    }

    this.salvando.set(true);
    this.erro.set('');
    const dados = this.form.getRawValue() as ParametroFiscal;
    const id = this.id();
    const requisicao = id
      ? this.adminService.atualizarParametro(id, dados)
      : this.adminService.criarParametro(dados);

    requisicao.subscribe({
      next: () => {
        this.snack.open(id ? 'Parâmetro atualizado.' : 'Parâmetro cadastrado.', 'Ok', {
          duration: 3000,
          verticalPosition: 'top',
        });
        this.router.navigate(['/admin/parametros']);
      },
      error: (error: HttpErrorResponse) => {
        // Ex.: sobreposição de vigência com outro registro da mesma chave.
        this.erro.set(mensagemDeErro(error, 'Erro ao salvar o parâmetro.'));
        this.salvando.set(false);
      },
    });
  }
}
