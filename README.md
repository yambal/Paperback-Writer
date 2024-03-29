# Paperback Writer

This extension converts Markdown files into PDF, HTML, PNG, and JPEG files.

- [日本語:Japanese (GitHub Pages)](https://yambal.github.io/Paperback-Writer/README_JA.html)
- [PaperBack Writer (Visual Studio Code)](https://marketplace.visualstudio.com/items?itemName=JuneYAMAMOTO.paperback-writer)

## Features
The following features are supported:

- Syntax highlighting

## Usage
### Command Palette
1. Open a Markdown file
1. Press F1 or Ctrl+Shift+P
1. Type export and select from the following:
    - Export Markdown to another format (settings.json)
    - Export Markdown to PDF
    - Export Markdown to PNG
    - Export Markdown to JPEG
    - Export Markdown to HTML
    - Export Markdown to HTML, PDF, PNG, JPEG

### Menu
1. Open a Markdown file
1. Right-click and select from the following:
    - Export Markdown to another format (settings.json)
    - Export Markdown to PDF
    - Export Markdown to PNG
    - Export Markdown to JPEG
    - Export Markdown to HTML
    - Export Markdown to HTML, PDF, PNG, JPEG

### Automatic Export
1. Add the option "paperback-writer.output.auto": true to settings.json
    - Or check isConvertOnSave in the Extensions settings
1. Restart Visual Studio Code
1. Open a Markdown file
1. Automatically convert upon saving

## Extension Settings
Visual Studio Code User and Workspace Settings

1. Open settings
1. Command＋, or Ctrl+,
1. Search for Paperback Writer settings

## Oprions

| Category | Option Name | Description |
| --- | --- | --- |
| Save Options | paperback-writer.`output.types` | Output formats: pdf, html, png, jpeg. Supports multiple output formats |
|  | paperback-writer.`output.auto` | Enables automatic export upon saving. You need to restart Visual Studio Code to apply the settings |
|  | paperback-writer.`output.listOfFileNamesExcludedFromAuto` | Filenames excluded from automatic export |
|  | paperback-writer.`output.directory` | Specifies the directory for exports. If empty, exports are placed in the same location as the source files |
|  | paperback-writer.`output.directoryRelativePathFile` | If set, the relative path specified for the export directory is interpreted relative to this file |
| Style Options | paperback-writer.`style.customCSS` | List of paths to custom style sheets (CSS) |
|  | paperback-writer.`style.customCSSRelativePathFile` | If set, integrates the path to the CSS file set in custom style without converting to a relative path |
|  | paperback-writer.`style.includeDefaultStyle` | Includes default styles |
|  | paperback-writer.`style.typography.lineHeight` | leading (line height) |
|  | paperback-writer.`style.typography.h1HeaderScale` | Automatically adjusts H1 to H6 font sizes based on a predefined jump ratio and the H1-body text size ratio. |
|  | paperback-writer.`style.font.baseSize` | Base font Size (px) |
|  | paperback-writer.`style.font.baseFont` | Base font |
|  | paperback-writer.`style.syntaxHighlighting.theme` | Syntax-highlighting theme |
|  | paperback-writer.`style.syntaxHighlighting.showLineNumbers` | Syntax-highlighting show line number |
|  | paperback-writer.`style.syntaxHighlighting.font` | Code font |
| Markdown Options | paperback-writer.`markdown.addBrOnSingleLineBreaks` | Adds a `<br>` on a single line break |
| Common | paperback-writer.`renderScale` | Scale for page rendering |
| PDF Options | paperback-writer.`PDF.displayHeaderFooter` | Displays page header and footer |
| | paperback-writer.`PDF.header.items` | Items to display in the header. You can combine `title`, `pageNumber`, `date`, and `url`. |
| | paperback-writer.`PDF.header.fontSize` | Header font size (in comparison with the body text) (pdf only) |
| | paperback-writer.`PDF.header.margin` | Margin between the header and the body text. (pdf only) |
| | paperback-writer.`PDF.footer.items` | Items to display in the footer. You can combine `title`, `pageNumber`, `date`, and `url`. |
| | paperback-writer.`PDF.footer.fontSize` | Footer font size (in comparison with the body text) (pdf only) |
| | paperback-writer.`PDF.footer.margin` | Margin between the footer and the body text. (pdf only) |
| | paperback-writer.`PDF.printBackground` | Prints background graphics |
| | paperback-writer.`PDF.paperOrientation` | Paper orientation |
| | paperback-writer.`PDF.pageRanges` | Page range for pdf only, e.g., '1-5, 8, 11-13' |
| | paperback-writer.`PDF.paperSizeFormat` | Paper size (pdf only), if specified, paper width/paper width will be ignored |
| | paperback-writer.`PDF.paperWidth` | Paper width (pdf only), Ignored when paper size is specified. Units available are mm, cm, in, px |
| | paperback-writer.`PDF.paperHeight` | Paper height (pdf only), Ignored when paper size is specified. Units available are mm, cm, in, px |
| | paperback-writer.`PDF.margin.top` | Page setting: top margin. Units mm, cm, in, px |
| | paperback-writer.`PDF.margin.bottom` | Page setting: bottom margin. Units mm, cm, in, px |
| | paperback-writer.`PDF.margin.right` | Page setting: right margin. Units mm, cm, in, px |
| | paperback-writer.`PDF.margin.left` | Page setting: left margin. Units mm, cm, in, px |
| PNG/JPEG Options | paperback-writer.`image.jpeg.quality` | Image quality for jpeg only, 0-100 |
| | paperback-writer.`image.clip.x` | X coordinate of the top-left corner of the clip area |
| | paperback-writer.`image.clip.y` | Y coordinate of the top-left corner of the clip area |
| | paperback-writer.`image.clip.width` | Width of the clip area |
| | paperback-writer.`image.clip.height` | Height of the clip area |
| | paperback-writer.`image.omitBackground` | Omits the background image. |
| Chromium | paperback-writer.`pathToAnExternalChromium` | Path to the executable file of Chromium or Chrome to run instead of the bundled Chromium |


### About ``PDF.paperSizeFormat``

``PDF.paperSizeFormat`` is used to specify the paper size for PDF documents. This setting allows you to select standard paper sizes (such as Letter, A4, etc.), or define a custom paper size by specifying specific paper width (``PDF.paperWidth``) and paper height (``PDF.paperHeight``). However, if a standard paper size is selected, any custom size specified through ``PDF.paperWidth`` and {{PDF.paperHeight}} will be ignored. Therefore, if you want to use a custom size, you should select blank in ``PDF.paperSizeFormat`` and then enter specific dimensions for ``PDF.paperWidth`` and ``PDF.paperHeight``.

The option ``Japanese Postcard 100x148`` is also available. This corresponds to the standard size of Japanese postal postcards.

Settings for special paper sizes tailored for Kindle Direct Publishing are also available:
| Option | Description | Notes |  |
| --- | --- | --- | --- |
| KDP-PB 139.7x215.9 no bleed | Kindle Direct Publishing Paperback: 139.7x215.9 mm without bleed | Minimum margin: 6.4 mm top and bottom, 9.6 mm left and right | kdp.amazon.com |
| ADP-PB (JP) 148x210 no bleed | Kindle Direct Publishing Paperback: 148x210 mm without bleed | Minimum margin: 6.4 mm top and bottom, 9.6 mm left and right | kdp.amazon.co.jp |


For more details, please refer to [KDP : Set Trim Size, Bleed, and Margins](https://kdp.amazon.com/en_US/help/topic/GVBQ3CMEQW3W2VL6)


## Release Notes

## License

MIT
