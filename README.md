# Paperback Writer

This extension converts Markdown files into PDF, HTML, PNG, and JPEG files.

[日本語:Japanese](https://yambal.github.io/Paperback-Writer/docs/README_JA)

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
|  | paperback-writer.`style.typography.h1HeaderScale` | Automatically adjusts H1 to H6 font sizes based on a predefined jump ratio and the H1-body text size ratio. |
|  | paperback-writer.`style.font.baseSize` | Base font Size (px) |
|  | paperback-writer.`style.font.baseFont` | Base font |
|  | paperback-writer.`style.font.codeFont` | Code font |
| Markdown Options | paperback-writer.`markdown.addBrOnSingleLineBreaks` | Adds a `<br>` on a single line break |
| Common | paperback-writer.`renderScale` | Scale for page rendering |
| PDF Options | paperback-writer.`PDF.displayHeaderFooter` | Displays page header and footer |
| | paperback-writer.`PDF.headerHtmlElementTemplate` | HTML template for the print header |
| | paperback-writer.`PDF.footerHtmlElementTemplate` | HTML template for the print footer |
| | paperback-writer.`PDF.printBackground` | Prints background graphics |
| | paperback-writer.`PDF.paperOrientation` | Paper orientation |
| | paperback-writer.`PDF.pageRanges` | Page range for pdf only, e.g., '1-5, 8, 11-13' |
| | paperback-writer.`PDF.paperSizeFormat` | Paper size for pdf only, specifying width or height disables this |
| | paperback-writer.`PDF.paperWidth` | Paper width for pdf only, units: mm, cm, in, px. Disables `PDF : PaperSizeFormat` if set |
| | paperback-writer.`PDF.paperHeight` | Paper height for pdf only, units: mm, cm, in, px. Disables `PDF : PaperSizeFormat` if set |
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

## Release Notes

## License

MIT
