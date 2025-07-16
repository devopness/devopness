import { ScaleLoader } from 'react-spinners'

import type { ReactSpinnersProps } from './ReactSpinners.type'
import { getColor } from 'src/colors'

type BarLoaderProps = ReactSpinnersProps

const BarLoader = (props: BarLoaderProps) => (
  <ScaleLoader
    color={getColor('gray.300')}
    size={4}
    {...props}
  />
)

export { BarLoader }
