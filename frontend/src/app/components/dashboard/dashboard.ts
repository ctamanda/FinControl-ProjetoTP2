import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { DashboardPessoal } from './pessoal/dashboard-pessoal';

// Visão geral da conta pessoal (o SUPER_ADMIN usa o painel do administrador).
@Component({
  selector: 'app-dashboard',
  imports: [DashboardPessoal],
  template: `
    @if (perfil()?.role === 'PESSOAL') {
      <app-dashboard-pessoal />
    }
  `,
})
export class Dashboard {
  protected readonly perfil = inject(UsuarioService).perfil;
}
