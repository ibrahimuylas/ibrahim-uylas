import React, { createContext, useContext } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Link } from 'theme-ui'
import components from '@components/Mdx'
import DeferredEmbed from '../../../components/DeferredEmbed'

const MdxContentContext = createContext(null)

const articleLinkStyles = {
  color: `alphaDark`,
  ':visited': {
    color: `alphaDark`
  },
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: `alphaDarker`
    }
  }
}

const ArticleLink = props => <Link {...props} sx={articleLinkStyles} />

export const MdxContentProvider = MdxContentContext.Provider

export const PostBody = () => {
  const content = useContext(MdxContentContext)

  return (
    <MDXProvider components={{ ...components, DeferredEmbed, a: ArticleLink }}>
      {content}
    </MDXProvider>
  )
}
