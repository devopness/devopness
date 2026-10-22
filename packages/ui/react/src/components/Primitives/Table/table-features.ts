import {
  columnVisibilityFeature,
  createCoreRowModel,
  createExpandedRowModel,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const tableFeatureSet = tableFeatures({
  columnVisibilityFeature,
  rowExpandingFeature,
  coreRowModel: createCoreRowModel(),
  expandedRowModel: createExpandedRowModel(),
})

export type TableFeatureSet = typeof tableFeatureSet
