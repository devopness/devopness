import { css, styled } from 'styled-components'

import { getColor } from 'src/colors'

const skeleton = css`
  background-color: ${getColor('purple.300')};
  animation-name: color;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;

  @keyframes color {
    0% {
      background-color: ${getColor('purple.300')};
    }
    50% {
      background-color: ${getColor('indigo.100')};
    }
    100% {
      background-color: ${getColor('purple.300')};
    }
  }
`

const AvatarLoading = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 5px;
  ${skeleton}
`

const LoadingBar = styled.div`
  width: 50%;
  height: 18px;
  border-radius: 2px;
  ${skeleton}
`

const LoadingIcon = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 20px;
  ${skeleton}
`

const LoadingBarLink = styled.div`
  width: 20%;
  height: 14px;
  border-radius: 2px;
  ${skeleton}
`

const Container = styled.div`
  display: flex;
  height: 105px;
  width: relative;
  border-radius: 10px;
  border: 1px solid ${getColor('slate.300')};
  background-color: ${getColor('white')};
  box-sizing: border-box;
  font-family: 'Roboto';
  overflow: hidden;
  flex-direction: column;
  align-items: center;
`

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 36px calc(100% - 36px);
  grid-template-rows: 36px;
  align-items: center;
  grid-gap: 15px;
  color: ${getColor('gray.615')};
`

const Header = styled.div`
  max-width: 100%;
  width: 100%;
  height: 63px;
  display: flex;
  align-items: center;
  padding: 0px 15px;
  border-bottom: 1px solid ${getColor('slate.300')};
  box-sizing: border-box;
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  height: 42px;
  padding: 0px 15px;
  box-sizing: border-box;
`

export {
  AvatarLoading,
  Container,
  Footer,
  Grid,
  Header,
  LoadingBar,
  LoadingBarLink,
  LoadingIcon,
}
