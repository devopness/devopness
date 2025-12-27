---
"@devopness/ui-react": patch
---

Stop forwarding styling/transient props (like `hasError`, `iconPosition`, `removeArrows`, `noResize`) to DOM elements, this reduces React "unknown prop" warnings by ensuring styling-only props are consumed by `styled-components` and not forwarded to native elements.

### What Changed
- Converted several styled-component props to transient props (prefixed with `$`) and stopped spreading internal styling props into DOM-rendered elements for the following components:
	- `src/components/Forms/Input/*` (styled + component)
	- `src/components/Forms/TextArea/*` (styled + component)
	- `src/components/Forms/Autocomplete/*` (renderInput integration; avoid spreading MUI params into DOM)
