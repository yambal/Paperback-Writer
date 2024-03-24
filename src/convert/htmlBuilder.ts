import { MarkdownToHtmlProps, markdownToHtmlBody } from "./markdown/markdownToHtmlBody"
import ejs from 'ejs'
import { defautTemplate } from "./templates/defaultTemplate"
import { StyleTagBuilderProps, styleTagBuilder } from "./styles/styleTag/styleTagBuilder"

type HtmlBuilderProps = {
  markdownProps: MarkdownToHtmlProps
} & StyleTagBuilderProps &
{
  title: string
}

export const htmlBuilder = ({
  title,
  markdownProps,
  buildInStyleTagBuilderProps,
  fontStyleTagsBuilderProps,
  userStyleTagsBuilderProps,
  includeDefaultStyles,
}: HtmlBuilderProps):Promise<{html: string, bodyHtml: string, markdownString: string}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { markdownString, isAddBrOnSingleNewLine } = markdownProps
      markdownToHtmlBody({
        markdownString,
        isAddBrOnSingleNewLine
      })
      .then(htmlBodyString => {

        const styleTags = styleTagBuilder({
          buildInStyleTagBuilderProps,
          fontStyleTagsBuilderProps,
          userStyleTagsBuilderProps,
          includeDefaultStyles
        })

        let html = ejs.render(defautTemplate, {
          title,
          body: htmlBodyString,
          style: styleTags
        })

        resolve({
          html,
          bodyHtml: htmlBodyString,
          markdownString: markdownString
        })

      })
    } catch (error) {
      reject(error)
    }
  })
}


