import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { RadioSelectCards } from './RadioSelectCards'

const sampleData = [
  { value: 'option1', label: 'Option 1', icon: 'icon1' },
  {
    value: 'option2',
    label: 'Option 2',
    icon: { name: 'icon2', color: 'blue' },
  },
]

const stackGroups = [
  {
    data: [
      {
        value: 'docker',
        label: 'Docker',
        icon: 'docker',
        description: 'Use the runtime defaults without framework helpers.',
      },
    ],
  },
  {
    label: '.NET (C#/F#)',
    description: 'Choose the framework and runtime used to build your app.',
    data: [
      {
        value: 'dotnetcore',
        label: '.NET (C#/F#)',
        icon: 'dotnetcore',
        description: 'Use the runtime defaults without framework helpers.',
      },
      {
        value: 'dotnetcore-aspnetcore',
        label: 'ASP.NET Core',
        icon: 'dotnetcore-aspnetcore',
        description: 'Framework defaults will be applied automatically.',
      },
    ],
  },
]

describe('RadioSelectCards', () => {
  it('renders without crashing', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
      />
    )
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={[]}
        isLoading
      />
    )
    const loader = screen.getByTestId('radio-select-cards-loader')
    expect(loader).toBeInTheDocument()
  })

  it('renders error message', () => {
    const error = { message: 'Please select an option' }
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
        error={error}
      />
    )
    expect(screen.getByText(error.message)).toBeInTheDocument()
  })

  it('allows selecting a radio option', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        data={sampleData}
      />
    )

    const option1 = screen.getByRole('radio', {
      name: 'Option 1',
    }) as HTMLInputElement

    const option2 = screen.getByRole('radio', {
      name: 'Option 2',
    }) as HTMLInputElement

    fireEvent.click(option1)
    expect(option1.checked).toBe(true)
    expect(option2.checked).toBe(false)

    fireEvent.click(option2)
    expect(option1.checked).toBe(false)
    expect(option2.checked).toBe(true)
  })

  it('renders grouped stack-style cards with helper text', () => {
    render(
      <RadioSelectCards
        name="exampleRadio"
        groups={stackGroups}
        showSelectionIndicator={false}
        density="compact"
      />
    )

    expect(screen.getAllByText('.NET (C#/F#)')).toHaveLength(2)
    expect(
      screen.getByText(
        'Choose the framework and runtime used to build your app.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('Framework defaults will be applied automatically.')
    ).toBeInTheDocument()

    const aspNetCore = screen.getByRole('radio', {
      name: 'ASP.NET Core',
    }) as HTMLInputElement

    fireEvent.click(aspNetCore)
    expect(aspNetCore.checked).toBe(true)
  })

  it('does not warn when a data item sets both checked and defaultChecked', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn())

    render(
      <RadioSelectCards
        name="exampleRadio"
        inputProps={{ onChange: vi.fn() }}
        data={[
          {
            value: 'option1',
            label: 'Option 1',
            icon: 'icon1',
            checked: true,
            defaultChecked: false,
          },
          {
            value: 'option2',
            label: 'Option 2',
            icon: 'icon2',
            checked: false,
            defaultChecked: true,
          },
        ]}
      />
    )

    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
