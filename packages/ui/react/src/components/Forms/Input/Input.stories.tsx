import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './Input'

const meta = {
  title: 'Form/Input',
  component: Input,
} satisfies Meta<typeof Input>

type Story = StoryObj<typeof meta>

const Default: Story = {
  args: {
    name: 'name',
    type: 'text',
    placeholder: 'Placeholder',
    labelProps: {
      htmlFor: 'name',
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
      htmlFor: 'name',
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
}

const Number: Story = {
  args: {
    name: 'name',
    type: 'number',
    placeholder: 'Placeholder',
    labelProps: {
      htmlFor: 'name',
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

const WithAutoFocusOnError: Story = {
  args: {
    name: 'name',
    type: 'text',
    placeholder: 'This input will auto-focus when error occurs',
    labelProps: {
      htmlFor: 'name',
      value: 'Auto-focus on error',
      helpValue: 'This input will automatically focus when an error occurs',
    },
    error: {
      message: 'This field has an error',
    },
    autoFocusOnError: true,
  },
  parameters: {
    controls: {
      exclude: [
        'publicStyle',
      ],
    },
  },
}

const MultipleInputs: Story = {
  args: {
    name: 'name',
    type: 'text',
    labelProps: {
      htmlFor: 'name',
      value: 'it is a label',
      helpValue: 'it is a help',
    },
    publicStyle: {
      fontStylePlaceholder: 'Placeholder font style',
    },
    disabled: false,
    readOnly: false,
  },
  render: () => (
    <div>
      <Input
        id="name"
        name="name"
        type="text"
        labelProps={{ htmlFor: 'name', value: 'Name' }}
        placeholder="Type your name"
      />
      <Input
        id="email"
        name="email"
        type="email"
        labelProps={{ htmlFor: 'email', value: 'E-mail' }}
        placeholder="Type your e-mail"
      />
    </div>
  ),
}

export { Default, Error, Number, WithAutoFocusOnError, MultipleInputs }

export default meta
