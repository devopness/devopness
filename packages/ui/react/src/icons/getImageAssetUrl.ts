import path from 'path-browserify'

const DEVOPNESS_URL_ASSETS = new URL('https://assets.devopness.com')

/**
 * Get URL for the given image asset on Devopness' CDN.
 *
 * @param imageAssetPath - Image asset path relative to CDN /images/ path.
 */
function getImageAssetUrl(imageAssetPath: string) {
  const assetUrl = new URL(
    path.join(DEVOPNESS_URL_ASSETS.pathname, 'images', imageAssetPath),
    DEVOPNESS_URL_ASSETS.origin
  )
  return assetUrl.href
}

export { getImageAssetUrl }
