const CAMPING_CATEGORY = 'Kampçılık'
const CAMPING_TAG = '#kampçılık'
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

const isCampingArticle = article =>
  article?.category?.name === CAMPING_CATEGORY ||
  article?.tags?.some(tag => tag?.name === CAMPING_TAG)

const filterArticles = ({ articles = [], query = '', category = 'Tümü' }) => {
  const normalizedQuery = normalizeSearchText(query)

  return articles.filter(article => {
    const categoryMatches =
      category === 'Tümü' || article?.category?.name === category
    const haystack = normalizeSearchText(
      `${article?.title || ''} ${article?.excerpt || ''}`
    )
    const queryMatches = !normalizedQuery || haystack.includes(normalizedQuery)

    return categoryMatches && queryMatches
  })
}

const selectGuideArticles = ({ articles = [], curatedSlugs = [] }) => {
  const curated = new Set(curatedSlugs.map(articleKey))
  const seen = new Set()

  return articles.filter(article => {
    const key = articleKey(article?.slug)
    if (!key || seen.has(key)) return false

    const included = curated.has(key) || isCampingArticle(article)
    if (included) seen.add(key)
    return included
  })
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
  isCampingArticle,
  normalizeSearchText,
  selectGuideArticles
}
