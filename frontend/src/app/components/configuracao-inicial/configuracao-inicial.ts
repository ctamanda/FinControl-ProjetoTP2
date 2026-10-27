import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { rotaInicial } from '../../core/acesso';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { Modulo } from '../../models/usuario.model';
import { MODULOS_PESSOAIS } from '../configuracoes/configuracoes';
import { EtapasCadastro } from '../shared/etapas-cadastro/etapas-cadastro';
import { FundoAuth } from '../shared/fundo-auth/fundo-auth';
import { Logo } from '../shared/logo/logo';
import { SeletorModulos } from '../shared/seletor-modulos/seletor-modulos';

// Última etapa da entrada, logo depois do cadastro: a conta pessoal escolhe as funcionalidades
// que quer usar (o administrador do FinControl não passa por aqui: segue para o painel).
@Component({
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, EtapasCadastro, FundoAuth, Logo, SeletorModulos],
  selector: 'app-configuracao-inicial',
  styleUrls: ['../auth/auth.css', './configuracao-inicial.css'],
  templateUrl: './configuracao-inicial.html',
})
export class ConfiguracaoInicial {
  private readonly usuarios = inject(UsuarioService);
  private readonly router = inject(Router);

  protected readonly usuario = this.usuarios.perfil;
  protected readonly pessoal = computed(() => this.usuario()?.role === 'PESSOAL');
  protected readonly primeiroNome = computed(() => (this.usuario()?.nome ?? '').split(' ')[0]);
  protected readonly opcoes = MODULOS_PESSOAIS;
  protected readonly modulos = signal<Modulo[]>(this.usuario()?.modulos ?? MODULOS_PESSOAIS);
  protected readonly salvando = signal(false);
  protected readonly erro = signal('');

  entrar(): void {
    const u = this.usuario();
    if (!u) return;
    if (!this.pessoal()) {
      this.router.navigateByUrl(rotaInicial(u));
      return;
    }
    this.salvando.set(true);
    this.usuarios
      .atualizarModulos(this.modulos())
      .subscribe({
        next: (atualizado) => this.router.navigateByUrl(rotaInicial(atualizado)),
        error: (error: HttpErrorResponse) => {
          this.salvando.set(false);
          this.erro.set(mensagemDeErro(error, 'Não foi possível salvar a configuração.'));
        },
      });
  }
}
