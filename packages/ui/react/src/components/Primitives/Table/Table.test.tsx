import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Table, type TableCellProps, type TableColumn } from './Table'
import { TableLoadingRowVariation } from './TableLoading/TableLoading'

type TestRow = {
  id: number
  name: string
  status: string
  rowType?: string
  subRows?: TestRow[]
}

const columns: TableColumn<TestRow>[] = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'name' },
  { header: 'Status', accessorKey: 'status' },
]

const data: TestRow[] = [
  { id: 1, name: 'Alpha', status: 'Healthy' },
  { id: 2, name: 'Beta', status: 'Degraded' },
]

describe('Table', () => {
  it('renders headers and cell content', () => {
    render(
      <Table
        columns={columns}
        data={data}
      />
    )

    expect(screen.getByText('ID')).toBeTruthy()
    expect(screen.getByText('Name')).toBeTruthy()
    expect(screen.getByText('Status')).toBeTruthy()
    expect(screen.getByText('Alpha')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
  })

  it('renders custom cell content through column cell callbacks', () => {
    const cellSpy = vi.fn(
      ({ getValue }: TableCellProps<TestRow>) => `name:${String(getValue())}`
    )
    const callbackColumns: TableColumn<TestRow>[] = [
      { header: 'Name', accessorKey: 'name', cell: cellSpy },
    ]

    render(
      <Table
        columns={callbackColumns}
        data={[data[0]]}
      />
    )

    expect(cellSpy).toHaveBeenCalledTimes(1)
    expect(screen.getByText('name:Alpha')).toBeTruthy()
  })

  it('renders loading placeholders when loading is enabled', () => {
    render(
      <Table
        columns={columns}
        data={data}
        isLoading
        loadingTableCells={[
          {
            name: 'Name',
            rowVariation: TableLoadingRowVariation.BAR_EFFECT,
          },
          {
            name: 'Status',
            rowVariation: TableLoadingRowVariation.BAR_EFFECT,
          },
        ]}
      />
    )

    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
    expect(screen.queryByText('Alpha')).not.toBeTruthy()
  })

  it('renders the empty data state wrapper when isEmpty is enabled', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        isEmpty
        emptyData={{
          message: 'No rows',
          image: 'https://example.com/empty.png',
        }}
      />
    )

    expect(screen.getByText('No rows')).toBeTruthy()
    expect(screen.getByAltText('Empty data logo')).toBeTruthy()
  })

  it('renders the empty data message when no rows are provided', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        isEmpty
        emptyData={{ message: 'No rows' }}
      />
    )

    expect(screen.getByText('No rows')).toBeTruthy()
  })

  it('uses the fixed height wrapper style when height is provided', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={data}
        height="420px"
      />
    )

    expect(container.firstChild).toHaveStyle('height: 420px')
  })

  it('renders pagination only when there is more than one page', () => {
    const paginationProps = {
      firstPaginateAction: vi.fn(),
      previousPaginateAction: vi.fn(),
      nextPaginateAction: vi.fn(),
      lastPaginateAction: vi.fn(),
    }

    const { rerender } = render(
      <Table
        columns={columns}
        data={data}
        paginationData={{ pageCount: 1, paginationProps }}
      />
    )

    expect(screen.queryByLabelText('Go to next page')).not.toBeTruthy()

    rerender(
      <Table
        columns={columns}
        data={data}
        paginationData={{ pageCount: 2, paginationProps }}
      />
    )

    expect(screen.getByLabelText('Go to next page')).toBeTruthy()
  })

  it('calls pagination callbacks when pagination controls are used', () => {
    const paginationProps = {
      firstPaginateAction: vi.fn(),
      previousPaginateAction: vi.fn(),
      nextPaginateAction: vi.fn(),
      lastPaginateAction: vi.fn(),
    }

    render(
      <Table
        columns={columns}
        data={data}
        paginationData={{ pageCount: 2, paginationProps }}
      />
    )

    fireEvent.click(screen.getByLabelText('Go to first page'))
    fireEvent.click(screen.getByLabelText('Go to previous page'))
    fireEvent.click(screen.getByLabelText('Go to next page'))
    fireEvent.click(screen.getByLabelText('Go to last page'))

    expect(paginationProps.firstPaginateAction).toHaveBeenCalledTimes(1)
    expect(paginationProps.previousPaginateAction).toHaveBeenCalledTimes(1)
    expect(paginationProps.nextPaginateAction).toHaveBeenCalledTimes(1)
    expect(paginationProps.lastPaginateAction).toHaveBeenCalledTimes(1)
  })

  it('expands rows and renders nested subrows', () => {
    const expandableColumns: TableColumn<TestRow>[] = [
      { header: 'Name', accessorKey: 'name' },
      { header: 'Status', accessorKey: 'status' },
    ]

    const expandableData: TestRow[] = [
      {
        id: 1,
        name: 'Parent',
        status: 'Open',
        subRows: [{ id: 2, name: 'Child', status: 'Closed' }],
      },
    ]

    const { container } = render(
      <Table
        columns={expandableColumns}
        data={expandableData}
      />
    )

    const parentRow = screen.getByText('Parent').closest('tr')
    expect(parentRow).toBeTruthy()
    const body = container.querySelector('tbody')
    expect(body).toBeTruthy()
    expect(within(body as HTMLElement).queryByText('Child')).toBeNull()

    fireEvent.click(parentRow as HTMLElement)
    expect(within(body as HTMLElement).getByText('Child')).toBeTruthy()

    fireEvent.click(parentRow as HTMLElement)
    expect(within(body as HTMLElement).queryByText('Child')).toBeNull()
  })

  it('renders custom subrow content for expanded leaf rows', () => {
    const { container } = render(
      <Table
        columns={columns}
        data={[data[0]]}
        getRowCanExpand={() => true}
        customSubRowInjection={() => <span>Custom child</span>}
      />
    )

    const parentRow = screen.getByText('Alpha').closest('tr')
    expect(parentRow).toBeTruthy()
    const body = container.querySelector('tbody')
    expect(body).toBeTruthy()
    expect(within(body as HTMLElement).queryByText('Custom child')).toBeNull()

    fireEvent.click(parentRow as HTMLElement)
    expect(within(body as HTMLElement).getByText('Custom child')).toBeTruthy()

    fireEvent.click(parentRow as HTMLElement)
    expect(within(body as HTMLElement).queryByText('Custom child')).toBeNull()
  })

  it('allows inner step rows to expand and render their log content', () => {
    const steps: TestRow[] = [
      {
        id: 1,
        name: 'Parent',
        status: 'Open',
        subRows: [
          {
            id: 2,
            name: 'Inner step',
            status: 'Running',
            rowType: 'subrow',
          },
        ],
      },
    ]
    const { container } = render(
      <Table
        columns={columns}
        data={steps}
        customSubRowInjection={() => <span>Step log</span>}
      />
    )
    const body = container.querySelector('tbody')
    expect(body).toBeTruthy()

    fireEvent.click(screen.getByText('Parent').closest('tr') as HTMLElement)
    const innerStepRow = screen.getByText('Inner step').closest('tr')
    expect(innerStepRow).toBeTruthy()
    expect(within(body as HTMLElement).queryByText('Step log')).toBeNull()

    fireEvent.click(innerStepRow as HTMLElement)
    expect(within(body as HTMLElement).getByText('Step log')).toBeTruthy()
  })
})
