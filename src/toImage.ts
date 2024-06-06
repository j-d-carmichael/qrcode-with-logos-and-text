import { BaseOptions, Logo } from './model'
import { toCanvas } from './toCanvas'
import { isFunction, isString } from './utils'
import QrCodeWithLogoText from './QrCodeWithLogoText';

export const toImage = async function (options: BaseOptions, instance: QrCodeWithLogoText) {
  const { canvas } = options
  if (options.logo) {
    if (isString(options.logo)) {
      options.logo = { src: options.logo } as Logo
    }
    ;(options.logo as Logo).crossOrigin = 'Anonymous'
  }

  if (!instance.ifCanvasDrawn) await toCanvas(options)

  const { image, downloadName = 'qr-code' } = options
  let { download } = options

  if (canvas!.toDataURL()) {
    image!.src = canvas!.toDataURL()
  } else {
    throw new Error('Can not get the canvas DataURL')
  }

  instance.ifImageCreated = true

  if (download !== true && !isFunction(download)) {
    return
  }

  download = download === true ? (start: Function): Promise<void> => start() : download

  const startDownload = () => {
    return saveImage(image!, downloadName)
  }

  if (download) {
    return download(startDownload)
  }

  return Promise.resolve()
}

export const saveImage = (
  image: HTMLImageElement,
  name: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const dataURL = image.src
      const link = document.createElement('a')
      link.download = name
      link.href = dataURL
      link.dispatchEvent(new MouseEvent('click'))
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}
