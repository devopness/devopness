import type { Meta, StoryObj } from '@storybook/react'

const introductionMarkdown = `
# Devopness Design System

The Devopness Design System provides a comprehensive set of components for building consistent user interfaces across Devopness applications. Built on top of [Radix UI](https://www.radix-ui.com/), it offers a robust foundation for creating beautiful, accessible, and performant web applications.

## Installation

\`\`\`bash
npm install @devopness/ui-react
\`\`\`

## Usage

\`\`\`jsx
// Import Radix components
import { Box, Flex, Button, Text, Theme, Progress } from '@devopness/ui-react/radix';

// Import Radix base styles + Devopness overrides (includes @radix-ui/themes)
import '@devopness/ui-react/radix/styles.css';

function App() {
  return (
    <Theme>
      <Box p="4">
        <Flex direction="column" gap="3">
          <Text size="4">Welcome to Devopness</Text>
          <Button variant="solid">Get started</Button>
        </Flex>
      </Box>
    </Theme>
  );
}
\`\`\`

## Key Features

- **Accessible Components**: Built with accessibility in mind on Radix UI primitives
- **Customizable**: Easily customize with theming and the Devopness accent color
- **Modern Design**: Clean, contemporary UI aesthetic
- **Responsive**: Components work across device sizes
- **Consistent**: Unified design language

## Component Categories

- **Layout**: Box, Flex, Grid, Container, Section
- **Typography**: Text, Heading, Blockquote, Code, Link
- **Inputs**: Button, TextField, TextArea, Select, Checkbox, Switch, Slider
- **Display**: Card, Table, Avatar, Badge, Progress, Skeleton
- **Feedback**: Callout, Spinner, AlertDialog
- **Navigation**: Tabs, TabNav, DropdownMenu, ContextMenu

## Theming

The design system supports theming with light and dark mode. Use the \`Theme\` component to set the visual style and \`accentColor="devopness"\` for the Devopness brand colors.
`

const meta: Meta = {
  title: 'Introduction',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: introductionMarkdown,
      },
    },
  },
}

export default meta

export const Overview: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: introductionMarkdown,
      },
      source: { code: '' },
      canvas: { hidden: true },
    },
  },
  render: () => <></>,
}
