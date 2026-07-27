import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import components from '@components/Mdx'
import DeferredEmbed from './src/components/DeferredEmbed'

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={{ ...components, DeferredEmbed }}>
    {element}
  </MDXProvider>
)
