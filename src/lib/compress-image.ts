export async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width)
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(file); return }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })
          resolve(compressedFile)
        },
        'image/jpeg',
        quality
      )
    }
    img.onerror = () => reject(new Error('Impossible de lire l\'image'))
    img.src = URL.createObjectURL(file)
  })
}
