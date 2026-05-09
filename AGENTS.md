# AGENTS

This file is for fast, action-oriented instructions for AI agents.

## Core flow

1. Keep changes scoped and minimal.
2. Run the smallest relevant check set for the modified paths.
3. Avoid duplicating broad repo-wide process instructions that already belong to CONTRIBUTING.

## Shared constraints

- Do not hand-edit `packages/sdks/common/spec.json`.
- Prefer source inputs over editing generated output.

## Monorepo structure

- `README.md` contains the package and project map.

## PR instructions
- Keep PR mechanics and validation in:
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/workflows/pr-lint.yml`
  - `.github/scripts/pr-validate-description.js`
- Use `CONTRIBUTING.md` for broader process and release expectations.
- Summarize actual commands and outcomes in the PR QA checklist.
