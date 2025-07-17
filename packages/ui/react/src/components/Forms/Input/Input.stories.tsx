import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './Input'
import { iconLoader } from 'src/icons'

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
      message: 'It is an error message',
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
    placeholder: 'This input will auto-focus when an error occurs',
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

const WithIconLeft: Story = {
  args: {
    name: 'search',
    type: 'text',
    placeholder: 'Search...',
    labelProps: {
      htmlFor: 'search',
      value: 'Search',
      helpValue: 'Type to search for items',
    },
    icon: iconLoader('help'),
    iconPosition: 'left',
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

const WithIconRight: Story = {
  args: {
    name: 'config',
    type: 'text',
    placeholder: 'Select config',
    labelProps: {
      htmlFor: 'config',
      value: 'Config',
      helpValue: 'Click to select a config',
    },
    icon: iconLoader('config'),
    iconPosition: 'right',
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

const WithIconAndError: Story = {
  args: {
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    labelProps: {
      htmlFor: 'email',
      value: 'Email',
      helpValue: 'We will never share your email',
    },
    icon: iconLoader('email'),
    iconPosition: 'left',
    error: {
      message: 'Please enter a valid email address',
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

const WithIconDisabled: Story = {
  args: {
    name: 'username',
    type: 'text',
    placeholder: 'Username',
    labelProps: {
      htmlFor: 'username',
      value: 'Username',
      helpValue: 'This field is disabled',
    },
    icon: iconLoader('user'),
    iconPosition: 'left',
    disabled: true,
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

const IconShowcase: Story = {
  args: {
    name: 'showcase',
    type: 'text',
    labelProps: {
      htmlFor: 'showcase',
      value: 'Icon Showcase',
      helpValue: 'Examples of different icons and positions',
    },
    disabled: false,
    readOnly: false,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        id="search"
        name="search"
        type="text"
        labelProps={{ htmlFor: 'search', value: 'Search' }}
        placeholder="Search..."
        icon={iconLoader('help')}
        iconPosition="left"
      />
      <Input
        id="email"
        name="email"
        type="email"
        labelProps={{ htmlFor: 'email', value: 'Email' }}
        placeholder="Enter your email"
        icon={iconLoader('email')}
        iconPosition="left"
      />
      <Input
        id="password"
        name="password"
        type="password"
        labelProps={{ htmlFor: 'password', value: 'Password' }}
        placeholder="Enter your password"
        icon={iconLoader('lock')}
        iconPosition="left"
      />
      <Input
        id="username"
        name="username"
        type="text"
        labelProps={{ htmlFor: 'username', value: 'Username' }}
        placeholder="Enter your username"
        icon={iconLoader('user')}
        iconPosition="left"
      />
      <Input
        id="config"
        name="config"
        type="text"
        labelProps={{ htmlFor: 'config', value: 'Config' }}
        placeholder="Select a config"
        icon={iconLoader('config')}
        iconPosition="right"
      />
    </div>
  ),
  parameters: {
    controls: {
      exclude: [
        'publicStyle',
        'error',
        'icon',
        'iconPosition',
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

export {
  Default,
  Error,
  MultipleInputs,
  Number,
  WithAutoFocusOnError,
  WithIconLeft,
  WithIconRight,
  WithIconAndError,
  WithIconDisabled,
  IconShowcase,
}

export default meta
