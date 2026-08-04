const INTERNAL_PATH = /^\/(?!\/)[^?#]*\/$/
const SAFE_ID = /^[a-z0-9-]{1,64}$/

const normalizeSearchText = value =>
  typeof value === 'string'
    ? value
        .toLocaleLowerCase('tr-TR')
        .normalize('NFKD')
        .replace(/\p{Mark}/gu, '')
        .replace(/ı/g, 'i')
        .replace(/\s+/g, ' ')
        .trim()
    : ''

const articlePath = slug => {
  if (typeof slug !== 'string') return ''
  const normalized = slug.replace(/^\/+|\/+$/g, '')
  return normalized ? `/${normalized}/` : ''
}

const articleKey = slug =>
  typeof slug === 'string' ? slug.replace(/^\/+|\/+$/g, '') : ''

const isGuideArticle = (
  article,
  { primaryCategory, categories = [], tagNames = [] } = {}
) => {
  const categoryNames = new Set(
    [primaryCategory, ...categories].filter(Boolean)
  )
  const articleTags = article?.tags || []

  return (
    categoryNames.has(article?.category?.name) ||
    articleTags.some(tag => tagNames.includes(tag?.name))
  )
}

const filterArticles = ({
  articles = [],
  query = '',
  category = 'Tümü',
  groupBySlug = null
}) => {
  const normalizedQuery = normalizeSearchText(query)
  const hasGroups = groupBySlug && Object.keys(groupBySlug).length > 0

  return articles.filter(article => {
    const categoryMatches =
      category === 'Tümü' ||
      (hasGroups
        ? groupBySlug[articleKey(article?.slug)] === category
        : article?.category?.name === category)
    const haystack = normalizeSearchText(
      `${article?.title || ''} ${article?.excerpt || ''}`
    )
    const queryMatches = !normalizedQuery || haystack.includes(normalizedQuery)

    return categoryMatches && queryMatches
  })
}

const selectGuideArticles = ({
  articles = [],
  curatedSlugs = [],
  primaryCategory,
  categories = [],
  tagNames = []
}) => {
  const curated = new Set(curatedSlugs.map(articleKey))
  const seen = new Set()

  return articles.filter(article => {
    const key = articleKey(article?.slug)
    if (!key || seen.has(key)) return false

    const included =
      curated.has(key) ||
      isGuideArticle(article, { primaryCategory, categories, tagNames })
    if (included) seen.add(key)
    return included
  })
}

const selectRandomArticles = ({
  articles = [],
  count = 0,
  random = Math.random
}) => {
  const uniqueArticles = Array.from(
    new Map(
      articles
        .filter(article => articleKey(article?.slug))
        .map(article => [articleKey(article.slug), article])
    ).values()
  )

  for (let index = uniqueArticles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    const currentArticle = uniqueArticles[index]
    uniqueArticles[index] = uniqueArticles[randomIndex]
    uniqueArticles[randomIndex] = currentArticle
  }

  return uniqueArticles.slice(0, Math.max(0, count))
}

const createCategoryHubActivation =
  ({ hub, sectionId, linkUrl, sourcePath, track }) =>
  () => {
    if (
      typeof track !== 'function' ||
      !SAFE_ID.test(hub || '') ||
      !SAFE_ID.test(sectionId || '') ||
      !INTERNAL_PATH.test(linkUrl || '') ||
      !INTERNAL_PATH.test(sourcePath || '')
    ) {
      return
    }

    track('category_hub_click', {
      hub,
      section_id: sectionId,
      link_url: linkUrl,
      source_path: sourcePath
    })
  }

module.exports = {
  articleKey,
  articlePath,
  createCategoryHubActivation,
  filterArticles,
  isGuideArticle,
  normalizeSearchText,
  selectRandomArticles,
  selectGuideArticles
}
