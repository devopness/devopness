import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Column } from 'react-table'

import { Button } from 'src/components/Primitives/Button'
import { CheckBox } from 'src/components/Primitives/CheckBox'
import { Status } from 'src/components/Primitives/Status'
import { ActionStatus } from 'src/constants'
import { type Icon } from 'src/icons'
import { getColor } from 'src/colors'

import { TableCellWrapper } from './TableCellWrapper/TableCellWrapper'
import { TableLoadingRowVariation } from './TableLoading/TableLoading'
import { Table } from './Table'

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
    {children}
  </div>
)

const ColumnWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      gap: 5,
    }}
  >
    {children}
  </div>
)

interface RowData {
  icon: Icon
  name: string
  framework: string
  lang: string
  directory: string
  buildCommand: string
  createdAt: string
  updatedAt: string
  actions?: React.ReactNode
}

const rowsDefault: RowData[] = [
  {
    name: 'value.com.br',
    icon: 'aws',
    framework: 'none',
    lang: 'nodejs',
    directory: '/public',
    buildCommand: 'npm run build',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-10-01T00:00:00.000Z',
  },
  {
    name: 'domain.com.br',
    icon: 'digitalocean',
    framework: 'none',
    lang: 'golang',
    directory: '/public',
    buildCommand: 'npm run build',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-10-01T00:00:00.000Z',
  },
  {
    name: 'address.org',
    icon: 'aws',
    framework: 'none',
    lang: 'ruby',
    directory: '/public',
    buildCommand: 'npm run build',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-10-01T00:00:00.000Z',
  },
  {
    name: 'reference.gov.uk',
    icon: 'digitalocean',
    framework: 'none',
    lang: 'python',
    directory: '/public',
    buildCommand: 'npm run build',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-10-01T00:00:00.000Z',
  },
  {
    name: 'reference.gov.uk',
    icon: 'digitalocean',
    framework: 'none',
    lang: 'python',
    directory: '/public',
    buildCommand: 'npm run build',
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-10-01T00:00:00.000Z',
  },
]

const columnsDefault: Column<RowData>[] = [
  {
    accessor: 'name',
    Header: 'Name',
    Cell: ({ row }) => (
      <TableCellWrapper
        icon={row.original.icon}
        value={row.original.name}
        iconBackgroundColor={getColor('purple.800')}
      />
    ),
  },
  { accessor: 'framework', Header: 'Framework' },
  { accessor: 'lang', Header: 'Language' },
  { accessor: 'directory', Header: 'Public Directory' },
  {
    accessor: 'actions',
    Header: '',
    Cell: (
      <Grid>
        <Button typeSize="medium">link servers</Button>
      </Grid>
    ),
  },
]

function DefaultComponent(args: any) {
  const [selected, setSelected] = useState<string[]>([])

  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Status',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: 'Language',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT,
      alignEnd: true,
    },
  ]

  const columns: Column<ActionRow>[] = [
    {
      accessor: 'name',
      Header: 'Name',
      Cell: ({ row }) => (
        <TableCellWrapper
          icon={row.original.icon}
          value={row.original.name}
          iconBackgroundColor={getColor('purple.800')}
        />
      ),
    },
    {
      accessor: 'status',
      Header: 'Status',
      Cell: ({ row }) => STATUS_CONTENTS[row.original.status],
    },
    {
      accessor: 'language',
      Header: 'Language',
      Cell: ({ value }) => value || '—',
    },
    {
      accessor: 'directory',
      Header: 'Public Directory',
      Cell: ({ value }) => value || '—',
    },
    {
      accessor: 'actions',
      Header: ({ rows: tableRows }) => {
        const rowIds = tableRows.map((row) => row.original.name)
        const isChecked =
          rowIds.length > 0 && rowIds.every((id) => selected.includes(id))

        return (
          <CheckBox
            isChecked={isChecked}
            isStroke={!isChecked && selected.length > 0}
            onClick={() => setSelected(isChecked ? [] : rowIds)}
          />
        )
      },
      Cell: ({ row }) => {
        const id = row.original.name
        const isChecked = selected.includes(id)

        return (
          <CheckBox
            isChecked={isChecked}
            onClick={() =>
              setSelected(
                isChecked
                  ? selected.filter((selectedId) => selectedId !== id)
                  : [...selected, id]
              )
            }
          />
        )
      },
    },
  ]
  return (
    <Table<ActionRow>
      columns={columns}
      data={actionRows}
      loadingTableCells={loadingTableCells}
      {...args}
    />
  )
}

const Default: StoryObj<typeof Table> = {
  render: (args) => <DefaultComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
  },
}

