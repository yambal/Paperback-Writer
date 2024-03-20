import { TokenizerAndRendererExtension, Token } from "marked"

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
            classValue.push('size-small')
            break

          case 'm':
            // サイズ中
            classValue.push('size-medium')
            break

          case 'l':
            // サイズ大
            classValue.push('size-large')
            break

          case '<>':
            // 最大幅
            classValue.push('size-full')
            break

          default:
        }

        const alignRule = /([<>]{1,2})/
        const align = alignRule.exec(exeString)?.[0]
        
        switch(align){
          case '>':
            // 右寄せ
            classValue.push('align-right')
            break

          case '<':
            // 左寄せ
            classValue.push('align-left')
            break

          case '><':
            // 中央寄せ
            classValue.push('align-center')
            break

          default:
        }

        const floatRule = /[fb]/
        const float = floatRule.exec(exeString)?.[0]
        switch(float){
          case 'f':
            // float
            classValue.push('float')
            break

          case 'b':
            // block
            classValue.push('block')
            break

          default:
        }
      }

      const token: Token = {
        type: 'image',
        raw: match[0],
        title: match[1].trim(),
        href: match[2].trim(),
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
      classString = ` class="${token.classValue.join(" ")}"`
    }
    if (token.figure) {
      return `<figure${classString}><img src="${token.href}" alt="${token.title}" /><figcaption>${token.figure}</figcaption></figure>`
    }
    return `<img src="${token.href}" alt="${token.title}"${classString} />`
  }
}