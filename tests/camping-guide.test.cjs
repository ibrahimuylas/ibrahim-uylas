const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const campingGuide = require('../site/src/content-guides/campingGuide')
const {
  createCategoryHubActivation,
  filterArticles,
  isCampingArticle,
  selectGuideArticles
} = require('../site/src/components/campingGuidePolicy')

const postsDirectory = path.resolve(__dirname, '../site/content/posts')
const campingGuideComponent = fs.readFileSync(
  path.resolve(__dirname, '../site/src/components/CampingGuide.jsx'),
  'utf8'
)
const campingGuideHero = path.resolve(
  __dirname,
  '../site/content/assets/camping-guide-hero.png'
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
    title: frontmatterValue(contents, 'title'),
    slug: explicitSlug || slugify(path.basename(path.dirname(file))),
    category: frontmatterValue(contents, 'category'),
    private: frontmatterValue(contents, 'private') === 'true',
    draft: frontmatterValue(contents, 'draft') === 'true'
  }
})

const configuredSlugs = [
  ...campingGuide.readingPath.map(item => item.slug),
  ...campingGuide.sections.flatMap(section => section.slugs)
]

test('topic badges keep their default color after navigation and expose the scrolling contents control', () => {
  assert.match(
    campingGuideComponent,
    /'&:visited':\s*\{\s*color: `heading`\s*\}/
  )
  assert.match(campingGuideComponent, /showInlineNavigation=\{false\}/)
  assert.match(campingGuideComponent, /id='yeni-eklenenler'/)
})

