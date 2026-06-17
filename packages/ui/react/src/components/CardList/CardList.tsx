import type { CardProps } from 'src/components/Templates/Card'
import { Card } from 'src/components/Templates/Card'
import { IconComponent as Icon } from 'src/components/Primitives'
import { CardLoadEffectGenerator } from 'src/utils/loadEffectGenerator'
import type { Color } from './CardTheme'

import { StyledCardListContainer, StyledGrid } from './CardList.styled'

/**
 * The size of the indicator icon
 */
const INDICATOR_ICON_SIZE = 16

type CardListProps = {
  /**
   * Array of card data to be rendered
   */
  data: (Pick<CardProps, 'children' | 'icon' | 'footer' | 'url'> & {
    backgroundColor: Color
    color: Color
    indicator: number
    label: string
  })[]
  /**
   * Whether there was an error loading the data
   */
  isError: boolean
  /**
   * Whether the data is currently loading
   */
  isLoading: boolean
  /**
   * The number of cards to render during loading state
   *
   * This helps to avoid layout shifts when the cards are rendered
   */
  loadingCardsCount: number
}

/**
 * Renders a grid of cards with loading and error states
 */
const CardList = ({
  data,
  isError: isErrorCount,
  isLoading: isLoadingCount,
  loadingCardsCount,
}: CardListProps) => {
  const indicatorElement = isLoadingCount ? (
    <Icon
      color="gray.600"
      name="loading"
      size={INDICATOR_ICON_SIZE}
    />
  ) : isErrorCount ? (
    <Icon
      color="red.500"
      name="error"
      size={INDICATOR_ICON_SIZE}
    />
  ) : undefined

  /**
   * If there are no cards to render, show the loading skeleton
   *
   * This helps to avoid layout shifts when the cards are rendered
   */
  if (data.length === 0) {
    return (
      <div data-testid="card-list-empty-state">
        <CardLoadEffectGenerator numberOfCards={loadingCardsCount} />
      </div>
    )
  }

  return (
    <StyledCardListContainer>
      <StyledGrid>
        {data.map(
          ({
            backgroundColor: backgroundColorName,
            color: colorName,
            indicator,
            label,
            ...props
          }) => (
            <Card
              avatarProps={{
                backgroundColor: colorName,
              }}
              headerProps={{
                backgroundColor: backgroundColorName,
                borderBottomColor: colorName,
              }}
              id={`module_card_${label}`}
              indicator={indicatorElement ?? indicator}
              key={label}
              title={label}
              {...props}
            />
          )
        )}
      </StyledGrid>
    </StyledCardListContainer>
  )
}

export type { CardListProps }
export { CardList }
