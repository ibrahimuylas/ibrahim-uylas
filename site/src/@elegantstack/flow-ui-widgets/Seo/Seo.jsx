import React from 'react'
import Helmet from 'react-helmet'
import { useLocation } from '@reach/router'
import { helmetJsonLdProp } from 'react-schemaorg'
import { getSrc } from 'gatsby-plugin-image'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'
import getImageVariant from '@components/utils/getImageVariant'
import favicon from '../../../../content/assets/favicon.png'
import { copy } from '../../../i18n/copy'
import {
  getLanguageLinks,
  getLocalizedLink,
  getPageLanguage,
  normalizePath,
  shouldNoIndex
} from '../../../i18n/language'

const Seo = ({
  title,
  description,
  excerpt,
  meta,
  keywords,
  author,
  category,
  date,
  datePublished,
  dateModified,
  timeToRead,
  children,
  thumbnail,
  imageData,
  siteUrl,
  private: isPrivate
}) => {
  const site = useSiteMetadata()
  const { pathname } = useLocation()
  const language = getPageLanguage(pathname)
  const labels = copy[language]
  const languageLinks = getLanguageLinks(pathname)
  const resolvedSiteUrl = (siteUrl || site.siteUrl || '').replace(/\/$/, '')
  const canonicalUrl =
    resolvedSiteUrl && `${resolvedSiteUrl}${normalizePath(pathname || '/')}`
  const published = datePublished || date

  const social = (author && author.social) || site.social || []
  const twitter =
    social.find(s => s.name && s.name.toLowerCase() === 'twitter') || {}

  description = description || excerpt || labels.description || site.description

  const imageSrc =
    getSrc(getImageVariant(thumbnail, 'hero')) || getSrc(imageData)
  const imageUrl =
    imageSrc &&
    (imageSrc.startsWith('//')
      ? imageSrc
      : resolvedSiteUrl && `${resolvedSiteUrl}${imageSrc}`)

  /**
   * Meta Tags
   */

  const metaTags = [
    { itemprop: 'name', content: title || site.title },
    { itemprop: 'description', content: description },
    { name: 'description', content: description },

    { property: 'og:title', content: title || site.title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: published ? 'article' : 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:image', content: imageUrl },
    { property: 'og:url', content: canonicalUrl },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: site.name },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:creator', content: twitter.url }
  ]

  if (keywords && keywords.length > 0) {
    metaTags.push({ name: 'keywords', content: keywords.join(', ') })
  }

  if (published) {
    metaTags.push({ name: 'article:published_time', content: published })
  }

  if (dateModified) {
    metaTags.push({ name: 'article:modified_time', content: dateModified })
  }

  if (timeToRead) {
    metaTags.push({ name: 'twitter:label1', content: labels.readingTime })
    metaTags.push({
      name: 'twitter:data1',
      content: labels.minutes(timeToRead)
    })
  }

  if (isPrivate === true || shouldNoIndex(pathname)) {
    metaTags.push({ name: 'robots', content: 'noindex,follow' })
  }

  if (meta) {
    metaTags.push(meta)
  }

  /**
   * Structured Data (JSON-LD)
   */

  const scripts = []

  // Article
  if (title && author) {
    const articleJsonLd = helmetJsonLdProp({
      '@context': 'https://schema.org',
      '@type': 'Article',
      inLanguage: language,
      headline: title,
      image: imageUrl,
      datePublished: published,
      ...(dateModified && { dateModified }),
      author: {
        '@type': 'Person',
        name: author.name,
        ...(author.slug && {
          url: `${resolvedSiteUrl}${getLocalizedLink(author.slug, language).href}`
        })
      },
      mainEntityOfPage: canonicalUrl
    })
    scripts.push(articleJsonLd)
  }

  // Breadcrumb
  if (title && category) {
    const breadcrumbJsonLd = helmetJsonLdProp({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: site.name,
          item: `${resolvedSiteUrl}${labels.homePath}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: `${resolvedSiteUrl}${getLocalizedLink(category.slug, language).href}`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: title,
          item: canonicalUrl
        }
      ]
    })
    scripts.push(breadcrumbJsonLd)
  }

  // Homepage entity context
  if (pathname === '/') {
    const personId = `${resolvedSiteUrl}/ibrahim-uylas-kimdir/#person`
    scripts.push(
      helmetJsonLdProp({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${resolvedSiteUrl}/#website`,
            url: resolvedSiteUrl,
            name: site.title,
            description,
            publisher: { '@id': personId }
          },
          {
            '@type': 'Person',
            '@id': personId,
            name: site.title,
            url: `${resolvedSiteUrl}/ibrahim-uylas-kimdir/`,
            sameAs: (site.social || []).map(socialLink => socialLink.url)
          }
        ]
      })
    )
  }

  return (
    <Helmet
      htmlAttributes={{
        lang: language
      }}
      title={title}
      titleTemplate={`%s | ${site.title}`}
      meta={metaTags}
      script={scripts}
    >
      <link rel='icon' type='image/png' href={favicon} />
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {resolvedSiteUrl && languageLinks && (
        <link
          rel='alternate'
          hrefLang='tr'
          href={`${resolvedSiteUrl}${languageLinks.tr}`}
        />
      )}
      {resolvedSiteUrl && languageLinks && (
        <link
          rel='alternate'
          hrefLang='en'
          href={`${resolvedSiteUrl}${languageLinks.en}`}
        />
      )}
      {resolvedSiteUrl && languageLinks && (
        <link
          rel='alternate'
          hrefLang='x-default'
          href={`${resolvedSiteUrl}${languageLinks.tr}`}
        />
      )}
      {children}
    </Helmet>
  )
}

export default Seo
