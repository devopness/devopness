import type { Meta, StoryObj } from '@storybook/react-vite'

import { StepForm } from './Steppers'
import type { StepFormProps } from './Steppers'

type FormValues = {
  name: string
  email: string
  token: string
}

const values: FormValues = { name: '', email: '', token: '' }

const StepFormStory = (
  props: Partial<StepFormProps<FormValues>> & {
    mockErrors?: Record<string, unknown>
  }
) => {
  const { mockErrors = {}, ...stepFormProps } = props

  return (
    <StepForm<FormValues>
      getValues={() => values}
      trigger={() => Promise.resolve(true)}
      setError={() => {}}
      errors={mockErrors}
      handleSubmit={(onValid) => (event) => {
        event?.preventDefault()
        onValid(values)
      }}
      steppersData={[
        {
          label: 'Account',
          component: <div>Account step content</div>,
          validateFields: ['name'],
        },
        {
          label: 'Contact',
          component: <div>Contact step content</div>,
          validateFields: ['email'],
        },
        {
          label: 'Confirmation',
          component: <div>Confirmation step content</div>,
          validateFields: ['token'],
        },
      ]}
      onSubmit={() => {}}
      onCancel={() => {}}
      {...stepFormProps}
    />
  )
}

const meta: Meta<typeof StepFormStory> = {
  title: 'Form/Steppers',
  component: StepFormStory,
}

type Story = StoryObj<typeof StepFormStory>

const Default: Story = {}

const SingleStep: Story = {
  args: {
    steppersData: [
      {
        label: 'Only step',
        component: <div>Single step content</div>,
        validateFields: ['name'],
      },
    ],
  },
}

const StartingOnSecondStep: Story = {
  args: {
    initialStep: 1,
  },
}

const Submitting: Story = {
  args: {
    initialStep: 2,
    submitting: true,
  },
}

const WaitingMode: Story = {
  args: {
    initialStep: 2,
    waitingMode: true,
  },
}

const WithHiddenCancelButton: Story = {
  args: {
    hiddenCancelButton: true,
  },
}

const WithCustomConfirmButton: Story = {
  args: {
    initialStep: 2,
    confirmButton: {
      value: 'Create resource',
      backgroundColor: '#57b261',
      borderColor: '#57b261',
    },
  },
}

const WithApiError: Story = {
  args: {
    error: {
      message: 'Unable to save the form.',
      errors: {
        unknown_field: ['This field is not part of the form'],
      },
    },
  },
}

const WithDisabledButtons: Story = {
  args: {
    disabledNext: true,
    disabledCancel: true,
  },
}

export default meta
export {
  Default,
  SingleStep,
  StartingOnSecondStep,
  Submitting,
  WaitingMode,
  WithHiddenCancelButton,
  WithCustomConfirmButton,
  WithApiError,
  WithDisabledButtons,
}
