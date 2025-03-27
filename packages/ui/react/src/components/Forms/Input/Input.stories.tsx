import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './Input'
import { Container } from './Input.styled'

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: {
    docs: {
      source: { type: 'code' },
      description: {
        component: `
A flexible input component that supports:
- Various input types (text, number, etc.)
- Error states with automatic focus
- Custom styling
- Label and help text

When an error state is applied, the input will automatically receive focus to draw the user's attention.
    `,
      },
    },
  },
  render: (args) => (
    <Container>
      <Input {...args} />
    </Container>
  ),
} satisfies Meta<typeof Input>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    name: 'name',
    type: 'text',
    placeholder: 'Placeholder',
    labelProps: {
      value: 'it is a label',
      helpValue: 'it is a help',
    },
    publicStyle: {
      fontStylePlaceholder: 'Placeholder font style',
    },
    disabled: false,
    readOnly: false,
  },
  parameters: {
    controls: {
      exclude: [
        'publicStyle',
        'error',
      ],
    },
  },
}

const Error: Story = {
  args: {
    name: 'name',
    type: 'text',
    placeholder: 'Placeholder',
    labelProps: {
      value: 'it is a label',
      helpValue: 'it is a help',
    },
    publicStyle: {
      fontStylePlaceholder: 'Placeholder font style',
    },
    error: {
      message: 'It is a error message',
    },
    disabled: false,
    readOnly: false,
  },
  parameters: {
    controls: {
      exclude: [
        'publicStyle',
      ],
    },
  },
  render: (args) => <InputWithErrorToggle {...args} />,
}

/**
 * Component to demonstrate the error state handling for
 * the Input component by providing a button that toggles
 * the error state.
 */
const InputWithErrorToggle = (args: React.ComponentProps<typeof Input>) => {
  const [
    hasError,
    setHasError,
  ] = useState(false)

  return (
    <div>
      <Input
        {...args}
        error={hasError ? { message: 'This field has an error!' } : undefined}
      />
      <button
        onClick={() => {
          setHasError((prev) => !prev)
        }}
        style={{ marginTop: '1rem' }}
      >
        Toggle Error
      </button>
      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
        Click the button to toggle error state. The input will automatically
        focus when the error appears.
      </p>
    </div>
  )
}

const Number: Story = {
  args: {
    name: 'name',
    type: 'number',
    placeholder: 'Placeholder',
    labelProps: {
      value: 'it is a label',
      helpValue: 'it is a help',
    },
    publicStyle: {
      fontStylePlaceholder: 'Placeholder font style',
    },
    disabled: false,
    readOnly: false,
  },
  parameters: {
    controls: {
      exclude: [
        'publicStyle',
        'error',
      ],
    },
  },
}

export default meta
export { Default, Number, Error }
