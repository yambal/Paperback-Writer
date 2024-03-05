import { TokenizerAndRendererExtension, Token } from "marked"

/**
 * RUBY拡張
 * {傀儡|かいらい} = <ruby>傀儡<rp>(</rp><rt>かいらい</rt><rp>)</rp></ruby>
 */
export const ruby: TokenizerAndRendererExtension = {
  name: 'ruby',
  level: 'inline',                                                 // Is this a block-level or inline-level tokenizer?
  start(src: string) {
    return src.match(/\{[^|]*\|[^}]*}/)?.index
  },
  tokenizer(src: string, tokens: any[]) {
    console.log('src', src)
    const rule = /\{([^|]*)\|([^}]*)}/                            // {傀儡|かいらい}
    const match = rule.exec(src)
    if (match) {  
      const token: Token = {                                      // トークンを生成
        type: 'ruby',                                             // "name" と一致させる
        raw: match[0],                                            // Text to consume from the source
        text: this.lexer.inlineTokens(match[1].trim()),           // マッチしたものを、さらにInlineレベルのパーサーにかける
        ruby: match[2].trim(),                                    // ルビの文字列(パーサーにかけない場合)
        tokens: []
      }
      return token
    }
  },
  renderer(this, token): string {
    return `<ruby>${this.parser.parseInline(token.text)}<rp>(</rp><rt>${token.ruby}</rt><rp>)</rp></ruby>`
  }
}