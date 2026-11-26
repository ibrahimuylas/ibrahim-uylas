const { createHash } = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')
const { normalizePath, getPageLanguage } = require('./language')
const { categoryPaths, parseCollectionPath, tagName } = require('./collections')
const categoryGuideLinks = require('../content-guides/categoryGuideLinks')
const translations = require('./translations.json')

const siteDirectory = path.join(__dirname, '../..')
const template = name => path.join(siteDirectory, 'src/templates', name)
const postTemplate =
  require.resolve('../../../packages/blog/gatsby-blog-core/src/templates/post.js')
const byId = new Map(
  translations.map(translation => [translation.id, translation])
)

const articleQuery = `{
  allArticle(sort: { date: DESC }) {
    nodes {
      id slug private draft link date
      category { id name slug }
      author { name slug }
      tags { id slug }
      parent {
        ... on Mdx {
          parent { ... on File { relativePath absolutePath } }
        }
      }
    }
  }
}`

const articleIdentity = article =>
  `article:${article.parent?.parent?.relativePath}`

const guideIds = {
  'diger-her-sey': 'diger',
  'doga-yuruyusleri-ve-kamp-ekipmanlari': 'ekipmanlar',
  'doga-yuruyusleri': 'doga-yuruyusleri',
  kampcilik: 'kampcilik',
  rotalar: 'rotalar'
}

const collectionPageSize = 6

const inCollection = ({ kind, slug }, article) =>
  kind === 'tag'
    ? article.tags?.some(tag => tag?.slug === slug)
    : article[kind]?.slug === slug

const getCollectionContext = (translation, collection, articles, previews) => {
  const { kind, name, page, slug } = collection
  const members = articles.filter(article => inCollection(collection, article))
  if (translation.template === 'camping-category.js') {
    return { slug, guideId: guideIds[name], previews }
  }

  const pageCount = Math.ceil(members.length / collectionPageSize)
  const start = (page - 1) * collectionPageSize
  const visible = members.slice(start, start + collectionPageSize)
  const category = categoryGuideLinks[members[0]?.category?.name]?.en
  const title =
    kind === 'tag'
      ? tagName(slug)
      : kind === 'author'
        ? members[0]?.author?.name
        : category?.title
  if (!title || !visible.length) {
    throw new Error(
      `English collection ${translation.en} has no title or articles`
    )
  }

  return {
    title: page === 1 ? title : `${title} · Page ${page}`,
    description:
      kind === 'category'
        ? category.description
        : kind === 'author'
          ? `Camping, hiking, routes and gear articles by ${title}.`
          : `Articles and guides about ${title}.`,
    kind,
    articleIds: visible.map(article => article.id),
    totalCount: members.length,
    pagination: {
      slug: `/en/${kind}/${kind === 'category' ? categoryPaths[name] : name}/`,
      currentPage: page,
      pageCount,
      hasNextPage: page < pageCount,
      hasPreviousPage: page > 1
    },
    previews: selectPreviews(visible, previews)
  }
}

const selectPreviews = (articles, previews) =>
  Object.fromEntries(
    articles
      .filter(article => previews[article.slug])
      .map(article => [article.slug, previews[article.slug]])
  )

const getRelatedPreviews = (article, articles, previews) => {
  const eligible = articles.filter(candidate => candidate.id !== article.id)
  const tagIds = new Set(
    (article.tags || []).filter(Boolean).map(tag => tag.id)
  )
  const hasTag = candidate => candidate.tags?.some(tag => tagIds.has(tag?.id))
  const hasCategory = candidate =>
    candidate.category?.id === article.category?.id
  return selectPreviews(
    [
      ...eligible
        .filter(candidate => hasTag(candidate) && hasCategory(candidate))
        .slice(0, 6),
      ...eligible.filter(hasTag).slice(0, 6),
      ...eligible.filter(hasCategory).slice(0, 6)
    ],
    previews
  )
}

const queryData = async (graphql, query) => {
  const { data, errors } = await graphql(query)
  if (errors?.length)
    throw new Error(errors.map(error => error.message).join('\n'))
  return data
}

