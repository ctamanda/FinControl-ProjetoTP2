import { Component } from '@angular/core';

// Fundo decorativo (roxo) do login/cadastro: formas suaves, moedas e um gráfico em alta.
@Component({
  selector: 'app-fundo-auth',
  template: `
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="brilho" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#6d3cc9" stop-opacity=".55" />
          <stop offset="100%" stop-color="#6d3cc9" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="linha" x1="0" x2="1">
          <stop offset="0%" stop-color="#facc15" stop-opacity="0" />
          <stop offset="60%" stop-color="#facc15" stop-opacity=".55" />
          <stop offset="100%" stop-color="#facc15" stop-opacity=".9" />
        </linearGradient>
      </defs>

      <circle cx="180" cy="160" r="320" fill="url(#brilho)" />
      <circle cx="1300" cy="780" r="380" fill="url(#brilho)" />

      <!-- gráfico em alta atravessando a tela -->
      <path
        d="M-20 760 C 160 720, 240 640, 380 660 S 600 560, 720 590 S 940 440, 1080 470 S 1300 300, 1460 260"
        fill="none" stroke="url(#linha)" stroke-width="3" stroke-linecap="round"
      />
      <g fill="#facc15">
        <circle cx="380" cy="660" r="6" opacity=".5" />
        <circle cx="720" cy="590" r="6" opacity=".6" />
        <circle cx="1080" cy="470" r="6" opacity=".75" />
        <circle cx="1380" cy="285" r="7" />
      </g>

      <!-- barras discretas -->
      <g fill="#ffffff" opacity=".05">
        <rect x="90" y="560" width="34" height="340" rx="10" />
        <rect x="140" y="480" width="34" height="420" rx="10" />
        <rect x="190" y="620" width="34" height="280" rx="10" />
        <rect x="1210" y="120" width="34" height="250" rx="10" />
        <rect x="1260" y="60" width="34" height="310" rx="10" />
        <rect x="1310" y="170" width="34" height="200" rx="10" />
      </g>

      <!-- moedas flutuando -->
      <g>
        <circle cx="1150" cy="640" r="26" fill="#facc15" opacity=".18" />
        <circle cx="1150" cy="640" r="17" fill="none" stroke="#facc15" stroke-width="2" opacity=".35" />
        <circle cx="300" cy="300" r="18" fill="#facc15" opacity=".15" />
        <circle cx="300" cy="300" r="11" fill="none" stroke="#facc15" stroke-width="2" opacity=".3" />
        <circle cx="980" cy="160" r="12" fill="#ffffff" opacity=".1" />
        <circle cx="520" cy="820" r="14" fill="#ffffff" opacity=".08" />
      </g>
    </svg>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background: linear-gradient(160deg, #2e0f60 0%, #3b1478 45%, #4c1d95 100%);
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class FundoAuth {}
