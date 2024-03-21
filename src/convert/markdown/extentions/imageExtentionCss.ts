

import { IMAGE_EXTENTION_CLASS_FLOAT_BLOCK } from "../../../../dist/extension"
import {
  IMAGE_EXTENTION_CLASS_PREFIX,
  IMAGE_EXTENTION_CLASS_SIZE_FULL,
  IMAGE_EXTENTION_CLASS_SIZE_LARGE,
  IMAGE_EXTENTION_CLASS_SIZE_SMALL,
  IMAGE_EXTENTION_CLASS_SIZE_MEDIUM,
  IMAGE_EXTENTION_CLASS_ALIGN_RIGHT,
  IMAGE_EXTENTION_CLASS_ALIGN_LEFT,
  IMAGE_EXTENTION_CLASS_ALIGN_CENTER,
  IMAGE_EXTENTION_CLASS_FLOAT_FLOAT
 } from "./imageExtentions"


export const imageExtentionCss = () => {
  return `

  img.${IMAGE_EXTENTION_CLASS_PREFIX} {
    max-width: 100%;
  }

  img.${IMAGE_EXTENTION_CLASS_SIZE_FULL} {
    width: 100%;
  }

  img.${IMAGE_EXTENTION_CLASS_SIZE_LARGE} {
    width: 75%;
  }

  img.${IMAGE_EXTENTION_CLASS_SIZE_MEDIUM} {
    width: 50%;
  }

  img.${IMAGE_EXTENTION_CLASS_SIZE_SMALL} {
    width: 25%;
  }

  img.${IMAGE_EXTENTION_CLASS_ALIGN_RIGHT} {
    display: block;
    margin-left: auto;
    margin-right: 0;
  }

  img.${IMAGE_EXTENTION_CLASS_ALIGN_LEFT} {
    display: block;
    margin-left: 0;
    margin-right: auto;
  }

  img.${IMAGE_EXTENTION_CLASS_ALIGN_CENTER} {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  img.${IMAGE_EXTENTION_CLASS_FLOAT_FLOAT}.${IMAGE_EXTENTION_CLASS_ALIGN_RIGHT} {
    display: inline;
    float: right;
  }

  img.${IMAGE_EXTENTION_CLASS_FLOAT_FLOAT}.${IMAGE_EXTENTION_CLASS_ALIGN_LEFT} {
    display: inline;
    float: left;
  }

  figure.${IMAGE_EXTENTION_CLASS_PREFIX} {
    max-width: 100%;
    border: 1px solid #ddd;
    padding: 0.25em;
    margin-left: 0;
    margin-right: auto;
  }

  figure.${IMAGE_EXTENTION_CLASS_ALIGN_RIGHT} {
    margin-right: 0;
    margin-left: auto;
  }

  figure.${IMAGE_EXTENTION_CLASS_ALIGN_LEFT} {
    margin-right: auto;
    margin-left: 0;
  }

  figure.${IMAGE_EXTENTION_CLASS_ALIGN_CENTER} {
    margin-right: auto;
    margin-left: auto;
  }

  figure.${IMAGE_EXTENTION_CLASS_FLOAT_FLOAT}.${IMAGE_EXTENTION_CLASS_ALIGN_RIGHT} {
    display: inline-block;
    float: right;
  }

  figure.${IMAGE_EXTENTION_CLASS_FLOAT_FLOAT}.${IMAGE_EXTENTION_CLASS_ALIGN_LEFT} {
    display: inline-block;
    float: left;
  }

  figure.${IMAGE_EXTENTION_CLASS_SIZE_FULL} {
    width: 100%;
  }

  figure.${IMAGE_EXTENTION_CLASS_SIZE_LARGE} {
    width: 75%;
  }

  figure.${IMAGE_EXTENTION_CLASS_SIZE_MEDIUM} {
    width: 50%;
  }

  figure.${IMAGE_EXTENTION_CLASS_SIZE_SMALL} {
    width: 25%;
  }

  figure.${IMAGE_EXTENTION_CLASS_SIZE_FULL} img,
  figure.${IMAGE_EXTENTION_CLASS_SIZE_LARGE} img,
  figure.${IMAGE_EXTENTION_CLASS_SIZE_MEDIUM} img,
  figure.${IMAGE_EXTENTION_CLASS_SIZE_SMALL} img {
    width: 100%;
  }

  figure.${IMAGE_EXTENTION_CLASS_FLOAT_BLOCK},
  img.${IMAGE_EXTENTION_CLASS_FLOAT_BLOCK} {
    display: block;
  }
`
} 