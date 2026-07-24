import { default as headings } from './Headings'
import { default as figure } from './Figure'
import { default as figcaption } from './Figcaption'
import { InlineCode as code, Pre as pre } from './CodeBlock'

export default {
  figure,
  figcaption,
  pre,
  code,
  ...headings
}
