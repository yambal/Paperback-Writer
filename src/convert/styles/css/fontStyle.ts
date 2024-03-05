import { VscodeEnvLanguage, getEnvLanguage, getPaperbackWriterConfiguration } from "../../../vscode-util"
import { FontQuery } from "../styleTagBuilder"

/**
 * フォントに関する定義
 */
export type FontFamily = {
  /** CSS の font-family: に記載するフォントのセット */
  fontFamily: string

  /** Google Font の family= 読込みに使う */
  googleFontName?: string
}

type MlFontFamily = {
  "default": FontFamily
  "ja": FontFamily
  "en"?: FontFamily
  "zh-cn"?: FontFamily
  "zh-tw"?: FontFamily
  "fr"?: FontFamily
  "de"?: FontFamily
  "it"?: FontFamily
  "es"?: FontFamily
  "ko"?: FontFamily
  "ru"?: FontFamily
  "pt-br"?: FontFamily
  "tr"?: FontFamily
  "pl"?: FontFamily
  "cs"?: FontFamily
  "hu"?: FontFamily
}

export type FontSetId = "system" | "notoSan" | "notoSerif" | "UDPGothic" | "Train+One" | "Dela+Gothic+One"

export type GetFontFamilyProps = {
  /** 登録済みのフォントID */
  fontSet: FontSetId

  /** 言語 */
  language?: VscodeEnvLanguage
}

/**
 * フォントセットと言語からフォントファミリーを取得する
 */
export const getFontFamily = ({
  fontSet,
  language
}: GetFontFamilyProps): FontFamily => {
  let set: MlFontFamily | undefined = undefined

  switch (fontSet) {
    case "notoSan":
      set = {
        default: {
          fontFamily: `"Noto Sans", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Noto+Sans:ital,wght@0,100..900;1,100..900"
        },
        ja: {
          fontFamily: `"Noto Sans JP", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Noto+Sans+JP:wght@100..900"
        }
      }
      break
    
    case "notoSerif":
      set = {
        default: {
          fontFamily: `"Noto Serif", serif`,
          googleFontName: "Noto+Serif:ital,wght@0,100..900;1,100..900"
        },
        ja: {
          fontFamily: `"Noto Serif JP", serif`,
          googleFontName: "Noto+Serif+JP"
        }
      }
      break

    case "UDPGothic":
      set = {
        default: {
          fontFamily: `"BIZ UDPGothic", sans-serif`,
          googleFontName: "BIZ+UDPGothic"
        },
        ja: {
          fontFamily: `"BIZ UDPGothic", sans-serif`,
          googleFontName: "BIZ+UDPGothic"
        }
      }
      break 

    case "Dela+Gothic+One":
      set = {
        default: {
          fontFamily: `"Dela Gothic One", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Dela+Gothic+One"
        },
        ja: {
          fontFamily: `"Dela Gothic One", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Dela+Gothic+One"
        }
      }
      break

    case "Train+One":
      set = {
        default: {
          fontFamily: `"Train One", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Train+One"
        },
        ja: {
          fontFamily: `"Train One", sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: "Train+One"
        }
      }
      break

    case "system":

    default:
      set = {
        default: {
          fontFamily: `sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: undefined
        },
        ja: {
          fontFamily: `sans-serif, system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", Meiryo, sans-serif`,
          googleFontName: undefined
        }
      }
  }

  return language && set[language] || set["default"]
}

/**
 * 設定からFontQueryを生成する
 **/
export const buildFontQuerys = ():FontQuery[] => {
  const pwConf = getPaperbackWriterConfiguration()

  const fontQuerys: FontQuery[] = []

  const language = getEnvLanguage()

  // 1. ベースフォント
  switch (pwConf.baseFont) {
    case 'Noto Sans':
      fontQuerys.push({target: 'body', fontSet: 'notoSan', language})
      break

    case 'Noto Serif':
      fontQuerys.push({target: 'body', fontSet: 'notoSerif', language})
      break

    case 'BIZ UDPGothic':
      fontQuerys.push({target: 'body', fontSet: 'UDPGothic', language})
      break

    default:
      fontQuerys.push({target: 'body', fontSet: 'system', language})
      break
  }

  return fontQuerys
}