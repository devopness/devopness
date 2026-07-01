import type { ComponentProps } from 'react'

import { Box, Button, Flex, Text, Heading, Theme } from '../../index'

export default {
  title: 'Radix/Button',
  component: Button,
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
        '4',
      ],
    },
    variant: {
      control: 'select',
      options: [
        'solid',
        'soft',
        'surface',
        'outline',
        'ghost',
      ],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name for icon-only buttons or when the visible label is not descriptive enough.',
    },
    title: {
      control: 'text',
      description:
        'Native tooltip shown on hover. Prefer Tooltip for richer content.',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Default Button',
    variant: 'solid',
    size: '2',
    loading: false,
    disabled: false,
  },
}

export const Default = {
  render: (args: ComponentProps<typeof Button>) => (
    <Theme>
      <Button {...args} />
    </Theme>
  ),
}

export const Size = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
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
            Use the size prop to control the size of the button.
          </Text>
          <Flex
            gap="3"
            align="center"
          >
            <Button
              size="1"
              variant="soft"
            >
              Size 1
            </Button>
            <Button
              size="2"
              variant="soft"
            >
              Size 2
            </Button>
            <Button
              size="3"
              variant="soft"
            >
              Size 3
            </Button>
            <Button
              size="4"
              variant="soft"
            >
              Size 4
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Variant = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Variant</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the variant prop to control the visual style of the button.
          </Text>
          <Flex
            align="center"
            gap="3"
            wrap="wrap"
          >
            <Button variant="solid">Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="surface">Surface</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Loading = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Loading</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the loading prop to display a loading spinner in place of button
            content.
          </Text>
          <Flex
            gap="3"
            wrap="wrap"
          >
            <Button
              loading
              variant="solid"
            >
              Solid
            </Button>
            <Button
              loading
              variant="soft"
            >
              Soft
            </Button>
            <Button
              loading
              variant="surface"
            >
              Surface
            </Button>
            <Button
              loading
              variant="outline"
            >
              Outline
            </Button>
            <Button
              loading
              variant="ghost"
            >
              Ghost
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const AriaLabel = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Aria label</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use aria-label when the button has no visible text, or when the
            visible label needs a more descriptive accessible name for assistive
            technologies.
          </Text>
          <Flex
            gap="3"
            align="center"
            wrap="wrap"
          >
            <Button
              aria-label="Close dialog"
              variant="soft"
            >
              ×
            </Button>
            <Button
              aria-label="Add new server"
              variant="solid"
            >
              +
            </Button>
            <Button
              aria-label="Save project settings"
              variant="outline"
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Title = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Title</Heading>
          <Text
            size="2"
            color="gray"
          >
            Use the native title attribute to show a short tooltip on hover. For
            richer tooltips, prefer the Tooltip component.
          </Text>
          <Flex
            gap="3"
            wrap="wrap"
          >
            <Button
              title="Deploy the latest version to production"
              variant="solid"
            >
              Deploy
            </Button>
            <Button
              title="This action cannot be undone"
              variant="outline"
            >
              Delete
            </Button>
            <Button
              aria-label="Refresh server status"
              title="Refresh server status"
              variant="ghost"
            >
              ↻
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const Disabled = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 800 }}
      >
        <Flex
          direction="column"
          gap="4"
        >
          <Heading size="6">Disabled</Heading>
          <Text
            size="2"
            color="gray"
          >
            Disabled buttons are not interactive and are excluded from the tab
            order. Combine with loading when an action is temporarily
            unavailable.
          </Text>
          <Flex
            gap="3"
            wrap="wrap"
          >
            <Button
              variant="solid"
              disabled
            >
              Solid
            </Button>
            <Button
              variant="soft"
              disabled
            >
              Soft
            </Button>
            <Button
              variant="surface"
              disabled
            >
              Surface
            </Button>
            <Button
              variant="outline"
              disabled
            >
              Outline
            </Button>
            <Button
              variant="ghost"
              disabled
            >
              Ghost
            </Button>
            <Button
              variant="solid"
              disabled
              loading
            >
              Loading
            </Button>
            <Button
              aria-label="Delete project"
              title="You do not have permission to delete this project"
              variant="outline"
              disabled
            >
              Delete
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  ),
}

export const AllVariants = {
  render: () => (
    <Theme>
      <Box
        p="6"
        style={{ maxWidth: 1000 }}
      >
        <Flex
          direction="column"
          gap="6"
        >
          <Heading size="6">All Variants</Heading>

          {/* Solid Variant */}
          <Box>
            <Text
              size="3"
              weight="bold"
              mb="3"
            >
              Solid (default)
            </Text>
            <Flex
              gap="3"
              wrap="wrap"
            >
              <Button variant="solid">Solid Button</Button>
              <Button
                variant="solid"
                size="1"
              >
                Size 1
              </Button>
              <Button
                variant="solid"
                size="2"
              >
                Size 2
              </Button>
              <Button
                variant="solid"
                size="3"
              >
                Size 3
              </Button>
              <Button
                variant="solid"
                size="4"
              >
                Size 4
              </Button>
            </Flex>
          </Box>

          {/* Soft Variant */}
          <Box>
            <Text
              size="3"
              weight="bold"
              mb="3"
            >
              Soft
            </Text>
            <Flex
              gap="3"
              wrap="wrap"
            >
              <Button variant="soft">Soft Button</Button>
              <Button
                variant="soft"
                size="1"
              >
                Size 1
              </Button>
              <Button
                variant="soft"
                size="2"
              >
                Size 2
              </Button>
              <Button
                variant="soft"
                size="3"
              >
                Size 3
              </Button>
              <Button
                variant="soft"
                size="4"
              >
                Size 4
              </Button>
            </Flex>
          </Box>

          {/* Surface Variant */}
          <Box>
            <Text
              size="3"
              weight="bold"
              mb="3"
            >
              Surface
            </Text>
            <Flex
              gap="3"
              wrap="wrap"
            >
              <Button variant="surface">Surface Button</Button>
              <Button
                variant="surface"
                size="1"
              >
                Size 1
              </Button>
              <Button
                variant="surface"
                size="2"
              >
                Size 2
              </Button>
              <Button
                variant="surface"
                size="3"
              >
                Size 3
              </Button>
              <Button
                variant="surface"
                size="4"
              >
                Size 4
              </Button>
            </Flex>
          </Box>

          {/* Outline Variant */}
          <Box>
            <Text
              size="3"
              weight="bold"
              mb="3"
            >
              Outline
            </Text>
            <Flex
              gap="3"
              wrap="wrap"
            >
              <Button variant="outline">Outline Button</Button>
              <Button
                variant="outline"
                size="1"
              >
                Size 1
              </Button>
              <Button
                variant="outline"
                size="2"
              >
                Size 2
              </Button>
              <Button
                variant="outline"
                size="3"
              >
                Size 3
              </Button>
              <Button
                variant="outline"
                size="4"
              >
                Size 4
              </Button>
            </Flex>
          </Box>

          {/* Ghost Variant */}
          <Box>
            <Text
              size="3"
              weight="bold"
              mb="3"
            >
              Ghost
            </Text>
            <Flex
              gap="5"
              wrap="wrap"
            >
              <Button variant="ghost">Ghost Button</Button>
              <Button
                variant="ghost"
                size="1"
              >
                Size 1
              </Button>
              <Button
                variant="ghost"
                size="2"
              >
                Size 2
              </Button>
              <Button
                variant="ghost"
                size="3"
              >
                Size 3
              </Button>
              <Button
                variant="ghost"
                size="4"
              >
                Size 4
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Theme>
  ),
}
