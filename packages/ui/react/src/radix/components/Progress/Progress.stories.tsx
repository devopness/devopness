import type { ComponentProps } from 'react'
import {
  Box,
  Flex,
  Text,
  Heading,
  Theme,
  Progress,
} from '../../index'

export default {
  title: 'Radix/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    useRadixTheme: true,
  },
  tags: [
    'autodocs',
  ],
  argTypes: {
    size: {
      control: 'select',
      options: [
        '1',
        '2',
        '3',
      ],
    },
    value: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
}

export const Default = {
  args: {
    value: 50,
  },
  render: (args: ComponentProps<typeof Progress>) => (
    <Theme>
      <Box
        style={{ width: 300, maxWidth: '100%' }}
      >
        <Progress {...args} />
      </Box>
    </Theme>
  ),
}

export const Size = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 400 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Size</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the size prop to control the size.
          </Text>
          <Flex
            direction="column"
            gap="4"
            style={{ maxWidth: 300 }}
          >
            <Progress
              value={25}
              size="1"
            />
            <Progress
              value={50}
              size="2"
            />
            <Progress
              value={75}
              size="3"
            />
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Value = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 400 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Value</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the value prop to indicate task progress (0–100).
          </Text>
          <Flex
            direction="column"
            gap="4"
            style={{ maxWidth: 300 }}
          >
            <Progress value={25} />
            <Progress value={50} />
            <Progress value={75} />
            <Progress value={100} />
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Duration = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 400 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Duration</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the duration prop for indeterminate progress with an estimated time.
          </Text>
          <Box style={{ maxWidth: 300 }}>
            <Progress duration="30s" />
          </Box>
        </Flex>
      </Box>
    </Theme>
  ),
}
