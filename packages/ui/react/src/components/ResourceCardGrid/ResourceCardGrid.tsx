import { CreateResourceCard } from './CreateResourceCard/CreateResourceCard'
import { GridWrapper } from './ResourceCardGrid.styled'
import { CardGrid } from 'src/components/Primitives/CardGrid'
import type { PaginationProps } from 'src/components/Primitives/Pagination'
import { Pagination } from 'src/components/Primitives/Pagination'
import type { ResourceCardProps } from 'src/components/Primitives/ResourceCard'
import { ResourceCard } from 'src/components/Primitives/ResourceCard'

type ResourceCardGridProps = {
  /** Label used in the "Add {resourceType}" create-tile, e.g. `"project"` */
  resourceType: string
  /** Resource tiles to render after the create tile */
  resources: ResourceCardProps[]
  /** Called when the create tile is clicked */
  onCreateResource?: () => void
  /** Total number of pages; pagination controls only render when greater than 1 */
  pageCount: number
  /** Props forwarded to `Pagination` */
  pagination: PaginationProps
}

/**
 * A responsive grid of `ResourceCard` tiles, with a "create" tile always
 * shown first and pagination controls shown when there's more than one page.
 *
 * Combines `CardGrid`, `ResourceCard` and `Pagination` so callers don't have
 * to re-assemble this layout by hand for every resource list page.
 *
 * @example
 * ```tsx
 * <ResourceCardGrid
 *   resourceType="project"
 *   resources={projects.map((project) => ({ name: project.name, onClick: () => open(project) }))}
 *   onCreateResource={() => navigate('/projects/add')}
 *   pageCount={pageCount}
 *   pagination={pagination}
 * />
 * ```
 */
const ResourceCardGrid = ({
  resourceType,
  resources,
  onCreateResource,
  pageCount,
  pagination,
}: ResourceCardGridProps) => (
  <GridWrapper>
    <CardGrid
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      rowHeight="160px"
    >
      <CreateResourceCard
        resourceType={resourceType}
        onClick={onCreateResource}
      />

      {resources.map((resource) => (
        <ResourceCard
          key={resource.name}
          {...resource}
        />
      ))}
    </CardGrid>

    {pageCount > 1 && <Pagination {...pagination} />}
  </GridWrapper>
)

export type { ResourceCardGridProps }
export { ResourceCardGrid }
