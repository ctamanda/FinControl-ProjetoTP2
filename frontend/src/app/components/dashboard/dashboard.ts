import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { DashboardColaborador } from './colaborador/dashboard-colaborador';
import { DashboardEmpresa } from './empresa/dashboard-empresa';
import { DashboardPessoal } from './pessoal/dashboard-pessoal';

// Visão geral de cada tipo de conta: pessoal, administrador da empresa (MEI/ME) ou colaborador.
@Component({
  selector: 'app-dashboard',
  imports: [DashboardPessoal, DashboardEmpresa, DashboardColaborador],
  template: `
    @switch (perfil()?.role) {
      @case ('ADMIN_EMPRESA') {
        <app-dashboard-empresa />
      }
      @case ('USUARIO_EMPRESA') {
        <app-dashboard-colaborador />
      }
      @case ('PESSOAL') {
        <app-dashboard-pessoal />
      }
    }
  `,
})
export class Dashboard {
  protected readonly perfil = inject(UsuarioService).perfil;
}
