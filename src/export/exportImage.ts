import { LunchedPuppeteer } from "../lunchPuppeteer"

export type PuppeteerImageOutputType = "png" | "jpeg"

export type ImageOption = {
  /** 画像の品質 */
  quality: number | undefined

  /** クリップ */
  clip: {
    /** x座標 */
    x: number | null

    /** y座標 */
    y: number | null

    /** 幅 */
    width: number | null

    /** 高さ */
    height: number | null
  }
  /** フルページ */
  fullPage: boolean

  /** 背景の省略 */
  omitBackground: boolean
}

export type ExportImageProps = {
  /** 画像の出力形式 */
  outputType: PuppeteerImageOutputType,

  /** ランチ済のPuppeteerのページ */
  lunchedPuppeteerPage: LunchedPuppeteer['page']

  /** エクスポートパスファイル */
  exportPathName: string

  /** 画像のオプション */
  imageOption: ImageOption
}

/**
 * ランチ済のPuppeteerのページを指定して、画像をエクスポートする
 */
export const exportImage = ({
  outputType,
  lunchedPuppeteerPage,
  exportPathName,
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
          path: exportPathName,
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
          path: exportPathName,
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