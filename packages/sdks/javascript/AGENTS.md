# AGENTS

Instructions for AI agents working in the JavaScript SDK package.

## Workflow

Run the package scripts from `packages/sdks/javascript` so the package-local ESLint and generator config is used:

- `make build-image`
- `make npm-ci`
- `make build-sdk-js`
- `make test`
- `make lint`
- `make npm ARGS=run lint:fix`

If the package adopts Vite+ tooling for linting or formatting, keep the package scripts simple:

- prefer `vp check` for lint gates
- prefer `vp check --fix` for auto-fix passes
- keep `vp fmt` as the explicit formatting entrypoint when the package needs it
- run these commands from the package directory so their local config is honored

Expect `vp check --fix` to touch many files when formatting rules change; keep the diff scoped to this package and avoid mixing in unrelated edits.

## Generated files

- Prefer editing source inputs and let generation drive changes to `src/api/generated`.
- For generated-file updates, run `npm run build-api-models`.
- Do not hand-edit generated outputs unless a change is explicitly requested and justified.

## Additional notes

- For non-docker local workflows, prefer package-level scripts and CI examples in CI workflows.
- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
- Do not use installer or build workarounds such as `--legacy-peer-deps` or `--force` or similar shortcuts for dependency conflicts. Fix the package constraints, lockfiles, or build inputs instead.
