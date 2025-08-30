import { PageContainer } from './Loader.styled'
import { Text } from 'src/components/Primitives/Text'

type PageLoaderProps = {
  text?: string
  imageSrc?: string
}

const PageLoader = ({ imageSrc, text = 'Loading...' }: PageLoaderProps) => (
  <PageContainer>
    <div>
      <img
        src={imageSrc}
        alt="Loading..."
      />
      <Text className="translate">{text}</Text>
    </div>
  </PageContainer>
)

export { PageLoader }
