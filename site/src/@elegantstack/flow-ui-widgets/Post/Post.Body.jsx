import React, { createContext, useContext } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { useLocation } from '@reach/router'
import { Link } from 'theme-ui'
import components from '@components/Mdx'
import DeferredEmbed from '../../../components/DeferredEmbed'
import {
  getLocalizedLink,
  getPageLanguage,
  fallbackLinkTitle
} from '../../../i18n/language'

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

const ArticleLink = ({ href, children, ...props }) => {
  const { pathname } = useLocation()
  const { href: target, fallbackLanguage } = getLocalizedLink(
    href,
    getPageLanguage(pathname)
  )

  return (
    <Link
      {...props}
      href={target}
      hrefLang={fallbackLanguage || props.hrefLang}
      title={props.title || fallbackLinkTitle[fallbackLanguage]}
      sx={articleLinkStyles}
    >
      {children}
    </Link>
  )
}

export const MdxContentProvider = MdxContentContext.Provider

export const PostBody = () => {
  const content = useContext(MdxContentContext)

  return (
    <MDXProvider components={{ ...components, DeferredEmbed, a: ArticleLink }}>
      {content}
    </MDXProvider>
  )
}
