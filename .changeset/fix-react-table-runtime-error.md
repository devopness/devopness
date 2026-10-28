---
'@devopness/ui-react': minor
---

- Externalize `@tanstack/react-table` library to prevent runtime error of `require` function not being available in consumer app
- Pass props `disabled` and `readOnly` to native input in `Input` component to prevent readOnly fields being editable
