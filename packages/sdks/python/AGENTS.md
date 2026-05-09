# AGENTS

Instructions for AI agents working in the Python SDK package.

## Workflow

From `packages/sdks/python`, run:

- `make build-image`
- `make build-sdk-python`
- `make lint`
- `make test-unit`

## Generated files

- Generated code paths include `src/devopness/generated` and model files created by `make build-sdk-python`.
- Do not hand-edit generated files.
- Regenerate generated outputs when source specs or generation config changes.

## Additional notes

- Follow `packages/sdks/common/AGENTS.md` for shared artifact rules.
