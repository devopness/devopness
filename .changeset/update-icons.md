---
"@devopness/ui-react": minor
---

Enhanced icon system with consistent naming patterns

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