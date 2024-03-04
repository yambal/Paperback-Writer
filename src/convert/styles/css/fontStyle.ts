
export type FontSets = "system" | "notoSan" | "notoSerif" | "Train+One" | "Dela+Gothic+One"

export type GetFontFamilyProps = {
  fontSet: FontSets
  language?: "ja"
}

export type MlFontFamily = {
  default: FontFamily
  ja: FontFamily
}

export type FontFamily = {
  fontFamily: string
  googleFontName?: string
}


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

  if (language) {
    return set[language]
  }
  return set["default"]
}

/**
 * 
 */
export type FontQuery = {
  language?: "ja"
  target: string
  fontSet: FontSets
}

export type GetFontStyleTagsProps = {
  fontQuerys: FontQuery[]
}

export const getFontStyleTags = ({
  fontQuerys
}: GetFontStyleTagsProps) => {
  

  const fontCsss: string[] = []
  const googleFontNames: string[] = []
  fontQuerys.forEach((fontQuery) => {
    const { language, target, fontSet } = fontQuery
    const { fontFamily, googleFontName } = getFontFamily({ fontSet, language })
    fontCsss.push(`${target} { font-family: ${fontFamily}}`)
    googleFontName && googleFontNames.push(googleFontName)
  })

  const uniqGoogleFontNames = Array.from(new Set(googleFontNames))
  let googleFontFamilyLink = ""
  if (googleFontNames.length > 0) {
    const preconnectLink = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
    const familyPrams = uniqGoogleFontNames.map((googleFontName, index) => {return `family=${googleFontName}`}).join("&")
    googleFontFamilyLink = `${preconnectLink}<link href="https://fonts.googleapis.com/css2?${familyPrams}&display=swap" rel="stylesheet">`
  }

  return googleFontFamilyLink + "\n<style>" + fontCsss.join("\n") + "</style>"
}