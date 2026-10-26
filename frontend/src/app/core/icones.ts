import { TipoCategoria } from '../models/categoria.model';

// Ícones (Material Icons) oferecidos para as categorias, agrupados para a escolha ficar fácil.
export const ICONES_CATEGORIA: { grupo: string; icones: { nome: string; rotulo: string }[] }[] = [
  {
    grupo: 'Dia a dia',
    icones: [
      { nome: 'restaurant', rotulo: 'Alimentação' },
      { nome: 'shopping_cart', rotulo: 'Mercado' },
      { nome: 'delivery_dining', rotulo: 'Delivery' },
      { nome: 'local_cafe', rotulo: 'Café' },
      { nome: 'home', rotulo: 'Moradia' },
      { nome: 'bolt', rotulo: 'Energia' },
      { nome: 'water_drop', rotulo: 'Água' },
      { nome: 'wifi', rotulo: 'Internet' },
      { nome: 'smartphone', rotulo: 'Celular' },
      { nome: 'checkroom', rotulo: 'Roupas' },
      { nome: 'content_cut', rotulo: 'Beleza' },
      { nome: 'pets', rotulo: 'Pets' },
    ],
  },
  {
    grupo: 'Transporte e lazer',
    icones: [
      { nome: 'directions_car', rotulo: 'Carro' },
      { nome: 'local_gas_station', rotulo: 'Combustível' },
      { nome: 'directions_bus', rotulo: 'Ônibus' },
      { nome: 'local_taxi', rotulo: 'Táxi/app' },
      { nome: 'flight', rotulo: 'Viagem' },
      { nome: 'sports_esports', rotulo: 'Lazer' },
      { nome: 'movie', rotulo: 'Cinema' },
      { nome: 'fitness_center', rotulo: 'Academia' },
      { nome: 'subscriptions', rotulo: 'Assinaturas' },
      { nome: 'card_giftcard', rotulo: 'Presentes' },
    ],
  },
  {
    grupo: 'Saúde e educação',
    icones: [
      { nome: 'favorite', rotulo: 'Saúde' },
      { nome: 'medication', rotulo: 'Farmácia' },
      { nome: 'school', rotulo: 'Educação' },
      { nome: 'menu_book', rotulo: 'Livros' },
      { nome: 'child_care', rotulo: 'Filhos' },
    ],
  },
  {
    grupo: 'Trabalho e finanças',
    icones: [
      { nome: 'payments', rotulo: 'Salário' },
      { nome: 'work', rotulo: 'Freela' },
      { nome: 'storefront', rotulo: 'Vendas' },
      { nome: 'handyman', rotulo: 'Serviços' },
      { nome: 'trending_up', rotulo: 'Investimentos' },
      { nome: 'savings', rotulo: 'Reserva' },
      { nome: 'account_balance', rotulo: 'Impostos/banco' },
      { nome: 'receipt_long', rotulo: 'Contas' },
      { nome: 'local_shipping', rotulo: 'Fornecedores' },
      { nome: 'campaign', rotulo: 'Marketing' },
      { nome: 'computer', rotulo: 'Tecnologia' },
      { nome: 'category', rotulo: 'Outros' },
    ],
  },
];

// Ícone quando a categoria não tem um escolhido.
export function iconePadrao(tipo: TipoCategoria | undefined): string {
  return tipo === 'RECEITA' ? 'payments' : 'sell';
}
