# AGENTS

Instructions for AI agents working in `packages/ui/react`.

## Workflow

Run the package scripts from `packages/ui/react` so the local ESLint, Prettier, and TypeScript config is used:

- `npm run build`
- `npm run lint`
- `npm run lint:fix`
- `npm run test`
- `npm run storybook`
- `npm run build-storybook`
- `npm run format`

## Changesets (REQUIRED for package changes)

**IMPORTANT:** Changes to this package require a changeset or the PR will fail CI checks.

From the repository root, run:

```bash
npx @changesets/cli
```

Follow the prompts to:

1. Select `@devopness/ui-react` as the changed package
2. Choose bump type:
   - **patch** (0.0.x): bug fixes, documentation updates, internal refactors
   - **minor** (0.x.0): new features, new components, non-breaking API additions
   - **major** (x.0.0): breaking changes (rare - discuss with maintainers first)
3. Write a user-facing summary of the change

This creates a file in `.changeset/` that MUST be included in your PR.

**When to skip:** Only skip if your changes don't affect the published package (e.g., editing this AGENTS.md file, updating Storybook config without changing components).

## Generated files

- Prefer editing source files under `src/` and let the package build or Storybook pipeline produce generated output.
- Do not hand-edit build artifacts such as `dist/` or `storybook-static/`.

## Package notes

- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
- Keep changes scoped to the package surface you are touching, especially shared components, icons, and test utilities.
