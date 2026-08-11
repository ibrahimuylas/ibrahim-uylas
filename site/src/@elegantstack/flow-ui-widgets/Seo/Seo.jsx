import React from 'react'
import Helmet from 'react-helmet'
import { useLocation } from '@reach/router'
import { helmetJsonLdProp } from 'react-schemaorg'
import { getSrc } from 'gatsby-plugin-image'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'
import getImageVariant from '@components/utils/getImageVariant'
import favicon from '../../../../content/assets/favicon.png'

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

  description = description || excerpt || site.description

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
        name: author.name,
        ...(author.slug && {
          url: `${resolvedSiteUrl}${author.slug}`
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
        lang: locale || 'tr'
      }}
      title={title}
      titleTemplate={`%s | ${site.title}`}
      meta={metaTags}
      script={scripts}
    >
      <link rel='icon' type='image/png' href={favicon} />
      {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
      {children}
    </Helmet>
  )
}

export default Seo
