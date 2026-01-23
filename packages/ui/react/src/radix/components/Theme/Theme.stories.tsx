import { Box, Button, Flex, Text, Card, Heading } from '@radix-ui/themes';

import { Theme } from './Theme';

export default {
  title: 'Layout/Theme',
  component: Theme,
  parameters: {
    layout: 'centered',
    useRadixTheme: true,
  },
  tags: ['autodocs'],
  argTypes: {
    accentColor: {
      control: 'select',
      options: ['devopness', 'red', 'blue', 'green', 'purple', 'mint', 'aqua'],
    },
    appearance: {
      control: 'radio',
      options: ['light',
'dark']
    },
    panelBackground: {
      control: 'radio',
      options: ['solid',
'translucent']
    },
  },
};

export const Default = {
  args: {
    accentColor: 'devopness',
    appearance: 'light',
    panelBackground: 'solid',
    children: (
      <Box p="6" style={{ maxWidth: 500 }}>
        <Flex direction="column" gap="4">
          <Heading size="6">Theme Example</Heading>
          <Text>This example shows our default theme styling.</Text>
          <Card>
            <Flex direction="column" gap="2" p="4">
              <Text weight="bold">Card Component</Text>
              <Text size="2">Content inside a card with default styling</Text>
              <Flex gap="3" mt="3">
                <Button variant="soft">Cancel</Button>
                <Button>Submit</Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Box>
    ),
  },
};

export const LightTheme = {
  args: {
    ...Default.args,
    appearance: 'light',
  },
}; 