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

## PR instructions
- Root AGENTS provides repository-wide behavior; use it first.
- For PR mechanics and validation, follow:
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/workflows/pr-lint.yml`
  - `.github/scripts/pr-validate-description.js`
