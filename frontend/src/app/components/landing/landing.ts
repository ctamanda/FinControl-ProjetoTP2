import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Logo } from '../shared/logo/logo';

interface Recurso {
  icone: string;
  titulo: string;
  texto: string;
}

// Página pública de apresentação do FinControl.
@Component({
  imports: [RouterLink, MatButtonModule, MatIconModule, Logo],
  selector: 'app-landing',
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly auth = inject(AuthService);
  protected readonly menuAberto = signal(false);
  protected readonly logado = this.auth.isLoggedIn();
  protected readonly ano = new Date().getFullYear();

  protected readonly recursos: Recurso[] = [
    {
      icone: 'swap_vert',
      titulo: 'Receitas e despesas',
      texto: 'Lance entradas e saídas em segundos e acompanhe tudo em uma lista com filtro e busca.',
    },
    {
      icone: 'sell',
      titulo: 'Categorias com cor',
      texto: 'Comece com 6 categorias prontas e crie as suas. Cada uma com cor própria nos gráficos.',
    },
    {
      icone: 'insights',
      titulo: 'Visão geral do mês',
      texto: 'Saldo, receitas, despesas e comparação com o mês anterior logo na primeira tela.',
    },
    {
      icone: 'storefront',
      titulo: 'Pessoal x empresa',
      texto: 'Separe o que é da casa e o que é do negócio, sem misturar as contas.',
    },
  ];

  protected readonly tecnologias = ['Quarkus', 'Java', 'PostgreSQL', 'Angular', 'JWT', 'Flyway'];

  // Rola até a seção sem usar href="#...", que com o base href do Pages recarregaria a página.
  rolar(id: string): void {
    this.menuAberto.set(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
