---
"@devopness/ui-react": patch
---

fixes component exported types, unresolved paths aliases

[tsconfig.json](./tsconfig.json) was configured to resolve imports using [rootDirs](https://www.typescriptlang.org/tsconfig/#rootDirs), which caused to import paths to not be resolved in build files.

Solution was to declare root folder "src" as one of the [paths](https://www.typescriptlang.org/tsconfig/#paths) to be resolved.

This patch should not require any changes to your code, if all props are correctly typed.

BEFORE:

[@devopness/ui-react@2.146.0 - npm Code tab](https://www.npmjs.com/package/@devopness/ui-react/v/2.146.0?activeTab=code)

```ts
// dist/components/Buttons/Button/Button.d.ts#L2-L3
import { getColor } from 'src/colors';
import { Icon } from 'src/icons';
```

This resulted in props like `ButtonProps.icon`  being `any`

```ts
import { Button } from '@devopness/ui-react'

// ...

<Button icon="non-existing-icon" /> // => no errors, accepts any value
```

AFTER:

```ts
// dist/components/Buttons/Button/Button.d.ts#L2-L3
import { getColor } from '../../../colors';
import { Icon } from '../../../icons';
```

```ts
import { Button } from '@devopness/ui-react'

// ...

<Button icon="non-existing-icon" /> // => error TS2322: Type '"non-existing-icon"' is not assignable to type '"html" | "link" | ...
```
