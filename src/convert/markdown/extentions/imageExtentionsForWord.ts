import { TokenizerAndRendererExtension, Token } from "marked"

/**
 * figure 拡張付きの画像
 */
export const imageForWord: TokenizerAndRendererExtension = {
  name: 'image',
  level: 'inline',
  start(src: string) {
    return src.match(/!\[([^\]]*)\]\(([^\)]+)\)(?:\{([^\}]+)\})?([<>smlfb]{1,4})?/)?.index
  },
  tokenizer(src: string, tokens: any[]) {
    const rule = /!\[([^\]]*)\]\(([^\)]+)\)(?:\{([^\}]+)\})?([<>smlfb]{1,4})?/
    const match = rule.exec(src)

    if (match) {  
      const token: Token = {
        type: 'image',
        raw: match[0],
        title: match[1].trim(),
        href: match[2].trim().replace("\\", '/'),
        tokens
      }
      return token
    }
  },
  renderer(this, token): string {
    return `<span>[Image : ${token.title} ( ${token.href} )]</span>`
  }
}