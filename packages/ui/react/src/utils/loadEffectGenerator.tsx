import { CardLoading } from 'src/components/Primitives/CardLoading'
import {
  StyledCardListContainer,
  StyledGrid,
} from '../components/CardList/CardList.styled'

type CardLoadProps = {
  numberOfCards: number
}

const CardLoadEffectGenerator = ({ numberOfCards }: CardLoadProps) => {
  return (
    <StyledCardListContainer>
      <StyledGrid>
        {[
          Array.from(Array(numberOfCards)).map((_, index) => (
            <CardLoading key={index} />
          )),
        ]}
      </StyledGrid>
    </StyledCardListContainer>
  )
}

export { CardLoadEffectGenerator }
