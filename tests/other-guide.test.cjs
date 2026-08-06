const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const slugifyPackage = require('slugify')
const otherGuide = require('../site/src/content-guides/otherGuide')
const component = fs.readFileSync(
  path.resolve(__dirname, '../site/src/components/CampingGuide.jsx'),
  'utf8'
)

const postsDirectory = path.resolve(__dirname, '../site/content/posts/diğer')

const slugify = value =>
  slugifyPackage(value, {
    lower: true,
    remove: /[^\w\s.{}\/-]+/g
  })

const unquote = value => value.trim().replace(/^(['"])(.*)\1$/, '$2')

const frontmatterValue = (contents, name) => {
  const match = contents.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))
  return match ? unquote(match[1]) : ''
}

const articles = fs.readdirSync(postsDirectory).flatMap(directory => {
  const file = path.join(postsDirectory, directory, 'index.mdx')
  if (!fs.existsSync(file)) return []

  const contents = fs.readFileSync(file, 'utf8')
  const explicitSlug = frontmatterValue(contents, 'slug')

  return [
    {
      slug: explicitSlug || slugify(frontmatterValue(contents, 'title')),
      private: frontmatterValue(contents, 'private') === 'true',
      file
    }
  ]
})

test('other guide groups every other-category article exactly once', () => {
  assert.equal(otherGuide.allOtherSlugs.length, articles.length)
  assert.equal(new Set(otherGuide.allOtherSlugs).size, articles.length)

  articles.forEach(article => {
    assert.equal(
      otherGuide.articleGroups[article.slug] !== undefined,
      true,
      `Missing other group for ${article.slug} (${article.file})`
    )
  })
})

test('other guide keeps the named travel series separate', () => {
  assert.equal(otherGuide.beginner, undefined)
  assert.equal(otherGuide.storyGroups['likya-yolu-anilari'].length, 18)
  assert.equal(otherGuide.storyGroups['iskocya-gezisi'].length, 6)
  assert.equal(otherGuide.storyGroups['nordkapp-yolculugu'].length, 2)
  assert.equal(
    otherGuide.articleGroups['likya-yolu-1.-gun'],
    'likya-yolu-anilari'
  )
  assert.deepEqual(otherGuide.storyGroups['likya-yolu-anilari'].slice(0, 2), [
    'likya-yolu-hazirliklari',
    'likyaya-1-kala'
  ])
  assert.equal(
    otherGuide.articleGroups['iskoc-yaylalari-nc500-rotasi-4.-bolum'],
    'iskocya-gezisi'
  )
  assert.equal(otherGuide.storyGroups['iskocya-gezisi'].length, 6)
  assert.equal(
    otherGuide.articleGroups['32.km-ilk-maraton-kosusu'],
    'kosu-hikayeleri'
  )
})

test('other guide presents Scotland before Likya stories', () => {
  assert.deepEqual(
    otherGuide.sections.slice(0, 2).map(section => section.id),
    ['iskocya-gezisi', 'likya-yolu-anilari']
  )
  assert.deepEqual(
    otherGuide.groupFilters.slice(0, 2).map(filter => filter.id),
    ['iskocya-gezisi', 'likya-yolu-anilari']
  )
})

test('other category is wired to the shared guide page', () => {
  const gatsbyNode = fs.readFileSync(
    path.resolve(__dirname, '../site/gatsby-node.js'),
    'utf8'
  )
  const template = fs.readFileSync(
    path.resolve(__dirname, '../site/src/templates/camping-category.js'),
    'utf8'
  )

  assert.match(gatsbyNode, /'\/category\/diger-her-sey\/'\s*:\s*'diger'/)
  assert.match(
    template,
    /import otherGuide from '..\/content-guides\/otherGuide'/
  )
  assert.match(template, /diger: otherGuide/)
  assert.match(template, /"Diğer"/)
  assert.match(
    component,
    /src='\.\.\/\.\.\/content\/assets\/diger-jeep-kamp-hero\.webp'/
  )
  assert.match(component, /guide\.beginner && \(/)
})
