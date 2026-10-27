# Contribuindo para este projeto

## 📌 Como contribuir

1. **Clone** este repositório ou abra no codespaces.
2. Crie uma nova branch:

   ```bash
   git checkout -b minha-feature
   ```
3. Faça suas alterações e o **commit** seguindo o padrão de mensagens (veja abaixo).

* `feat:` para novas funcionalidades.
* `fix:` para correções de bugs.
* `docs:` para alterações na documentação.
* `style:` para mudanças de formatação/estilo sem impacto no código.
* `refactor:` para refatorações.
* `test:` para adição ou modificação de testes.
* `chore:` para tarefas gerais de manutenção.

  **Exemplo:**

  ```
  feat: adicionar endpoint de autenticação
  fix: corrigir bug no cálculo de estoque
  docs: atualizar instruções de instalação
  ```

5. Antes de enviar, execute:

   ```bash
   bun run test
   bun run lint
   bun run format
   ```

6. Envie a branch para o seu fork:

   ```bash
   git push origin minha-feature
   ```
7. Abra um **Pull Request (PR)** para a branch `main` deste repositório.

---

## ✅ Boas práticas de código

* **Padrão de arquivos:** usar `kebab-case` para nomes, ex.: `novo-arquivo.ts`, `novo-arquivo.tsx`.
* No **frontend**, não usar `export default`, sempre `export` nomeado.
* Sempre usar as requisições geradas pelo **Orval**, através do `@tanstack/query`.
* Onde houver lista de dados, usar **tabela com `@tanstack/table`**.
* Não usar **ilustrações da internet**. Se necessário, usar **ícones**.
* Sempre que for mostrar **tempo relativo** (ex: "Há 1 minuto"), usar o componente `IntervalUpdater`:

  ```tsx
  <IntervalUpdater interval="1s">
    {() => dayjs('2025-08-05T12:29:00').fromNow()}
  </IntervalUpdater>
  ```
* Imagens devem ficar em `src/assets/img` e ser importadas via `import`.
* Não usar `@ApiProperty`. Use os **decoradores customizados** já criados.
* Se um campo aceitar `null`, marcar como `nullable` no decorator.
* Para **string obrigatória**, usar `ApiNonEmptyStringProperty` + `MinLength(1)`.
* Se usar `minLength` ou `maxLength`, declarar no decorator para gerar o **zod** no frontend.
* Preferir usar ícones da biblioteca **`react-icons/ri`**.
* Ao utilizar formulários, preferir usar os componentes prontos em `src/components/fields/common/basic-fields.tsx`

## 🔍 Revisão de Pull Requests

* Todo PR passará por revisão antes de ser aprovado.

## 💬 Dúvidas e suporte

Caso tenha dúvidas:

* Abra uma **Issue** descrevendo o problema ou sugestão.
* Reporte diretamente no **canal do Discord** do projeto.
