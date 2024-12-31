---
"@devopness/ui-react": patch
---

---

## "@devopness/ui-react": patch

Fix Alert component export in main index.ts. The component was previously only accessible through direct path import, but now it's properly exported from the package root, allowing users to import it directly from '@devopness/ui-react'.
