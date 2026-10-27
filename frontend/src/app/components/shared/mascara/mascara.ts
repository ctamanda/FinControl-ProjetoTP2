import { Directive, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatarTelefone } from '../../../core/validadores';

// Formata o telefone enquanto a pessoa digita: <input formControlName="telefone" appMascara="telefone" />.
// O back aceita com ou sem pontuação e grava só os dígitos.
@Directive({ selector: 'input[appMascara]' })
export class Mascara {
  readonly appMascara = input.required<'telefone'>();
  private readonly controle = inject(NgControl, { optional: true });

  @HostListener('input', ['$event'])
  aoDigitar(event: Event): void {
    const campo = event.target as HTMLInputElement;
    const formatado = formatarTelefone(campo.value);
    if (formatado !== campo.value) {
      campo.value = formatado;
      this.controle?.control?.setValue(formatado, { emitEvent: true });
    }
  }
}