test('camping guide hero uses the supplied responsive image asset', () => {
  assert.ok(fs.existsSync(campingGuideHero))
  assert.match(
    campingGuideComponent,
    /src='\.\.\/\.\.\/content\/assets\/camping-guide-hero\.png'/
  )
  assert.match(
    campingGuideComponent,
    /gridTemplateAreas:\s*\[\s*`"image" "content"`[\s\S]*`"content image"`/
  )
  assert.match(
    campingGuideComponent,
    /WebkitMaskImage:\s*`linear-gradient\(to right, transparent/
  )
})

test('equipment section uses a responsive editorial card grid', () => {
  assert.match(campingGuideComponent, /data-equipment-grid/)
  assert.match(campingGuideComponent, /`repeat\(3, minmax\(0, 1fr\)\)`/)
  assert.match(campingGuideComponent, /editorial/)
})

test('reading path uses three columns on desktop without changing mobile', () => {
  assert.match(campingGuideComponent, /data-reading-path-grid/)
  assert.match(
    campingGuideComponent,
    /`repeat\(2, minmax\(0, 1fr\)\)`,\s*`repeat\(3, minmax\(0, 1fr\)\)`/
  )
  assert.match(
    campingGuideComponent,
    /readingPath\.map[\s\S]*desktopImageOnly=\{!featuredSlugs\.has\(item\.slug\)\}[\s\S]*withImage/
  )
})

test('new articles section shows only three cards', () => {
  const campingCategoryTemplate = fs.readFileSync(
    path.resolve(__dirname, '../site/src/templates/camping-category.js'),
    'utf8'
  )

  assert.match(campingCategoryTemplate, /latestArticles:[\s\S]*limit: 3/)
  assert.match(
    campingGuideComponent,
    /visibleLatestArticles = useMemo\([\s\S]*latestArticles\.slice\(0, 3\)/
  )
  assert.match(campingGuideComponent, /nodes=\{visibleLatestArticles\}/)
  assert.match(campingGuideComponent, /columns=\{\[1, 2, 2, 3\]\}/)
})

test('all content uses an editorial grid and category navigation', () => {
  assert.match(campingGuideComponent, /data-all-content-grid/)
  assert.match(
    campingGuideComponent,
    /data-all-content-grid[\s\S]*`repeat\(3, minmax\(0, 1fr\)\)`/
  )
  assert.match(
    campingGuideComponent,
    /visibleArticleCount, setVisibleArticleCount/
  )
  assert.match(
    campingGuideComponent,
    /filteredArticles\.slice\(0, visibleArticleCount\)/
  )
  assert.match(campingGuideComponent, /aria-label='İçerik kategorileri'/)
  assert.match(
    campingGuideComponent,
    /categoryLinks\.map[\s\S]*to=\{item\.slug\}/
  )
  assert.match(campingGuideComponent, /Daha fazla içerik yükle/)
})

test('camping guide config resolves to unique, published articles', () => {
  const articleBySlug = new Map(
    articles.map(article => [article.slug, article])
  )
  const uniqueSlugs = new Set(configuredSlugs)
  const sectionIds = campingGuide.sections.map(section => section.id)

  assert.equal(uniqueSlugs.size, configuredSlugs.length)
  assert.equal(new Set(sectionIds).size, sectionIds.length)
  assert.deepEqual(campingGuide.imageSectionIds, ['ekipman', 'kamp-yerleri'])
  campingGuide.imageSectionIds.forEach(sectionId => {
    assert.ok(
      sectionIds.includes(sectionId),
      `Image section is not displayed: ${sectionId}`
    )
  })
  campingGuide.imageExcludedSlugs.forEach(slug => {
    assert.ok(
      uniqueSlugs.has(slug),
      `Image exclusion is not displayed: ${slug}`
    )
  })

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

  campingGuide.featuredSlugs.forEach(slug => {
    assert.ok(
      uniqueSlugs.has(slug),
      `Featured article is not displayed: ${slug}`
    )
  })
})

test('all thirteen camping category articles are curated on the hub', () => {
  const campingArticles = articles.filter(
    article =>
      article.category === 'Kampçılık' && !article.private && !article.draft
  )

  assert.equal(campingArticles.length, 13)
  campingArticles.forEach(article => {
    assert.ok(
      configuredSlugs.includes(article.slug),
      `Camping article is not curated: ${article.slug}`
    )
  })
})

test('searches Turkish titles and filters source categories', () => {
  const fixture = [
    {
      title: 'Uyku Tulumu Nasıl Kullanılır?',
      excerpt: 'Sıcaklık dereceleri ve bakım',
      category: { name: 'Kampçılık' }
    },
    {
      title: 'Ferrino Kamp Çadırı',
      excerpt: 'Hafif çadır incelemesi',
      category: { name: 'Ekipmanlar' }
    }
  ]

  assert.deepEqual(
    filterArticles({ articles: fixture, query: 'sicaklik', category: 'Tümü' }),
    [fixture[0]]
  )
  assert.deepEqual(
    filterArticles({
      articles: fixture,
      query: 'kamp',
      category: 'Ekipmanlar'
    }),
    [fixture[1]]
  )
  assert.deepEqual(
    filterArticles({ articles: fixture, query: 'kano', category: 'Tümü' }),
    []
  )
})

test('builds the automatic pool from category, tag, and curated slugs', () => {
  const fixture = [
    {
      slug: '/category-article/',
      category: { name: 'Kampçılık' },
      tags: []
    },
    {
      slug: '/tagged-article/',
      category: { name: 'Rotalar' },
      tags: [{ name: '#kampçılık' }]
    },
    {
      slug: '/curated-article/',
      category: { name: 'Ekipmanlar' },
      tags: []
    },
    {
      slug: '/unrelated/',
      category: { name: 'Diğer' },
      tags: []
    }
  ]

  assert.equal(isCampingArticle(fixture[0]), true)
  assert.equal(isCampingArticle(fixture[1]), true)
  assert.deepEqual(
    selectGuideArticles({
      articles: fixture,
      curatedSlugs: ['curated-article']
    }),
    fixture.slice(0, 3)
  )
})

test('tracks only allowlisted category hub link fields', () => {
  const calls = []
  const track = (eventName, parameters) => calls.push([eventName, parameters])

  createCategoryHubActivation({
    hub: 'kampcilik',
    sectionId: 'uyku-sistemi',
    linkUrl: '/r-degeri-nedir/',
    sourcePath: '/category/kampcilik/',
    track,
    visitorEmail: 'visitor@example.com',
    title: 'private-title'
  })()
  createCategoryHubActivation({
    hub: 'kampcilik',
    sectionId: 'invalid section',
    linkUrl: 'https://example.com/',
    sourcePath: '/category/kampcilik/',
    track
  })()

  assert.deepEqual(calls, [
    [
      'category_hub_click',
      {
        hub: 'kampcilik',
        section_id: 'uyku-sistemi',
        link_url: '/r-degeri-nedir/',
        source_path: '/category/kampcilik/'
      }
    ]
  ])
  assert.doesNotMatch(JSON.stringify(calls), /visitor|private|example\.com/)
})
