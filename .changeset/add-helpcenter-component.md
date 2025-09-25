Perfeito! Podemos atualizar o **changeset** para incluir os hooks `useChecklist` e `useHelpCenter` também. Aqui está a versão corrigida:

---

### **Changeset (`changeset/add-help-center-component.md`)**

````md
---
"@devopness/ui-react": minor
---

Add new `HelpCenter` component and related hooks

### What Changed
- Introduced the `HelpCenter` component integrating **Product Fruits** checklist.
- Added hooks `useChecklist` and `useHelpCenter` for managing checklist and help center button state.
- Renders a draggable button to toggle onboarding checklist.
- Accepts `workspaceCode`, `checklistId`, and `user` as props.

### Example Usage
```tsx
<HelpCenter
  workspaceCode="workspace_123"
  checklistId="checklist_123"
  user={{ name: 'Willian', email: 'willian@example.com' }}
/>
````

### Hooks Usage

```ts
const { checklistOpened, handleToggleChecklist } = useChecklist('checklist_123')
const { isOpened, open, close } = useHelpCenter()
```

These hooks provide type-safe and reusable ways to control the onboarding checklist and Help Center button, fully integrated with Product Fruits.
