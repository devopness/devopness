---
"@devopness/sdk-python": patch
---

- Change `auto_refresh_token` default from `True` to `False` and mark as deprecated
  - Token-based authentication (api_token) is now the primary method and incompatible with auto-refresh

* Update documentation to guide users to use token-based authentication (Personal Access Tokens and Project API Tokens) instead of deprecated email/password method
