import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { rotaInicial } from '../../core/acesso';
import { mensagemDeErro } from '../../core/api';
import { UsuarioService } from '../../core/usuario/usuario.service';
import { Modulo } from '../../models/usuario.model';
import { MODULOS_PESSOAIS } from '../configuracoes/configuracoes';
import { EtapasCadastro } from '../shared/etapas-cadastro/etapas-cadastro';
import { FundoAuth } from '../shared/fundo-auth/fundo-auth';
import { Logo } from '../shared/logo/logo';
import { SeletorModulos } from '../shared/seletor-modulos/seletor-modulos';

// Última etapa da entrada, logo depois do cadastro:
//  - conta pessoal escolhe as funcionalidades que quer usar;
//  - administrador da empresa vê os primeiros passos (equipe, categorias, lançamentos).
@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, EtapasCadastro, FundoAuth, Logo, SeletorModulos],
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

  protected readonly passos = [
    {
      icone: 'group_add',
      titulo: 'Monte sua equipe',
      texto: 'Cadastre quem ajuda na gestão e escolha o que cada um pode acessar.',
      rota: '/empresa/usuarios/novo',
      acao: 'Cadastrar usuário',
    },
    {
      icone: 'sell',
      titulo: 'Confira as categorias',
      texto: 'A empresa já começa com categorias de receita e despesa. Ajuste se quiser.',
      rota: '/categorias',
      acao: 'Ver categorias',
    },
    {
      icone: 'add_card',
      titulo: 'Faça o primeiro lançamento',
      texto: 'Registre uma venda ou uma despesa para o dashboard ganhar vida.',
      rota: '/transacoes/nova',
      acao: 'Novo lançamento',
    },
  ];

  entrar(): void {
    const u = this.usuario();
    if (!u) return;
    if (!this.pessoal()) {
      this.router.navigateByUrl(rotaInicial(u));
      return;
    }
    this.salvando.set(true);
    this.usuarios
      .atualizarPerfil({ nome: u.nome, telefone: u.telefone ?? '', profissao: u.profissao, modulos: this.modulos() })
      .subscribe({
        next: (atualizado) => this.router.navigateByUrl(rotaInicial(atualizado)),
        error: (error: HttpErrorResponse) => {
          this.salvando.set(false);
          this.erro.set(mensagemDeErro(error, 'Não foi possível salvar a configuração.'));
        },
      });
  }
}
