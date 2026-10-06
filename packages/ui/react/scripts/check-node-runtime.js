const [major, minor, patch] = process.versions.node.split('.').map(Number)

const isSupported =
  (major === 22 && (minor > 22 || (minor === 22 && patch >= 2))) ||
  (major === 24 && minor >= 15) ||
  major >= 26

if (!isSupported) {
  console.error(
    `UI React tests require Node.js ^22.22.2 || ^24.15.0 || >=26.0.0; found ${process.version}.`
  )
  process.exitCode = 1
}
