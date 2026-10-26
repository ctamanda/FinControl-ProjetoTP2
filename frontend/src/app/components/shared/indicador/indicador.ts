import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type CorIndicador = 'roxo' | 'verde' | 'vermelho' | 'amarelo' | 'azul';

// Card de indicador: ícone redondo colorido, valor grande, rótulo e um detalhe opcional
// (variação "↗ 6,2% vs. mês anterior" ou um texto livre).
@Component({
  selector: 'app-indicador',
  imports: [MatIconModule, DecimalPipe],
  template: `
    <div class="indicador {{ cor() }}" [class.destaque]="destaque()">
      <span class="icone"><mat-icon>{{ icone() }}</mat-icon></span>
      <div class="textos">
        <strong class="valor">{{ valor() }}</strong>
        <span class="rotulo">{{ rotulo() }}</span>
        @if (variacao() !== null) {
          <span class="detalhe" [class.ruim]="ruim()">
            <mat-icon>{{ variacao()! >= 0 ? 'north_east' : 'south_east' }}</mat-icon>
            {{ abs() | number: '1.0-1' }}% vs. mês anterior
          </span>
        } @else if (detalhe()) {
          <span class="detalhe neutro">{{ detalhe() }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
      container-type: inline-size;
    }
    /* Card estreito (4 por linha ao lado da coluna lateral): ícone em cima do valor */
    @container (max-width: 250px) {
      .indicador {
        flex-direction: column;
        gap: 12px;
      }
      .detalhe {
        margin-top: 4px;
      }
    }
    .indicador {
      height: 100%;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 22px 20px;
      border-radius: 18px;
      background: var(--fc-surface);
      box-shadow: var(--fc-shadow);
    }
    .icone {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      background: var(--cor);
      color: #fff;
    }
    .textos {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .valor {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--cor-texto, var(--cor));
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .rotulo {
      font-size: 14px;
      color: var(--fc-muted);
    }
    .detalhe {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      margin-top: 6px;
      font-size: 13px;
      color: var(--fc-success);
    }
    .detalhe.ruim {
      color: var(--fc-danger);
    }
    .detalhe.neutro {
      color: var(--fc-muted);
    }
    .detalhe mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    .roxo { --cor: var(--fc-roxo-medio); }
    .verde { --cor: #15803d; }
    .vermelho { --cor: #d0343f; }
    .amarelo { --cor: var(--fc-amarelo); --cor-texto: var(--fc-text); }
    .amarelo .icone { color: var(--fc-roxo-escuro); }
    .azul { --cor: #2563c9; }

    /* Card cheio (roxo), como "Usuários ativos" no painel do administrador */
    .destaque {
      background: var(--fc-roxo);
      box-shadow: 0 16px 32px -20px rgba(59, 20, 120, 0.8);
      --cor-texto: #fff;
    }
    .destaque .rotulo {
      color: rgba(255, 255, 255, 0.8);
    }
    .destaque .detalhe {
      color: var(--fc-amarelo);
    }

    @media (max-width: 760px) {
      .indicador {
        padding: 18px 16px;
        gap: 12px;
      }
      .valor {
        font-size: 20px;
      }
      .icone {
        width: 40px;
        height: 40px;
      }
    }
  `,
})
export class Indicador {
  readonly icone = input.required<string>();
  readonly cor = input<CorIndicador>('roxo');
  readonly valor = input.required<string>();
  readonly rotulo = input.required<string>();
  readonly detalhe = input('');
  readonly variacao = input<number | null>(null);
  // Para despesas, subir é ruim (vermelho).
  readonly subirEhRuim = input(false);
  readonly destaque = input(false);

  protected readonly abs = computed(() => Math.abs(this.variacao() ?? 0));
  protected readonly ruim = computed(() => (this.variacao() ?? 0) > 0 === this.subirEhRuim() && this.variacao() !== 0);
}
