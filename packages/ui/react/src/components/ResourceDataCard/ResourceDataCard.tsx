import { useState } from 'react'
import type { ReactNode } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { iconLoader } from 'src/icons'
import { Link } from 'src/components/Primitives/Link'

import {
  CardBodyContent,
  CardBodyInner,
  CardBodyWrapper,
  CardFooter,
  CardFooterLabel,
  CardHeader,
  CardWrapper,
  DataLabel,
  DataRow,
  DataValue,
  ExpandIconWrapper,
  HeaderContent,
  HeaderLabel,
  InfoGroup,
  PrefixContainer,
  Title,
} from './ResourceDataCard.styled'

type ResourceIconName = Parameters<typeof iconLoader>[0]

type ResourceDataCardItem = {
  label: ReactNode
  value: ReactNode
  icon?: ResourceIconName
  isUrl?: boolean
  url?: string
  isExternalUrl?: boolean
}

type ResourceDataCardProps = {
  title: ReactNode
  headerLabel?: ReactNode
  prefixNode?: ReactNode
  items?: ResourceDataCardItem[]
  actions?: ReactNode
  defaultExpanded?: boolean
  prefixBackgroundColor?: string
  viewDetailsHref?: string
  viewDetailsLabel?: string
}

const ResourceDataCard = ({
  title,
  headerLabel,
  prefixNode,
  items,
  actions,
  defaultExpanded = false,
  prefixBackgroundColor,
  viewDetailsHref,
  viewDetailsLabel = 'View Details',
}: ResourceDataCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const hasContent = Boolean((items && items.length > 0) || actions)
  const hasFooter = Boolean(viewDetailsHref)

  return (
    <CardWrapper>
      <CardHeader
        type="button"
        onClick={() => {
          if (hasContent) {
            setIsExpanded((previous) => !previous)
          }
        }}
        aria-expanded={isExpanded}
        disabled={!hasContent}
      >
        <HeaderContent>
          {prefixNode && (
            <PrefixContainer $backgroundColor={prefixBackgroundColor}>
              {prefixNode}
            </PrefixContainer>
          )}
          <InfoGroup>
            {headerLabel && <HeaderLabel>{headerLabel}</HeaderLabel>}
            <Title>{title}</Title>
          </InfoGroup>
        </HeaderContent>

        {hasContent && (
          <ExpandIconWrapper $isExpanded={isExpanded}>
            <ExpandMoreIcon />
          </ExpandIconWrapper>
        )}
      </CardHeader>

      {hasContent && (
        <CardBodyWrapper $isExpanded={isExpanded}>
          <CardBodyContent>
            <CardBodyInner>
              {items?.map((item, index) => (
                <DataRow key={`data-row-${index}`}>
                  {item.label && <DataLabel>{item.label}</DataLabel>}
                  <DataValue>
                    {item.icon && iconLoader(item.icon, 20, 'gray.600')}
                    {item.isUrl && item.url ? (
                      <Link
                        to={item.url}
                        target={item.isExternalUrl ? '_blank' : '_self'}
                        hideExternalUrlIcon
                        style={{ fontSize: '13px' }}
                      >
                        {item.value}
                      </Link>
                    ) : (
                      item.value
                    )}
                  </DataValue>
                </DataRow>
              ))}
              {actions}
            </CardBodyInner>
          </CardBodyContent>
        </CardBodyWrapper>
      )}

      {hasFooter && (
        <CardFooter
          to={viewDetailsHref as string}
          target="_self"
          hideUnderline={false}
          hideUnderlineOnHover
          hideExternalUrlIcon
        >
          <CardFooterLabel>{viewDetailsLabel}</CardFooterLabel>
        </CardFooter>
      )}
    </CardWrapper>
  )
}

export type { ResourceDataCardItem, ResourceDataCardProps }
export { ResourceDataCard }
