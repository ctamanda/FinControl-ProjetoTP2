import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TipoConta } from '../../../models/usuario.model';

// Trilha do cadastro, igual em todas as telas da entrada:
// Pessoal: Tipo · Cadastro · Perfil · Configuração
// MEI/Microempresa: Tipo · Cadastro · Perfil · Empresa · Configuração
@Component({
  imports: [MatIconModule],
  selector: 'app-etapas-cadastro',
  template: `
    <ol class="etapas" aria-label="Etapas do cadastro">
      @for (e of etapas(); track e; let i = $index) {
        <li [class.feita]="i < atual()" [class.atual]="i === atual()" [attr.aria-current]="i === atual() ? 'step' : null">
          <span class="bolinha">
            @if (i < atual()) {
              <mat-icon>check</mat-icon>
            } @else {
              {{ i + 1 }}
            }
          </span>
          <span class="nome">{{ e }}</span>
        </li>
      }
    </ol>
  `,
  styles: `
    .etapas {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 6px;
      padding: 0;
      margin: 0 0 22px;
    }
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
      max-width: 84px;
      position: relative;
    }
    li + li::before {
      content: '';
      position: absolute;
      top: 13px;
      right: calc(50% + 16px);
      width: calc(100% - 26px);
      height: 2px;
      background: #e1e4e8;
    }
    li.feita + li::before,
    li.feita + li.atual::before {
      background: var(--fc-primary);
    }
    .bolinha {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 600;
      background: #eef0f2;
      color: #8a9199;
    }
    .bolinha mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .feita .bolinha {
      background: var(--fc-primary);
      color: #fff;
    }
    .atual .bolinha {
      background: var(--fc-amarelo);
      color: var(--fc-roxo-escuro);
      box-shadow: 0 0 0 4px #fff3c4;
    }
    .nome {
      font-size: 11px;
      color: #8a9199;
    }
    .atual .nome {
      color: var(--fc-text);
      font-weight: 500;
    }
  `,
})
export class EtapasCadastro {
  readonly tipo = input<TipoConta>('PESSOAL');
  readonly atual = input(0);

  protected readonly etapas = computed(() =>
    this.tipo() === 'EMPRESA'
      ? ['Tipo', 'Cadastro', 'Perfil', 'Empresa', 'Configuração']
      : ['Tipo', 'Cadastro', 'Perfil', 'Configuração'],
  );
}
