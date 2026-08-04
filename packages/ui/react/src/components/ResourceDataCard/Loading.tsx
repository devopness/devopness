import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Skeleton } from 'src/components/Primitives/Skeleton'

import {
  CardHeader,
  CardsContainer,
  CardWrapper,
  ExpandIconWrapper,
  HeaderContent,
  InfoGroup,
  PrefixContainer,
} from './ResourceDataCard.styled'

type ResourceDataCardLoadingProps = {
  paddingTop?: string
  lines?: number
}

const ResourceDataCardLoading = ({
  lines = 5,
  paddingTop = '80px',
}: ResourceDataCardLoadingProps) => {
  const loadingCards = Array.from({ length: lines })

  return (
    <CardsContainer style={{ paddingTop }}>
      {loadingCards.map((_, index) => (
        <CardWrapper key={index}>
          <CardHeader
            disabled
            type="button"
          >
            <HeaderContent>
              <PrefixContainer>
                <Skeleton
                  width={40}
                  height={40}
                  borderRadius={20}
                />
              </PrefixContainer>
              <InfoGroup>
                <div style={{ marginBottom: '4px' }}>
                  <Skeleton
                    width={100}
                    height={12}
                    borderRadius={2}
                  />
                </div>
                <Skeleton
                  width={150}
                  height={15}
                  borderRadius={2}
                />
              </InfoGroup>
            </HeaderContent>
            <ExpandIconWrapper $isExpanded={false}>
              <ExpandMoreIcon />
            </ExpandIconWrapper>
          </CardHeader>
        </CardWrapper>
      ))}
    </CardsContainer>
  )
}

export type { ResourceDataCardLoadingProps }
export { ResourceDataCardLoading }
