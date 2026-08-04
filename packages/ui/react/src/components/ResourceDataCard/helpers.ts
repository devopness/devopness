import { getTextContent } from 'src/utils/getTextContent'

const backgroundColors = [
  '#b388ff',
  '#fcc139',
  '#a0dab5',
  '#fd786e',
  '#62a9ff',
  '#cecbdb',
  '#ff9643',
  '#f2fb6e',
  '#bcaaa4',
  '#ffd7ac',
  '#fd6ef3',
]

const getMiniCardBackground = (index: number) =>
  backgroundColors[index % backgroundColors.length]

const getResourceCardAvatar = (name: string) => {
  const titleText = getTextContent(name)
  const nameHash = titleText
    .split('')
    .reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0)

  return {
    prefixNode: titleText.charAt(0).toUpperCase(),
    prefixBackgroundColor: getMiniCardBackground(nameHash),
  }
}

export { getMiniCardBackground, getResourceCardAvatar }
