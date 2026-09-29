# AGENTS

Instructions for AI agents working in the Python SDK package.

## Workflow

Run the package commands from `packages/sdks/python` so the local Makefile and Python tooling are used:

- `make build-image`
- `make build-sdk-python`
- `make lint`
- `make format`
- `make test-unit`

All of these run in a container. The engine is auto-detected, preferring
`podman` and falling back to `docker`; override with
`CONTAINER_ENGINE=docker make test-unit` when the detection picks wrong.

## Toolchain

- `uv` manages the lockfile, the environment, lint, typecheck and tests.
  The lockfile is authoritative: `uv.lock` must be committed, and CI installs
  with `--locked`.
- `hatchling` is the build backend. Poetry has been removed; there is no
  `poetry.lock` and no `[tool.poetry]` section.
- The virtual environment and uv cache live at `/opt/sdk-venv` and
  `/tmp/uv-cache` inside the image, not in the bind mount, so they survive the
  host directory being mounted over `/sdk`.

## Generated files

- Generated code paths include `src/devopness/generated` and model files created by `make build-sdk-python`.
- Do not hand-edit generated files.
- Regenerate generated outputs when source specs or generation config changes.

## Additional notes

- Follow [`packages/sdks/common/AGENTS.md`](../common/AGENTS.md) for shared artifact rules.
- Follow the root [AGENTS.md](../../../AGENTS.md) for repository-wide git workflow and PR guidance.
