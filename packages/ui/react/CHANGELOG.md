# @devopness/ui-react

## 2.150.1

### Patch Changes

- [#1135](https://github.com/devopness/devopness/pull/1135) [`23606df`](https://github.com/devopness/devopness/commit/23606dfed3d3671465c000e10b3fea67535cf8d9) Thanks [@pvdevs](https://github.com/pvdevs)! - enhance ErrorMessage component type definitions:

  - add support for custom error types using Record<string,any>
  - update JSDoc documentation for error formats
  - add linter exceptions with proper documentation

## 2.150.0

### Minor Changes

- [#1124](https://github.com/devopness/devopness/pull/1124) [`daebe66`](https://github.com/devopness/devopness/commit/daebe666071c26568a26b5267257558c796c4de2) Thanks [@pvdevs](https://github.com/pvdevs)! - add [`components#ErrorMessage`](./src/components/Primitives/ErrorMessage/ErrorMessage.tsx)

## 2.149.0

### Minor Changes

- [#1107](https://github.com/devopness/devopness/pull/1107) [`88814b5`](https://github.com/devopness/devopness/commit/88814b51b8b8f314c3092935d5e82b7cce0686fe) Thanks [@pvdevs](https://github.com/pvdevs)! - add [`components#Pagination`](./src/components/Primitives/Pagination/Pagination.tsx)

## 2.148.2

### Patch Changes

- [#1102](https://github.com/devopness/devopness/pull/1102) [`ad70323`](https://github.com/devopness/devopness/commit/ad70323213650a4bc9e472afc73ba0e4019b319a) Thanks [@mateus2033](https://github.com/mateus2033)! - Fixes Dropdown closing after clicking a disabled option

## 2.148.1

### Patch Changes

- [#1109](https://github.com/devopness/devopness/pull/1109) [`88f83b7`](https://github.com/devopness/devopness/commit/88f83b74b5a81985f1fbe61069767ef9e53be479) Thanks [@pvdevs](https://github.com/pvdevs)! - Fix Alert component export in main index.ts. The component was previously only accessible through direct path import, but now it's properly exported from the package root, allowing users to import it directly from '@devopness/ui-react'.

## 2.148.0

### Minor Changes

- [#1104](https://github.com/devopness/devopness/pull/1104) [`b2a9a04`](https://github.com/devopness/devopness/commit/b2a9a044e729f1de53e5d65054a64f569fcd14b4) Thanks [@pvdevs](https://github.com/pvdevs)! - add [`components#Alert`](./src/components/Forms/Alert/Alert.tsx)

## 2.147.0

### Minor Changes

- [#1007](https://github.com/devopness/devopness/pull/1007) [`9b6b62b`](https://github.com/devopness/devopness/commit/9b6b62be65b4f7876e64ca1fa83f0fdeec796717) Thanks [@thlmenezes](https://github.com/thlmenezes)! - add [`components#Dropdown`](./src/components/Primitives/Dropdown/Dropdown.tsx)

- [#1007](https://github.com/devopness/devopness/pull/1007) [`9b6b62b`](https://github.com/devopness/devopness/commit/9b6b62be65b4f7876e64ca1fa83f0fdeec796717) Thanks [@thlmenezes](https://github.com/thlmenezes)! - add [`components#Icon`](./src/components/Primitives/Icon/Icon.tsx)

- [#1007](https://github.com/devopness/devopness/pull/1007) [`9b6b62b`](https://github.com/devopness/devopness/commit/9b6b62be65b4f7876e64ca1fa83f0fdeec796717) Thanks [@thlmenezes](https://github.com/thlmenezes)! - add [`components#Link`](./src/components/Primitives/Link/Link.tsx)

- [#1007](https://github.com/devopness/devopness/pull/1007) [`9b6b62b`](https://github.com/devopness/devopness/commit/9b6b62be65b4f7876e64ca1fa83f0fdeec796717) Thanks [@thlmenezes](https://github.com/thlmenezes)! - adds [`colors#getOpacity`](./src/colors/getColor.ts#getOpacity) helper

### Patch Changes

- [#1007](https://github.com/devopness/devopness/pull/1007) [`9b6b62b`](https://github.com/devopness/devopness/commit/9b6b62be65b4f7876e64ca1fa83f0fdeec796717) Thanks [@thlmenezes](https://github.com/thlmenezes)! - fixes component exported types, unresolved paths aliases

  [tsconfig.json](./tsconfig.json) was configured to resolve imports using [rootDirs](https://www.typescriptlang.org/tsconfig/#rootDirs), which caused to import paths to not be resolved in build files.

  Solution was to declare root folder "src" as one of the [paths](https://www.typescriptlang.org/tsconfig/#paths) to be resolved.

  This patch should not require any changes to your code, if all props are correctly typed.

  BEFORE:

  [@devopness/ui-react@2.146.0 - npm Code tab](https://www.npmjs.com/package/@devopness/ui-react/v/2.146.0?activeTab=code)

  ```ts
  // dist/components/Buttons/Button/Button.d.ts#L2-L3
  import { getColor } from 'src/colors'
  import { Icon } from 'src/icons'
  ```

  This resulted in props like `ButtonProps.icon` being `any`

  ```ts
  import { Button } from '@devopness/ui-react'

  // ...

  <Button icon="non-existing-icon" /> // => no errors, accepts any value
  ```

  AFTER:

  ```ts
  // dist/components/Buttons/Button/Button.d.ts#L2-L3
  import { getColor } from '../../../colors'
  import { Icon } from '../../../icons'
  ```

  ```ts
  import { Button } from '@devopness/ui-react'

  // ...

  <Button icon="non-existing-icon" /> // => error TS2322: Type '"non-existing-icon"' is not assignable to type '"html" | "link" | ...
  ```
