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
  },
}

export const Default = {
  render: () => (
    <Theme>
      <Button>Default Button</Button>
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
            Disabled button states.
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
