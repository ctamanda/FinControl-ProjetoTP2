import { Component, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ICONES_CATEGORIA } from '../../../core/icones';

// Grade de ícones para escolher o da categoria (two-way: [(icone)]).
@Component({
  selector: 'app-seletor-icone',
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <div class="seletor" role="radiogroup" aria-label="Ícone da categoria">
      @for (g of grupos; track g.grupo) {
        <span class="grupo">{{ g.grupo }}</span>
        <div class="grade">
          @for (i of g.icones; track i.nome) {
            <button
              type="button"
              role="radio"
              class="opcao-icone"
              [class.escolhido]="icone() === i.nome"
              [attr.aria-checked]="icone() === i.nome"
              [attr.aria-label]="i.rotulo"
              [matTooltip]="i.rotulo"
              [style.--cor]="cor()"
              (click)="icone.set(i.nome)"
            >
              <mat-icon>{{ i.nome }}</mat-icon>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .seletor {
      max-height: 280px;
      overflow-y: auto;
      padding: 4px 14px 12px;
      border-radius: 16px;
      background: var(--fc-campo);
    }
    .grupo {
      display: block;
      margin: 10px 0 6px;
      font-size: 12px;
      color: var(--fc-muted);
    }
    .grade {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
      gap: 6px;
    }
    .opcao-icone {
      aspect-ratio: 1;
      border: none;
      border-radius: 12px;
      background: #fff;
      color: #5b5b66;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: transform 0.1s, background 0.15s;
    }
    .opcao-icone:hover {
      transform: scale(1.06);
    }
    .opcao-icone.escolhido {
      background: var(--cor);
      color: #fff;
      box-shadow: 0 4px 12px -4px var(--cor);
    }
  `,
})
export class SeletorIcone {
  readonly icone = model<string | null>(null);
  readonly cor = input('#3b1478');
  protected readonly grupos = ICONES_CATEGORIA;
}
