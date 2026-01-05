import {
  EmptyDataContainer,
  EmptyDataText,
  Img,
  ImgContainer,
} from './EmptyData.styled'

const defaultMessageEmptyTable = `
  You do not have any items created for this module.
  To create use the Add button above.
`

type EmptyDataProps = {
  /**
   * Enables style settings for small containers
   */
  isSmallContainer?: boolean
  /**
   * Image to be displayed
   */
  image?: string
  /**
   * message to be displayed
   */
  message?: string
}

const EmptyData = ({ isSmallContainer, image, message }: EmptyDataProps) => (
  <EmptyDataContainer>
    {image && (
      <ImgContainer
        $isSmallContainer={Boolean(isSmallContainer)}
        data-testid="emptydata-img-container"
      >
        <Img
          src={image}
          alt="Empty data logo"
          loading="lazy"
        />
      </ImgContainer>
    )}
    <EmptyDataText>{message ?? defaultMessageEmptyTable}</EmptyDataText>
  </EmptyDataContainer>
)

export { EmptyData }
export type { EmptyDataProps }
