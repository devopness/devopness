import type { Meta } from '@storybook/react-vite'

import { TableRowDragDrop } from './TableRowDragDrop'
import {
  mockedTableColumns,
  mockedTableData,
} from './TableRowDragDrop.sample-data'

const meta = {
  title: 'Primitives/Table/Drag and drop',
  component: TableRowDragDrop,
} satisfies Meta<typeof TableRowDragDrop>

export default meta

export const Default = {
  args: {
    data: mockedTableData.map((item, index) => ({
      ...item,
      blockDrag: !!(index % 2) && {
        message: `Row ${index + 1} is blocked!`,
      },
    })),
    columns: mockedTableColumns,
    onDrop: () => undefined,
    onDrag: () => undefined,
  },
}
