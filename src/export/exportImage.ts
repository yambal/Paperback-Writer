import { LunchedPuppeteer } from "../lunchPuppeteer"

export type PuppeteerOutputType = "png" | "jpeg"

export type ImageOption = {
  quality: number | undefined
  clip: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
  }
  fullPage: boolean
  omitBackground: boolean
}

export type ExportImageProps = {
  outputType: PuppeteerOutputType,
  lunchedPuppeteerPage: LunchedPuppeteer['page']
  exportFilename: string
  imageOption: ImageOption
}

export const exportImage = ({
  outputType,
  lunchedPuppeteerPage,
  exportFilename,
  imageOption
}: ExportImageProps): Promise<void> => {

  return new Promise((resolve, reject) => {
    if (outputType === 'png' || outputType === 'jpeg') {
      const quality_option = outputType === 'png' ? undefined : imageOption.quality || 100

      // screenshot size
      const clip_x_option = imageOption.clip.x || null
      const clip_y_option = imageOption.clip.y || null
      const clip_width_option = imageOption.clip.width || null
      const clip_height_option = imageOption.clip.height || null
      let options
      if (clip_x_option !== null && clip_y_option !== null && clip_width_option !== null && clip_height_option !== null) {
        options = {
          path: exportFilename,
          quality: quality_option,
          fullPage: imageOption.fullPage,
          clip: {
            x: clip_x_option,
            y: clip_y_option,
            width: clip_width_option,
            height: clip_height_option,
          },
          omitBackground: imageOption.omitBackground,
        }
      } else {
        options = {
          path: exportFilename,
          quality: quality_option,
          fullPage: true,
          omitBackground: imageOption.omitBackground,
        }
      }
      return lunchedPuppeteerPage.screenshot(options)
      .then(() => {
        resolve()
      })
      .catch((error: any) => {
        reject(error)
      })
    }
  })
}