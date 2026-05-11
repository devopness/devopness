# AGENTS

Instructions for AI agents working in `packages/ui/react`.

## Workflow

Use the package scripts from `packages/ui/react`:

- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run storybook`
- `npm run build-storybook`
- `npm run format`

## Generated files

- Prefer editing source files under `src/` and let the package build or Storybook pipeline produce generated output.
- Do not hand-edit build artifacts such as `dist/` or `storybook-static/`.

## Package notes

- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
- Keep changes scoped to the package surface you are touching, especially shared components, icons, and test utilities.
