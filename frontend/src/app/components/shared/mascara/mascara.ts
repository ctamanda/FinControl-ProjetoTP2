import { Directive, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatarCnpj, formatarTelefone } from '../../../core/validadores';

// Formata telefone/CNPJ enquanto a pessoa digita: <input formControlName="cnpj" appMascara="cnpj" />.
// O back aceita com ou sem pontuação e grava só os dígitos.
@Directive({ selector: 'input[appMascara]' })
export class Mascara {
  readonly appMascara = input.required<'telefone' | 'cnpj'>();
  private readonly controle = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  aoDigitar(event: Event): void {
    const campo = event.target as HTMLInputElement;
    const formatado = this.appMascara() === 'cnpj' ? formatarCnpj(campo.value) : formatarTelefone(campo.value);
    if (formatado !== campo.value) {
      campo.value = formatado;
      this.controle?.control?.setValue(formatado, { emitEvent: true });
    }
  }
}
