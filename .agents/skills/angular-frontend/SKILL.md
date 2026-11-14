---
name: angular-frontend
description: Diretrizes consolidadas para implementação e revisão do frontend em Angular 22+, cobrindo componentes standalone, formulários reativos, rotas, guards e consumo tipado de APIs REST.
---

# Governança de Frontend — Angular Standalone (FinControl)

Esta skill estabelece os padrões técnicos, boas práticas arquiteturais e diretrizes de desenvolvimento para a camada de frontend do **FinControl** em Angular 22+.

---

## 1. Objetivo da Skill

Orientar a criação, refatoração e revisão de componentes standalone, serviços de comunicação HTTP, formulários reativos, modelos tipados TypeScript, guards de rota e injeção de dependências no Angular.

---

## 2. Quando Usar

Utilize esta skill sempre que a tarefa envolver:
- Criação ou modificação de páginas, componentes ou diálogos no Angular.
- Configuração e proteção de rotas (`app.routes.ts`) com guards de autenticação e perfis.
- Desenvolvimento e validação de formulários reativos (`ReactiveFormsModule`).
- Criação de serviços de integração HTTP (`HttpClient`) para consumir os endpoints do Quarkus.
- Modelagem de interfaces e tipos TypeScript de entrada e saída correspondentes aos DTOs do backend.

---

## 3. Diretrizes de Execução

### 3.1. Angular Standalone Obrigatório
- Todos os componentes, diretivas e pipes devem ser configurados como standalone:
  ```typescript
  @Component({
    selector: 'app-transacao-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './transacao-form.component.html',
    styleUrl: './transacao-form.component.scss'
  })
  export class TransacaoFormComponent { ... }
  ```
- O uso de `NgModule` legado é terminantemente vetado.
- Injeção de dependências moderna: preferir a função `inject(Servico)` ou injeção explícita no construtor.

### 3.2. Formulários Reativos e Validações
- Todo formulário deve ser construído utilizando `ReactiveFormsModule` (`FormBuilder`, `FormGroup`, `FormControl`).
- As regras de validação no frontend devem espelhar as validações do backend documentadas em `docs/REGRAS_NEGOCIO.md`:
  - `nome`: obrigatório, limite de 60 ou 100 caracteres.
  - `valor`: numérico estritamente positivo (`> 0`).
  - `data`: obrigatória, formato de data válido.
  - `email`: formato RFC válido, máximo de 254 caracteres.
  - `telefone`: formato brasileiro com DDD (10 ou 11 dígitos).
  - `password`: critérios de senha forte (mínimo 6 caracteres, maiúscula, minúscula, número e caractere especial).
- Erros de validação devem ser associados ao controle visual via `mat-error`.

### 3.3. Consumo Tipado de APIs HTTP
- O consumo de APIs deve ser centralizado em serviços Angular (`@Injectable({ providedIn: 'root' })`).
- Toda requisição e resposta deve utilizar modelos e interfaces TypeScript estritamente tipadas, sem o uso de `any`:
  ```typescript
  @Injectable({ providedIn: 'root' })
  export class TransacaoService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/transacoes`;

    buscar(filtro: TransacaoFiltro, page = 0, pageSize = 10): Observable<PageResponse<TransacaoResponse>> {
      let params = new HttpParams().set('page', page).set('pageSize', pageSize);
      // mapeamento de filtros...
      return this.http.get<PageResponse<TransacaoResponse>>(this.apiUrl, { params });
    }
  }
  ```

---

## 4. Restrições Críticas (Inegociáveis)

> [!CAUTION]
> 1. **Proibição de inventar endpoints ou propriedades JSON:** As chamadas HTTP devem refletir com exatidão os endpoints disponíveis no Swagger/OpenAPI do backend (`http://localhost:8080/q/swagger-ui`). Nunca crie rotas ou campos no frontend que não existam no backend.
> 2. **Proibido usar `NgModule`:** Novos módulos do padrão legado do Angular não devem ser introduzidos. A arquitetura é 100% standalone.
> 3. **Frontend não substitui o backend:** A autoridade de segurança, validação de regras de saldo e bloqueios de exclusão residem no backend. O frontend apenas fornece a melhor experiência de usuário.
