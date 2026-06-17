import React from 'react'
import type { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const user = userEvent.setup()

  return {
    ...render(ui, {
      wrapper: AllTheProviders,
      ...options,
    }),
    user,
  }
}

export { customRender as render }
