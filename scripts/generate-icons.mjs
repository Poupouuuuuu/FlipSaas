import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const inputPath = join(publicDir, 'logo-original.png')

async function generateIcons() {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  console.log(`Original: ${metadata.width}x${metadata.height}`)

  // Crop to square centered on the icon content (remove white padding)
  // Trim whitespace, then add small uniform padding back
  const trimmed = sharp(inputPath).trim({ threshold: 240 })
  const trimmedMeta = await trimmed.clone().toBuffer().then(buf => sharp(buf).metadata())

  console.log(`After trim: ${trimmedMeta.width}x${trimmedMeta.height}`)

  const trimmedBuffer = await trimmed.toBuffer()

  // Make it square with padding
  const maxDim = Math.max(trimmedMeta.width, trimmedMeta.height)
  const padding = Math.round(maxDim * 0.15) // 15% padding around the icon
  const finalSize = maxDim + padding * 2

  const squareBuffer = await sharp(trimmedBuffer)
    .resize(maxDim, maxDim, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .toBuffer()

  // Generate 512x512
  await sharp(squareBuffer)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(join(publicDir, 'icon-512.png'))
  console.log('Created icon-512.png')

  // Generate 192x192
  await sharp(squareBuffer)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(join(publicDir, 'icon-192.png'))
  console.log('Created icon-192.png')

  // Generate favicon (32x32)
  await sharp(squareBuffer)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toFile(join(publicDir, 'favicon.png'))
  console.log('Created favicon.png')

  console.log('\nDone! Icons generated in public/')
}

generateIcons().catch(console.error)
