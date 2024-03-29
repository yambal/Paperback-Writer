# Paperback Writer

この拡張機能は、MarkdownファイルをPDF、HTML、PNG、JPEGファイルに変換します。

- [English (GitHub Pages)](https://yambal.github.io/Paperback-Writer/)
- [PaperBack Writer (Visual Studio Code)](https://marketplace.visualstudio.com/items?itemName=JuneYAMAMOTO.paperback-writer)

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

1. **settings.json**に`"paperback-writer.output.auto": true`オプションを追加
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
| 保存オプション | paperback-writer.`output.types` | 出力形式 : pdf、html、png、jpeg 複数の出力形式をサポート |
|  | paperback-writer.`output.auto` | 保存時に自動書き出しを有効にします。設定を適用するには、Visual Studio Codeを再起動する必要があります |
|  | paperback-writer.`output.listOfFileNamesExcludedFromAuto` | 自動書き出しの対象外ファイル名 |
|  | paperback-writer.`output.directory` | 書き出し先のディレクトリを指定します。空の場合、変換元ファイルと同じ場所に書き出しされます |
|  | paperback-writer.`output.directoryRelativePathFile` | 設定されている場合、書き出しディレクトリで設定された相対パスは、そのファイルからの相対パスとして解釈されます |
| スタイルオプション | paperback-writer.`style.customCSS` | 使用するカスタムスタイルシート（CSS）のパスリスト |
|  | paperback-writer.`style.customCSSRelativePathFile` | 設定されている場合、カスタムスタイルで設定されたCSSファイルへのパスを（相対パスに変換せずに）そのまま組み込みます |
|  | paperback-writer.`style.includeDefaultStyle` | デフォルトのスタイルを組み込む |
|  | paperback-writer.`style.typography.lineHeight` | 行送り (line height) |
|  | paperback-writer.`style.typography.h1HeaderScale` | 設定したジャンプ率に基づき、H1タグと本文のサイズ比を元に、H6からH1までの見出しタグのフォントサイズを自動的に調整します。 |
|  | paperback-writer.`style.font.baseSize` | ベースとなるフォントサイズ（px） |
|  | paperback-writer.`style.font.baseFont` | 基本となるフォント |
|  | paperback-writer.`style.syntaxHighlighting.font` | コードハイライトに使用するフォント |
|  | paperback-writer.`style.syntaxHighlighting.showLineNumbers` | コードハイライトに行番号を表示する |
|  | paperback-writer.`style.syntaxHighlighting.theme` | コードハイライトのテーマ |
| Markdownオプション | paperback-writer.`markdown.addBrOnSingleLineBreaks` | 一行改行時に<br>を追加します |
| 共通 | paperback-writer.`renderScale` | ページレンダリングのスケール |
| PDFオプション | paperback-writer.`PDF.displayHeaderFooter` | ページヘッダーとフッターを表示 |  
|| paperback-writer.`PDF.header.items` | ヘッダーに表示するアイテム。`title`, `pageNumber`, `date`, `url` を組み合わせる事ができます (pdf only) |
|| paperback-writer.`PDF.header.fontSize` | ヘッダーのフォントサイズ(本文のベースサイズとの比較)(pdf only) |
|| paperback-writer.`PDF.header.margin` | ヘッダーと本文の間のマージン(pdfのみ) |
|| paperback-writer.`PDF.footer.items` | フッターに表示するアイテム。`title`, `pageNumber`, `date`, `url` を組み合わせる事ができます (pdf only) |
|| paperback-writer.`PDF.footer.fontSize` | フッターのフォントサイズ(本文のベースサイズとの比較)(pdf only) |
|| paperback-writer.`PDF.footer.margin` | フッターと本文の間のマージン(pdfのみ) |
|| paperback-writer.`PDF.printBackground` | 背景グラフィックを印刷する|
|| paperback-writer.`PDF.paperOrientation` | 用紙の向き|
|| paperback-writer.`PDF.pageRanges` | ページ範囲(pdfのみ), 例 '1-5, 8, 11-13|
|| paperback-writer.`PDF.paperSizeFormat` | 用紙サイズ(pdfのみ)、指定した場合、用紙幅/用紙幅は無視されます |
|| paperback-writer.`PDF.paperWidth` | 用紙幅(pdfのみ), 用紙サイズが指定されているときは無視されます。mm, cm, in, pxの単位が利用できます |
|| paperback-writer.`PDF.paperHeight` | 用紙高さ(pdfのみ), 用紙サイズが指定されているときは無視されます。mm, cm, in, pxの単位が利用できます |
|| paperback-writer.`PDF.margin.top` | ページ設定 : 上余白。単位 mm、cm、in、px |
|| paperback-writer.`PDF.margin.bottom` | ページ設定 : 下余白。単位 mm、cm、in、px |
|| paperback-writer.`PDF.margin.right` | ページ設定 : 右余白。単位 mm、cm、in、px |
|| paperback-writer.`PDF.margin.left` | ページ設定 : 左余白。単位 mm、cm、in、px |
|PNG/JPEGオプション | paperback-writer.`image.jpeg.quality` | 画像品質(jpegのみ)、0-100 |
|| paperback-writer.`image.clip.x` | クリップ領域の左上隅の x座標 |
|| paperback-writer.`image.clip.y` | クリップ領域の左上隅の y座標 |
|| paperback-writer.`image.clip.width` | クリップ領域の幅 |
|| paperback-writer.`image.clip.height` | クリップ領域の高さ |
|| paperback-writer.`image.omitBackground` | 背景画像を省略する。 |
| Chromium | paperback-writer.`pathToAnExternalChromium` | バンドルされたChromiumの代わりに実行するChromiumまたはChromeの実行ファイルへのパス |

### ``PDF.paperSizeFormat``について
用紙サイズの指定である``PDF.paperSizeFormat``について説明します

``PDF.paperSizeFormat``は、PDF文書の用紙サイズを指定するために使用されます。この設定では、標準の用紙サイズ（例えばLetter、A4など）を指定できるほか、特定の用紙幅（``PDF.paperWidth``）と用紙高さ（``PDF.paperHeight``）を指定してカスタムサイズの用紙を定義することも可能です。ただし、標準の用紙サイズが指定された場合、``PDF.paperWidth``と``PDF.paperHeight``で指定されたカスタムサイズは無視されます。そのため、カスタムサイズを使用したい場合は、``PDF.paperSizeFormat``で空白を選択してから、``PDF.paperWidth``と``PDF.paperHeight``に具体的な寸法を入力する必要があります。


``Japanese Postcard 100x148``という選択肢もあります。これは、日本の標準的な郵便ハガキサイズに対応しています。

特殊な用紙サイズに Kindle direct publishing 向けの設定が（いくつか）用意されています
| 選択肢 | 解説 | 備考 |  |
| --- | --- | --- | --- |
| KDP-PB 139.7x215.9 no bleed | kindle direct publishing の ペーパーバック：139.7x215.9mm 裁ち落としなし | 最低マージン：上下6.4mm、左右9.6mm | kdp.amazon.com |
| ADP-PB (JP) 148x210 no bleed | kindle direct publishing の ペーパーバック：148x210mm 裁ち落としなし| 最低マージン：上下6.4mm、左右9.6mm | kdp.amazon.co.jp |

詳しくは[KDP : 判型、裁ち落とし、マージンの設定](https://kdp.amazon.co.jp/ja_JP/help/topic/GVBQ3CMEQW3W2VL6#margins)をご参照ください


## リリースノート


## ライセンス

MIT
