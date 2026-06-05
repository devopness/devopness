import { render, screen, fireEvent } from '@testing-library/react'

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Radio } from './Radio'

describe('Radio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the label and items', () => {
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={vi.fn()}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
        <Radio.Item
          value="b"
          label="Option B"
        />
      </Radio.Root>
    )
    expect(screen.getByText('Pick one')).toBeInTheDocument()
    expect(screen.getByLabelText('Option A')).toBeInTheDocument()
    expect(screen.getByLabelText('Option B')).toBeInTheDocument()
  })

  it('marks the selected radio according to value', () => {
    render(
      <Radio.Root
        label="Pick one"
        value="b"
        onChange={vi.fn()}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
        <Radio.Item
          value="b"
          label="Option B"
        />
      </Radio.Root>
    )
    expect(screen.getByLabelText('Option B')).toBeChecked()
    expect(screen.getByLabelText('Option A')).not.toBeChecked()
  })

  it('calls onChange with the selected value when an item is clicked', () => {
    const onChange = vi.fn()
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={onChange}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
        <Radio.Item
          value="b"
          label="Option B"
        />
      </Radio.Root>
    )
    fireEvent.click(screen.getByLabelText('Option A'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('renders an error message when error is set', () => {
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={vi.fn()}
        error="Required"
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
      </Radio.Root>
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('does not render an error message when error is undefined', () => {
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={vi.fn()}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
      </Radio.Root>
    )
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })

  it('exposes the group as a radiogroup labeled by the visible label', () => {
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={vi.fn()}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
      </Radio.Root>
    )
    expect(
      screen.getByRole('radiogroup', { name: /Pick one/ })
    ).toBeInTheDocument()
  })

  it('forwards the name prop to the underlying RadioGroup', () => {
    render(
      <Radio.Root
        label="Pick one"
        name="myField"
        value=""
        onChange={vi.fn()}
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
      </Radio.Root>
    )
    expect(screen.getByLabelText('Option A')).toHaveAttribute('name', 'myField')
  })

  it('wires aria-invalid and aria-describedby when error is set', () => {
    render(
      <Radio.Root
        label="Pick one"
        value=""
        onChange={vi.fn()}
        error="Required"
      >
        <Radio.Item
          value="a"
          label="Option A"
        />
      </Radio.Root>
    )
    const group = screen.getByRole('radiogroup', { name: /Pick one/ })
    expect(group).toHaveAttribute('aria-invalid', 'true')
    const describedBy = group.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(screen.getByText('Required')).toHaveAttribute('id', describedBy)
  })
})
