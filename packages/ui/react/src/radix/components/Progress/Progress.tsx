import { Progress as RadixProgress } from '@radix-ui/themes'

type ProgressProps = Omit<React.ComponentProps<typeof RadixProgress>, 'variant'>

export const Progress = (props: ProgressProps) => (
  <RadixProgress
    variant="soft"
    {...props}
  />
)
