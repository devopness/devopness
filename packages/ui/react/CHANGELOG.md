# @devopness/ui-react

## 2.156.0

### Minor Changes

- [#1408](https://github.com/devopness/devopness/pull/1408) [`c59d66c`](https://github.com/devopness/devopness/commit/c59d66c1011b59f3268d5eefa83a068ae19d2f48) Thanks [@dapeduu](https://github.com/dapeduu)! - feat: adds input focus on error

## 2.155.0

### Minor Changes

- [#1322](https://github.com/devopness/devopness/pull/1322) [`f5263f9`](https://github.com/devopness/devopness/commit/f5263f994ff12b2665c8fa1f5e198ba9e16c6a00) Thanks [@pvdevs](https://github.com/pvdevs)! - Update icon paths in iconLoader to match new assets paths

## 2.154.0

### Minor Changes

- [#1188](https://github.com/devopness/devopness/pull/1188) [`e2d89c0`](https://github.com/devopness/devopness/commit/e2d89c03d6652540cb1bdf03dd9c5969760cdd60) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Added `linkProps` property to `DropdownOption` type to provide granular control over link behavior when using URL options.

  ### What Changed

  - Added new `linkProps` property of type `LinkProps` to `DropdownOption`
  - Link options now support all props from the base `Link` component
  - Properties like `target`, `rel`, `hideExternalUrlIcon` and custom styling can be configured

  ### Why

  Previously, when using URL-based dropdown options, developers had limited control over the link's behavior. This change provides more flexibility for customizing link appearance and functionality while maintaining a clean API.

  ### Migration Guide

  The change is fully backwards compatible. To take advantage of the new functionality, you can optionally add `linkProps` to your URL-based dropdown options:

  ```tsx
  <Dropdown
    options={[
      {
        label: 'Documentation',
        url: 'https://docs.example.com',
        linkProps: {
          target: '_blank',
          hideExternalUrlIcon: true,
        },
      },
    ]}
  />
  ```

## 2.153.2

### Patch Changes

- [#1186](https://github.com/devopness/devopness/pull/1186) [`bbcd2c2`](https://github.com/devopness/devopness/commit/bbcd2c2aa3d3c1a1ed12a74fb97fa49a7511c15c) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Revert Button breaking changes

  The following changes were made in 2.153.1

  ```diff
  -  noMargin?: boolean
  +  $noMargin?: boolean
    /**
     * The button component has a 10px margin on its sides, to remove activate the "noIconMargin" property
     */
  -  noIconMargin?: boolean
  +  $noIconMargin?: boolean
    /**
     * The button component has a 15px padding on its sides, to remove activate the "noPadding" property
     */
  -  noPadding?: boolean
  +  $noPadding?: boolean
  ```

  This version reverts the diff above

  The ButtonProps will be compatible with 2.153.0, and any changes to props will not be released as a patch version in the future

## 2.153.1

### Patch Changes

- [#1179](https://github.com/devopness/devopness/pull/1179) [`0219a4c`](https://github.com/devopness/devopness/commit/0219a4c2fdb8becee36c92cd6ce328e8f0aaf058) Thanks [@rafael-g-depaulo](https://github.com/rafael-g-depaulo)! - Fix camelCase props propagating from React component to DOM element

## 2.153.0

### Minor Changes

- [#1165](https://github.com/devopness/devopness/pull/1165) [`d1ef7b9`](https://github.com/devopness/devopness/commit/d1ef7b961e4c0e2ba3f0073e950df8beb4b0033c) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Update icons source from [@react-icons/all-files](https://www.npmjs.com/package/@react-icons/all-files) to [react-icons](https://www.npmjs.com/package/react-icons)

  Both libraries are from the same author, but all-files is a heavy dependency that needed to be installed from outside the npm registry

  Using [react-icons](https://www.npmjs.com/package/react-icons) is the recommended approach for this package's use case, according to their [docs](https://react-icons.github.io/react-icons/)

## 2.152.0

### Minor Changes

- [#1145](https://github.com/devopness/devopness/pull/1145) [`7dc3476`](https://github.com/devopness/devopness/commit/7dc3476ceef61b5ffe4009dbc8d6c5c352bedc0c) Thanks [@pvdevs](https://github.com/pvdevs)! - add [`components#ArrowHead`](./src/components/Primitives/ArrowHead/ArrowHead.tsx)

## 2.151.0

### Minor Changes

- [#1141](https://github.com/devopness/devopness/pull/1141) [`ed5456c`](https://github.com/devopness/devopness/commit/ed5456ce083e634f28529d66c0bd18fa59647dca) Thanks [@pvdevs](https://github.com/pvdevs)! - adds [`components#Input`](./src/components/Forms/Input/Input.tsx) and [`components#Label`](./src/components/Forms/Label/Label.tsx)

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
