---

"@devopness/ui-react": minor

---

Enhance `Input` component with password visibility toggle and add new `email` icon

### What Changed

- Updated the `Input` component to support a password visibility toggle icon (`eyeOpen` / `eyeClosed`) **alongside** a custom icon (e.g. lock icon)
- Ensures the visibility toggle is shown only when `type="password"` and `iconPosition !== 'right'`
- Allows both icons (custom + visibility toggle) to appear without layout conflicts
- Added a new `email` icon to the set of supported `Icon` options

### Example Usage

```tsx
<Input
  type="password"
  placeholder="Enter your password"
  icon={iconLoader("lock")}
  iconPosition="left"
/>
```

```tsx
<Icon name="email" size={14} color="blue.950" />
```

These improvements enhance the flexibility and accessibility of the `Input` component and expand the available icon set for consistent UI design.
