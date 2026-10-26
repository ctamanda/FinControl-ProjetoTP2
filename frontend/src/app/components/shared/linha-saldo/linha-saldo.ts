import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';

// Saldo do mês em três pontos: início do mês → saldo atual → previsto para o fim do mês.
// No computador é um card roxo vertical; no celular, uma linha horizontal num card branco.
@Component({
  selector: 'app-linha-saldo',
  imports: [CurrencyPipe],
  template: `
    <div class="saldo" role="group" aria-label="Saldo do mês">
      <div class="ponto inicio">
        <strong>{{ inicio() | currency: 'BRL' }}</strong>
        <span>Início do mês</span>
      </div>
      <div class="ponto atual">
        <strong>{{ atual() | currency: 'BRL' }}</strong>
        <span>Saldo atual</span>
      </div>
      <div class="ponto previsto">
        <strong>{{ previsto() | currency: 'BRL' }}</strong>
        <span>Previsto<span class="so-computador"> para {{ fimDoMes() }}</span></span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .saldo {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 30px;
      padding: 32px 32px 32px 68px;
      border-radius: 20px;
      background: var(--fc-roxo);
      color: #fff;
      box-shadow: 0 16px 32px -20px rgba(59, 20, 120, 0.8);
    }
    /* linha que liga os pontos */
    .saldo::before {
      content: '';
      position: absolute;
      left: 38px;
      top: 44px;
      bottom: 44px;
      width: 2px;
      background: rgba(255, 255, 255, 0.3);
    }
    .ponto {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .ponto::before {
      content: '';
      position: absolute;
      left: -37px;
      top: 4px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      box-sizing: border-box;
    }
    .ponto strong {
      font-size: 18px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .ponto span {
      font-size: 13px;
      opacity: 0.85;
    }
    .inicio::before {
      background: #c4b5fd;
    }
    .atual::before {
      top: 12px;
      background: var(--fc-amarelo);
      box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.3);
    }
    .atual strong {
      font-size: 32px;
      color: var(--fc-amarelo);
    }
    .previsto::before {
      border: 2px solid #fff;
      background: var(--fc-roxo);
    }

    @media (max-width: 760px) {
      .saldo {
        flex-direction: row;
        align-items: flex-start;
        gap: 4px;
        padding: 22px 12px 20px;
        background: var(--fc-surface);
        color: var(--fc-text);
        box-shadow: 0 8px 24px -12px rgba(20, 6, 45, 0.25);
        text-align: center;
      }
      .saldo::before {
        left: 16.6%;
        right: 16.6%;
        top: 29px;
        bottom: auto;
        width: auto;
        height: 2px;
        background: linear-gradient(90deg, var(--fc-roxo) 50%, #e3e1ea 50%);
      }
      .ponto {
        flex: 1;
        min-width: 0;
        padding-top: 30px;
      }
      .ponto::before,
      .atual::before {
        left: 50%;
        top: 0;
        transform: translateX(-50%);
      }
      .ponto strong {
        font-size: 13px;
      }
      .ponto span {
        font-size: 12px;
        color: var(--fc-muted);
        opacity: 1;
      }
      .inicio::before {
        background: var(--fc-roxo);
        width: 16px;
        height: 16px;
      }
      .atual::before {
        width: 18px;
        height: 18px;
      }
      .atual strong {
        font-size: 18px;
        color: var(--fc-roxo);
      }
      .previsto::before {
        border-color: #b9b6c3;
        background: #fff;
        width: 16px;
        height: 16px;
      }
    }
  `,
})
export class LinhaSaldo {
  readonly inicio = input.required<number>();
  readonly atual = input.required<number>();
  readonly previsto = input.required<number>();
  readonly fimDoMes = input(''); // 'dd/MM'
}
