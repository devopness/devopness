# AGENTS

> Quick guide for AI agents working with devopness-api-docs. Humans see [README.md](./README.md).

## What This Is

OpenAPI 3.0 documentation generator for Devopness API (api-docs.devopness.com). Generates spec from auto-generated and manual endpoint definitions, validates with Dredd against live API.

## Development Workflow

### Docker (recommended)
```bash
make build               # Build Docker image
make dev                 # Start dev server at http://localhost:9090
make shell               # Open shell in container
```

### Without Docker
```bash
npm ci                   # Install dependencies
npm run build            # Full build + validation + test
npm run api-docs-serve   # Build spec and serve docs
npm run api-test         # Run Dredd API tests
npm test                 # Run Jest unit tests
```

## Architecture Rules

**Spec Sources and Build Wiring:**
- `docs/spec/auto-generated/` - Generated from devopness-api repo
- The generated `docs/spec/auto-generated/paths.yaml` currently references only `./auto-generated/endpoints/*`
- Do not assume `docs/spec/endpoints/` is applied as a manual override unless the build/spec scripts are updated to reference it explicitly
- Update flow: `npm run copy-local-docs` from `../devopness-api/`

**Testing Architecture:**
- Dredd validates API against spec
- TransactionGraph builds dependency DAG for test ordering
- FixtureStore passes data between transactions (e.g., project_id → application creation)
- Custom hooks in `src/hooks.ts` orchestrate test flow

**Naming Conventions:**
- Path parameters: `{entity_type}_id` format
- Schema references: `#/components/schemas/{ObjectType}` (PascalCase)
- Operation IDs: Describe action + entity (e.g., `addProject`, `updateServer`)

## Critical Don'ts

- ❌ Don't hand-edit `docs/spec/auto-generated/` - regenerate from API repo
- ❌ Don't hand-edit `docs/build/` - it's generated output
- ❌ Don't skip validation steps - they catch schema errors

## Common Behavior

- Keep edits focused and minimal
- Preserve existing conventions in the touched area
- Run validation before committing
- Code changes MUST pass the Dredd validation before PR
- Use Conventional Commit style when committing: `<type>: <description>`
- Branch naming: `<type>/<descriptive-name>`
