import { useState } from 'react'
import type { ActionMeta, MultiValue, SingleValue } from 'react-select'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './index'
import type { OptionProps } from './index'

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
}

const options: OptionProps<string>[] = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' },
  { label: 'Option C', value: 'C' },
]

const StoryContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minWidth: 300, padding: 16 }}>{children}</div>
)

const ControlledSelect = () => {
  const [value, setValue] = useState<
    SingleValue<OptionProps<string>> | MultiValue<OptionProps<string>>
  >(null)

  const handleChange = (
    newValue: MultiValue<OptionProps<string>> | SingleValue<OptionProps<string>>
  ) => {
    setValue(newValue)
  }

  return (
    <StoryContainer>
      <Select
        options={options}
        value={value}
        onChange={handleChange}
        placeholder="Select an option..."
      />
    </StoryContainer>
  )
}

const Default: StoryObj<typeof Select> = {
  render: () => <ControlledSelect />,
}

const WithError: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={options}
        error={{ message: 'This field is required' }}
        placeholder="Select an option..."
      />
    </StoryContainer>
  ),
}

const ReadOnly: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={options}
        value={options[1]}
        isReadOnly
        placeholder="Read only select"
      />
    </StoryContainer>
  ),
}

const ControlledMultiSelect = () => {
  const [value, setValue] = useState<MultiValue<OptionProps<string>>>([])

  const handleChange = (
    newValue:
      | MultiValue<OptionProps<string>>
      | SingleValue<OptionProps<string>>,
    _: ActionMeta<OptionProps<string>>
  ) => {
    setValue(Array.isArray(newValue) ? newValue : [])
  }

  return (
    <StoryContainer>
      <Select
        options={options}
        value={value}
        isMulti
        onChange={handleChange}
        placeholder="Select multiple options..."
      />
    </StoryContainer>
  )
}

const Multiselect: StoryObj<typeof Select> = {
  render: () => <ControlledMultiSelect />,
}

const CreatableControlledSelect = () => {
  const [value, setValue] = useState<
    SingleValue<OptionProps<string>> | MultiValue<OptionProps<string>>
  >(null)

  return (
    <StoryContainer>
      <Select
        options={options}
        isCreatable
        placeholder="Create or select..."
        value={value}
        onChange={setValue}
        onCreateOption={(input) => {
          alert(`Created new option: ${input}`)
        }}
      />
    </StoryContainer>
  )
}

const Creatable: StoryObj<typeof Select> = {
  render: () => <CreatableControlledSelect />,
}

