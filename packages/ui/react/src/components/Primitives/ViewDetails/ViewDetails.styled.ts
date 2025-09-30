import { styled } from 'styled-components'

import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'

const LoadingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(290px, 50%) 1fr;
  grid-column-gap: 2em;
  grid-row-gap: 42px;

  margin-top: 42px;
  margin-bottom: 42px;
`

const Section = styled.div`
  grid-column: 2 / 3;
  border-bottom: 1px solid ${getColor('slate.300')};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  min-height: 42px;
`

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(290px, 50%) 1fr;
  grid-column-gap: 2em;
  grid-row-gap: 42px;

  padding-top: 42px;
  padding-bottom: 42px;
`

const DetailViewSection = styled.div`
  grid-column: 2 / 3;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${getColor('slate.300')};
`

const LineWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Title = styled.h3`
  margin: 0px;
  word-break: break-all;
  font-family: ${getFont('montserrat')};
  font-size: 18px;
  font-weight: 600;
  color: ${getColor('blue.800')};
`

const Paragraph = styled.div`
  width: 100%;
  display: flex;
  font-family: ${getFont('roboto')};
  font-size: 13px;
  gap: 0.125rem;
  align-items: start;
`

const Label = styled.label`
  display: flex;
  white-space: nowrap;
  color: ${getColor('slate.400')};
  text-transform: capitalize;
`

const Text = styled.span`
  word-break: break-all;
  font-size: 13px;
  color: ${getColor('blue.800')};
  white-space: pre-wrap;
`
export {
  Container,
  Section,
  Row,
  Title,
  Text,
  LoadingContainer,
  Paragraph,
  Label,
  DetailViewSection,
  LineWrapper,
}
