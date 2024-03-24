import { TokenizerAndRendererExtension, Token } from "marked"

export const IMAGE_EXTENTION_CLASS_PREFIX = "img-ex"
export const IMAGE_EXTENTION_CLASS_SIZE_SMALL = `${IMAGE_EXTENTION_CLASS_PREFIX}-small`
export const IMAGE_EXTENTION_CLASS_SIZE_MEDIUM = `${IMAGE_EXTENTION_CLASS_PREFIX}-medium`
export const IMAGE_EXTENTION_CLASS_SIZE_LARGE = `${IMAGE_EXTENTION_CLASS_PREFIX}-large`
export const IMAGE_EXTENTION_CLASS_SIZE_FULL = `${IMAGE_EXTENTION_CLASS_PREFIX}-full`
export const IMAGE_EXTENTION_CLASS_ALIGN_RIGHT = `${IMAGE_EXTENTION_CLASS_PREFIX}-right`
export const IMAGE_EXTENTION_CLASS_ALIGN_LEFT = `${IMAGE_EXTENTION_CLASS_PREFIX}-left`
export const IMAGE_EXTENTION_CLASS_ALIGN_CENTER = `${IMAGE_EXTENTION_CLASS_PREFIX}-center`
export const IMAGE_EXTENTION_CLASS_FLOAT_FLOAT = `${IMAGE_EXTENTION_CLASS_PREFIX}-float`
export const IMAGE_EXTENTION_CLASS_FLOAT_BLOCK = `${IMAGE_EXTENTION_CLASS_PREFIX}-block`

/**
 * figure 拡張付きの画像
 */
export const image: TokenizerAndRendererExtension = {
  name: 'image',
  level: 'inline',
  start(src: string) {
    return src.match(/!\[([^\]]*)\]\(([^\)]+)\)(?:\{([^\}]+)\})?([<>smlfb]{1,4})?/)?.index
  },
  tokenizer(src: string, tokens: any[]) {
    const rule = /!\[([^\]]*)\]\(([^\)]+)\)(?:\{([^\}]+)\})?([<>smlfb]{1,4})?/
    const match = rule.exec(src)

    if (match) {  
      const classValue: string[] = []

      if (match[4]?.trim().length >= 0) {
        const exeString = match[4]?.trim()

        const sizeRule = /[sml]|<>/
        const size = sizeRule.exec(exeString)?.[0]

        switch(size){
          case 's':
            // サイズ小
            classValue.push(IMAGE_EXTENTION_CLASS_SIZE_SMALL)
            break

          case 'm':
            // サイズ中
            classValue.push(IMAGE_EXTENTION_CLASS_SIZE_MEDIUM)
            break

          case 'l':
            // サイズ大
            classValue.push(IMAGE_EXTENTION_CLASS_SIZE_LARGE)
            break

          case '<>':
            // 最大幅
            classValue.push(IMAGE_EXTENTION_CLASS_SIZE_FULL)
            break

          default:
        }

        const alignRule = /([<>]{1,2})/
        const align = alignRule.exec(exeString)?.[0]
        
        switch(align){
          case '>':
            // 右寄せ
            classValue.push(IMAGE_EXTENTION_CLASS_ALIGN_RIGHT)
            break

          case '<':
            // 左寄せ
            classValue.push(IMAGE_EXTENTION_CLASS_ALIGN_LEFT)
            break

          case '><':
            // 中央寄せ
            classValue.push(IMAGE_EXTENTION_CLASS_ALIGN_CENTER)
            break

          default:
        }

        const floatRule = /[fb]/
        const float = floatRule.exec(exeString)?.[0]
        switch(float){
          case 'f':
            // float
            classValue.push(IMAGE_EXTENTION_CLASS_FLOAT_FLOAT)
            break

          case 'b':
            // block
            classValue.push(IMAGE_EXTENTION_CLASS_FLOAT_BLOCK)
            break

          default:
        }
      }

      const token: Token = {
        type: 'image',
        raw: match[0],
        title: match[1].trim(),
        href: match[2].trim().replace("\\", '/'),
        figure: match[3]?.trim(),
        classValue,
        tokens
      }
      return token
    }
  },
  renderer(this, token): string {
    let classString = ""
    if (token.classValue?.length > 0) {
      classString = ` class="${IMAGE_EXTENTION_CLASS_PREFIX} ${token.classValue.join(" ")}"`
    }
    if (token.figure) {
      return `<figure${classString}><img src="${token.href}" alt="${token.title}" /><figcaption>${token.figure}</figcaption></figure>`
    }
    return `<img src="${token.href}" alt="${token.title}"${classString} />`
  }
}