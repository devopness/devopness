import {
  EmptyDataContainer,
  EmptyDataText,
  EmptyDataTitle,
  EmptyDataDescription,
  Img,
  ImgContainer,
} from './EmptyData.styled'

const defaultMessageEmptyTable = `
  You do not have any items created for this module.
  To create use the Add button above.
`

type EmptyDataMessage = {
  /** Short, friendly title. Example: "Nothing here yet" */
  title: string
  /** Optional supporting description with context or next step */
  description?: string
}

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
   * Message displayed in the empty state.
   * Pass a plain string for simple use cases, or an object with
   * `title` and optional `description` for structured messages.
   */
  message?: string | EmptyDataMessage
}

const defaultMessage: EmptyDataMessage = {
  title: 'Nothing here yet',
  description: defaultMessageEmptyTable.trim(),
}

const EmptyData = ({ isSmallContainer, image, message }: EmptyDataProps) => {
  const resolved = message ?? defaultMessage
  const isStructured = resolved !== null && typeof resolved === 'object'

  return (
    <EmptyDataContainer>
      {image && (
        <ImgContainer
          $isSmallContainer={isSmallContainer ?? false}
          data-testid="emptydata-img-container"
        >
          <Img
            src={image}
            alt="Empty data logo"
            loading="lazy"
          />
        </ImgContainer>
      )}
      <EmptyDataText>
        {isStructured ? (
          <>
            <EmptyDataTitle>{resolved.title}</EmptyDataTitle>
            {resolved.description && (
              <EmptyDataDescription>
                {resolved.description}
              </EmptyDataDescription>
            )}
          </>
        ) : (
          resolved
        )}
      </EmptyDataText>
    </EmptyDataContainer>
  )
}

export { EmptyData }
export type { EmptyDataProps, EmptyDataMessage }
