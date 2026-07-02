# AGENTS

Instructions for AI agents working in the Python SDK package.

## Workflow

Run the package commands from `packages/sdks/python` so the local Makefile and Python tooling are used:

- `make build-image`
- `make build-sdk-python`
- `make lint`
- `make format`
- `make test-unit`

## Generated files

- Generated code paths include `src/devopness/generated` and model files created by `make build-sdk-python`.
- Do not hand-edit generated files.
- Regenerate generated outputs when source specs or generation config changes.

## Additional notes

- Follow [`packages/sdks/common/AGENTS.md`](../common/AGENTS.md) for shared artifact rules.
- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
