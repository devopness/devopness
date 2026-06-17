import { getColor } from 'src/colors'
import { getFont } from 'src/fonts'
import type { Color } from 'src/colors'

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

const getPropsColor =
  (defaultColor: Color = 'purple.800') =>
  ({ color = defaultColor }: { color?: Color }) =>
    getColor(color)

const getMiniCardBackground = (index: number) =>
  backgroundColors[index % backgroundColors.length]

const getPropsBackground =
  (defaultColor: Color = 'indigo.10') =>
  ({ background = defaultColor }: { background?: Color }) =>
    getColor(background)

export type { Color }

export {
  getColor,
  getFont,
  getMiniCardBackground,
  getPropsBackground,
  getPropsColor,
}
