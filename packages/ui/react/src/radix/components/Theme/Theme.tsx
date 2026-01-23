// Import the original Theme component
import { Theme as OriginalTheme } from '@radix-ui/themes'

type ThemeProps = {
  children: React.ReactNode
} & Omit<React.ComponentProps<typeof OriginalTheme>, 'accentColor'> & {
  accentColor?: React.ComponentProps<typeof OriginalTheme>['accentColor'] | 'devopness'
}

// Create our custom Theme component with default props
export const Theme = ({
  children,
  accentColor = 'devopness',
  ...props
}: ThemeProps) => {
  return (
    <OriginalTheme
      accentColor={accentColor as never}
      appearance="light"
      panelBackground="solid"
      {...props}
    >
      {children}
    </OriginalTheme>
  )
}
