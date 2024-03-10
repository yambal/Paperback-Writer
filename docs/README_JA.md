# Paperback Writer

この拡張機能は、MarkdownファイルをPDF、HTML、PNG、JPEGファイルに変換します。

[English](https://yambal.github.io/Paperback-Writer)

## 機能

以下の機能をサポートします
* シンタックスハイライト

## 使い方

### コマンドパレット

1. Markdownファイルを開く
1. `F1`または`Ctrl+Shift+P`を押す
1. `export`と入力し、以下から選択
   * `Markdownを他の形式にOutput (settings.json) `
   * `MarkdownをPDFにOutput`
   * `MarkdownをPNGにOutput`
   * `MarkdownをJPEGにOutput`
   * `MarkdownをHTMLにOutput`
   * `MarkdownをHTML,PDF,PNG,JPEGにOutput`


### メニュー

1. Markdownファイルを開く
1. 右クリックして以下を選択
   * `Markdownを他の形式にOutput (settings.json) `
   * `MarkdownをPDFにOutput`
   * `MarkdownをPNGにOutput`
   * `MarkdownをJPEGにOutput`
   * `MarkdownをHTMLにOutput`
   * `MarkdownをHTML,PDF,PNG,JPEGにOutput`

### 自動Output

1. **settings.json**に`"paperback-writer.autoOutput": true`オプションを追加
   * あるいは「拡張機能の設定」で`autoOutput`にチェックを入れる
1. Visual Studio Codeを再起動
1. Markdownファイルを開く
1. 保存時に自動変換

## 拡張機能の設定

[Visual Studio Code User and Workspace Settings](https://code.visualstudio.com/docs/customization/userandworkspace)

1. 設定を開く
   * `Command＋,` もしくは `Ctrl+,`
1. `Paperback Writer`の設定を探す

## オプション

| カテゴリ | オプション名 | 説明 |
| --- | --- | --- |
| 保存オプション | paperback-writer.`outputTypes` | 出力形式 : pdf、html、png、jpeg 複数の出力形式をサポート |
|  | paperback-writer.`autoOutput` | 保存時に自動書き出しを有効にします。設定を適用するには、Visual Studio Codeを再起動する必要があります |
|  | paperback-writer.`listOfFileNamesExcludedFromAutoOutput` | 自動書き出しの対象外ファイル名 |
|  | paperback-writer.`outputDirector` | 書き出し先のディレクトリを指定します。空の場合、変換元ファイルと同じ場所に書き出しされます |
|  | paperback-writer.`outputDirectoryRelativePathFile` | 設定されている場合、書き出しディレクトリで設定された相対パスは、そのファイルからの相対パスとして解釈されます |
| スタイルオプション | paperback-writer.`customCSS` | 使用するカスタムスタイルシート（CSS）のパスリスト |
|  | paperback-writer.`customCSSRelativePathFile` | 設定されている場合、カスタムスタイルで設定されたCSSファイルへのパスを（相対パスに変換せずに）そのまま組み込みます |
|  | paperback-writer.`includeDefaultStyles` | デフォルトのスタイルを組み込む |
|  | paperback-writer.`baseFont` | 基本となるフォント |
|  | paperback-writer.`codeFont` | コードに使用するフォント |
|  | paperback-writer.`baseFontSize` | ベースとなるフォントサイズ（px） |
| Markdownオプション | paperback-writer.`addBrOnSingleLineBreaksInMarkdown` | 一行改行時に<br>を追加します |
| 共通 | paperback-writer.`renderScale` | ページレンダリングのスケール |
| PDFオプション | paperback-writer.`displayHeaderFooter` | ページヘッダーとフッターを表示 |
|| paperback-writer.`headerHtmlElementTemplate` | 印刷ヘッダー用HTMLテンプレート|
|| paperback-writer.`footerTemplate.dsc` | 印刷フッター用HTMLテンプレート|
|| paperback-writer.`printBackground` | 背景グラフィックを印刷する|
|| paperback-writer.`orientation` | 用紙の向き|
|| paperback-writer.`pageRange` | ページ範囲(pdfのみ), 例 '1-5, 8, 11-13|
|| paperback-writer.`format` | 用紙サイズ(pdfのみ), 用紙幅や高さを設定すると無効になります。|
|| paperback-writer.`width` | 用紙幅(pdfのみ), mm, cm, in, pxの単位が利用できます. 設定した場合「用紙サイズ」は無効になります。|
|| paperback-writer.`height` | 用紙高さ(pdfのみ), mm, cm, in, pxの単位が利用できます. 設定した場合「用紙サイズ」は無効になります。 |
|| paperback-writer.margin.`top` | ページ設定 : 上余白。単位 mm、cm、in、px |
|| paperback-writer.margin.`bottom` | ページ設定 : 下余白。単位 mm、cm、in、px |
|| paperback-writer.margin.`right` | ページ設定 : 右余白。単位 mm、cm、in、px |
|| paperback-writer.margin.`left` | ページ設定 : 左余白。単位 mm、cm、in、px |
|PNG/JPEGオプション | paperback-writer.quality | 画像品質(jpegのみ)、0-100 |
|| paperback-writer.clip.x | クリップ領域の左上隅の x座標 |
|| paperback-writer.clip.y | クリップ領域の左上隅の y座標 |
|| paperback-writer.clip.width | クリップ領域の幅 |
|| paperback-writer.clip.height | クリップ領域の高さ |
|| paperback-writer.omitBackground | 背景画像を省略する。 |
| Chromium | paperback-writer.`pathToAnExternalChromium` | バンドルされたChromiumの代わりに実行するChromiumまたはChromeの実行ファイルへのパス |

## リリースノート


## ライセンス

MIT
