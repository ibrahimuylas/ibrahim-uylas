import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { Link } from 'theme-ui'
import { getLocalizedLink, fallbackLinkTitle } from './language'

export default function LocaleLink({ to, language, children, ...props }) {
  const { href, fallbackLanguage } = getLocalizedLink(to, language)
  const crossesLanguage = Boolean(fallbackLanguage)

  return (
    <Link
      {...props}
      as={crossesLanguage ? 'a' : GatsbyLink}
      {...(crossesLanguage
        ? {
            href,
            hrefLang: fallbackLanguage,
            title: props.title || fallbackLinkTitle[fallbackLanguage]
          }
        : { to: href })}
    >
      {children}
    </Link>
  )
}
