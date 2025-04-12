import { render, screen } from '@testing-library/react'
import { Button } from '../Button'
import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('renders children buttons', () => {
    render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('applies horizontal layout by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ flexDirection: 'row' })
  })

  it('applies vertical layout when isVertical is true', () => {
    const { container } = render(
      <ButtonGroup isVertical>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ flexDirection: 'column' })
  })

  it('applies spacing between buttons by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ gap: '10px' })
  })

  it('removes spacing between buttons when hasSpacing is false', () => {
    const { container } = render(
      <ButtonGroup hasSpacing={false}>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ gap: '0' })
  })

  it('aligns buttons to the right when isRightAligned is true', () => {
    const { container } = render(
      <ButtonGroup isRightAligned>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ justifyContent: 'flex-end' })
  })

  it('aligns buttons to the left by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ justifyContent: 'flex-start' })
  })

  it('stretches buttons vertically when isVertical is true', () => {
    const { container } = render(
      <ButtonGroup isVertical>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ alignItems: 'stretch' })
  })

  it('centers buttons horizontally by default', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttonGroup = container.firstChild
    expect(buttonGroup).toHaveStyle({ alignItems: 'center' })
  })

  it('removes margin from child buttons', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    )

    const buttons = container.querySelectorAll('button')
    buttons.forEach(button => {
      expect(button).toHaveStyle({ margin: '0' })
    })
  })
}) 