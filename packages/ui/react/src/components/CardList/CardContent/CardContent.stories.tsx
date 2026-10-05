import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import type { CardContentProps } from './CardContent'
import { CardContent } from './CardContent'

const mockResources: CardContentProps['resources'] = [
  { id: 1, name: 'devopness-web-app', url: '/applications/1' },
  {
    id: 2,
    name: 'jef-testing-nextjs-migration-billing',
    url: '/applications/2',
  },
  {
    id: 3,
    name: 'aladino-teste-erros-console-web-app-with-a-very-long-name',
    url: '/applications/3',
  },
]

/**
 * Stands in for a router's own `Link` (e.g. `devopness-web-app`'s
 * `CustomDevopnessLink`, a `styled(Link)` from `@tanstack/react-router`).
 * Deliberately styled to look nothing like `Link`'s own styles, so the
 * `WithCustomLinkAs` story below makes it obvious which styling wins once
 * `linkAs` composes the two styled-components definitions.
 */
const MockRouterLink = styled.a`
  font-weight: bold;
  color: green;
  text-decoration: none;

  &:hover {
    color: darkgreen;
  }
`

const meta = {
  title: 'Components/CardList/CardContent',
  component: CardContent,
  args: {
    basePath: '/applications',
    resourceTypeLabelPlural: 'Applications',
    resourceTypeLabelSingular: 'Application',
    resources: mockResources,
    isError: false,
    isLoading: false,
  },
} satisfies Meta<typeof CardContent>

type Story = StoryObj<typeof meta>

const Default: Story = {}

const Empty: Story = {
  args: {
    resources: [],
  },
}

const EmptyWithoutPermission: Story = {
  args: {
    resources: [],
    userCanAddResource: false,
    userPermissionsErrorMessage:
      'You do not have permission to perform this action.',
  },
}

const Loading: Story = {
  args: {
    isLoading: true,
  },
}

const ErrorState: Story = {
  args: {
    isError: true,
  },
}

/**
 * Renders internal links through `MockRouterLink` via `linkAs`, standing in
 * for a real client-side-router `Link`. Use this story to visually confirm
 * `MockRouterLink`'s own styling (bold, green, no underline) isn't overridden
 * by `Link`'s own generated styles before relying on `linkAs` in an app.
 */
const WithCustomLinkAs: Story = {
  args: {
    linkAs: MockRouterLink,
  },
}

export default meta
export {
  Default,
  Empty,
  EmptyWithoutPermission,
  Loading,
  ErrorState,
  WithCustomLinkAs,
}
