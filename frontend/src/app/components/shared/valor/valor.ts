import { Component, computed, input } from '@angular/core';

const FORMATO = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Exibe "1.234,56" com os centavos menores; azul quando positivo, vermelho quando negativo.
@Component({
  selector: 'app-valor',
  template: `<span class="valor" [class.negativo]="negativo()" [class.neutro]="neutro()"
    >{{ sinal() }}{{ prefixo() }}{{ partes()[0] }}<small>,{{ partes()[1] }}</small></span
  >`,
})
export class Valor {
  readonly valor = input.required<number>();
  // Força o sinal: útil para despesas que vêm positivas do back.
  readonly negativar = input(false);
  readonly neutro = input(false);
  readonly moeda = input(false);

  protected readonly numero = computed(() => (this.negativar() ? -Math.abs(this.valor()) : this.valor()));
  protected readonly negativo = computed(() => this.numero() < 0);
  protected readonly sinal = computed(() => (this.negativo() ? '-' : ''));
  protected readonly prefixo = computed(() => (this.moeda() ? 'R$ ' : ''));
  protected readonly partes = computed(() => FORMATO.format(Math.abs(this.numero())).split(','));
}
