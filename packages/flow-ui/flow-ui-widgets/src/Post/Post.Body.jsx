import React, { createContext, useContext } from 'react'
import { MDXProvider } from '@mdx-js/react'
import components from '@components/Mdx'

const MdxContentContext = createContext(null)

export const MdxContentProvider = MdxContentContext.Provider

export const PostBody = ({ mdxComponents }) => {
  const content = useContext(MdxContentContext)

  return (
    <MDXProvider components={{ ...components, ...mdxComponents }}>
      {content}
    </MDXProvider>
  )
}