const createEnglishPages = async ({ graphql, actions }) => {
  const [{ allArticle }, { allFile }] = await Promise.all([
    queryData(graphql, articleQuery),
    queryData(
      graphql,
      `{
      allFile(filter: { sourceInstanceName: { eq: "englishContent" } }) {
        nodes {
          relativePath
          childMdx { id internal { contentFilePath } frontmatter { title description } }
        }
      }
    }`
    )
  ])

  const sources = new Map(
    allArticle.nodes.map(article => [articleIdentity(article), article])
  )
  const files = new Map(
    allFile.nodes.map(file => [file.relativePath, file.childMdx])
  )
  const publicArticles = allArticle.nodes.filter(
    article => !article.private && !article.draft && !article.link
  )
  const previews = Object.fromEntries(
    publicArticles.flatMap(article => {
      const translation = byId.get(articleIdentity(article))
      const frontmatter = files.get(translation?.translation)?.frontmatter
      return frontmatter
        ? [[article.slug, { ...frontmatter, date: article.date }]]
        : []
    })
  )
  const routes = new Set()

  for (const translation of translations) {
    const { id, tr, en } = translation
    if (
      byId.size !== translations.length ||
      routes.has(en) ||
      routes.has(tr) ||
      !en.startsWith('/en/') ||
      !tr.startsWith('/') ||
      tr.startsWith('//') ||
      getPageLanguage(tr) !== 'tr' ||
      normalizePath(en) !== en ||
      normalizePath(tr) !== tr
    ) {
      throw new Error(`Invalid translation mapping for ${id}`)
    }
    routes.add(tr)
    routes.add(en)

    if (translation.template) {
      const collection = parseCollectionPath(tr)
      const latest =
        tr === '/'
          ? publicArticles.filter(article => previews[article.slug]).slice(0, 6)
          : []
      actions.createPage({
        path: en,
        component: template(translation.template),
        context: collection
          ? getCollectionContext(
              translation,
              collection,
              publicArticles,
              previews
            )
          : {
              articleIds: latest.map(article => article.id),
              previews: selectPreviews(latest, previews)
            }
      })
      continue
    }

    const article = sources.get(id)
    const mdx = files.get(translation.translation)
    if (
      !article ||
      article.private ||
      article.draft ||
      article.link ||
      normalizePath(article.slug) !== tr
    ) {
      throw new Error(
        `Translation ${en} needs a public Turkish article at ${tr} (${id})`
      )
    }
    if (
      !mdx?.internal.contentFilePath ||
      !mdx.frontmatter?.title ||
      !mdx.frontmatter?.description ||
      !/^[a-f0-9]{64}$/.test(translation.sourceRevision || '')
    ) {
      throw new Error(
        `Translation ${en} needs MDX with title, description and a Turkish source revision`
      )
    }

    const tagsIds = (article.tags || []).filter(Boolean).map(tag => tag.id)
    actions.createPage({
      path: en,
      component: `${postTemplate}?__contentFilePath=${mdx.internal.contentFilePath}`,
      context: {
        id: article.id,
        categoryId: article.category?.id,
        tagsIds,
        hasTags: tagsIds.length > 0,
        hasTranslation: true,
        translationId: mdx.id,
        previews: getRelatedPreviews(article, publicArticles, previews)
      }
    })
  }
}

const writeTranslationInventory = async ({ graphql, reporter }) => {
  const [{ allArticle }, { allSitePage }, redirects] = await Promise.all([
    queryData(graphql, articleQuery),
    queryData(graphql, '{ allSitePage { nodes { path } } }'),
    fs.readFile(path.join(siteDirectory, 'static/_redirects'), 'utf8')
  ])
  const articles = new Map(
    allArticle.nodes.map(article => [normalizePath(article.slug), article])
  )
  const paths = new Set(allSitePage.nodes.map(page => normalizePath(page.path)))
  const aliases = new Set(
    redirects
      .split('\n')
      .map(line => line.trim().split(/\s+/))
      .filter(([, , status]) => /^30[1278]!?$/.test(status))
      .map(([route]) => normalizePath(route))
  )

  const inventory = await Promise.all(
    [...paths].sort().map(async tr => {
      if (
        getPageLanguage(tr) !== 'tr' ||
        aliases.has(tr) ||
        /^\/(?:admin(?:\/|\.html)|dev-404-page\/|404\.html$)/.test(tr)
      )
        return null

      const article = articles.get(tr)
      if (article?.private || article?.draft || article?.link) return null

      const id = article
        ? articleIdentity(article)
        : tr === '/'
          ? 'page:home'
          : `page:${tr}`
      const translation = byId.get(id)
      const sourcePath = article?.parent?.parent?.absolutePath
      const revision = sourcePath
        ? createHash('sha256')
            .update(await fs.readFile(sourcePath))
            .digest('hex')
        : null

      return {
        id,
        tr,
        en: translation?.en || null,
        sourceRevision: revision,
        translatedSourceRevision: translation?.sourceRevision || null,
        status: !translation
          ? 'missing'
          : revision && revision !== translation.sourceRevision
            ? 'source-changed'
            : 'translated'
      }
    })
  )
  const entries = inventory.filter(Boolean)

  for (const { id, tr, en } of translations) {
    if (
      !paths.has(en) ||
      !entries.some(entry => entry.id === id && entry.tr === tr)
    ) {
      throw new Error(`Translation ${en} has no generated public pair at ${tr}`)
    }
  }

  await fs.writeFile(
    path.join(siteDirectory, '.cache/translation-inventory.json'),
    `${JSON.stringify(entries, null, 2)}\n`
  )
  reporter.info(
    `Translation inventory: ${entries.length} Turkish pages, ${entries.filter(entry => entry.en).length} English pages (.cache/translation-inventory.json)`
  )
}

module.exports = { createEnglishPages, writeTranslationInventory }
