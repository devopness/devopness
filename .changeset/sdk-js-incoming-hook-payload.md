---
"@devopness/sdk-js": patch
---

Fixed incoming hook triggers so you can send the payload that should reach the hook.

```ts
import { DevopnessApiClient } from "@devopness/sdk-js";

const devopness = new DevopnessApiClient();

await devopness.hooks.triggerHook(hookId, {
  event_id: 123,
  title: "Fix login flow",
});
```
