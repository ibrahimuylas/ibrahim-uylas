const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const hikingGuide = require('../site/src/content-guides/hikingGuide')
const policy = require('../site/src/components/categoryGuidePolicy')

const postsDirectory = path.resolve(__dirname, '../site/content/posts')
const component = fs.readFileSync(
  path.resolve(__dirname, '../site/src/components/CampingGuide.jsx'),
  'utf8'
)
const template = fs.readFileSync(
  path.resolve(__dirname, '../site/src/templates/camping-category.js'),
  'utf8'
)
const gatsbyNode = fs.readFileSync(
  path.resolve(__dirname, '../site/gatsby-node.js'),
  'utf8'
)

const findMdxFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return findMdxFiles(entryPath)
    return entry.name === 'index.mdx' ? [entryPath] : []
  })

const unquote = value => value.trim().replace(/^(['"])(.*)\1$/, '$2')

const slugify = value =>
  value
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const frontmatterValue = (contents, name) => {
  const match = contents.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))
  return match ? unquote(match[1]) : ''
}

const articles = findMdxFiles(postsDirectory).map(file => {
  const contents = fs.readFileSync(file, 'utf8')
  const explicitSlug = frontmatterValue(contents, 'slug')

  return {
    file,
    slug: explicitSlug || slugify(path.basename(path.dirname(file))),
    category: frontmatterValue(contents, 'category'),
    private: frontmatterValue(contents, 'private') === 'true',
    draft: frontmatterValue(contents, 'draft') === 'true'
  }
})

const configuredSlugs = [
  ...hikingGuide.readingPath.map(item => item.slug),
  ...hikingGuide.sections.flatMap(section => section.slugs)
]

test('hiking guide keeps the intended six-step beginner journey', () => {
  assert.deepEqual(
    hikingGuide.readingPath.map(item => item.slug),
    [
      'hiking-ne-demek',
      'trekking-ne-demek',
      'trekking-ile-hiking-arasindaki-farklar-nelerdir',
      'doga-yuruyusleri-icin-gerekli-ekipmanlar',
      'doga-yuruyuslerinde-nasil-giyinilmelidir',
      'doga-yuruyuslerinde-dikkat-edilmesi-gerekenler'
    ]
  )
})

test('hiking guide config resolves to unique, published articles', () => {
  const articleBySlug = new Map(
    articles.map(article => [article.slug, article])
  )
  const sectionIds = hikingGuide.sections.map(section => section.id)

  assert.equal(new Set(configuredSlugs).size, configuredSlugs.length)
  assert.equal(new Set(sectionIds).size, sectionIds.length)
  assert.deepEqual(hikingGuide.imageSectionIds, [
    'giyim-ekipman',
    'rotalar-ilham'
  ])

  configuredSlugs.forEach(slug => {
    const article = articleBySlug.get(slug)
    assert.ok(article, `Missing configured article: ${slug}`)
    assert.equal(
      article.private,
      false,
      `Configured article is private: ${slug}`
    )
    assert.equal(article.draft, false, `Configured article is a draft: ${slug}`)
  })
})

test('hiking guide includes walking, equipment, and route categories', () => {
  const fixture = [
    { slug: '/walking/', category: { name: 'Doğa Yürüyüşleri' }, tags: [] },
    { slug: '/equipment/', category: { name: 'Ekipmanlar' }, tags: [] },
    { slug: '/route/', category: { name: 'Rotalar' }, tags: [] },
    { slug: '/camping/', category: { name: 'Kampçılık' }, tags: [] }
  ]

  assert.deepEqual(
    policy
      .selectGuideArticles({
        articles: fixture,
        primaryCategory: hikingGuide.primaryCategory,
        categories: hikingGuide.hubCategories,
        tagNames: hikingGuide.tagNames
      })
      .map(article => article.slug),
    ['/walking/', '/equipment/', '/route/']
  )
})

test('hiking route is wired to the shared guide template', () => {
  assert.match(
    gatsbyNode,
    /'\/category\/doga-yuruyusleri\/'\s*:\s*'doga-yuruyusleri'/
  )
  assert.match(template, /'doga-yuruyusleri': hikingGuide/)
  assert.match(component, /guide\.hero\.imageType === 'static'/)
  assert.match(component, /guide\.beginner\.title/)
})
