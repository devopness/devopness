import { css, styled } from 'styled-components'

type ContainerProps = {
  isFullContainer?: boolean
}

const loadingPage = css`
  width: 100vw;
  height: calc(100vh - (105px + 42px));
`

const loadingFullWindow = css`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
`

const Container = styled.div<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  ${({ isFullContainer }) =>
    isFullContainer ? loadingFullWindow : loadingPage}
`

const Gif = styled.img`
  width: 140px;
  height: 140px;

  @media (max-width: 1366px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 320px) {
    width: 80px;
    height: 80px;
  }
`

export { Container, Gif }