const CustomNoOptionsMessage: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={[]}
        placeholder="Try typing something..."
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No match for "${inputValue}"` : 'No options available'
        }
      />
    </StoryContainer>
  ),
}

const optionsWithIcons: OptionProps<string>[] = [
  {
    icon: 'github',
    value: 'GitHub',
    label: 'GitHub',
  },
  {
    icon: 'gitlab',
    value: 'Gitlab',
    label: 'Gitlab',
  },
  {
    icon: 'bitbucket',
    value: 'Bitbucket',
    label: 'Bitbucket',
  },
]

const WithIcons: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithIcons}
        placeholder="Select with icons..."
      />
    </StoryContainer>
  ),
}

const optionsWithDescriptions: OptionProps<string>[] = [
  {
    icon: 'github',
    labelDescriptionIconName: 'info',
    value: 'GitHub',
    label: 'GitHub',
    labelDescription: 'Collaborate with Git version control',
  },
  {
    icon: 'gitlab',
    labelDescriptionIconName: 'info',
    value: 'Gitlab',
    label: 'GitLab',
    labelDescription: 'Complete DevOps platform',
  },
  {
    icon: 'bitbucket',
    labelDescriptionIconName: 'info',
    value: 'Bitbucket',
    label: 'Bitbucket',
    labelDescription: 'Git solution for teams using Jira',
  },
  {
    icon: 'aws',
    labelDescriptionIconName: 'info',
    value: 'AWS',
    label: 'AWS CodeCommit',
    labelDescription: 'Fully managed source control service',
  },
]

const WithDescriptions: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithDescriptions}
        placeholder="Select a provider..."
      />
    </StoryContainer>
  ),
}

const optionsWithDescriptionsNoIcons: OptionProps<string>[] = [
  {
    value: 'github',
    label: 'GitHub',
    labelDescription: 'Fully managed source control service',
  },
  {
    value: 'gitlab',
    label: 'GitLab',
    labelDescription: 'DevOps platform with CI/CD',
  },
  {
    value: 'bitbucket',
    label: 'Bitbucket',
    labelDescription: 'Git solution with Jira integration',
  },
  {
    value: 'aws',
    label: 'AWS CodeCommit',
    labelDescription: 'Fully managed source control service',
  },
]

const optionsWithDescriptionsNoFirstIcon: OptionProps<string>[] = [
  {
    value: 'github',
    label: 'GitHub',
    labelDescription: 'Fully managed source control service',
    labelDescriptionIconName: 'info',
  },
  {
    value: 'gitlab',
    label: 'GitLab',
    labelDescription: 'DevOps platform with CI/CD',
    labelDescriptionIconName: 'info',
  },
  {
    value: 'bitbucket',
    label: 'Bitbucket',
    labelDescription: 'Git solution with Jira integration',
    labelDescriptionIconName: 'info',
  },
  {
    value: 'aws',
    label: 'AWS CodeCommit',
    labelDescription: 'Fully managed source control service',
    labelDescriptionIconName: 'info',
  },
]

const optionsWithDescriptionsNoSecondIcon: OptionProps<string>[] = [
  {
    value: 'github',
    icon: 'github',
    label: 'GitHub',
    labelDescription: 'Fully managed source control service',
  },
  {
    value: 'gitlab',
    icon: 'gitlab',
    label: 'GitLab',
    labelDescription: 'DevOps platform with CI/CD',
  },
  {
    value: 'bitbucket',
    icon: 'bitbucket',
    label: 'Bitbucket',
    labelDescription: 'Git solution with Jira integration',
  },
  {
    value: 'aws',
    icon: 'aws',
    label: 'AWS CodeCommit',
    labelDescription: 'Fully managed source control service',
  },
]

const WithDescriptionsNoIcons: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithDescriptionsNoIcons}
        placeholder="Select a provider (no icons)..."
      />
    </StoryContainer>
  ),
}

const WithDescriptionsHideFirstIcon: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithDescriptionsNoFirstIcon}
        placeholder="Select a provider (only description icon)..."
      />
    </StoryContainer>
  ),
}

const WithDescriptionsHideSecondIcon: StoryObj<typeof Select> = {
  render: () => (
    <StoryContainer>
      <Select
        options={optionsWithDescriptionsNoSecondIcon}
        placeholder="Select a provider (only label icon)..."
      />
    </StoryContainer>
  ),
}

const ControlledSelectWithDescriptions = () => {
  const [value, setValue] = useState<
    SingleValue<OptionProps<string>> | MultiValue<OptionProps<string>>
  >(null)

  const handleChange = (
    newValue: MultiValue<OptionProps<string>> | SingleValue<OptionProps<string>>
  ) => {
    setValue(newValue)
  }

  return (
    <StoryContainer>
      <Select
        options={optionsWithDescriptions}
        value={value}
        onChange={handleChange}
        placeholder="Search by title or description..."
      />
      <div style={{ marginTop: 16, fontSize: 14, color: '#666' }}>
        <p>Try searching:</p>
        <ul>
          <li>"GitHub" or "GitLab" - searches title</li>
          <li>"DevOps" or "Jira" - searches description</li>
          <li>"version control" - searches description</li>
        </ul>
      </div>
    </StoryContainer>
  )
}

const SearchableByDescription: StoryObj<typeof Select> = {
  render: () => <ControlledSelectWithDescriptions />,
}

export default meta

export {
  Default,
  WithError,
  ReadOnly,
  Creatable,
  CustomNoOptionsMessage,
  Multiselect,
  WithIcons,
  WithDescriptions,
  WithDescriptionsNoIcons,
  WithDescriptionsHideFirstIcon,
  WithDescriptionsHideSecondIcon,
  SearchableByDescription,
}
