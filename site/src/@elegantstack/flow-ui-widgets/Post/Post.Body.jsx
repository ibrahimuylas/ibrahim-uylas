import React, { createContext, useContext } from 'react'
import { MDXProvider } from '@mdx-js/react'
import components from '@components/Mdx'
import DeferredEmbed from '../../../components/DeferredEmbed'

const MdxContentContext = createContext(null)

export const MdxContentProvider = MdxContentContext.Provider

export const PostBody = () => {
  const content = useContext(MdxContentContext)

  return (
    <MDXProvider components={{ ...components, DeferredEmbed }}>
      {content}
    </MDXProvider>
  )
}
