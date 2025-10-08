import { Wrapper, BoxLoader } from './styled'
import { getColor } from 'src/colors'
import { Loader } from 'src/components/Primitives'

const LoadingMessage = () => (
  <Wrapper>
    <BoxLoader>
      <Loader
        variant="ring"
        color={getColor('purple.800')}
        size={30}
        text=""
      />
    </BoxLoader>
  </Wrapper>
)

export { LoadingMessage }
