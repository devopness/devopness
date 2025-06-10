# @devopness/ui-react

## 2.163.0

### Minor Changes

- [#1675](https://github.com/devopness/devopness/pull/1675) [`c9b3206`](https://github.com/devopness/devopness/commit/c9b3206b2c8dddb5b0cdd97f1c2da6da5de142cf) Thanks [@TiagoMontes](https://github.com/TiagoMontes)! - Add new Icon (Home) to devopness-ui

  ### What Changed

  - Updated iconList const with a new icon (home)

  ### Example Usage

  ```tsx
  <Icon
    name={home}
    size={14}
    color={'blue.950'}
  />
  ```

  This enables a new icon to be used when importing <Icon />.

## 2.162.0

### Minor Changes

- [#1487](https://github.com/devopness/devopness/pull/1487) [`e49817d`](https://github.com/devopness/devopness/commit/e49817da6225daa8890fdf1b1b1eb47d42e8c653) Thanks [@unnati06](https://github.com/unnati06)! - Make Input error auto-focus behavior optional

  ### What Changed

  - Added new `autoFocusOnError` prop to Input component
  - Changed error auto-focus to be opt-in rather than default behavior
  - Updated documentation to reflect the optional nature of auto-focus

  ### Example Usage

  ```tsx
  // With auto-focus enabled (previous default behavior)
  <Input
    autoFocusOnError
    error={{ message: 'This field is required' }}
  />

  // Without auto-focus (new default behavior)
  <Input
    error={{ message: 'This field is required' }}
  />
  ```

  This change provides more control over form behavior while maintaining backward compatibility through the new opt-in prop.

## 2.161.1

### Patch Changes

- [#1556](https://github.com/devopness/devopness/pull/1556) [`1d46ac8`](https://github.com/devopness/devopness/commit/1d46ac8bc24a619a360373287c1cb771ef8ccd5a) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Fix `shieldLock` icon rendering error

  Previously, the `shieldLock` icon was incorrectly typed as 'icon', which attempted to use the SVG URL as a React component, causing a DOM error:
  "DOMException: Failed to execute 'createElement' on 'Document': The tag name provided is not a valid name."

  This change:

  - Updates the shieldLock icon type from 'icon' to 'image', to correctly render it as an <img> element
  - Fixes the runtime error when using the `shieldLock` icon
  - Maintains backward compatibility - the icon name and usage remain the same

## 2.161.0

### Minor Changes

- [#1554](https://github.com/devopness/devopness/pull/1554) [`153d24e`](https://github.com/devopness/devopness/commit/153d24ea124683d1d43fa3de3ab97c0336102edf) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Remove deprecated icon types and clean up icon system

  ### What Changed

  - Removed deprecated icon types from iconList
  - Maintained core icon system functionality while removing legacy code

  This is a cleanup change that removes technical debt related to deprecated icons. No functional changes to the current icon system - this just removes unused deprecated icon support that was previously marked for removal.

## 2.160.0

### Minor Changes

- [#1538](https://github.com/devopness/devopness/pull/1538) [`7e9e5a7`](https://github.com/devopness/devopness/commit/7e9e5a70b30ec479e87c13fd68f63ede7236fd61) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Enhanced icon system with consistent naming patterns

  ### What Changed

  - Added consistent naming patterns for all icons
  - Introduced type-safe deprecation system for old icon names
  - Updated icon organization with logical grouping
  - Added missing icons with proper naming

  ### Icon Naming Conventions

  - Use camelCase for general icons
  - Use kebab-case for technology/brand icons
  - Follow consistent patterns:

    ```tsx
    // Actions
    'add', 'remove', 'edit'

    // States
    'loading', 'error', 'success'

    // Variants
    'checkOutline', 'checkFilled'
    'eyeOpen', 'eyeClosed'
    ```

  ### Migration Guide

  Old icon names are deprecated but will continue to work during runtime. There are two ways to handle deprecated icons:

  1. Update to the new icon name (Recommended)

  ```tsx
  // Before
  <Icon name="eyeOff" />

  // After
  <Icon name="eyeClosed" />
  ```

  2. Use the `deprecatedToNewIconMap` helper

  ```tsx
  import { deprecatedToNewIconMap } from '@devopness/ui-react'

  const newName = deprecatedToNewIconMap['eyeOff'] // returns 'eyeClosed'
  <Icon name={newName} />
  ```

  We recommend updating to the new icon names as soon as possible to ensure future compatibility.

  In general, this update improves maintainability and provides a better developer experience while maintaining backward compatibility during the transition period.

## 2.159.0

### Minor Changes

- [#1529](https://github.com/devopness/devopness/pull/1529) [`f32f1ac`](https://github.com/devopness/devopness/commit/f32f1ac512c0c4727500bb312e274f6ed005e9f1) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Enhanced Card component URL handling

  ### What Changed

  - Updated Card component's URL handling to support full LinkProps configuration
  - Added support for all Link component props (except 'style') in:
    - Card's main `url` prop
    - Footer action `url` properties
  - Enables granular control over link behavior including `target`, `rel`, and other Link component properties

  ### Example Usage

  ```tsx
  <Card
    title="Example Card"
    url={{
      hideExternalUrlIcon: true,
      rel: 'noopener',
      target: '_blank',
      to: '/dashboard',
    }}
    footer={[
      {
        label: 'View Details',
        url: {
          hideExternalUrlIcon: true,
          target: '_self',
          to: '/details',
        },
      },
    ]}
  />
  ```

  This enhancement provides more flexibility in configuring Card's link behavior while maintaining backward compatibility with existing Card implementations.

## 2.158.0

### Minor Changes

- [#1515](https://github.com/devopness/devopness/pull/1515) [`e4de917`](https://github.com/devopness/devopness/commit/e4de917742db54d705494a1e8e2403d54bfaef92) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Add `borderBottomColor` prop to Card component header

  ### What Changed

  - Added new `borderBottomColor` prop to Card's `headerProps` for customizing the bottom border color
  - Updated tests to verify border color styling behavior
  - Maintains backward compatibility with existing header styling options

  ### Example Usage

  ```tsx
  <Card
    title="Example Card"
    headerProps={{
      backgroundColor: 'blue.100',
      borderBottomColor: 'purple.500', // New prop
    }}
  />
  ```

  This enhancement provides more flexibility in styling Card headers by allowing separate control of the border color, independent of the background color.

## 2.157.0

### Minor Changes

- [#1501](https://github.com/devopness/devopness/pull/1501) [`69386d8`](https://github.com/devopness/devopness/commit/69386d8060886db806fdcc5ce339873fd08b06bc) Thanks [@thlmenezes](https://github.com/thlmenezes)! - Add [`components#Card`](./src/components/Templates/Card/Card.tsx) and test utilities

  ### What Changed

  - Added new `Card` component for displaying content in a structured layout
  - Added test utilities to standardize component testing
  - Updated Tooltip tests to use new test utilities

  ### Card Component Features

  - Flexible header with avatar/icon, title, and subtitle
  - Optional indicator display
  - Customizable footer with actions
  - Support for tooltips on truncated text
  - Configurable styling through props

  Example usage:

  ```tsx
  <Card
    title="Environment"
    subtitle="Overview of current environments"
    avatarProps={{ backgroundColor: 'blue.500' }}
    icon="cubes"
    footer={[
      {
        label: 'View All',
        url: '/environments',
        tooltip: 'View all environments',
      },
    ]}
  />
  ```

  ### Test Utilities

  Added new test utilities to help write consistent and maintainable tests:

  - `testHoverTooltip`: Standardizes testing of tooltip hover interactions
  - Additional utilities can be added to the `test-utils` directory

  This change improves testing consistency and reduces duplicate code across component tests.

## 2.156.0

### Minor Changes

- [#1408](https://github.com/devopness/devopness/pull/1408) [`c59d66c`](https://github.com/devopness/devopness/commit/c59d66c1011b59f3268d5eefa83a068ae19d2f48) Thanks [@dapeduu](https://github.com/dapeduu)! - Add automatic focus behavior to Input component when in error state

This enhancement:

- Automatically focuses the input field with an error
- Improves form validation UX by directing user attention to fields needing correction
- Works by default without additional configuration

Example usage:

```typescript
<Input
  // Focus will be automatically applied when error prop is present
  error={{ message: 'This field is required' }}
/>
```

This change helps users quickly identify and fix form validation issues by automatically focusing on problematic fields.

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
