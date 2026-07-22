import React from 'react'
import Helmet from 'react-helmet'
import { useLocation } from '@reach/router'
import { helmetJsonLdProp } from 'react-schemaorg'
import { getSrc } from 'gatsby-plugin-image'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'
import getImageVariant from '@components/utils/getImageVariant'

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
  siteUrl,
  locale
}) => {
  const site = useSiteMetadata()
  const { pathname } = useLocation()
  const resolvedSiteUrl = (siteUrl || site.siteUrl || '').replace(/\/$/, '')
  const canonicalUrl = resolvedSiteUrl && `${resolvedSiteUrl}${pathname || '/'}`
  const shouldNoIndex =
    /^\/(?:author|tag)\//.test(pathname) || /\/page\/\d+\/?$/.test(pathname)
  const published = datePublished || date

  const social = (author && author.social) || site.social || []
  const twitter =
    social.find(s => s.name && s.name.toLowerCase() === 'twitter') || {}

  description = excerpt || description || site.description

  const imageSrc = getSrc(getImageVariant(thumbnail, 'hero'))
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

    { name: 'twitter:card', content: 'summary' },
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
    metaTags.push({ name: 'twitter:label1', value: 'Okuma Süresi' })
    metaTags.push({
      name: 'twitter:data1',
      value: `${timeToRead} dk`
    })
  }

  if (shouldNoIndex) {
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
      headline: title,
      image: imageUrl,
      datePublished: published,
      ...(dateModified && { dateModified }),
      author: {
        '@type': 'Person',
        name: author.name
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
          item: resolvedSiteUrl
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: `${resolvedSiteUrl}${category.slug}`
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

  return (
    <Helmet
      htmlAttributes={{
        lang: locale || 'tr'
      }}
      title={title}
      titleTemplate={`%s | ${site.title}`}
      meta={metaTags}
      script={scripts}
    >
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {children}
    </Helmet>
  )
}

export default Seo
