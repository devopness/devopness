import React, { Fragment } from 'react'
import { Button } from 'src/components/Buttons'
import { Tooltip } from 'src/components/Primitives'
import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'
import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'

import {
  StyledAddResourceContainer,
  StyledDivider,
  StyledResourceList,
  StyledResourceName,
} from './CardContent/CardContent.styled'
import type { CardListProps } from './CardList'
import { CardList } from './CardList'

/**
 * Extended args type: adds a `cardsCount` control that is NOT a CardList prop.
 * It controls both the number of visible data cards and the loadingCardsCount skeleton count.
 */
type CardListStoryArgs = React.ComponentPropsWithoutRef<typeof CardList> & {
  cardsCount: number
}

const MockNavigationLink = styled.div`
  display: flex;
  align-items: center;
  color: ${getColor('purple.800')};
  cursor: pointer;
  font-family: ${getFont('roboto')};

  &:hover {
    color: ${getColor('blue.950')};
    text-decoration: underline;
  }
`

/**
 * Renders a resource-name list for cards with resources.
 * Each item displays a truncated name with a tooltip on hover.
 * Empty slots render a blank row to preserve consistent card height.
 */
function resourceList(
  resources: { name: string; url: string }[],
  maxLength = 3
) {
  const emptySlots = Array(Math.max(0, maxLength - resources.length)).fill(
    undefined
  ) as undefined[]
  const allItems: ({ name: string; url: string } | undefined)[] = [
    ...resources,
    ...emptySlots,
  ]

  return (
    <StyledResourceList>
      {allItems.map((resource, index) => (
        <Fragment key={resource?.name ?? `empty_${index}`}>
          {resource ? (
            <Tooltip
              title={resource.name}
              disableHover={false}
            >
              <MockNavigationLink
                style={{
                  marginRight: 'auto',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <StyledResourceName>{resource.name}</StyledResourceName>
              </MockNavigationLink>
            </Tooltip>
          ) : (
            <StyledResourceName $disableHover />
          )}
          {index < maxLength - 1 && <StyledDivider />}
        </Fragment>
      ))}
    </StyledResourceList>
  )
}

/**
 * Map of card labels to singular forms used in "+ add {singular}" buttons.
 */
const labelToSingular: Record<string, string> = {
  Credentials: 'credential',
  Networks: 'network',
  Subnets: 'subnet',
  Servers: 'server',
  Applications: 'application',
  'Virtual Hosts': 'virtual host',
  'SSL Certificates': 'ssl certificate',
  Daemons: 'daemon',
  Services: 'service',
  'Cron Jobs': 'cron job',
  'Network Rules': 'network rule',
  'SSH Keys': 'ssh key',
}

/**
 * Renders the empty state for a card with 0 resources, matching the real app's AddResource component.
 * Shows "No {ResourceType}" text and a "+ add {singular}" button.
 */
function emptyResourceChildren(label: string) {
  const singular = labelToSingular[label] ?? label.toLowerCase()
  return (
    <StyledAddResourceContainer>
      <span
        style={{
          color: getColor('blue.950'),
        }}
      >{`No ${label}`}</span>
      <Button
        buttonType="outlinedSecondary"
        color={getColor('purple.800')}
        noMargin
        style={{
          alignItems: 'start',
          cursor: 'pointer',
          fontSize: '0.813rem',
          height: 'auto',
        }}
        typeSize="medium"
      >
        {`+ add ${singular}`}
      </Button>
    </StyledAddResourceContainer>
  )
}

/**
 * All 12 environment resource card definitions.
 * Colors, icons, and labels match the webapp's environment dashboard.
 */
const allEnvironmentCards: CardListProps['data'] = [
  {
    backgroundColor: 'gray.200',
    color: 'blue.750',
    indicator: 8,
    label: 'Credentials',
    icon: 'passkey',
    children: resourceList([
      {
        name: 'GCP jef tests',
        url: '/projects/1/environments/1/credentials/1',
      },
      {
        name: '2023-09-04-jef Test-cloud-resource-with-long-name',
        url: '/projects/1/environments/1/credentials/2',
      },
      {
        name: 'azure-2025-12-29-e2e-cred',
        url: '/projects/1/environments/1/credentials/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/credentials/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/credentials/' },
  },
  {
    backgroundColor: 'cyan.200',
    color: 'cyan.400',
    indicator: 9,
    label: 'Networks',
    icon: 'network',
    children: resourceList([
      {
        name: 'azure-default-australiacentral-network',
        url: '/projects/1/environments/1/networks/1',
      },
      {
        name: 'jef-do-network-with-invisible-subnet-a',
        url: '/projects/1/environments/1/networks/2',
      },
      {
        name: 'jef-do-network-with-invisible-subnet-b',
        url: '/projects/1/environments/1/networks/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/networks/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/networks/' },
  },
  {
    backgroundColor: 'blue.100',
    color: 'blue.500',
    indicator: 6,
    label: 'Subnets',
    icon: 'treeView',
    children: resourceList([
      { name: 'sub-env-level-1', url: '/projects/1/environments/1/subnets/1' },
      { name: 'default', url: '/projects/1/environments/1/subnets/2' },
      {
        name: 'azure-default-australiacentral-subnet',
        url: '/projects/1/environments/1/subnets/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/subnets/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/subnets/' },
  },
  {
    backgroundColor: 'cyan.50',
    color: 'blue.500',
    indicator: 8,
    label: 'Servers',
    icon: 'server',
    children: resourceList([
      {
        name: 'tests-from-new-dev-server-mumbai',
        url: '/projects/1/environments/1/servers/1',
      },
      {
        name: 'tst-d-o-to-hetzner',
        url: '/projects/1/environments/1/servers/2',
      },
      {
        name: 'azure-bug-in-remove-failed-server',
        url: '/projects/1/environments/1/servers/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/servers/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/servers/' },
  },
  {
    backgroundColor: 'purple.50',
    color: 'purple.800',
    indicator: 24,
    label: 'Applications',
    icon: 'devices',
    children: resourceList([
      {
        name: 'aladino-teste-erros-console-web-app',
        url: '/projects/1/environments/1/applications/1',
      },
      {
        name: 'jef-testing-nextjs-migration-billing',
        url: '/projects/1/environments/1/applications/2',
      },
      {
        name: 'devopness-web-app',
        url: '/projects/1/environments/1/applications/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: {
          target: '_self',
          to: '/projects/1/environments/1/applications/',
        },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/applications/' },
  },
  {
    backgroundColor: 'blue.50',
    color: 'blue.700',
    indicator: 12,
    label: 'Virtual Hosts',
    icon: 'serverCloud',
    children: resourceList([
      {
        name: '34.46.199.129',
        url: '/projects/1/environments/1/virtual-hosts/1',
      },
      { name: '171.2.3.4', url: '/projects/1/environments/1/virtual-hosts/2' },
      { name: '1.2.3.45', url: '/projects/1/environments/1/virtual-hosts/3' },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: {
          target: '_self',
          to: '/projects/1/environments/1/virtual-hosts/',
        },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/virtual-hosts/' },
  },
  {
    backgroundColor: 'green.125',
    color: 'green.800',
    indicator: 1,
    label: 'SSL Certificates',
    icon: 'shieldLock',
    children: resourceList([
      {
        name: 'local-tests.example.com',
        url: '/projects/1/environments/1/ssl-certificates/1',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: {
          target: '_self',
          to: '/projects/1/environments/1/ssl-certificates/',
        },
      },
    ],
    url: {
      target: '_self',
      to: '/projects/1/environments/1/ssl-certificates/',
    },
  },
  {
    backgroundColor: 'stone.50',
    color: 'cyan.800',
    indicator: 9,
    label: 'Daemons',
    icon: 'eyeOutline',
    children: resourceList([
      {
        name: 'ate_TESTING-124_abobrinha_tang_alpha',
        url: '/projects/1/environments/1/daemons/1',
      },
      {
        name: 'ate_TESTING-124_abobrinha_tang_beta',
        url: '/projects/1/environments/1/daemons/2',
      },
      {
        name: 'jef_test_workdir_no_app_linked',
        url: '/projects/1/environments/1/daemons/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/daemons/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/daemons/' },
  },
  {
    backgroundColor: 'brown.50',
    color: 'brown.400',
    indicator: 7,
    label: 'Services',
    icon: 'gear',
    children: resourceList([
      {
        name: 'Docker:20.10',
        url: '/projects/1/environments/1/services/1',
      },
      {
        name: 'PostgreSQL:16',
        url: '/projects/1/environments/1/services/2',
      },
      { name: 'NGINX:1.18', url: '/projects/1/environments/1/services/3' },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/services/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/services/' },
  },
  {
    backgroundColor: 'orange.100',
    color: 'amber.800',
    indicator: 7,
    label: 'Cron Jobs',
    icon: 'alarm',
    children: resourceList([
      {
        name: 'test 1 renamed again 2',
        url: '/projects/1/environments/1/cronjobs/1',
      },
      {
        name: 'backup-db-daily',
        url: '/projects/1/environments/1/cronjobs/2',
      },
      {
        name: 'cleanup-temp-files',
        url: '/projects/1/environments/1/cronjobs/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/cronjobs/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/cronjobs/' },
  },
  {
    backgroundColor: 'orange.10',
    color: 'orange.500',
    indicator: 6,
    label: 'Network Rules',
    icon: 'security',
    children: resourceList([
      { name: 'HTTP', url: '/projects/1/environments/1/network-rules/1' },
      { name: 'HTTPS', url: '/projects/1/environments/1/network-rules/2' },
      {
        name: 'firewall rule from nextjs',
        url: '/projects/1/environments/1/network-rules/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: {
          target: '_self',
          to: '/projects/1/environments/1/network-rules/',
        },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/network-rules/' },
  },
  {
    backgroundColor: 'red.50',
    color: 'red.400',
    indicator: 4,
    label: 'SSH Keys',
    icon: 'key',
    children: resourceList([
      { name: 'jef-test', url: '/projects/1/environments/1/ssh-keys/1' },
      {
        name: 'ssh-key-production',
        url: '/projects/1/environments/1/ssh-keys/2',
      },
      {
        name: 'devopness-deploy-key',
        url: '/projects/1/environments/1/ssh-keys/3',
      },
    ]),
    footer: [
      {
        label: { content: 'view all' },
        url: { target: '_self', to: '/projects/1/environments/1/ssh-keys/' },
      },
    ],
    url: { target: '_self', to: '/projects/1/environments/1/ssh-keys/' },
  },
]

/**
 * Shared render function: maps `cardsCount` to `data` and `loadingCardsCount`.
 * When `isLoading` is true, `data` is always empty so the skeleton renders.
 */
function renderCardList({ cardsCount, isLoading, isError }: CardListStoryArgs) {
  return (
    <CardList
      data={isLoading ? [] : allEnvironmentCards.slice(0, cardsCount)}
      isLoading={isLoading}
      isError={isError}
      loadingCardsCount={cardsCount}
    />
  )
}

/**
 * Pre-computed zero-state cards: all indicators set to 0 with the empty state UI.
 * Defined as a constant to avoid creating new React elements on every render.
 */
const allZeroCards: CardListProps['data'] = allEnvironmentCards.map((card) => ({
  ...card,
  indicator: 0,
  children: emptyResourceChildren(card.label),
}))

/**
 * AllZero render: uses pre-computed zero-state cards.
 */
function renderAllZero({ cardsCount, isLoading, isError }: CardListStoryArgs) {
  return (
    <CardList
      data={allZeroCards.slice(0, cardsCount)}
      isLoading={isLoading}
      isError={isError}
      loadingCardsCount={cardsCount}
    />
  )
}

/** Default: 4 cards rendered. Adjust `cardsCount` to show 1–12 cards. */
const Default: StoryObj<CardListStoryArgs> = {
  args: {
    cardsCount: 4,
    isLoading: false,
    isError: false,
  },
  render: renderCardList,
}

/** AllResources: all 12 resource types with sample resource names and tooltips. */
const AllResources: StoryObj<CardListStoryArgs> = {
  args: {
    cardsCount: 12,
    isLoading: false,
    isError: false,
  },
  render: renderCardList,
}

/** AllZero: all cards show indicator 0, triggering the "No X / + Add" empty state. */
const AllZero: StoryObj<CardListStoryArgs> = {
  args: {
    cardsCount: 12,
    isLoading: false,
    isError: false,
  },
  render: renderAllZero,
}

/** Loading: skeleton state. `cardsCount` controls how many skeletons are rendered. */
const Loading: StoryObj<CardListStoryArgs> = {
  args: {
    cardsCount: 4,
    isLoading: true,
    isError: false,
  },
  render: renderCardList,
}

/** Error: each card's numeric indicator is replaced by a red error icon. */
const Error: StoryObj<CardListStoryArgs> = {
  args: {
    cardsCount: 12,
    isLoading: false,
    isError: true,
  },
  render: renderCardList,
}

export { AllResources, AllZero, Default, Error, Loading }

export default {
  title: 'Components/CardList',
  component: CardList,
  argTypes: {
    cardsCount: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description:
        'Number of cards to display (1–12). Also sets the skeleton count in the Loading state.',
    },
    isLoading: {
      control: 'boolean',
      description: 'When true, shows skeleton cards instead of data.',
    },
    isError: {
      control: 'boolean',
      description:
        "When true, replaces each card's numeric indicator with a red error icon.",
    },
    // Hide raw CardList props from the controls panel — managed via cardsCount
    data: { table: { disable: true } },
    loadingCardsCount: { table: { disable: true } },
  },
  parameters: {
    controls: {
      sort: 'requiredFirst',
      expanded: true,
    },
  },
} as Meta<CardListStoryArgs>