interface StepsRow {
  name: string
  rowType: 'row' | 'subrow'
  disabled: boolean
  subRows?: StepsRow[]
}

const stepsData: StepsRow[] = [
  {
    name: 'Cache cleaner',
    rowType: 'row',
    disabled: false,
    subRows: [
      { name: 'www.petshop.com', rowType: 'subrow', disabled: false },
      { name: 'www.bookstore.com', rowType: 'subrow', disabled: false },
    ],
  },
]

function WithStepsComponent(args: any) {
  const columns: Column<StepsRow>[] = [
    {
      accessor: 'name',
      Header: 'Daemon',
      Cell: ({ row, value }) => (
        <TableCellWrapper
          icon={row.original.rowType === 'subrow' ? 'devices' : 'eyeOutline'}
          value={value}
          iconBackgroundColor={getColor('purple.800')}
        />
      ),
    },
    {
      id: 'expander',
      Header: '',
      Cell: ({ row }) =>
        row.canExpand || row.original.rowType === 'subrow' ? (
          <Button
            type="button"
            typeSize="medium"
            onClick={() => row.toggleRowExpanded()}
          >
            {row.isExpanded ? 'Hide' : 'Show'} log
          </Button>
        ) : null,
    },
  ]
  return (
    <Table<StepsRow>
      columns={columns}
      data={stepsData}
      layout="indented"
      customSubRowInjection={() => (
        <pre style={{ margin: 0 }}>Install dependencies\nDone</pre>
      )}
      {...args}
    />
  )
}

const WithSteps: StoryObj<typeof Table> = {
  render: (args) => <WithStepsComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
  },
}

function LoadingComponent(args: any) {
  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Framework',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    { name: 'Language', rowVariation: TableLoadingRowVariation.BAR_EFFECT },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.ONE_BUTTON_EFFECT,
      alignEnd: true,
    },
  ]

  return (
    <Table
      columns={[]}
      loadingTableCells={loadingTableCells}
      data={[]}
      {...args}
    />
  )
}

const Loading: StoryObj<typeof Table> = {
  render: (args) => <LoadingComponent {...args} />,
  args: {
    isLoading: true,
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
  },
}

function EmptyComponent(args: any) {
  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Framework',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    { name: 'Language', rowVariation: TableLoadingRowVariation.BAR_EFFECT },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.ONE_BUTTON_EFFECT,
      alignEnd: true,
    },
  ]

  return (
    <Table<RowData>
      columns={columnsDefault}
      data={[]}
      loadingTableCells={loadingTableCells}
      {...args}
    />
  )
}

const Empty: StoryObj<typeof Table> = {
  render: (args) => <EmptyComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
  },
}

interface ActionRow {
  name: string
  icon: Icon
  language: string
  status: `${ActionStatus}`
  directory: string
  actions?: React.ReactNode
  disabled?: boolean
  fixedLine?: {
    activated?: boolean
    lineBackgroundColor?: string
    lineHoverColor?: string
  }
}

const STATUS_CONTENTS: Record<`${ActionStatus}`, React.ReactNode> = {
  queued: (
    <Status
      status="queued"
      statusHumanReadable="Queued"
      statusReasonHumanReadable=""
    />
  ),
  pending: (
    <Status
      status="pending"
      statusHumanReadable="Pending"
      statusReasonHumanReadable=""
    />
  ),
  'in-progress': (
    <Status
      status="in-progress"
      statusHumanReadable="In Progress"
      statusReasonHumanReadable=""
    />
  ),
  completed: (
    <Status
      status="completed"
      statusHumanReadable="Completed"
      statusReasonHumanReadable=""
    />
  ),
  failed: (
    <Status
      status="failed"
      statusHumanReadable="Failed"
      statusReasonHumanReadable=""
    />
  ),
  waiting: (
    <Status
      status="waiting"
      statusHumanReadable="Waiting"
      statusReasonHumanReadable=""
    />
  ),
  skipped: (
    <Status
      status="skipped"
      statusHumanReadable="Skipped"
      statusReasonHumanReadable=""
    />
  ),
}

