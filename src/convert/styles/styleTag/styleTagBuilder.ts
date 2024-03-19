import {
  buildInStyleTagBuilder,
  userStyleTagsBuilder,
  fontStyleTagsBuilder,
  UserStyleTagsBuilderProps,
  FontStyleTagsBuilderProps,
  BuildInStyleTagBuilderProps
} from "./builder"


export type StyleTagBuilderProps = {
  buildInStyleTagBuilderProps: BuildInStyleTagBuilderProps
  fontStyleTagsBuilderProps: FontStyleTagsBuilderProps
  userStyleTagsBuilderProps: UserStyleTagsBuilderProps
} & {
  includeDefaultStyles: boolean
}

export const styleTagBuilder = ({
  buildInStyleTagBuilderProps,
  fontStyleTagsBuilderProps,
  userStyleTagsBuilderProps,
  includeDefaultStyles,
}:StyleTagBuilderProps) => {
  const styleTags: string[] = []

  const {baseFont, syntaxHighlightingFont} = fontStyleTagsBuilderProps
  const fontStyleTags = fontStyleTagsBuilder({
    baseFont,
    syntaxHighlightingFont
  })
  styleTags.push(fontStyleTags)

  if (includeDefaultStyles) {
    const { lineHeight = 1.5, codeTheme, baseFontSize, h1HeaderScale } = buildInStyleTagBuilderProps
    const buildInStyleTag = buildInStyleTagBuilder({
      lineHeight,
      codeTheme,
      baseFontSize,
      h1HeaderScale
    })
    styleTags.push(buildInStyleTag)
  }

  const {editorDocVsUrl, userCustomCss} = userStyleTagsBuilderProps
  const userStyleTags = userStyleTagsBuilder({
    editorDocVsUrl,
    userCustomCss
  })
  styleTags.push(userStyleTags)

  return styleTags.join('\n')
}


