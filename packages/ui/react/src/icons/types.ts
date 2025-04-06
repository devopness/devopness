import type { deprecatedToNewIconMap, iconList } from './iconLoader'

/**
 * Lists all valid icon names available in the iconList
 */
type Icon = (typeof iconList)[number]['name']

/**
 * Lists all valid icon names, filtered out the deprecated ones
 *
 * If you need to migrate from a deprecated icon, you can use the
 * deprecatedToNewIconMap object to find the new icon name.
 *
 * @see {deprecatedToNewIconMap}
 */
type ValidIcon = Exclude<Icon, keyof typeof deprecatedToNewIconMap>

export type { ValidIcon as Icon }
