---
"@devopness/ui-react": patch
---

Fix `getOpacity` returning invalid hex alpha values for low opacity inputs such as `0` and `0.05` by flooring and zero-padding the alpha channel.
