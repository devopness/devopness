import { CircleLoader as CometSpinLoader } from 'react-spinners'

import { getColor } from 'src/colors'
import { ContainerCometSpinLoader } from './Loader.styled'
import type { ReactSpinnersProps } from './ReactSpinners.type'

type CircleLoaderProps = {
  paddingTop?: string
} & ReactSpinnersProps

const CircleLoader = ({ paddingTop, ...props }: CircleLoaderProps) => (
  <ContainerCometSpinLoader $paddingTop={paddingTop}>
    <CometSpinLoader
      color={getColor('purple.800')}
      size={20}
      {...props}
    />
  </ContainerCometSpinLoader>
)

export { CircleLoader }
