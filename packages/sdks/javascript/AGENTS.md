# AGENTS

Instructions for AI agents working in the JavaScript SDK package.

## Workflow

From `packages/sdks/javascript`, use these package scripts:

- `make build-image`
- `make npm-ci`
- `make build-sdk-js`
- `make test`
- `make lint`

## Generated files

- Prefer editing source inputs and let generation drive changes to `src/api/generated`.
- For generated-file updates, run `npm run build-api-models`.
- Do not hand-edit generated outputs unless a change is explicitly requested and justified.

## Additional notes

- For non-docker local workflows, prefer package-level scripts and CI examples in CI workflows.
- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
