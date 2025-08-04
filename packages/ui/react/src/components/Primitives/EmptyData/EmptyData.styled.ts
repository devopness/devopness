import { styled } from 'styled-components'

type ImgContainerProps = {
  isSmallContainer: boolean
}

const ImgContainer = styled.div<ImgContainerProps>`
  width: ${({ isSmallContainer }) => (isSmallContainer ? 100 : 170)}px;
  height: ${({ isSmallContainer }) => (isSmallContainer ? 100 : 170)}px;
  overflow: hidden;
`

const Img = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 40px;
  border-radius: 5px;
  object-fit: cover;
  pointer-events: none;
`

const EmptyDataContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 40px;
  width: 100%;
  margin-top: 63px;
  margin-bottom: 32px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`

const EmptyDataText = styled.div`
  max-width: 330px;
  width: 100%;
  text-align: center;
`
export { EmptyDataContainer, EmptyDataText, ImgContainer, Img }
