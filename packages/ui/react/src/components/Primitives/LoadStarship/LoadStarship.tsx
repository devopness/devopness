import type { PropsWithChildren } from 'react'
import { memo } from 'react'

import { getImageAssetUrl } from 'src/icons'
import { Container, Gif } from './LoadStarship.styled'

const starshipGif = getImageAssetUrl('effect_load_starship_devopness.gif')

type LoadStarshipProps = {
  /** If true, the loader covers the full window */
  isFullContainer?: boolean
}

/**
 * A component that renders a loading animation.
 *
 * The loading animation is an animated GIF of the devopness starship.
 *
 * @prop {boolean} isFullContainer
 * If true, the loader covers the full window.
 *
 * @example
 * // A full window loader
 * <LoadStarship isFullContainer/>
 *
 * @example
 * // A loader that renders in a container
 * <LoadStarship/>
 */
const LoadStarship = ({
  isFullContainer,
}: PropsWithChildren<LoadStarshipProps>) => (
  <Container $isFullContainer={isFullContainer}>
    <Gif
      src={starshipGif}
      alt="This is an animated GIF image of the devopness starship"
    />
  </Container>
)

const LoadStarshipMemo = memo(LoadStarship)
export { LoadStarshipMemo as LoadStarship }
export type { LoadStarshipProps }
