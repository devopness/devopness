import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';
import { Container } from './Input.styled';

const meta = {
  title: 'Form/Input',
  component: Input,
  parameters: { docs: { source: { type: 'code' } } },
  render: (args) => (
    <Container>
      <Input {...args} />
    </Container>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

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
      exclude: ['publicStyle', 'error'],
    },
  },
};

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
      exclude: ['publicStyle'],
    },
  },
};

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
      exclude: ['publicStyle', 'error'],
    },
  },
};

const WithAutoFocusOnError: Story = {
  args: {
    name: 'name',
    type: 'text',
    placeholder: 'This input will auto-focus when error occurs',
    labelProps: {
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
      exclude: ['publicStyle'],
    },
  },
};

export { Default, Error, Number, WithAutoFocusOnError };