---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

## Added
- New method in the `static` service to **list available subscription plans** in Devopness.

## Deprecated
- User management methods (`create`, `update`, `etc`) and authentication methods (`login`, `logout`, `refresh-token`, `etc`) are now **deprecated**.
  - They always return **403 Forbidden**.
  - Their signatures have been simplified to **accept no arguments**.
