---
"@devopness/ui-react": patch
---

Fix Dropdown link handling

### What Changed

- Improved behavior of dropdown options with `url`, enabling the correct usage of a link `<a>` without preventing default behavior
- Prevent link default behavior only when an `onClick` or `onSelect` handler is defined

### Example Usage

```tsx
<Dropdown
  options={[
    {
      label: "Go to Dashboard",
      url: "/dashboard",
      linkProps: { target: "_self" },
    },
    {
      label: "Log out",
      onClick: async () => {
        await api.logout();
      },
    },
  ]}
/>


This update improves usability and accessibility of link-based dropdown options, maintains expected browser behavior.