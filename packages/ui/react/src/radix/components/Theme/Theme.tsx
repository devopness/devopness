// Import the original Theme component
import { Theme as OriginalTheme } from '@radix-ui/themes'

// Create our custom Theme component with default props
export const Theme = ({ children, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof OriginalTheme>) => {
  return (
    <OriginalTheme
      accentColor="cyan"
      appearance="dark"
      panelBackground="solid"
      {...props}
    >
      {children}
    </OriginalTheme>
  )
}
