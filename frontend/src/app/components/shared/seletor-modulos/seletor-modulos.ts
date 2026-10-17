import { Component, computed, input, model } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MODULOS, Modulo } from '../../../models/usuario.model';

// Escolha das funcionalidades (módulos): as que já têm tela em cartões com interruptor;
// as "em breve" num grupo compacto (já podem ser liberadas, ficam prontas quando a tela chegar).
@Component({
  imports: [MatIconModule],
  selector: 'app-seletor-modulos',
  template: `
    <div class="grupo" role="group" [attr.aria-label]="rotulo()">
      @for (m of disponiveis(); track m) {
        <label class="cartao" [class.marcado]="selecionados().includes(m)">
          <span class="icone"><mat-icon>{{ info[m].icone }}</mat-icon></span>
          <span class="texto">
            <strong>{{ info[m].rotulo }}</strong>
            <small>{{ info[m].descricao }}</small>
          </span>
          <input
            type="checkbox"
            class="interruptor"
            [checked]="selecionados().includes(m)"
            [disabled]="desabilitado()"
            (change)="alternar(m)"
          />
        </label>
      }
    </div>

    @if (emBreve().length) {
      <p class="titulo-breve"><mat-icon>schedule</mat-icon> Em breve</p>
      <div class="breve">
        @for (m of emBreve(); track m) {
          <label class="chip-modulo" [class.marcado]="selecionados().includes(m)" [title]="info[m].descricao">
            <input type="checkbox" [checked]="selecionados().includes(m)" [disabled]="desabilitado()" (change)="alternar(m)" />
            <mat-icon>{{ info[m].icone }}</mat-icon>{{ info[m].rotulo }}
          </label>
        }
      </div>
    }
  `,
  styles: `
    .grupo {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
    }
    .cartao {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--fc-border);
      border-radius: 12px;
      background: #fff;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cartao.marcado {
      border-color: var(--fc-primary);
      box-shadow: 0 0 0 3px var(--fc-roxo-claro);
    }
    .icone {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--fc-roxo-claro);
      color: var(--fc-primary);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .texto {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .texto strong {
      font-size: 14px;
      font-weight: 500;
    }
    .texto small {
      font-size: 12px;
      color: var(--fc-muted);
    }
    /* Interruptor (toggle) feito com o próprio checkbox */
    .interruptor {
      appearance: none;
      width: 38px;
      height: 22px;
      border-radius: 999px;
      background: #d4d8dc;
      position: relative;
      cursor: pointer;
      flex-shrink: 0;
      margin: 0;
      transition: background 0.15s;
    }
    .interruptor::after {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      transition: transform 0.15s;
    }
    .interruptor:checked {
      background: var(--fc-primary);
    }
    .interruptor:checked::after {
      transform: translateX(16px);
    }
    .interruptor:focus-visible {
      outline: 2px solid var(--fc-primary);
      outline-offset: 2px;
    }
    .titulo-breve {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 18px 0 8px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #9aa1a8;
    }
    .titulo-breve mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .breve {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .chip-modulo {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px 6px 8px;
      border: 1px solid var(--fc-border);
      border-radius: 999px;
      font-size: 13px;
      color: var(--fc-muted);
      background: #fff;
      cursor: pointer;
    }
    .chip-modulo.marcado {
      border-color: var(--fc-primary);
      color: var(--fc-primary);
      background: var(--fc-roxo-claro);
    }
    .chip-modulo input {
      accent-color: var(--fc-primary);
      margin: 0;
    }
    .chip-modulo mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `,
})
export class SeletorModulos {
  readonly opcoes = input.required<Modulo[]>();
  readonly selecionados = model<Modulo[]>([]);
  readonly desabilitado = input(false);
  readonly rotulo = input('Funcionalidades');

  protected readonly info = MODULOS;
  protected readonly disponiveis = computed(() => this.opcoes().filter((m) => MODULOS[m].disponivel));
  protected readonly emBreve = computed(() => this.opcoes().filter((m) => !MODULOS[m].disponivel));

  protected alternar(modulo: Modulo): void {
    const atuais = this.selecionados();
    this.selecionados.set(
      atuais.includes(modulo) ? atuais.filter((m) => m !== modulo) : this.opcoes().filter((m) => m === modulo || atuais.includes(m)),
    );
  }
}
