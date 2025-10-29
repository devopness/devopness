import type { Meta, StoryObj } from '@storybook/react-vite'

import { Autocomplete } from './Autocomplete'
import type { AutocompleteProps } from './Autocomplete'

const meta: Meta<AutocompleteProps> = {
  title: 'Form/Autocomplete',
  component: Autocomplete,
  args: {
    inputProps: {
      labelProps: {
        value: 'Source Provider',
      },
      placeholder: 'Select or type to search',
    },
    autocompleteProps: {
      options: [
        'github',
        'gitlab',
        'bitbucket',
      ],
    },
  },
}

type Story = StoryObj<AutocompleteProps>

const Default: Story = {
  args: {},
}

export default meta
export { Default }
