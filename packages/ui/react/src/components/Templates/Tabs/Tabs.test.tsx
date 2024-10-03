import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tabs } from '.'

describe('Tabs', () => {
  it('renders properly', () => {
    const data = [
      { label: 'details', component: 'details content' },
      { label: 'variables', component: 'variable content' },
    ]
    const { rerender } = render(
      <Tabs
        data={data}
        currentTabIndex={0}
      />
    )
    expect(screen.getByText(data[0].component)).toBeInTheDocument()

    rerender(
      <Tabs
        data={data}
        currentTabIndex={1}
      />
    )
    expect(screen.getByText(data[1].component)).toBeInTheDocument()
  })
})
