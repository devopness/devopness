import React from 'react'

import Typography, { TypographyProps } from '@mui/material/Typography'

type TextProps = {
  className: string
  children: React.ReactNode
  variant?: TypographyProps['variant'] | 'span'
  isSmall?: boolean
}

const Text = ({
  children,
  className,
  variant,
  isSmall,
  ...restProps
}: TextProps) => (
  <Typography
    variant={variant !== 'span' ? variant : undefined}
    className={className}
    style={{
      fontSize: isSmall ? '0.8em' : undefined,
    }}
    {...restProps}
  >
    {children}
  </Typography>
)

export { Text }
