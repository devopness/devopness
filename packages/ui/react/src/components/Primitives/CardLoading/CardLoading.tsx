import {
  AvatarLoading,
  LoadingIcon,
  LoadingBar,
  LoadingBarLink,
  Container,
  Grid,
  Header,
  Footer,
} from './CardLoading.styled'

/**
 * CardLoading is a skeleton placeholder component
 * used to indicate that content inside a card
 * is loading.
 *
 * @example
 * ```jsx
 * <CardLoading />
 * ```
 */
const CardLoading = () => (
  <Container data-testid="card-loading">
    <Header>
      <Grid>
        <AvatarLoading />
        <LoadingBar />
      </Grid>
    </Header>
    <Footer>
      <LoadingIcon />
      <LoadingBarLink />
    </Footer>
  </Container>
)

export { CardLoading }
