---
"@devopness/sdk-python": minor
---

Fix client state sharing in `DevopnessClient`.

You can now create multiple clients in the same runtime, and each one keeps its own runtime state.
