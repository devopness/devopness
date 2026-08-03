## Objetivo
Modernizar as 4 páginas de operação de configuração de arquivos em `docs/docs/files/` para seguirem as diretrizes de autoria (`docs/docs/authoring-guidelines.md`), eliminando as inconsistências com os demais guias já atualizados (ex: `applications/*`).

## Arquivos a modificar
1. `docs/docs/files/add-file.md`
2. `docs/docs/files/edit-file.md`
3. `docs/docs/files/view-file.md`
4. `docs/docs/files/remove-file.md`

(`files/index.md` fica fora do escopo, conforme decisão do usuário.)

## O que muda em cada página
- Remover o campo `intro` do frontmatter (proibido pela seção 2 da diretriz)
- Corrigir o link quebrado `[/docs/applications/deploy-application]` → `[Deploy Application](/docs/applications/deploy-application)`
- Substituir os passos de navegação numerados no topo por estrutura outcome-driven:
  - `add-file.md`/`edit-file.md`: `## Goal` → `## Prerequisites` (quando aplicar) → `## What you need` → `## Using Devopness MCP` → `## After you save` → `## Verify` → `## Common issues` → `## What to do next`
  - `view-file.md`: `## Goal` → `## What you see` → `## Using Devopness MCP` (ou nota) → `## Verify` → `## Common issues` → `## What to do next`
  - `remove-file.md`: `## Goal` → `## What you need` → `## Using Devopness MCP` → `## After you remove` → `## Verify` → `## Common issues` → `## What to do next`
- Manter `required_permissions` onde já existe (`application:update` para add/edit/remove; `application:read` para view)
- Adicionar `## Verify` com sinal de sucesso observável e `## Common issues` com sintomas concretos
- Adicionar seção `## Using Devopness MCP` com exemplos de prompts nomeando ambiente/projeto/recurso e nota de que um redeploy aplica as mudanças
- Manter mensagem de "um novo deploy é necessário para as mudanças valerem" na seção de follow-up

## Estilo
- Frase de abertura com o resultado da ação
- Voz direta ("you"), exemplos concretos (`.env`, `acme/api`)
- Bullets curtos sem pontuação final
- Sem em dashes grudados; preferir dois-pontos

## Verificação
- Rodar `npm run lint` a partir de `docs/` (vite-plus check) para validar formatação, conforme AGENTS.md
- Conferir que os links relativos continuam válidos