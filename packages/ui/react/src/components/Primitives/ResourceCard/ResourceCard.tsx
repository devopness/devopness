import type React from 'react'

import {
  Avatar,
  CardContainer,
  CardInner,
  Header,
  Meta,
  MetaGroup,
  Name,
} from './ResourceCard.styled'
import { Tooltip } from 'src/components/Primitives/Tooltip'

const AVATAR_BACKGROUND_COLORS = [
  '#b388ff',
  '#fcc139',
  '#a0dab5',
  '#fd786e',
  '#62a9ff',
  '#cecbdb',
  '#ff9643',
  '#f2fb6e',
  '#bcaaa4',
  '#ffd7ac',
  '#fd6ef3',
]

const RELATIVE_TIME_UNITS: [
  Intl.RelativeTimeFormatUnit,
  number,
][] = [
  [
    'year',
    1000 * 60 * 60 * 24 * 365,
  ],
  [
    'month',
    1000 * 60 * 60 * 24 * 30,
  ],
  [
    'day',
    1000 * 60 * 60 * 24,
  ],
  [
    'hour',
    1000 * 60 * 60,
  ],
  [
    'minute',
    1000 * 60,
  ],
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'always',
})

/** Formats a date as relative time, e.g. `"5 minutes ago"`, `"in 2 days"` */
const formatRelativeTime = (date: string | Date) => {
  const diffMs = new Date(date).getTime() - Date.now()

  for (const [
    unit,
    unitMs,
  ] of RELATIVE_TIME_UNITS) {
    if (Math.abs(diffMs) >= unitMs) {
      return relativeTimeFormatter.format(Math.round(diffMs / unitMs), unit)
    }
  }

  return relativeTimeFormatter.format(Math.round(diffMs / 1000), 'second')
}

/**
 * Hashes a name into a stable index for picking an avatar background color,
 * so the same name always resolves to the same color
 */
const hashNameToColorIndex = (name: string) => {
  const sum = name
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)

  return (sum + 1) % AVATAR_BACKGROUND_COLORS.length
}

type ResourceCardProps = {
  /** Resource name, shown as the card title and avatar initial */
  name: string
  /** Organization name, shown in the meta row when provided */
  organization?: string
  /** Creation date, displayed as relative time, e.g. `"5 minutes ago"` */
  createdAt?: string | Date
  onClick?: () => void
  /**
   * Derive the avatar background color from a hash of `name`, instead of
   * the default color
   *
   * @default false
   */
  useDynamicColor?: boolean
}

/**
 * A card summarizing a resource (name, organization and creation date), for
 * use as a tile inside `CardGrid`
 */
const ResourceCard = ({
  name,
  organization,
  createdAt,
  onClick,
  useDynamicColor = false,
}: ResourceCardProps) => {
  const backgroundColor = useDynamicColor
    ? AVATAR_BACKGROUND_COLORS[hashNameToColorIndex(name)]
    : undefined

  const createdLabel = createdAt ? formatRelativeTime(createdAt) : undefined

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick?.()
  }

  return (
    <CardContainer
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <CardInner>
        <Header>
          <Avatar $backgroundColor={backgroundColor}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <Tooltip
            title={name}
            enableOnlyWithEllipsisPoints
          >
            <Name>{name}</Name>
          </Tooltip>
        </Header>
        {(organization || createdLabel) && (
          <MetaGroup>
            {organization && <Meta>Organization: {organization}</Meta>}
            {createdLabel && <Meta>Created: {createdLabel}</Meta>}
          </MetaGroup>
        )}
      </CardInner>
    </CardContainer>
  )
}

export type { ResourceCardProps }
export { ResourceCard }
