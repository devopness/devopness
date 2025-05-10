# src/test-utils

Test utilities to help write consistent and maintainable tests across the Devopness UI components.

## Directory Structure

```
src/test-utils/
├── interactions/ # User interaction test helpers
│ └── hoverTooltip.ts # Tooltip hover testing utilities
└── index.ts # Public exports
```

## Read More

- [Component Testing Guide](../components/README.md)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [User-Event Documentation](https://testing-library.com/docs/user-event/intro)
- [Testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet)

## Contributing

### Adding New Utilities

When adding new test utilities:

1. Create a new folder for the category (if needed)
1. Add the utility file with proper JSDoc documentation
1. Export from category index.ts
1. Update root index.ts

### Implementation Guidelines

- Keep utilities focused and single-purpose
- Use descriptive names that indicate the testing scenario
- Include comprehensive JSDoc documentation
- Handle common edge cases
- Follow Testing Library best practices

### Example Implementation

````typescript
type MyTestUtilOptions = {
  /** Description of option */
  option: string
}

/**
 * Brief description of what the utility does
 *
 * @example
 * ```typescript
 * await myTestUtil({ option: 'value' })
 * ```
 */
export async function myTestUtil(options: MyTestUtilOptions) {
  // Implementation
}
````
