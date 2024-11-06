import '@testing-library/jest-dom'

import { act, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Dropdown } from '.'

describe('Dropdown', () => {
  it('render correctly with required props', () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[]}
      />
    )

    const subjectDropdown = screen.getByText('Menu')
    expect(subjectDropdown).toBeInTheDocument()
  })

  it('show dropdown options when anchor is clicked', () => {
    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[
          {
            label: 'Remove',
            badge: { icon: true, name: 'delete' },
          },
        ]}
      />
    )

    const subjectDropdown = screen.getByText('Menu')
    expect(subjectDropdown).toBeInTheDocument()

    act(() => {
      subjectDropdown.click()
    })

    const subjectRemove = screen.getByText('Remove')
    expect(subjectRemove).toBeInTheDocument()
  })

  it('click dropdown option', () => {
    const onClick = vi.fn(() => null)

    render(
      <Dropdown
        id="test-dropdown"
        anchorType="button"
        label="Menu"
        options={[
          {
            label: 'Remove',
            badge: { icon: true, name: 'delete' },
            onClick,
          },
        ]}
      />
    )

    const subjectDropdown = screen.getByText('Menu')
    expect(subjectDropdown).toBeInTheDocument()

    expect(onClick).not.toHaveBeenCalled()

    act(() => {
      subjectDropdown.click()
    })

    const subjectRemove = screen.getByText('Remove')
    expect(subjectRemove).toBeInTheDocument()

    act(() => {
      subjectRemove.click()
    })

    expect(onClick).toHaveBeenCalled()
  })
})
