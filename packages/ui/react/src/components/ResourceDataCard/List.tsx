import type { ReactNode } from 'react'

import type { EmptyDataProps } from 'src/components/Primitives/EmptyData'
import { EmptyData, Pagination } from 'src/components/Primitives'
import type { PaginationProps } from 'src/components/Primitives/Pagination'
import { getTextContent } from 'src/utils/getTextContent'

import { ResourceDataCard } from './ResourceDataCard'
import type { ResourceDataCardProps } from './ResourceDataCard'
import { ResourceDataCardAdd } from './AddCard'
import { ResourceDataCardLink } from './LinkCard'
import { ResourceDataCardLoading } from './Loading'
import { CardsContainer } from './ResourceDataCard.styled'

const getResourceDataCardKey = (cardProps: ResourceDataCardProps) => {
  if (cardProps.resourceId != null) {
    return `resource-data-card-${cardProps.resourceId}`
  }

  if (cardProps.viewDetailsHref) {
    return `resource-data-card-${cardProps.viewDetailsHref}`
  }

  const itemIdentity = cardProps.items
    ?.map((item) =>
      [
        getTextContent(item.label),
        getTextContent(item.value),
        item.icon ?? '',
        item.isUrl ? 'url' : '',
        item.url ?? '',
        item.isExternalUrl ? 'external' : '',
      ].join('|')
    )
    .join('::')

  return [
    'resource-data-card',
    getTextContent(cardProps.headerLabel),
    getTextContent(cardProps.title),
    itemIdentity ?? '',
    cardProps.prefixBackgroundColor ?? '',
    cardProps.defaultExpanded ? 'expanded' : '',
  ].join('::')
}

type ResourceDataCardListProps = {
  cards: ResourceDataCardProps[]
  isLoading?: boolean
  emptyTableImage?: string
  emptyTableMessage?: EmptyDataProps['message']
  paddingTop?: string
  paddingLeft?: string
  paddingRight?: string
  header?: ReactNode
  description?: ReactNode
  onAdd?: () => void
  disabledAdd?: boolean
  disabledAddTooltip?: string
  onLink?: () => void
  primaryActionType?: string
  pageCount?: number | null
  pagination?: PaginationProps
  resourceTypeHumanReadable?: string
}

const ResourceDataCardList = ({
  cards,
  isLoading,
  pageCount,
  pagination,
  emptyTableImage,
  emptyTableMessage,
  paddingTop,
  paddingLeft,
  paddingRight,
  header,
  description,
  onAdd,
  disabledAdd,
  disabledAddTooltip,
  onLink,
  primaryActionType,
  resourceTypeHumanReadable,
}: ResourceDataCardListProps) => {
  if (isLoading) {
    return <ResourceDataCardLoading paddingTop={paddingTop} />
  }

  const showEmptyState = cards.length === 0 && !onAdd && !onLink

  if (showEmptyState) {
    return (
      <div
        style={{
          padding: '0 16px',
          boxSizing: 'border-box',
          width: '100%',
          paddingTop,
        }}
      >
        <EmptyData
          image={emptyTableImage}
          message={emptyTableMessage || ''}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {(header || description) && (
        <div style={{ padding: '0 16px', marginTop: '16px' }}>
          {header && (
            <div style={{ fontSize: '18px', fontWeight: 600 }}>{header}</div>
          )}
          {description && (
            <div style={{ fontSize: '14px', color: '#666' }}>{description}</div>
          )}
        </div>
      )}
      <CardsContainer
        $paddingLeft={paddingLeft}
        $paddingRight={paddingRight}
        style={{ paddingTop }}
      >
        {onLink && (
          <ResourceDataCardLink
            resourceType={resourceTypeHumanReadable || 'Resource'}
            onClick={onLink}
          />
        )}
        {onAdd && (
          <ResourceDataCardAdd
            actionType={primaryActionType || 'add'}
            resourceType={resourceTypeHumanReadable || 'Resource'}
            onClick={onAdd}
            disabled={disabledAdd}
            disabledTooltip={disabledAddTooltip}
          />
        )}
        {cards.map((cardProps) => (
          <ResourceDataCard
            key={getResourceDataCardKey(cardProps)}
            {...cardProps}
          />
        ))}
        {pageCount && pageCount > 1 && pagination && (
          <div style={{ marginTop: '16px' }}>
            <Pagination {...pagination} />
          </div>
        )}
      </CardsContainer>
    </div>
  )
}

export type { ResourceDataCardListProps }
export { ResourceDataCardList }
