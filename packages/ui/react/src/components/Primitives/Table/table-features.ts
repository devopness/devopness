import {
  columnVisibilityFeature,
  createCoreRowModel,
  createExpandedRowModel,
  rowExpandingFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const tableFeatureSet = tableFeatures({
  columnVisibilityFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  coreRowModel: createCoreRowModel(),
  expandedRowModel: createExpandedRowModel(),
})

export type TableFeatureSet = typeof tableFeatureSet
