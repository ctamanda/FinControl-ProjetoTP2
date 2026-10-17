import { Component, input } from '@angular/core';

// Marca do FinControl: símbolo (anéis + barras amarelas + seta em alta) e nome.
// O SVG fica embutido para não depender do base href (GitHub Pages).
// Versões em arquivo: public/logo/fincontrol-simbolo-fundo-{claro,escuro}.svg
@Component({
  selector: 'app-logo',
  template: `
    <span class="logo" [class.pequeno]="pequeno()" [class.claro]="fundoClaro()">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="40" fill="none" [attr.stroke]="cor()" stroke-width="16" stroke-dasharray="76.8 174.5" transform="rotate(45 60 60)" />
        <circle cx="60" cy="60" r="40" fill="none" [attr.stroke]="cor()" stroke-opacity="0.72" stroke-width="16" stroke-dasharray="60 191.3" transform="rotate(163 60 60)" />
        <circle cx="60" cy="60" r="40" fill="none" [attr.stroke]="cor()" stroke-opacity="0.45" stroke-width="16" stroke-dasharray="40.5 210.8" transform="rotate(257 60 60)" />
        <rect x="64" y="68" width="9" height="10" rx="1.5" fill="#FACC15" />
        <rect x="77" y="60" width="9" height="18" rx="1.5" fill="#FACC15" />
        <rect x="90" y="52" width="9" height="26" rx="1.5" fill="#FACC15" />
        <polyline points="58,58 74,51 87,42 100.3,26.2" fill="none" [attr.stroke]="cor()" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        <polygon points="106,18 105.2,29.6 95.4,22.8" [attr.fill]="cor()" />
      </svg>
      <span class="nome">Fin<strong>Control</strong></span>
    </span>
  `,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-size: 28px;
      letter-spacing: -0.01em;
      line-height: 1;
    }
    .logo.claro {
      color: #3b1478;
    }
    svg {
      width: 1.45em;
      height: 1.45em;
    }
    .nome {
      font-weight: 400;
    }
    .nome strong {
      font-weight: 600;
      color: #facc15;
    }
    .claro .nome strong {
      color: inherit;
    }
    .pequeno {
      font-size: 18px;
      gap: 8px;
    }
  `,
})
export class Logo {
  readonly pequeno = input(false);
  // Fundo claro usa o símbolo roxo; o padrão (fundo roxo) usa o branco.
  readonly fundoClaro = input(false);

  protected cor(): string {
    return this.fundoClaro() ? '#3B1478' : '#FFFFFF';
  }
}
