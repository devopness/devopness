# src/icons

Devopness UI Icons

## Contributing

### Icon Development Guide

Before adding a new icon, please:

1. Check if a similar icon already exists
2. Follow the naming conventions strictly
3. Discuss major changes in an issue first
   - [Devopness - Create new issue](https://github.com/devopness/devopness/issues/new/choose)

#### Directory Structure

```
src/icons/
├── getImageAssetUrl.ts # Devopness CDN image asset URL getter
├── iconLoader.tsx      # Main icon loader
├── index.ts            # Public exports
├── README.md           # Documentation
└── types.ts            # Icon types
```

#### Icon Naming Conventions

We follow patterns from successful icon libraries like [Material-UI](https://material.io/design/iconography/system-icons.html) and [Heroicons](https://heroicons.com/):

1. **General Rules**:

   - Use camelCase (e.g. `arrowUp`, `arrowDown`, `arrowLeft`, `arrowRight`)
     - Except for technology/brand icons (e.g. `aws`, `docker`, `nodejs`)
   - Be descriptive and action-oriented (e.g. `add`, `remove`, `edit`, `delete`)
   - Avoid library-specific prefixes (e.g. `md`, `fa`, `go`)

2. **Common Patterns**:

   ```typescript
   // Actions
   'add', 'remove', 'edit', 'delete'

   // States
   'loading', 'error', 'success', 'warning'

   // Directional
   'arrowUp', 'arrowDown', 'arrowLeft', 'arrowRight'

   // Variants
   'checkOutline', 'checkFilled'
   'eyeOpen', 'eyeClosed'
   ```

3. **Technology/Brand Icons**:
   - Use lowercase
   - Use hyphens for compounds
   ```typescript
   'aws', 'docker', 'nodejs'
   'dotnet-core', 'python-django'
   ```

#### Implementation Example

```typescript
// New icon addition
const iconList = [
  {
    type: 'icon',
    name: 'arrowDown', // Clear, action-oriented name
    component: MdKeyboardArrowDown,
  },
  {
    type: 'image',
    name: 'python-django', // Technology name with hyphen
    component: pythonDjangoSVG,
  },
] as const
```

#### Deprecation Guide

When deprecating icons:

1. Add the icon to the iconList with type 'deprecated-icon':

   ```typescript
   {
     type: 'deprecated-icon',
     name: 'downArrow',
     component: MdKeyboardArrowDown,
     newName: 'arrowDown'  // The new icon name to use instead, or undefined if the icon is being removed permanently
   }
   ```

   Or for images:

   ```typescript
   {
     type: 'deprecated-image',
     name: 'rightArrow',
     component: MdKeyboardArrowRight,
     newName: undefined // The new icon name to use instead, or undefined if the icon is being removed permanently
   }
   ```

2. The deprecated icon will automatically be:
   - Added to the `deprecatedToNewIconMap` for easy migration
   - Excluded from the `Icon` type
     - Users will get a type error when trying to use the deprecated icon

There are two ways to handle deprecated icons and fix the type error:

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

## Read More

- [React Icons](https://react-icons.github.io/react-icons/)
- [Material UI Icons Guidelines](https://m3.material.io/styles/icons/applying-icons)
- [Heroicons](https://heroicons.com/)
