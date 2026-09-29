# AGENTS

This file is for fast, action-oriented instructions for AI agents.

## Core flow

1. Keep changes scoped and minimal
2. Run the smallest relevant check set for the modified paths
3. Avoid duplicating broad repo-wide process instructions that already belong to CONTRIBUTING
4. When working in a package directory, run lint and fix scripts from that package folder so the package-local config is used
5. Run `pnpm run tetanus:check` before proposing a change. It is the same check set CI runs
6. Use `pnpm run test:affected BASE=<ref>` while iterating. It runs only the tests `testing/tests.toml` says a change affects, and caches the rest. Run the full `pnpm test` before proposing a change
7. `tetanus test generate` regenerates `testing/tests.toml` from the dependency graph. Do not hand-edit `target` or `affected_by`: they are derived, and a hand-written entry is a guess about what a test covers

## Engineering state

`living.toml` is the authoritative record of engineering state. `CHANGELOG.md`,
`HANDOVER.md` and `SESSION.md` are rendered from it and are checked for drift.
Do not hand-edit them.

- Read `living.toml` and the relevant `.tetanus/specs/*.toml` before changing code
- Any change under `docs/docs/**` or `packages/**/src/**` must update `living.toml` or add a changeset. `tetanus state check` enforces this
- After changing code, run `pnpm run tetanus:check`, then `tetanus living generate` and commit the regenerated mirrors

## Ratchets

Metrics are ratcheted in `.tetanus/baseline.toml`. Each ratchet pins a hash of
its metric definition, so redefining a metric invalidates its baseline.

- Never lower a baseline to make a check pass. Fix the regression, or record an `[[exception]]` with a reason and an expiry
- To refresh a baseline legitimately, run `tetanus ratchet baseline` and commit the result. `tetanus ratchet baseline-check` fails if the committed baseline does not match a real measurement
- A metric that cannot be measured is `unknown`, and unknown is a failure. There is no path from "could not measure" to "pass"

## Tetanus

`tools/tetanus` is an unpublished Rust substrate, not a product. Invoke it as
`tetanus <command>` or, through its argv[0] alias, `devopness engineering <command>`.

- `tetanus classify` — the generated-artifact registry must match the working tree
- `tetanus ast` — every module must parse
- `tetanus graph-verify` — the graph must be byte-identical across two builds
- `tetanus test reconcile` — every test file must be registered in `testing/tests.toml`
- `tetanus test affected` — select the tests a change set affects, and emit them as Turborepo filters or per-package file lists
- `tetanus living check` — the mirrors must match `living.toml`
- `tetanus ratchet check` — no metric may have regressed

Reachability analysis reports evidence and never deletes code. A dead-code
finding is a prompt to look, not a licence to remove.

## Shared constraints

- Do not hand-edit `packages/sdks/common/spec.json`
- Prefer source inputs over editing generated output
- Do not hand-edit `packages/sdks/*/src/**/generated/**`. Regenerate through the normal codegen flow
- Avoid workaround flags or bypasses such as `--legacy-peer-deps`, `--force`, or similar installer shortcuts unless the user explicitly asks for a temporary unblock and you explain the tradeoff.
- Do not add a dependency to an `allowBuilds` entry without recording why. Install scripts are blocked by default
- The pnpm workspace covers the root, `apps/api-docs`, `packages/sdks/javascript` and `packages/ui/react`. `docs` is excluded and installs on its own; see `pnpm-workspace.yaml` for why
- `turbo.json` is the task graph. A new task must be declared there, or `turbo run` reports it as missing
- `tools/test-affected/run.sh` fails closed by design. An absent, empty or stale list runs the package's full suite. Do not "optimise" it to skip instead
- Generated code is committed. If a generator's input changed, regenerate; do not hand-edit the output

## Monorepo structure

- `README.md` contains the package and project map
- `pnpm-workspace.yaml` declares workspace membership and the dependency
  override and install-script policy
- `tetanus living show` prints the current phase, active work and blockers

## Git Workflow

- When committing, use Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.)
- Keep branch names short and descriptive, using `<type>/<descriptive-name>` when a branch name is needed
- Avoid `--amend` unless the user asks for it

## PR instructions

- Before creating PR, make sure branch has no merge conflicts with base branch
- PR titles should be written in active imperative form, not end with a period, and read naturally, using Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.)
- **CRITICAL: All PRs MUST pass CI validation before submission**
  - Read `.github/PULL_REQUEST_TEMPLATE.md` to understand required sections
  - Read `.github/workflows/pr-lint.yml` to understand validation workflow
  - Read `.github/scripts/pr-validate-description.js` to understand validation rules
  - Required sections in PR description:
    - `## Description of changes` - checklist with `- [x]` items (cannot be placeholder text like `<add item here>`)
    - `## GitHub issues resolved by this PR` - must contain issue numbers (`#123`) or explicitly state `N/A`
    - `## Quality Assurance` - must contain success criteria (not just the placeholder template text)
    - `## More info` - optional additional context
  - Verify PR format matches template BEFORE creating/updating the PR
  - After creating/updating a PR, monitor CI checks and fix any validation failures immediately
- Keep PR mechanics and validation in:
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/workflows/pr-lint.yml`
  - `.github/scripts/pr-validate-description.js`
- Use `CONTRIBUTING.md` for broader process and release expectations
- Summarize actual commands and outcomes in the PR QA checklist
