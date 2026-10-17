import { Component, computed, input } from '@angular/core';
import { REGRAS_SENHA } from '../../../core/validadores';

// Lista das regras de senha, marcando em verde (em tempo real) as que já foram atendidas.
// Usa as classes .requisitos do styles.css global.
@Component({
  selector: 'app-requisitos-senha',
  template: `
    <div class="requisitos" aria-live="polite">
      Por segurança, a senha deve ter
      <ul>
        @for (r of regras(); track r.rotulo) {
          <li [class.ok]="r.ok">{{ r.rotulo }}</li>
        }
        <li [class.ok]="confirmada()">A confirmação igual à senha</li>
      </ul>
    </div>
  `,
})
export class RequisitosSenha {
  readonly senha = input('');
  readonly confirmacao = input('');

  protected readonly regras = computed(() =>
    REGRAS_SENHA.map((r) => ({ rotulo: r.rotulo, ok: r.atende(this.senha() ?? '') })),
  );
  protected readonly confirmada = computed(() => !!this.senha() && this.senha() === this.confirmacao());
}
