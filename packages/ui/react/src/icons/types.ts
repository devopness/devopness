import type { deprecatedToNewIconMap, iconList } from './iconLoader'

/**
 * Lists all valid icon accessors available in the iconList
 */
type Icon = (typeof iconList)[number]['name']

/**
 * Lists all valid icon accessors, filtered out the deprecated ones
 *
 * If you need to migrate from a deprecated icon, you can use the
 * DeprecatedIcons object to find the new icon accessor.
 *
 * @see {deprecatedToNewIconMap}
 */
type ValidIcon = Exclude<Icon, keyof typeof deprecatedToNewIconMap>

export type { ValidIcon as Icon }
