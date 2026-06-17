import { Fragment, useRef, useState, useEffect } from 'react'
import { Alert } from 'src/components/Forms/Alert'
import { Button } from 'src/components/Buttons'
import { Link } from 'src/components/Primitives'
import { Skeleton, Tooltip } from 'src/components/Primitives'
import { getColor } from 'src/colors'
import ConditionalWrapper from 'src/utils/ConditialWrapper'

import {
  StyledAddResourceContainer,
  StyledDivider,
  StyledResourceList,
  StyledResourceName,
} from './CardContent.styled'

type ResourceItemData = {
  id: number | string
  name: string
  url: string
}

function useIsOverflowing(ref: React.RefObject<HTMLElement | null>) {
  const [
    isOverflowing,
    setIsOverflowing,
  ] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth)
    }
  }, [
    ref,
  ])

  return isOverflowing
}

type CardContentProps = {
  /**
   * Base path for resource URLs
   */
  basePath: string

  /**
   * Custom path to the resource creation page, if it differs from the default `${basePath}/add`
   */
  customAddPath?: string

  /**
   * Whether there was an error loading the data
   */
  isError: boolean

  /**
   * Whether the data is currently loading
   */
  isLoading: boolean

  /**
   * The maximum number of resources to display in the card content
   *
   * This affects the card content height, as it will reserve space for the
   * remaining resources.
   *
   * @default 3
   */
  maxLength?: number

  /**
   * The plural label for the resource type (e.g. "Applications", "Servers")
   */
  resourceTypeLabelPlural: string

  /**
   * The singular label for the resource type (e.g. "Application", "Server")
   */
  resourceTypeLabelSingular: string

  /**
   * The list of resources to display
   */
  resources: ResourceItemData[]

  /**
   * Whether the user is allowed to add a new resource.
   * If not allowed, the button is disabled.
   */
  userCanAddResource?: boolean

  /**
   * The error message to display when the user doesn't have permission to add a resource.
   */
  userPermissionsErrorMessage?: string
}

const DEFAULT_MAX_LENGTH = 3

/**
 * Card content component for displaying a list of resources
 */
const CardContent = ({
  basePath,
  customAddPath,
  isError,
  isLoading,
  maxLength = DEFAULT_MAX_LENGTH,
  resourceTypeLabelPlural,
  resourceTypeLabelSingular,
  resources,
  userCanAddResource = true,
  userPermissionsErrorMessage,
}: CardContentProps) => {
  if (isError) {
    return (
      <StyledResourceList
        style={{
          alignItems: 'center',
          minHeight: '9.875rem',
        }}
      >
        <Alert
          alertDescription={`Failed to load ${resourceTypeLabelPlural.toLowerCase()}`}
          noPadding
          type="error"
        />
      </StyledResourceList>
    )
  }

  if (isLoading) {
    return (
      <StyledResourceList>
        {Array(maxLength)
          .fill(undefined)
          .map((_, index) => (
            <Fragment key={`skeleton_${index}`}>
              <ResourceItemSkeleton />
              {index < maxLength - 1 && <StyledDivider />}
            </Fragment>
          ))}
      </StyledResourceList>
    )
  }

  const isEmpty = resources.length === 0

  if (isEmpty) {
    return (
      <AddResource
        basePath={basePath}
        customAddPath={customAddPath}
        resourceTypeLabelPlural={resourceTypeLabelPlural}
        resourceTypeLabelSingular={resourceTypeLabelSingular}
        userCanAddResource={userCanAddResource}
        userPermissionsErrorMessage={userPermissionsErrorMessage}
      />
    )
  }

  const emptySlotsCount = maxLength - resources.length
  const emptySlots = Array(Math.max(0, emptySlotsCount)).fill(
    undefined
  ) as undefined[]

  const allResources: (ResourceItemData | undefined)[] = [
    ...resources.slice(0, maxLength),
    ...emptySlots,
  ]

  return (
    <StyledResourceList>
      {allResources.map((resource, index) => (
        <Fragment key={resource?.id ?? `$resource_item_${index}`}>
          <ResourceItem resource={resource} />
          {index < maxLength - 1 && <StyledDivider />}
        </Fragment>
      ))}
    </StyledResourceList>
  )
}

type AddResourceProps = Pick<
  CardContentProps,
  | 'basePath'
  | 'resourceTypeLabelPlural'
  | 'resourceTypeLabelSingular'
  | 'customAddPath'
> & {
  userCanAddResource: boolean
  userPermissionsErrorMessage?: string
}

const AddResource = ({
  basePath,
  customAddPath,
  resourceTypeLabelPlural,
  resourceTypeLabelSingular,
  userCanAddResource,
  userPermissionsErrorMessage,
}: AddResourceProps) => {
  const pathToNavigateTo = customAddPath ?? `${basePath}/add`
  const isDisabled = !userCanAddResource

  return (
    <StyledAddResourceContainer>
      <span
        style={{
          color: getColor('blue.950'),
        }}
      >{`No ${resourceTypeLabelPlural}`}</span>
      <Tooltip title={userPermissionsErrorMessage ?? ''}>
        <ConditionalWrapper
          condition={!isDisabled}
          wrapper={(children) => (
            <Link
              hideExternalUrlIcon
              hideUnderline
              hideUnderlineOnHover
              target="_self"
              to={pathToNavigateTo}
              style={{
                display: 'block',
                marginRight: 'auto',
              }}
            >
              {children}
            </Link>
          )}
        >
          <Button
            buttonType="outlinedSecondary"
            color={getColor('purple.800')}
            noMargin
            noPointerEvents={isDisabled}
            disabled={isDisabled}
            style={{
              alignItems: 'start',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              fontSize: '0.813rem',
              height: 'auto',
            }}
            typeSize="medium"
          >
            {`+ add ${resourceTypeLabelSingular.toLowerCase()}`}
          </Button>
        </ConditionalWrapper>
      </Tooltip>
    </StyledAddResourceContainer>
  )
}

type ResourceItemProps = {
  resource: ResourceItemData | undefined
}

const ResourceItem = ({ resource }: ResourceItemProps) => {
  const elementRef = useRef<HTMLSpanElement>(null)
  const isOverflowing = useIsOverflowing(elementRef)

  if (!resource) {
    return <StyledResourceName $disableHover />
  }

  return (
    <Tooltip
      title={resource.name}
      disableHover={!isOverflowing}
    >
      <Link
        hideExternalUrlIcon
        hideUnderline
        target="_self"
        to={resource.url}
        style={{
          marginRight: 'auto',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <StyledResourceName ref={elementRef}>
          {resource.name}
        </StyledResourceName>
      </Link>
    </Tooltip>
  )
}

type ResourceItemSkeletonProps = Record<string, never>

const ResourceItemSkeleton = (_props: ResourceItemSkeletonProps) => (
  <StyledResourceName
    data-testid="resource-item-skeleton"
    $disableHover
  >
    <Skeleton
      widthPercent={90}
      heightPercent={100}
      borderRadius={2}
    />
  </StyledResourceName>
)

export { CardContent }
export type { CardContentProps, ResourceItemData }
