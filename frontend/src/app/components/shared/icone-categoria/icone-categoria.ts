import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { iconePadrao } from '../../../core/icones';
import { Categoria } from '../../../models/categoria.model';

// Ícone da categoria num círculo com a cor dela (estilo app do iPhone).
@Component({
  selector: 'app-icone-categoria',
  imports: [MatIconModule],
  template: `
    <span class="circulo" [style.--cor]="cor()" [style.width.px]="tamanho()" [style.height.px]="tamanho()">
      <mat-icon [style.font-size.px]="tamanho() * 0.55" [style.width.px]="tamanho() * 0.55" [style.height.px]="tamanho() * 0.55">{{ icone() }}</mat-icon>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
    .circulo {
      border-radius: 50%;
      display: grid;
      place-items: center;
      /* fundo claro da própria cor + ícone na cor cheia */
      background: color-mix(in srgb, var(--cor) 16%, white);
      color: var(--cor);
    }
  `,
})
export class IconeCategoria {
  readonly categoria = input<Categoria | undefined | null>(null);
  readonly tamanho = input(36);

  protected readonly icone = computed(() => this.categoria()?.icone || iconePadrao(this.categoria()?.tipo));
  protected readonly cor = computed(
    () => this.categoria()?.cor || (this.categoria()?.tipo === 'RECEITA' ? '#15803d' : '#3b1478'),
  );
}
