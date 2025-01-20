# src/components

Devopness UI React Components with Storybook Stories and Tests

## FAQ

### How to add a new component?

1. **Create Component Structure**
   ```
   src/components/
   ├── ComponentName/
   │   ├── index.ts
   │   ├── ComponentName.tsx
   │   ├── ComponentName.styled.ts  (if needed)
   │   ├── ComponentName.stories.tsx
   │   └── ComponentName.test.tsx
   ```

2. **Component Implementation (ComponentName.tsx)**
   - Use TypeScript for type safety
   - Export both component and props type
   - Add comprehensive JSDoc documentation
   - Follow naming conventions:
     - Use descriptive boolean props with auxiliary verbs (isLoading, hasError)
     - Prefix event handlers with "on" (onClick, onSubmit)
     - Use named exports

   Example:
   ```typescript
   type MyComponentProps = {
     /** Description of what this prop does */
     isLoading?: boolean
     /** Handler called when action occurs */
     onAction?: () => void
   }

   /**
    * Brief description of what the component does
    *
    * @example
    * ```jsx
    * <MyComponent 
    *   isLoading={false}
    *   onAction={() => console.log('clicked')}
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
   ```

3. **Styled Components (ComponentName.styled.ts)**
   - Create styles using Styled Components
   - Use [transient props](https://styled-components.com/docs/api#transient-props) when needed

4. **Stories (ComponentName.stories.tsx)**
   - Create stories using Storybook
   - Include different variations/states
   - Add controls for interactive props

5. **Tests (ComponentName.test.tsx)**
   - Write comprehensive tests using Vitest
   - Test rendering, interactions, and edge cases
   - Use React Testing Library best practices
   - Test accessibility where applicable

6. **Export Component (index.ts)**
   ```typescript
   export * from './ComponentName'
   ```

7. **Update Parent `index.ts`**
   - Add export in the appropriate category index file (Buttons, Forms, Primitives, etc.)
   - Update root components/index.ts if needed

8. **Documentation**
   - Add JSDoc comments for the component and all props
   - Include usage examples in the component's JSDoc
   - Document any complex logic or important implementation details

For examples of these patterns, see:
- Button component for structure and implementation
- Input component for comprehensive prop types
- Alert component for styled-components usage
- Tooltip component for complex interactions

## Read More

- [Learn React - Describing the UI](https://react.dev/learn/describing-the-ui)
- [Storybook - What's a story?](https://storybook.js.org/docs/get-started/whats-a-story)
- [React Testing Library - Intro](https://testing-library.com/docs/react-testing-library/intro)
- [React Testing Library - Debugging](https://testing-library.com/docs/dom-testing-library/api-debugging/)
- [Styled Components - Getting Started](https://styled-components.com/docs/basics#getting-started)
