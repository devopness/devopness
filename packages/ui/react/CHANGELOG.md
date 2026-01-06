# @devopness/ui-react

## 2.184.3

### Patch Changes

- [#2491](https://github.com/devopness/devopness/pull/2491) [`b269715`](https://github.com/devopness/devopness/commit/b2697150754e92db05763ba25d23e52c264e0fd6) Thanks [@AladinoBorges](https://github.com/AladinoBorges)! - Guard custom element registration and prevent server-side DOM access so the package is safe to import using Next.js framework with `App Router`.
  - Mark client-only components as `use client` where appropriate to keep them out of server bundles and to ensure runtime-only APIs run only in the browser.
  - Ensure React remains a peer dependency and avoid bundling multiple React runtimes;
  - Prefer `sideEffects: false` and rebuild artifacts to produce consistent ESM and CJS outputs.

  These changes make `@devopness/ui-react` safe to import during Next.js server rendering/building and prevent runtime errors caused by top-level DOM API usage.

## 2.184.2

### Patch Changes

- [#2473](https://github.com/devopness/devopness/pull/2473) [`fdbc8c2`](https://github.com/devopness/devopness/commit/fdbc8c2f430e133daed6eec89ea4f63fd56cd727) Thanks [@AladinoBorges](https://github.com/AladinoBorges)!

  ### What Changed

  Implements resize observer to guard state updates in the Tooltip component, avoiding redundant setState calls that causes a "Maximum update depth exceeded" runtime error. Now, the effect only updates state when the measured overflow value actually changes.

## 2.184.1

### Patch Changes

- [#2417](https://github.com/devopness/devopness/pull/2417) [`c5e30ec`](https://github.com/devopness/devopness/commit/c5e30eca62a1e86928ad06affc8c9b7a8aa77f35) Thanks [@AladinoBorges](https://github.com/AladinoBorges)! - Fix the `Alert` component to ensure consistent styling

  ### What Changed
  - The layout, spacing, alignment, and icon positioning were corrected to improve visual accuracy and component stability.
    - Adjusting internal spacing and text alignment
    - Correcting icon positioning and sizing
    - Improving close button alignment and spacing
    - Ensuring consistent border-radius application

- [#2467](https://github.com/devopness/devopness/pull/2467) [`b3a064d`](https://github.com/devopness/devopness/commit/b3a064db650b62183f67b66bab64edc59a2849ae) Thanks [@AladinoBorges](https://github.com/AladinoBorges)! - Stop forwarding styling/transient props (like `hasError`, `iconPosition`, `removeArrows`, `noResize`) to DOM elements, this reduces React "unknown prop" warnings by ensuring styling-only props are consumed by `styled-components` and not forwarded to native elements.

  ### What Changed
  - Converted several styled-component props to transient props (prefixed with `$`) and stopped spreading internal styling props into DOM-rendered elements for the following components:
    - `Skeleton` now uses transient props (`$widthPercent`, `$heightPercent`, etc.);
    - `src/components/Forms/Input/*` (styled + component);
    - `src/components/Forms/TextArea/*` (styled + component);
    - `src/components/Forms/Autocomplete/*` (renderInput integration; avoid spreading MUI params into DOM);
    - `src/components/Primitives/Pagination/*` (hideFirstAndLastButton -> `$hideFirstAndLastButton`)
    - `src/components/Primitives/EmptyData/*` (isSmallContainer -> `$isSmallContainer`)
    - `src/components/Primitives/Review/*` (style props -> `$...`, ContentIcon `$backgroundColor`)
    - `src/components/Primitives/Loader/*` (paddingTop/isAlignLeft -> `$paddingTop`/`$isAlignLeft`)
    - `src/components/Primitives/LoadStarship/*` (isFullContainer -> `$isFullContainer`)
    - `src/components/Primitives/Popover/*` (Header/Footer justifyContent -> `$justifyContent`)
    - `src/components/Primitives/Cover/*` (backgroundColor -> `$backgroundColor`)
    - `src/components/Forms/Container/*` (shouldRemoveTopMargin -> `$shouldRemoveTopMargin`)
    - `src/components/Forms/FormText/*` (subtitleColor -> `$subtitleColor`)
    - `src/components/Forms/Alert/*` (noPadding/fullWidth -> `$noPadding`/`$fullWidth`)

  These changes are part of a grouped set of fixes bundled in this PR to remove React unknown-prop warnings emitted during tests and in built artifacts.

## 2.184.0

### Minor Changes

- [#2248](https://github.com/devopness/devopness/pull/2248) [`6d1d10e`](https://github.com/devopness/devopness/commit/6d1d10e6c8d813d12ff2194aacd5fd880921a096) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `DynamicField` component

  ### What Changed
  - Introduced a flexible `DynamicField` component capable of rendering different input types based on configuration:
    - `Input` for string and number fields
    - `TextArea` for multi-line text
    - `Select` for boolean (Yes/No) choices
  - Supports:
    - Label configuration with help tooltips
    - Error state handling with built-in `ErrorMessage`
    - External value and event control (agnostic to form libraries)
    - Sensitive data masking (`sensitive` prop)

  ### Example Usage

  ```tsx
  <DynamicField
    name="age"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    validation={{ type: 'number', min: 0, max: 100 }}
    labelProps={{ value: 'Age' }}
  />
  ```

  This component provides a highly reusable and configurable way to render form fields dynamically.
  It standardizes input rendering across the application, improves type safety and accessibility, and simplifies integration with different form management libraries in the Devopness UI library.

- [#2242](https://github.com/devopness/devopness/pull/2242) [`e37ab88`](https://github.com/devopness/devopness/commit/e37ab88020a5e9e7724f56ba06960afefc4a8a91) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Select` component

  ### What Changed
  - Introduced a reusable `Select` component built on top of `react-select`.
  - Supports:
    - `isReadOnly` mode (non-interactive but still displays value)
    - `isCreatable` for dynamic option creation
    - Custom `noOptionsMessage` handling
    - Error state with built-in `ErrorMessage`
  - Includes default styles, custom components, and full Storybook examples.

  ### Example Usage

  ```tsx
  <Select
    options={[
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ]}
    onChange={setValue}
  />
  ```

  This component provides a flexible and reusable dropdown selection experience, supports dynamic option creation and multi-selection, handles error states and read-only modes consistently, and follows accessibility and type-safety guidelines in the Devopness UI library.

## 2.183.0

### Minor Changes

- [#2219](https://github.com/devopness/devopness/pull/2219) [`19e7f7a`](https://github.com/devopness/devopness/commit/19e7f7a3f1e042ddfeefc0f6db541f21fd8a0c5f) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Status` component

  ### What Changed
  - Introduced `Status` component to display action statuses with icon, color, and tooltip.
  - Supports human-readable status and reason.
  - Uses `ViewDetailsContent` for consistent rendering in Devopness UI style.

  ### Example Usage

  ```tsx
  <Status
    status="completed"
    statusHumanReadable="Completed"
    statusReasonHumanReadable="All tasks finished successfully"
  />

  <Status
    status="failed"
    statusHumanReadable="Failed"
    statusReasonHumanReadable="Error occurred"
  />
  ```

  This component improves consistency for displaying action statuses in forms, lists, and detail views.

- [#2219](https://github.com/devopness/devopness/pull/2219) [`19e7f7a`](https://github.com/devopness/devopness/commit/19e7f7a3f1e042ddfeefc0f6db541f21fd8a0c5f) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `ViewDetails` component

  ### What Changed
  - Introduced `ViewDetails` to display multiple sections of detail items with labels and values.
  - Supports optional icons, navigation links, copy-to-clipboard functionality, hidden/sensitive content with toggle, and tooltips.
  - Added `ViewDetailsContent` for individual detail rows and `ViewDetailsLoading` for the loading state.

  ### Example Usage

  ```tsx
  import { ViewDetails, ViewDetailsContent, ViewDetailsLoading } from '@devopness/ui-react'
  import { DetailsContentProps } from '@devopness/ui-react'

  const sampleData: { label: string; items: DetailsContentProps[] }[] = [
    {
      label: 'User Info',
      items: [
        { label: 'Name', value: 'John Doe' },
        { label: 'Email', value: 'john@example.com', isCopyToClipboard: true }
      ]
    }
  ]

  <ViewDetails navigationComponent={NavigationLink} data={sampleData} />

  <ViewDetailsContent
    label="Website"
    value="https://example.com"
    url="https://example.com"
    navigationComponent={NavigationLink}
  />

  <ViewDetailsLoading />
  ```

  This component improves the display of structured information, enables consistent handling of sensitive or interactive content, and follows accessibility and type-safety guidelines in the Devopness UI library.

## 2.182.0

### Minor Changes

- [#2218](https://github.com/devopness/devopness/pull/2218) [`3850938`](https://github.com/devopness/devopness/commit/38509380a34013eaa8d641166f24ee90ed0e6821) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `ViewDetails` component

  ### What Changed
  - Introduced `ViewDetails` to display multiple sections of detail items with labels and values.
  - Supports optional icons, navigation links, copy-to-clipboard functionality, hidden/sensitive content with toggle, and tooltips.
  - Added `ViewDetailsContent` for individual detail rows and `ViewDetailsLoading` for the loading state.

  ### Example Usage

  ```tsx
  import { ViewDetails, ViewDetailsContent, ViewDetailsLoading } from '@devopness/ui-react'
  import { DetailsContentProps } from '@devopness/ui-react'

  const sampleData: { label: string; items: DetailsContentProps[] }[] = [
    {
      label: 'User Info',
      items: [
        { label: 'Name', value: 'John Doe' },
        { label: 'Email', value: 'john@example.com', isCopyToClipboard: true }
      ]
    }
  ]

  <ViewDetails navigationComponent={NavigationLink} data={sampleData} />

  <ViewDetailsContent
    label="Website"
    value="https://example.com"
    url="https://example.com"
    navigationComponent={NavigationLink}
  />

  <ViewDetailsLoading />
  ```

  This component improves the display of structured information, enables consistent handling of sensitive or interactive content, and follows accessibility and type-safety guidelines in the Devopness UI library.

## 2.181.0

### Minor Changes

- [#2211](https://github.com/devopness/devopness/pull/2211) [`bc7d55c`](https://github.com/devopness/devopness/commit/bc7d55cd6167636fad56dc60c3afb1df592c0fd7) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Review` component

  ### What Changed
  - Introduced `Review` component for displaying label/value pairs with optional icon and prefix.
  - Handles icon placement before or after the label using `isIconAfterLabel`.
  - Supports bold label, prefix margin, and custom background colors.
  - Provides `ReviewBox` as an optional container to group multiple `Review` components in examples.
  - Follows Devopness UI design and accessibility standards.

  ### Example Usage

  ```tsx
  import { Review, ReviewBox } from '@devopness/ui-react'

  <Review content="Status: Approved" icon="check" prefix="Info" />

  <ReviewBox type="default">
    <Review content="Status: Approved" icon="check" prefix="Info" />
    <Review content="Score: 85%" icon="star" isIconAfterLabel />
  </ReviewBox>
  ```

  This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.

- [#2212](https://github.com/devopness/devopness/pull/2212) [`3fa1dda`](https://github.com/devopness/devopness/commit/3fa1dda0f64a30fa96db8ab653c0ff7b3dcb3da9) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `ToggleContent` component

  ### What Changed
  - Introduced `ToggleContent` to show/hide sensitive content with a toggle button.
  - Supports optional warning when revealing sensitive content (`showWarning`).
  - Supports custom hidden content placeholders and disabling them.
  - Includes `ToggleContentButton` internally to handle toggle actions.

  ### Example Usage

  ```tsx
  <ToggleContent
    isSensitiveContent
    showWarning
    hiddenContentPlaceholder="*****"
  >
    <span>Secret value</span>
  </ToggleContent>
  ```

  ```tsx
  <ToggleContentButton
    showContent={showFileContent}
    onClick={() => {
      yourFunction
    }}
  />
  ```

  This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.

## 2.180.0

### Minor Changes

- [#2202](https://github.com/devopness/devopness/pull/2202) [`b2bd89e`](https://github.com/devopness/devopness/commit/b2bd89e77e1ca015432f215b4350a7bd2a9f5f94) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Autocomplete` component

  ### What Changed
  - Introduced the `Autocomplete` component wrapping MUI Autocomplete with a Devopness Input.
  - Supports free text input, custom options, and styled popper.
  - Maintains full typing for inputProps and autocompleteProps.

  ### Example Usage

  ```tsx
  <Autocomplete
    inputProps={{ placeholder: 'Type something' }}
    autocompleteProps={{
      options: [
        'Option 1',
        'Option 2',
      ],
      value: '',
      onChange: (event, value) => console.log(value),
    }}
  />
  ```

  This component improves form handling consistency, enhances reusability, and follows Devopness UI guidelines for accessibility and type safety.

- [#2204](https://github.com/devopness/devopness/pull/2204) [`ff260d8`](https://github.com/devopness/devopness/commit/ff260d8f25a9f4729b497f111d0d5ae209a1114f) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Popover` component

  ### What Changed
  - Introduced the `Popover` component as a flexible panel anchored to an element.
  - Supports optional header (`title`) and footer content (`footer`).
  - Handles close actions via built-in close button.
  - Uses `ConditionalWrapper` to render footer conditionally.
  - Follows Devopness UI design and accessibility standards.

  ### Example Usage

  ```tsx
  <Popover
    open={isOpen}
    anchorEl={anchorElement}
    onClose={() => setIsOpen(false)}
    title="Popover Title"
    footer={<div>Footer content</div>}
  >
    <div>Main content of the popover</div>
  </Popover>
  ```

  This component improves reusability for popover panels and provides a consistent header/footer layout.

- [#2203](https://github.com/devopness/devopness/pull/2203) [`7a3f991`](https://github.com/devopness/devopness/commit/7a3f9916e19592243d36c8b88e28d3c7041958f1) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `RadioSelectCards` component

  ### What Changed
  - Introduced the `RadioSelectCards` component to render radio options as selectable cards.
  - Supports icons, labels, and custom styling per card.
  - Handles loading state via `RingLoader`.
  - Handles error messages using the `ErrorMessage` primitive.
  - Forwards refs and accepts shared `inputProps` for each radio input.

  ### Example Usage

  ```tsx
  <RadioInput
    name="exampleRadio"
    data={[
      { value: 'gitlab', label: 'Gitlab', icon: 'gitlab' },
      {
        value: 'github',
        label: 'Github',
        icon: { name: 'github', color: 'blue' },
      },
    ]}
  />
  ```

  This component enhances form handling consistency, improves reusability, and follows Devopness UI guidelines for accessibility and type safety.

## 2.179.0

### Minor Changes

- [#2178](https://github.com/devopness/devopness/pull/2178) [`ad48b03`](https://github.com/devopness/devopness/commit/ad48b03719571dcdd52a2ed089ed683c66ff0df3) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `SourceAndHash` component

  ### What Changed
  - Introduced the `SourceAndHash` component to display commit hash with optional deployment source reference.
  - Wraps the commit hash and source reference in a link (`Link`) to the commit URL
  - Shows a tooltip (`Tooltip`) with the full commit message, which can be customized via `tooltipOptions`.

  ### Example Usage

  ```tsx
  <SourceAndHash
    commit={{
      hash: 'abcd123456',
      url: 'https://github.com/repo/commit/abcd123456',
      message: 'Fix bug',
    }}
    deployment={{ source_ref: 'feature/new-feature', source_type: 'branch' }}
    maxDisplayCharacters={8}
  />
  ```

  This component improves commit display consistency, enhances reusability across the application, and follows Devopness UI guidelines for accessibility, type safety, and visual clarity.

- [#2179](https://github.com/devopness/devopness/pull/2179) [`0e1df40`](https://github.com/devopness/devopness/commit/0e1df40fc4bef2b3d100d34fe5bd47e974c39861) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `TextArea` component

  ### What Changed
  - Introduced the `TextArea` component with flexible props for form usage.
  - Supports labels via `Label` primitive.
  - Handles error messages (`string`, `FieldError`, or custom object with `message`).
  - Optional `isResizable` prop to enable/disable textarea resizing.
  - Forwards refs to the native `<textarea>` element.

  ### Example Usage

  ```tsx
  <TextArea
    label={{ children: 'Comments' }}
    placeholder="Write your message..."
    error={{ message: 'Required field' }}
    isResizable={false}
  />
  ```

  This component improves form handling consistency, enhances reusability, and follows Devopness UI guidelines for accessibility and type safety.

## 2.178.0

### Minor Changes

- [#2170](https://github.com/devopness/devopness/pull/2170) [`a97c38e`](https://github.com/devopness/devopness/commit/a97c38e6386cd0d2d926e45c7b1165c55ca6629e) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `FormLoading` component

  ### What Changed
  - Introduced the `FormLoading` component, a structured loading state for forms.
  - Uses `Skeleton` placeholders for title, paragraph, separator line, and action buttons.
  - Accepts optional `ariaLabel` prop for accessibility.

  ### Example Usage

  ```tsx
  <FormLoading ariaLabel="Loading form content" />
  ```

  This component provides a consistent loading UI for forms across the application, improving UX and accessibility.

## 2.177.0

### Minor Changes

- [#2171](https://github.com/devopness/devopness/pull/2171) [`2a4882e`](https://github.com/devopness/devopness/commit/2a4882ea74a048bcf03b9c686714656ebf8f407e) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Illustration` component

  ### What Changed
  - Introduced the `Illustration` component that centers its children horizontally and vertically.
  - Provides a fixed height of `126px` and full width.
  - Adds a bottom border using the theme color `slate.300`.

  ### Example Usage

  ```tsx
  <Illustration>
    <img
      src="logo.png"
      alt="Logo"
    />
  </Illustration>
  ```

  This component improves visual consistency across the application and follows Devopness UI guidelines for reusability, type safety, and documentation.

## 2.176.0

### Minor Changes

- [#2169](https://github.com/devopness/devopness/pull/2169) [`a9ff2ef`](https://github.com/devopness/devopness/commit/a9ff2ef5ec4aca96a69cd836f35a21e8cd333146) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `FormText` component

  ### What Changed
  - Introduced the `FormText` component for displaying section titles with an optional subtitle and divider line.
  - Supports optional custom color for subtitle text.

  ### Example Usage

  ```tsx
  <FormText
    title="Form Section"
    subTitle="Optional description here"
    subTitleColor="#ef4444"
  />
  ```

  This component improves form section readability and consistency across the application.

## 2.175.0

### Minor Changes

- [#2164](https://github.com/devopness/devopness/pull/2164) [`0f90905`](https://github.com/devopness/devopness/commit/0f909050907f9b37b125d3e4bc6139d8e50d88d4) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Container` component

  ### What Changed
  - Introduced the `Container` component that provides a responsive 12-column grid layout with a styled content wrapper.
  - Supports optional removal of the default top margin (42px).
  - Allows customizing background color and height of the inner wrapper.

  ### Example Usage

  ```tsx
  <Container
    shouldHaveTopMargin={false}
    styles={{ backgroundWrapperContent: '#f5f5f5', height: 400 }}
  >
    <p>Page content here</p>
  </Container>
  ```

  This component improves layout consistency across the application and follows Devopness UI guidelines for reusability, type safety, and documentation.

## 2.174.0

### Minor Changes

- [#2162](https://github.com/devopness/devopness/pull/2162) [`8a4c518`](https://github.com/devopness/devopness/commit/8a4c5184425154bc831e50162d8edbdb1b1d3bc4) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `TimerCounter` component

  ### What Changed
  - Introduced the `TimerCounter` component for displaying a live-updating timer.
  - The component supports:
    - Starting, stopping, and resetting via boolean props (`shouldStartTimer`, `shouldStopTimer`, `shouldResetTimer`).
    - Custom date and duration formatting via `formatDateTime` and `formatDurationTime` props.

  ### Example Usage

  ```tsx
  <TimerCounter
    timerStartDate="2025-09-01T12:00:00Z"
    shouldStartTimer
    formatDurationTime={(start, end) => customFormatDurationTime(start, end)}
    formatDateTime={(date) => customFormatDateTime(date)}
  />
  ```

  This improves UI consistency and flexibility by allowing different formatting strategies and reusable timer logic.

## 2.173.0

### Minor Changes

- [#2143](https://github.com/devopness/devopness/pull/2143) [`a751033`](https://github.com/devopness/devopness/commit/a75103331a57c6183a75f21e5eaac6547343751f) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Migrate `Cover`, `LoadStarship`, `CheckBox`, `AccordionExpand`, and `PopoverPopupState` components

  ### What Changed
  - **Cover**: Renders a responsive cover with selectable logo variants (`white` or `colored`) and configurable background color. Only visible above the specified `minWidth`.
  - **LoadStarship**: Displays an animated starship loader. Supports full-window or container-based layouts.
  - **CheckBox**: Enhanced reusable checkbox component with support for controlled/uncontrolled states, strokes, error handling, and multiple sizes.
  - **AccordionExpand**: Flexible accordion component that supports standard items with callbacks and optional navigation links via `navigationComponent`.
  - **PopoverPopupState**: Wraps Material-UI Popover with `material-ui-popup-state`. Provides a reusable popover with automatic open/close state handling and a button trigger.

  ### Example Usage

  ```tsx
  // Cover
  <Cover minWidth="600px" logo="colored">
    <p>Content inside the Cover component</p>
  </Cover>

  // LoadStarship
  <LoadStarship isFullContainer />

  // CheckBox
  <CheckBox isChecked={true} isStroke={true} hasError={false} />

  // AccordionExpand standard
  <AccordionExpand
    label="Options"
    items={[
      { label: 'Option 1', onClick: async () => console.log('clicked') },
      { label: 'Option 2', onClick: () => console.log('clicked too') },
    ]}
  />

  // AccordionExpand with navigation
  <AccordionExpand
    label="Actions"
    items={[
      { label: 'Go Home', url: '/home' },
      { label: 'Go About', url: '/about' },
    ]}
    navigationComponent={MyNavLink}
  />

  // PopoverPopupState
  <PopoverPopupState trigger={<Button>Open Popover</Button>}>
    <div>Popover content here</div>
  </PopoverPopupState>
  ```

  This migration improves consistency, type safety, reusability, and developer experience by aligning all components with Devopness UI React standards, including proper documentation, testing, and Storybook integration.

## 2.172.0

### Minor Changes

- [#2109](https://github.com/devopness/devopness/pull/2109) [`5ba799d`](https://github.com/devopness/devopness/commit/5ba799d3749f6c35d4fa7d529fb1572f1073727a) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `FlexContainer` and `CopyToClipboard` components

  ### What Changed
  - Introduced the `FlexContainer` component for building flexible layouts easily with consistent styling.
  - Added the `CopyToClipboard` component that allows users to copy content to the clipboard with visual feedback via tooltip.
  - Both components follow the Devopness UI guidelines for reusability, type safety, and documentation.

  ### Example Usage

  ```tsx
  // FlexContainer
  <FlexContainer justify="center" align="center">
    <div>Item 1</div>
    <div>Item 2</div>
  </FlexContainer>

  // CopyToClipboard
  <CopyToClipboard id="example">
    Copy me
  </CopyToClipboard>
  ```

  These components improve UI consistency and developer productivity by providing reusable building blocks for layouts and clipboard interactions.

## 2.171.0

### Minor Changes

- [#2101](https://github.com/devopness/devopness/pull/2101) [`8fd037f`](https://github.com/devopness/devopness/commit/8fd037f877248e1192afdb82bbb2f1a687b42a22) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Refactor `Dropdown` component to add `popoverProps` for more flexible Popover styling

  ### What Changed
  - Refactored the `Dropdown` component to accept a new `popoverProps` property.
  - This prop allows consumers to fully customize the Popover, including `slotProps` and `paper` styles.
  - If `popoverProps` is not provided, the Popover falls back to a default style, ensuring backward compatibility.

  ### Example Usage

  ```tsx
  <Dropdown
    id="example-dropdown"
    options={[
      { label: 'Option 1' },
      { label: 'Option 2' },
    ]}
    anchorType="button"
    label="Open Menu"
    popoverProps={{
      slotProps: {
        paper: {
          marginTop: '5px',
          minWidth: '250px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        },
      },
    }}
  />
  ```

  This change allows full flexibility to style the Popover while keeping a default consistent look when `popoverProps` is not provided.

## 2.170.0

### Minor Changes

- [#2078](https://github.com/devopness/devopness/pull/2078) [`c92f8ed`](https://github.com/devopness/devopness/commit/c92f8edad77fc932ad2f5ba34674037a999a8bae) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `CardLoading` skeleton component for card placeholders

  ### What Changed
  - Introduced the `CardLoading` skeleton component to indicate content is being loaded inside a card
  - Displays placeholder elements for avatar, text bar, link, and icon to simulate the final layout
  - Ensures consistent loading experience across different parts of the application

  ### Example Usage

  ```tsx
  <CardLoading />
  ```

  This component provides a consistent visual skeleton for cards during data loading, helping improve perceived performance and maintain layout stability while content is fetched.

## 2.169.0

### Minor Changes

- [#2061](https://github.com/devopness/devopness/pull/2061) [`b52899d`](https://github.com/devopness/devopness/commit/b52899db8fb3b85c95ac77525121e12b0ef62ba3) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `hetzner` and `fastmcp` icons to the icon set

  ### What Changed
  - Added a new `hetzner` icon to the set of supported `Icon` options
  - Added a new `fastmcp` icon to the set of supported `Icon` options

  ### Example Usage

  ```tsx
  <Icon name="hetzner" size={14} color="blue.950" />
  <Icon name="python-fastmcp" size={14} color="blue.950" />
  ```

  These additions expand the available icon set for consistent and recognizable UI design.

## 2.168.0

### Minor Changes

- [#2036](https://github.com/devopness/devopness/pull/2036) [`4a32b3f`](https://github.com/devopness/devopness/commit/4a32b3f5349ded574ed7d4469c68b5c81e9419ec) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `EmptyData` component for empty states display

  ### What Changed
  - Introduced the `EmptyData` component to visually represent empty states in pages or sections with no data
  - Supports optional `image` and `message` props to customize the content
  - Accepts an `isSmallContainer` flag to adjust image size for smaller layouts

  ### Example Usage

  ```tsx
  <EmptyData />

  <EmptyData
    isSmallContainer
    image="/assets/images/empty-projects.png"
    message="No projects have been created yet. Use the Add button to get started."
  />
  ```

  This component helps improve user experience by clearly communicating when there's no content to show, offering optional visual and text customization.

## 2.167.0

### Minor Changes

- [#1998](https://github.com/devopness/devopness/pull/1998) [`bd3b2db`](https://github.com/devopness/devopness/commit/bd3b2db91e8ff76d8746a33a2fe2e20ae10311fc) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add new `Skeleton` component for loading placeholders

  ### What Changed
  - Introduced a new `Skeleton` component to represent loading states with optional width, height, percentage sizing, and border radius
  - Animated shimmer effect using themed background colors (e.g. `purple.300`, `indigo.100`...)
  - Accepts pixel or percentage-based dimensions via `width`, `height`, `widthPercent`, and `heightPercent` props
  - `borderRadius` prop for rounded visual

  ### Example Usage

  ```tsx
  <Skeleton width={120} height={20} />

  <Skeleton widthPercent={100} height={12} borderRadius={8} />
  ```

  This component improves visual feedback for content loading, allowing consistent placeholder elements throughout the app.

## 2.166.0

### Minor Changes

- [#1992](https://github.com/devopness/devopness/pull/1992) [`8274f9f`](https://github.com/devopness/devopness/commit/8274f9ffd0e7df9a86d2b866f0ef833ea5a03ad4) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Enhance `Input` component with password visibility toggle and add new `email` icon

  ### What Changed
  - Updated the `Input` component to support a password visibility toggle icon (`eyeOpen` / `eyeClosed`) **alongside** a custom icon (e.g. lock icon)
  - Ensures the visibility toggle is shown only when `type="password"` and `iconPosition !== 'right'`
  - Allows both icons (custom + visibility toggle) to appear without layout conflicts
  - Added a new `email` icon to the set of supported `Icon` options

  ### Example Usage

  ```tsx
  <Input
    type="password"
    placeholder="Enter your password"
    icon={iconLoader('lock')}
    iconPosition="left"
  />
  ```

  ```tsx
  <Icon
    name="email"
    size={14}
    color="blue.950"
  />
  ```

  These improvements enhance the flexibility and accessibility of the `Input` component and expand the available icon set for consistent UI design.

## 2.165.0

### Minor Changes

- [#1988](https://github.com/devopness/devopness/pull/1988) [`6152309`](https://github.com/devopness/devopness/commit/615230998d109c1c8b48c0dafce003a65eb6ec1d) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Add `Loader` and `Text` components to the design system

  ### What Changed
  - Introduced the `Text` component based on MUI's `Typography`
  - Added the `Loader` component with support for multiple variants: `bar`, `circle`, `ring`, and `page`
  - Added the [react-spinners](https://www.npmjs.com/package/react-spinners) library to provide a variety of customizable loading spinners
  - Loader components are built using `react-spinners` with props for `color`, `size`, `speedMultiplier`, `text`, `isAlignLeft`, and `paddingTop`

  ### Example Usage

  ```tsx
  <Text
    variant="h4"
    isSmall
  >
    Loading data...
  </Text>
  ```

  ```tsx
  <Loader
    variant="circle"
    color={getColor('purple.800')}
    text="Please wait..."
  />
  ```

  These new components enhance UI consistency and developer experience by providing ready-to-use typography and loading visuals.

## 2.164.1

### Patch Changes

- [#1971](https://github.com/devopness/devopness/pull/1971) [`8efb04b`](https://github.com/devopness/devopness/commit/8efb04bf546f6ad4e09d07ab985bf40cc71a178d) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Fix Dropdown link handling

  ### What Changed
  - Improved behavior of dropdown options with `url`, enabling the correct usage of a link `<a>` without preventing default behavior
  - Prevent link default behavior only when an `onClick` or `onSelect` handler is defined

  ### Example Usage

  ```tsx
  <Dropdown
    options={[
      {
        label: "Go to Dashboard",
        url: "/dashboard",
        linkProps: { target: "_self" },
      },
      {
        label: "Log out",
        onClick: async () => {
          await api.logout();
        },
      },
    ]}
  />


  This update improves usability and accessibility of link-based dropdown options, maintains expected browser behavior.
  ```

## 2.164.0

### Minor Changes

- [#1948](https://github.com/devopness/devopness/pull/1948) [`ff73888`](https://github.com/devopness/devopness/commit/ff7388887ef8063c949be362db9f21020d67500e) Thanks [@WillianSantosC](https://github.com/WillianSantosC)! - Improve Dropdown to support both sync and async handlers and add new Icon option

  ### What Changed
  - Refactored `onClick` and `onSelect` props to support both synchronous and asynchronous functions using `Promise.resolve()`
  - Introduced `handleDropdownOptionClick()` to centralize and simplify the click/select logic in the `Dropdown` component
  - Added support for the new `discord` icon in `iconLoader.tsx`

  ### Example Usage

  ```tsx
  <Dropdown
    options={[
      {
        label: 'Log out',
        onClick: async () => {
          await api.logout()
        },
      },
    ]}
  />
  ```

  ```tsx
  <Icon
    name={discord}
    size={14}
    color={'blue.950'}
  />
  ```

  This improves reusability and flexibility while ensuring the component gracefully handles both sync and async handlers and also adds support for a new icon.

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
    ;('add', 'remove', 'edit')

    // States
    ;('loading', 'error', 'success')

    // Variants
    ;('checkOutline', 'checkFilled')
    ;('eyeOpen', 'eyeClosed')
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
