import path from "path"

/**
 * Get URL for the given image asset on Devopness' CDN.
 *
 * @param imageAssetPath - Image asset path relative to CDN /images/ path.
 */
function getImageAssetURLFor(imageAssetPath: string) {
  const assetsCdnUrl = new URL(process.env.DEVOPNESS_URL_ASSETS ?? '#')
  const assetUrl = new URL(
    path.join(assetsCdnUrl.pathname, 'images', imageAssetPath),
    assetsCdnUrl.origin
  )
  return assetUrl.href
}

export { getImageAssetURLFor }
