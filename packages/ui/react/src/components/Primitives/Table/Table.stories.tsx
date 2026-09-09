import { useState } from 'react'
import type { Meta } from '@storybook/react-vite'
import type { Column } from 'react-table'

import { Button } from 'src/components/Buttons'
import { CheckBox } from 'src/components/Primitives/CheckBox'
import { Status } from 'src/components/Primitives/Status'
import { Tooltip } from 'src/components/Primitives/Tooltip'
import { ActionStatus } from 'src/constants'
import type { Icon } from 'src/icons'
import { getColor } from 'src/colors'

import { TableCellWrapper } from './CellWrapper'
import { TableLoading, TableRowVariation } from './Loading'
import Table from './Table'

const Grid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
    {children}
  </div>
)

interface RowData {
  icon: Icon
  name: string
  framework: string
  lang: string
  directory: string
  actions?: React.ReactNode
}

const rowsDefault: RowData[] = [
  {
    name: 'value.com.br',
    icon: 'aws',
    framework: 'none',
    lang: 'nodejs',
    directory: '/public',
  },
  {
    name: 'domain.com.br',
    icon: 'digitalocean',
    framework: 'none',
    lang: 'golang',
    directory: '/public',
  },
  {
    name: 'address.org',
    icon: 'aws',
    framework: 'none',
    lang: 'ruby',
    directory: '/public',
  },
  {
    name: 'reference.gov.uk',
    icon: 'digitalocean',
    framework: 'none',
    lang: 'python',
    directory: '/public',
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

function Default() {
  return (
    <Table<RowData>
      columns={columnsDefault}
      data={rowsDefault}
      hoverColor={getColor('indigo.10')}
    />
  )
}

function Loading() {
  return (
    <TableLoading
      cells={[
        {
          name: 'Name',
          rowVariation: TableRowVariation.CHECKBOX_EFFECT_WITH_BAR,
        },
        { name: 'Framework', rowVariation: TableRowVariation.BAR_EFFECT },
        { name: 'Language', rowVariation: TableRowVariation.BAR_EFFECT },
        {
          name: 'Public Directory',
          rowVariation: TableRowVariation.BAR_EFFECT,
        },
        {
          name: '',
          rowVariation: TableRowVariation.ONE_BUTTON_EFFECT,
          alignEnd: true,
        },
      ]}
    />
  )
}

function Empty() {
  return (
    <Table<RowData>
      columns={columnsDefault}
      data={[]}
      hoverColor={getColor('indigo.10')}
    />
  )
}

function HeadCheckbox({
  data,
  selected,
  setSelected,
}: {
  data: { rows: Array<{ original: RowData }> }
  selected: string[]
  setSelected: (value: string[]) => void
}) {
  const ids = data.rows.map(({ original }) => original.name)
  const checked = ids.length > 0 && ids.every((id) => selected.includes(id))
  return (
    <CheckBox
      isChecked={checked}
      isStroke={!checked && selected.length > 0}
      onClick={() => setSelected(checked ? [] : ids)}
    />
  )
}

function RowCheckbox({
  data,
  selected,
  setSelected,
}: {
  data: { row: { original: RowData } }
  selected: string[]
  setSelected: (value: string[]) => void
}) {
  const id = data.row.original.name
  const checked = selected.includes(id)
  return (
    <CheckBox
      isChecked={checked}
      onClick={() =>
        setSelected(
          checked ? selected.filter((item) => item !== id) : [...selected, id]
        )
      }
    />
  )
}

function WithCheckbox() {
  const [selected, setSelected] = useState<string[]>([])
  const columns: Column<RowData>[] = [
    columnsDefault[0],
    columnsDefault[1],
    columnsDefault[2],
    columnsDefault[3],
    {
      accessor: 'actions',
      Header: (data) => (
        <HeadCheckbox
          data={data}
          selected={selected}
          setSelected={setSelected}
        />
      ),
      Cell: (data) => (
        <RowCheckbox
          data={data}
          selected={selected}
          setSelected={setSelected}
        />
      ),
    },
  ]
  return (
    <Table<RowData>
      columns={columns}
      data={rowsDefault}
      hoverColor={getColor('indigo.10')}
    />
  )
}

interface TooltipRow extends RowData {
  servers: string[]
}

const tooltipRows: TooltipRow[] = rowsDefault.map((row, index) => ({
  ...row,
  servers: Array.from({ length: index + 1 }, (_, item) => `server ${item + 1}`),
}))

function WithTooltip() {
  const columns: Column<TooltipRow>[] = [
    {
      accessor: 'name',
      Header: 'Name',
      Cell: ({ row }) => (
        <TableCellWrapper
          icon={row.original.icon}
          value={
            <Tooltip
              title={row.original.name}
              enableOnlyWithEllipsisPoints
            >
              {row.original.name}
            </Tooltip>
          }
          iconBackgroundColor={getColor('purple.800')}
        />
      ),
    },
    {
      accessor: 'framework',
      Header: 'Framework',
      Cell: ({ value }) => (
        <Tooltip
          title={value}
          enableOnlyWithEllipsisPoints
        >
          {value}
        </Tooltip>
      ),
    },
    { accessor: 'lang', Header: 'Language' },
    { accessor: 'directory', Header: 'Public Directory' },
    {
      accessor: 'servers',
      Header: 'Servers',
      Cell: ({ value }) => (
        <Tooltip title={value.join('\n')}>
          <span>{value.length}</span>
        </Tooltip>
      ),
    },
  ]
  return (
    <Table<TooltipRow>
      columns={columns}
      data={tooltipRows}
      hoverColor={getColor('indigo.10')}
    />
  )
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

function WithSteps() {
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
      hoverColor={getColor('indigo.10')}
      customSubRowInjection={() => (
        <pre style={{ margin: 0 }}>Install dependencies\nDone</pre>
      )}
    />
  )
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

function WithActionStates() {
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
      Header: '',
      Cell: (
        <Grid>
          <Button typeSize="medium">Deploy</Button>
        </Grid>
      ),
    },
  ]
  return (
    <Table<ActionRow>
      columns={columns}
      data={actionRows}
      hoverColor={getColor('indigo.10')}
    />
  )
}

interface MediumRow {
  name: { value: string; icon: Icon }
  actions?: React.ReactNode
}

function MediumSizeTableDefaultWithCheckbox() {
  const [selected, setSelected] = useState<string[]>([])
  const rows: MediumRow[] = [
    { name: { value: 'Machine 1', icon: 'aws' } },
    { name: { value: 'Machine 2', icon: 'server' } },
    { name: { value: 'Machine 3', icon: 'digitalocean' } },
  ]
  const columns: Column<MediumRow>[] = [
    {
      accessor: 'name',
      Header: 'Servers name',
      Cell: ({ value }) => (
        <TableCellWrapper
          icon={value.icon}
          value={value.value}
          iconBackgroundColor={getColor('purple.800')}
        />
      ),
    },
    {
      accessor: 'actions',
      Header: ({ rows: tableRows }) => {
        const rowIds = tableRows.map((row) => row.original.name.value)
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
        const id = row.original.name.value
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
    <Table<MediumRow>
      smallContainer
      columns={columns}
      data={rows}
      hoverColor={getColor('indigo.10')}
    />
  )
}

function MediumSizeTableLoading() {
  return (
    <TableLoading
      cells={[
        {
          name: 'Name',
          rowVariation: TableRowVariation.CHECKBOX_EFFECT_WITH_BAR,
        },
        {
          name: '',
          rowVariation: TableRowVariation.ONE_BUTTON_EFFECT,
          alignEnd: true,
        },
      ]}
      lines={3}
      smallContainer
    />
  )
}

function MediumSizeTableEmpty() {
  return (
    <Table<MediumRow>
      smallContainer
      columns={[{ accessor: 'name', Header: 'Servers name' }]}
      data={[]}
      hoverColor={getColor('indigo.10')}
    />
  )
}

export {
  Default,
  Empty,
  Loading,
  MediumSizeTableDefaultWithCheckbox,
  MediumSizeTableEmpty,
  MediumSizeTableLoading,
  WithActionStates,
  WithCheckbox,
  WithSteps,
  WithTooltip,
}

const meta = {
  title: 'Primitives/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