const actionRows: ActionRow[] = [
  {
    name: 'www.application01.com',
    icon: 'devices',
    language: 'ruby',
    status: 'queued',
    directory: '/public',
    fixedLine: {
      activated: false,
      lineHoverColor: getColor('green.100'),
    },
  },
  {
    name: 'www.application02.com',
    icon: 'devices',
    language: 'php',
    status: 'completed',
    directory: '/public',
    fixedLine: {
      activated: false,
      lineHoverColor: getColor('green.100'),
    },
  },
  {
    name: 'www.application03.com',
    icon: 'devices',
    language: 'nodejs',
    status: 'in-progress',
    directory: '/public',
    fixedLine: {
      activated: true,
      lineBackgroundColor: getColor('amber.50'),
      lineHoverColor: getColor('amber.200'),
    },
  },
  {
    name: 'www.application04.com',
    icon: 'devices',
    language: 'java',
    status: 'pending',
    directory: '/public',
    disabled: true,
  },
  {
    name: 'www.application05.com',
    icon: 'devices',
    language: 'rust',
    status: 'waiting',
    directory: '/public',
  },
  {
    name: 'www.application06.com',
    icon: 'devices',
    language: 'zig',
    status: 'skipped',
    directory: '/public',
  },
  {
    name: 'www.application07.com',
    icon: 'devices',
    language: 'golang',
    status: 'failed',
    directory: '/public',
    fixedLine: {
      activated: true,
      lineBackgroundColor: getColor('red.100'),
      lineHoverColor: getColor('red.300'),
    },
  },
]

function WithPaginationComponent(args: any) {
  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Framework',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    { name: 'Language', rowVariation: TableLoadingRowVariation.BAR_EFFECT },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: 'Build Command',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: 'Created At',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.ONE_BUTTON_EFFECT,
      alignEnd: true,
    },
  ]

  const columns: Column<RowData>[] = [
    ...columnsDefault.slice(0, -1),
    { accessor: 'buildCommand', Header: 'Build Command' },
    { accessor: 'createdAt', Header: 'Created At' },
    {
      accessor: 'actions',
      Header: () => <Button icon="link">link ssh key</Button>,
      Cell: () => (
        <ColumnWrapper>
          <Button typeSize="medium">Accept</Button>
          <Button typeSize="medium">Deploy</Button>
          <Button
            noPadding
            typeSize="medium"
            icon="delete"
            buttonType="borderless"
            color={getColor('red.500')}
            style={{ padding: '0 8px' }}
          >
            remove
          </Button>
        </ColumnWrapper>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={rowsDefault}
      loadingTableCells={loadingTableCells}
      {...args}
    />
  )
}

const WithPagination: StoryObj<typeof Table> = {
  render: (args) => <WithPaginationComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
    paginationData: {
      pageCount: 10,
      paginationProps: {
        lastPaginateAction: () => alert('last page action'),
        firstPaginateAction: () => alert('first page action'),
        previousPaginateAction: () => alert('previous page action'),
        nextPaginateAction: () => alert('next page action'),
      },
    },
  },
}

function WithCustomEmptyStateComponent(args: any) {
  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Framework',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    { name: 'Language', rowVariation: TableLoadingRowVariation.BAR_EFFECT },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.ONE_BUTTON_EFFECT,
      alignEnd: true,
    },
  ]

  return (
    <Table
      columns={columnsDefault}
      data={[]}
      loadingTableCells={loadingTableCells}
      {...args}
    />
  )
}

const WithCustomEmptyState: StoryObj<typeof Table> = {
  render: (args) => <WithCustomEmptyStateComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
    isEmpty: true,
    emptyData: {
      isSmallContainer: true,
      message: 'No data found.',
      image: 'https://assets.devopness.com/images/logo-devopness-primary.svg',
    },
    paginationData: {
      pageCount: 10,
      paginationProps: {
        lastPaginateAction: () => alert('last page action'),
        firstPaginateAction: () => alert('first page action'),
        previousPaginateAction: () => alert('previous page action'),
        nextPaginateAction: () => alert('next page action'),
      },
    },
  },
}

function WithFixedHeightComponent(args: any) {
  const loadingTableCells = [
    {
      name: 'Name',
      rowVariation: TableLoadingRowVariation.CHECKBOX_EFFECT_WITH_BAR,
    },
    {
      name: 'Framework',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    { name: 'Language', rowVariation: TableLoadingRowVariation.BAR_EFFECT },
    {
      name: 'Public Directory',
      rowVariation: TableLoadingRowVariation.BAR_EFFECT,
    },
    {
      name: '',
      rowVariation: TableLoadingRowVariation.ONE_BUTTON_EFFECT,
      alignEnd: true,
    },
  ]

  return (
    <Table
      columns={columnsDefault}
      data={rowsDefault}
      loadingTableCells={loadingTableCells}
      {...args}
    />
  )
}

const WithFixedHeight: StoryObj<typeof Table> = {
  render: (args) => <WithFixedHeightComponent {...args} />,
  args: {
    hoverColor: getColor('indigo.10'),
    alignEndLastColumn: true,
    isLoading: false,
    height: '200px',
  },
}

export {
  Default,
  Empty,
  Loading,
  WithSteps,
  WithPagination,
  WithCustomEmptyState,
  WithFixedHeight,
}

const meta = {
  title: 'Primitives/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
