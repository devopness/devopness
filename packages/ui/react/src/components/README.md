# src/components

Devopness UI React Components with Storybook Stories and Tests

## Contributing

### Component Development Guide

Before creating a new component, please:

1. Check if a similar component already exists
2. Discuss major changes in an issue first
   - [Devopness - Create new issue](https://github.com/devopness/devopness/issues/new/choose)

#### Directory Structure

```
src/components/
├── ComponentName/
│   ├── index.ts                  # Public exports
│   ├── ComponentName.tsx         # Main component
│   ├── ComponentName.styled.ts   # Styled components (if needed)
│   ├── ComponentName.stories.tsx # Storybook stories
│   └── ComponentName.test.tsx    # Unit tests
```

#### Development Checklist

- [ ] Implement the component
- [ ] Use proper prop naming conventions
- [ ] Include comprehensive JSDoc documentation
- [ ] Handle error states and edge cases
- [ ] Follow styling guidelines
- [ ] Add unit tests
- [ ] Add stories
- [ ] Update exports

#### Implementation Example

````typescript
   type MyComponentProps = {
     /** Whether the component is in a loading state */
     isLoading?: boolean
     /** Event handler called when the action is triggered */
     onAction?: () => void
   }

   /**
    * MyComponent provides a reusable pattern for...
    *
    * @example
    * ```jsx
    * <MyComponent
    *   isLoading={false}
    *   onAction={() => console.log('action triggered')}
    * />
    * ```
    */
   const MyComponent = ({ isLoading, onAction }: MyComponentProps) => {
     return (
       // Component JSX
     )
   }

   export type { MyComponentProps }
   export { MyComponent }
````

#### Styling Guidelines

- Follow responsive design patterns
- Use semantic HTML elements

#### Testing Requirements

- Create unit tests for component logic
- Test error states and edge cases

#### Stories

- Create stories using Storybook
- Include different variations/states
- Add controls for interactive props

#### Storybook Categories

Use the Storybook title to communicate the abstraction level of the component:

- `Primitives/` for low-level building blocks that are broadly reusable and have minimal domain behavior
- `Components/` for composed, reusable UI patterns built from primitives
- `Templates/` for higher-level demo compositions or page-like examples

Prefer nested titles that group related items by feature or family. For example:

- `Primitives/ResourceCard/ResourceCard`
- `Components/ResourceDataCard/ResourceDataCard`
- `Components/ResourceDataCard/ResourceDataCardList`
- `Templates/Card/Card`

Keep the category aligned with the component's role, not its visual appearance alone. A card that is mostly an atomic display surface belongs in `Primitives`; a card that includes list state, empty state, add/link actions, pagination, or resource-specific composition belongs in `Components`.

#### Export Pattern

```typescript
// index.ts
export * from './ComponentName'
// Update category index (e.g., Forms/index.ts)
export * from './ComponentName'
// Update root index if needed (components/index.ts)
export * from './Category'
```

#### Naming Conventions

##### Props

- Boolean props: Use auxiliary verbs (isLoading, hasError, shouldDisplay)
- Event handlers: Prefix with "on" (onClick, onSubmit, onValueChange)
- Child component props: Use "\<componentName\>Props" (buttonProps, inputProps)
  - Example:
    ```typescript
    const MyComponent = ({ isLoading, onAction, buttonProps }: MyComponentProps) => {
      return (
        <Button {...buttonProps}>
          My Component
        </Button>
      )
    }
    ```

##### Components

- Use PascalCase (Button, ArrowHead, Tooltip)

##### Styled Components

- Suffix with purpose (-Container, -Wrapper, -Item)
- Be specific (HeaderContainer vs Container)

#### Example Components

- See [Button](../components/Buttons/Button/Button.tsx) for basic component structure
- See [Input](../components/Forms/Input/Input.tsx) for form handling patterns
- See [Alert](../components/Forms/Alert/Alert.tsx) for styled-components usage
- See [Tooltip](../components/Primitives/Tooltip/Tooltip.tsx) for complex interactions

## Read More

- [Learn React - Describing the UI](https://react.dev/learn/describing-the-ui)
- [Storybook - What's a story?](https://storybook.js.org/docs/get-started/whats-a-story)
- [React Testing Library - Intro](https://testing-library.com/docs/react-testing-library/intro)
- [React Testing Library - Debugging](https://testing-library.com/docs/dom-testing-library/api-debugging/)
- [Styled Components - Getting Started](https://styled-components.com/docs/basics#getting-started)
