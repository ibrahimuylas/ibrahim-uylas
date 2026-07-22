const canonicalPostUrl = (siteUrl, slug) => {
  if (!siteUrl || !slug) return undefined

  const origin = siteUrl.replace(/\/+$/, '')
  const path = slug.replace(/^\/+|\/+$/g, '')

  return `${origin}/${path}/`
}

const createDisqusConfig = ({ siteUrl, slug, title }) => {
  const url = canonicalPostUrl(siteUrl, slug)

  return {
    ...(title && { title }),
    ...(url && { url })
  }
}

module.exports = createDisqusConfig
