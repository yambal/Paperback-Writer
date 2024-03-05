import { TokenizerAndRendererExtension, Token } from "marked"

/**
 * RUBY拡張
 * {傀儡|かいらい} = <ruby>傀儡<rp>(</rp><rt>かいらい</rt><rp>)</rp></ruby>
 */
export const plantuml: TokenizerAndRendererExtension = {
  name: 'plantuml',
  level: 'block',                                                // Is this a block-level or inline-level tokenizer?
  start(src) { return src.match(/(<uml>)(.*?)(<\/uml>)/s)?.index },
  tokenizer(src: string, tokens: any[]) {
    const rule = /(<uml>)(.*?)(<\/uml>)/s
    const match = rule.exec(src)
    if (match) {
      console.log('plantuml match', match)
      const token: Token = {
        type: 'plantuml',
        raw: match[0],
        content: match[2],
        html: '',
        tokens: []
      }
      return token
    }
  },
  renderer(this, token): string {
    console.log('plantuml renderer', `[${token.html}]`)
    return token.html
  },
}

export const plantumlFetcher = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('fetching plantuml start')
    setTimeout(() => {
      console.log('fetched')
      resolve('hello')
    }, 1000)
  })
}