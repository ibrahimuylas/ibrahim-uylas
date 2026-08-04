const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const routeGuide = require('../site/src/content-guides/routeGuide')
const policy = require('../site/src/components/categoryGuidePolicy')

const postsDirectory = path.resolve(__dirname, '../site/content/posts')

const slugify = value =>
  value
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .replace(/ı/g, 'i')
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const findMdxFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return findMdxFiles(entryPath)
    return entry.name === 'index.mdx' ? [entryPath] : []
  })

const value = (contents, name) => {
  const match = contents.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))
  return match ? match[1].trim().replace(/^(['"])(.*)\1$/, '$2') : ''
}

const articles = findMdxFiles(postsDirectory).map(file => {
  const contents = fs.readFileSync(file, 'utf8')
  const directory = path.basename(path.dirname(file))
  const explicitSlug = value(contents, 'slug')

  return {
    slug: explicitSlug || slugify(directory),
    category: value(contents, 'category'),
    file
  }
})

const routeArticles = articles.filter(article => article.category === 'Rotalar')

test('route guide keeps all route articles explicitly grouped', () => {
  assert.equal(routeArticles.length, 62)
  assert.equal(routeGuide.likyaSlugs.length, 12)
  assert.equal(new Set(routeGuide.allRouteSlugs).size, 62)
  assert.equal(Object.keys(routeGuide.articleGroups).length, 62)

  routeArticles.forEach(article => {
    assert.ok(
      routeGuide.articleGroups[article.slug],
      `Missing route group for ${article.slug}`
    )
  })
})

test('route guide includes the 11 ordered Likya stages and journals', () => {
  assert.deepEqual(
    routeGuide.likyaStages.map(stage => stage.context),
    [
      '1. etap · 25 km',
      '2. etap · 23 km',
      '3. etap · 17 km',
      '4. etap · 15 km',
      '5. etap · 22 km',
      '6. etap · 22 km',
      '7. etap · 12 km',
      '8. etap · 12 km',
      '9. etap · 28 km',
      '10. etap · 13 km',
      '11. etap · 23 km'
    ]
  )
  routeGuide.likyaStages.forEach(stage => {
    assert.match(stage.journalSlug, /^likya-yolu-(?:[1-9]|10|11)\.-gun$/)
  })
})

test('route filters use explicit groups instead of category-name matching', () => {
  const fixture = [
    { slug: '/likya-yolu-rotasi/', category: { name: 'Rotalar' } },
    { slug: '/barakli-goleti/', category: { name: 'Rotalar' } },
    { slug: '/patara-plaji/', category: { name: 'Rotalar' } }
  ]

  assert.deepEqual(
    policy
      .filterArticles({
        articles: fixture,
        category: 'likya-yolu',
        groupBySlug: routeGuide.articleGroups
      })
      .map(article => article.slug),
    ['/likya-yolu-rotasi/']
  )
})

test('route guide adds a route research step and compact spacing mode', () => {
  assert.equal(routeGuide.compactSpacing, false)
  assert.equal(routeGuide.research.id, 'rota-arastir')
  assert.equal(routeGuide.research.steps.length, 4)
  assert.equal(routeGuide.readingPath.length, 3)
  assert.match(routeGuide.research.title, /Rota nasıl bulunur/)
})

test('rotalar route is wired to the shared guide template', () => {
  const gatsbyNode = fs.readFileSync(
    path.resolve(__dirname, '../site/gatsby-node.js'),
    'utf8'
  )
  const template = fs.readFileSync(
    path.resolve(__dirname, '../site/src/templates/camping-category.js'),
    'utf8'
  )
  const component = fs.readFileSync(
    path.resolve(__dirname, '../site/src/components/CampingGuide.jsx'),
    'utf8'
  )

  assert.match(gatsbyNode, /'\/category\/rotalar\/'\s*:\s*'rotalar'/)
  assert.match(
    template,
    /import routeGuide from '..\/content-guides\/routeGuide'/
  )
  assert.match(template, /rotalar: routeGuide/)
  assert.match(component, /section\.layout === 'route'/)
  assert.match(component, /guide\.groupFilters/)
})
