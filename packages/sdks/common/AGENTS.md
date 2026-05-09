# AGENTS

Instructions for AI agents working with shared SDK artifacts.

## Source of truth

- `spec.json` is the generated API specification source consumed by SDK generators.

## Constraints

- Do not hand-edit `spec.json`.
- Propose API-contract changes via issue or discussion, then implement through the upstream spec pipeline.
- Regenerate SDK outputs in package-level AGENTS flows, never by manual patching.

## PR instructions
- Root AGENTS provides repository-wide behavior; use it first.
- For PR mechanics and validation, follow:
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/workflows/pr-lint.yml`
  - `.github/scripts/pr-validate-description.js`
