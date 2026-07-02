# Docs AGENTS

Read these first:

1. `docs/README.md`
1. `docs/docs/README.md`
1. `docs/docs/authoring-guidelines.md`

## Before commit

Run from the `docs/` directory. **Do not commit if any command fails.**

```bash
npm run lint             # required — ESLint + Prettier + TypeScript
npm run build            # required when navigation, content, plugins, or app code changed
npm run lint:fix         # optional — auto-fix lint issues before re-running lint
```
