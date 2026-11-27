import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { InitializeColorMode } from 'theme-ui'
import components from '@components/Mdx'
import DeferredEmbed from './src/components/DeferredEmbed'

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([<InitializeColorMode key='initialize-color-mode' />])
}

export const wrapRootElement = ({ element }) => (
  <MDXProvider components={{ ...components, DeferredEmbed }}>
    {element}
  </MDXProvider>
)
