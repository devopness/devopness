---
"@devopness/ui-react": patch
---

Stop forwarding styling/transient props (like `hasError`, `iconPosition`, `removeArrows`, `noResize`) to DOM elements, this reduces React "unknown prop" warnings by ensuring styling-only props are consumed by `styled-components` and not forwarded to native elements.

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
