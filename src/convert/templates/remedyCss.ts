
export const remedyCss = `
/* @docs
label: Core Remedies
version: 0.1.0-beta.2

note: |
  These remedies are recommended
  as a starter for any project.

category: file
*/


/* @docs
label: Box Sizing

note: |
  Use border-box by default, globally.

category: global
*/
*, ::before, ::after { box-sizing: border-box; }


/* @docs
label: Line Sizing

note: |
  Consistent line-spacing,
  even when inline elements have different line-heights.

links:
  - https://drafts.csswg.org/css-inline-3/#line-sizing-property

category: global
*/
html { line-sizing: normal; }


/* @docs
label: Body Margins

note: |
  Remove the tiny space around the edge of the page.

category: global
*/
body { margin: 0; }

[hidden] { display: none; }


/* @docs
label: Heading Sizes

note: |
  Switch to rem units for headings

category: typography
*/
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.17rem; }
h4 { font-size: 1.00rem; }
h5 { font-size: 0.83rem; }
h6 { font-size: 0.67rem; }


/* @docs
label: H1 Margins

note: |
  Keep h1 margins consistent, even when nested.

category: typography
*/
h1 { margin: 0.67em 0; }


/* @docs
label: Pre Wrapping

note: |
  Overflow by default is bad...

category: typography
*/
pre { white-space: pre-wrap; }

hr {
  border-style: solid;
  border-width: 1px 0 0;
  color: inherit;
  height: 0;
  overflow: visible;
}

img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
  max-width: 100%;
}
audio:not([controls]) { display:none; }

picture { display: contents; }
source { display: none; }

label: Audio Width

note: |
  There is no good reason elements default to 300px,
  and audio files are unlikely to come with a width attribute.

category: embedded elements
*/
audio { width: 100%; }

/* @docs
label: Image Borders

note: |
  Remove the border on images inside links in IE 10 and earlier.

category: legacy browsers
*/
img { border-style: none; }


/* @docs
label: SVG Overflow

note: |
  Hide the overflow in IE 10 and earlier.

category: legacy browsers
*/
svg { overflow: hidden; }

article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section {
  display: block;
}


/* @docs
label: Checkbox & Radio Inputs

note: |
  1. Add the correct box sizing in IE 10
  2. Remove the padding in IE 10

category: legacy browsers
*/
[type='checkbox'],
[type='radio'] {
  box-sizing: border-box;
  padding: 0;
}
`