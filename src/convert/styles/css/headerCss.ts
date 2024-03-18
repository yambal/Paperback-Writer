export type HeaderCssProps = {
  h1Scale: number
}

/**
 * ヘッダータグのスタイルを生成する
 * @param param0 
 * @returns 
 */
export const headerCss = ({
  h1Scale = 2
}: HeaderCssProps) => {
  const h6Scale = 0.67
  const jump = (h1Scale - h6Scale) / 5  // h1Scale:2 = 0.266

  const h5Scale = parseFloat((1).toFixed(2))                     // h1Scale:2 = 0.936
  const h4Scale = parseFloat((1 + jump).toFixed(2))              // h1Scale:2 = 1.202
  const h3Scale = parseFloat((1 + jump * 2).toFixed(2))          // h1Scale:2 = 1.468
  const h2Scale = parseFloat((1 + jump * 3).toFixed(2))           // h1Scale:2 = 1.734

  return `
    h1 { font-size: ${h1Scale}rem; }
    h2 { font-size: ${h2Scale}rem; }
    h3 { font-size: ${h3Scale}rem; }
    h4 { font-size: ${h4Scale}rem; }
    h5 { font-size: ${h5Scale}rem; }
    h6 { font-size: ${h6Scale}rem; }

    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
    }
  `

}