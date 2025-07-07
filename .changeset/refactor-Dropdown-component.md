---
"@devopness/ui-react": minor
---

Improve Dropdown to support both sync and async handlers and add new Icon option

### What Changed

- Refactored `onClick` and `onSelect` props to support both synchronous and asynchronous functions using `Promise.resolve()`
- Introduced `handleDropdownOptionClick()` to centralize and simplify the click/select logic in the `Dropdown` component
- Added support for the new `discord` icon in `iconLoader.tsx`

### Example Usage

```tsx
<Dropdown
  options={[
    {
      label: "Log out",
      onClick: async () => {
        await api.logout();
      },
    },
  ]}
/>
```

```tsx
<Icon name={discord} size={14} color={"blue.950"} />
```

This improves reusability and flexibility while ensuring the component gracefully handles both sync and async handlers and also adds support for a new icon.
