const fs = require('node:fs')
const path = require('node:path')
const { copy, localizeArticle } = require('../src/i18n/copy')
const {
  getPageLanguage,
  normalizePath,
  shouldNoIndex
} = require('../src/i18n/language')
const translations = require('../src/i18n/translations.json')
const {
  countMatches,
  decodeHtmlText,
  extractElement,
  extractPagefindMeta,
  removeIgnoredElements,
  routeToHtmlPath,
  validatePagefindEntry
} = require('./pagefind-validation')

const publicDirectory = path.resolve(__dirname, '..', 'public')
const invalidParagraphChildren = /<(?:div|pre)\b/i
const paragraph = /<p\b[^>]*>[\s\S]*?<\/p>/gi
const homepagePath = path.join(publicDirectory, 'index.html')
const englishHomepagePath = path.join(publicDirectory, 'en', 'index.html')
const contactPath = path.join(publicDirectory, 'iletisim', 'index.html')
const campingGuidePath = path.join(
  publicDirectory,
  'category',
  'kampcilik',
  'index.html'
)
const hikingGuidePath = path.join(
  publicDirectory,
  'category',
  'doga-yuruyusleri',
  'index.html'
)
const equipmentGuidePath = path.join(
  publicDirectory,
  'category',
  'doga-yuruyusleri-ve-kamp-ekipmanlari',
  'index.html'
)
const pageDataDirectory = path.join(publicDirectory, 'page-data')
const pagefindDirectory = path.join(publicDirectory, 'pagefind')

const findHtmlFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) return findHtmlFiles(entryPath)
    return entry.name.endsWith('.html') ? [entryPath] : []
  })

const findPageDataFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) return findPageDataFiles(entryPath)
    return entry.name === 'page-data.json' ? [entryPath] : []
  })

if (!fs.existsSync(publicDirectory)) {
  throw new Error('site/public does not exist; run the Gatsby build first')
}

const failures = findHtmlFiles(publicDirectory).flatMap(file => {
  const html = fs.readFileSync(file, 'utf8')
  const invalidParagraph = [...html.matchAll(paragraph)].find(match =>
    invalidParagraphChildren.test(match[0])
  )

  return invalidParagraph ? [path.relative(publicDirectory, file)] : []
})

if (failures.length) {
  console.error('Generated HTML contains invalid paragraph nesting:')
  failures.forEach(file => console.error(`- ${file}`))
  process.exitCode = 1
} else {
  console.log('Generated HTML nesting is valid.')
}

const englishHome = fs.readFileSync(englishHomepagePath, 'utf8')
const missingEnglishHomeContent = [
  'id="one-cikanlar"',
  'slick-slider',
  'Featured and recent articles',
  'aria-label="Next slide"',
  '>See more</a>',
  'href="/en/about-ibrahim-uylas/"',
  'alt="İbrahim Uylaş out hiking"',
  'I’m İbrahim Uylaş',
  'data-instagram-state="loading"',
  ...[
    'kampcilik',
    'doga-yuruyusleri',
    'rotalar',
    'doga-yuruyusleri-ve-kamp-ekipmanlari',
    'diger-her-sey'
  ].map(slug => `id="ana-/category/${slug}/"`)
].filter(value => !englishHome.includes(value))

if (missingEnglishHomeContent.length) {
  console.error('Generated English homepage is missing sections or content:')
  missingEnglishHomeContent.forEach(value => console.error(`- ${value}`))
  process.exitCode = 1
}

if (
  !/\b\d+ min<\//.test(englishHome) ||
  /\b\d+\s+(?:<!-- -->\s*)?dk<\//.test(englishHome)
) {
  console.error('Generated English homepage has incorrect reading time units.')
  process.exitCode = 1
}

const localizedPageChecks = [
  ['/404/', 'Sayfa bulunamadı'],
  ['/en/404/', 'Page not found'],
  ['/en/author/ibrahim-uylas/', 'Software developer on the road'],
  ['/en/category/camping/page/2/', 'aria-label="Pagination"']
]
for (const [route, expected] of localizedPageChecks) {
  const file = routeToHtmlPath(publicDirectory, route)
  if (
    !fs.existsSync(file) ||
    !fs.readFileSync(file, 'utf8').includes(expected)
  ) {
    console.error(`${route}: missing localized content ${expected}`)
    process.exitCode = 1
  }
}

const instagramPages = [
  ['homepage', homepagePath],
  ['contact', contactPath]
]

instagramPages.forEach(([pageName, pagePath]) => {
  if (!fs.existsSync(pagePath)) {
    console.error(`Generated ${pageName} HTML is missing.`)
    process.exitCode = 1
    return
  }

  const pageHtml = fs.readFileSync(pagePath, 'utf8')
  const requiredSkeletonContent = [
    'data-instagram-state="loading"',
    'aria-label="Instagram bölümü yükleniyor"',
    'aria-busy="true"',
    'data-instagram-newsletter="true"',
    'Yeni yazılardan haberdar ol'
  ]
  const forbiddenDefaultContent = [
    'Yoldaki hikâyeleri kaçırma',
    '@uylasonwheels',
    'Londra’dan vahşi doğaya',
    'https://ig.me/m/uylasonwheels'
  ]
  const missingContent = requiredSkeletonContent.filter(
    value => !pageHtml.includes(value)
  )
  const exposedDefaultContent = forbiddenDefaultContent.filter(value =>
    pageHtml.includes(value)
  )

  if (missingContent.length || exposedDefaultContent.length) {
    console.error(`Generated ${pageName} Instagram SSR contract is invalid:`)
    missingContent.forEach(value => console.error(`- Missing: ${value}`))
    exposedDefaultContent.forEach(value =>
      console.error(`- Default content exposed: ${value}`)
    )
    process.exitCode = 1
  } else {
    console.log(
      `Generated ${pageName} Instagram skeleton SSR contract is valid.`
    )
  }
})

if (!fs.existsSync(campingGuidePath)) {
  console.error('Generated camping guide HTML is missing.')
  process.exitCode = 1
} else {
  const campingGuide = fs.readFileSync(campingGuidePath, 'utf8')
  const requiredCampingGuideContent = [
    'Kampçılık Rehberi',
    'İlk kampını adım adım planla',
    'Uyku sistemi ve sıcak kalmak',
    'Güvenlik ve kamp ateşi',
    'Ekipman seçimi',
    'Kamp yerleri ve rotalar',
    'Terimler, kitaplar ve ilham',
    'Tüm içerikler',
    'CollectionPage',
    'ItemList',
    'rel="canonical" href="https://www.ibrahimuylas.com/category/kampcilik/"',
    'href="/buff-nedir-ne-ise-yarar/"',
    'href="/cliff-jacobson-ile-kampcilik/"',
    'href="/dogada-kamp-yapmak-guvenli-midir/"',
    'href="/gtx-ayakkabi-ne-demek/"',
    'href="/guvenli-kamp-atesi-icin-en-iyi-10-ipucu/"',
    'href="/iki-kisilik-uyku-tulumu-hakkinda/"',
    'href="/ilk-kamp-icin-gerekli-malzemeler/"',
    'href="/ilk-kamp-nerede-yapilir/"',
    'href="/kamp-hayatina-bulasmak-ister-misiniz/"',
    'href="/outdoor-ne-demek/"',
    'href="/r-degeri-nedir/"',
    'href="/cadir-alirken-nelere-dikkat-edilmeli/"',
    'href="/uyku-tulumu-alirken-nelere-dikkat-edilmelidir/"',
    'href="/uyku-tulumu-nasil-kullanilir/"',
    'href="/uyku-tulumu-yetersiz-kalirsa-ne-yapilmalidir/"',
    'href="/carsak-ne-demek/"'
  ]
  const missingCampingGuideContent = requiredCampingGuideContent.filter(
    value => !campingGuide.includes(value)
  )
  const h1Count = (campingGuide.match(/<h1\b/gi) || []).length

  if (missingCampingGuideContent.length || h1Count !== 1) {
    console.error('Generated camping guide SSR contract is invalid:')
    missingCampingGuideContent.forEach(value =>
      console.error(`- Missing: ${value}`)
    )
    if (h1Count !== 1) {
      console.error(`- Expected one h1, found ${h1Count}`)
    }
    process.exitCode = 1
  } else {
    console.log('Generated camping guide SSR contract is valid.')
  }
}

if (!fs.existsSync(hikingGuidePath)) {
  console.error('Generated hiking guide HTML is missing.')
  process.exitCode = 1
} else {
  const hikingGuide = fs.readFileSync(hikingGuidePath, 'utf8')
  const requiredHikingGuideContent = [
    'Doğa Yürüyüşleri Rehberi',
    'Doğa yürüyüşüne adım adım hazırlan',
    'Hazırlık ve güvenlik',
    'Giyim ve ekipman seçimi',
    'Rotalar ve ilham',
    'Tüm içerikler',
    'CollectionPage',
    'ItemList',
    'rel="canonical" href="https://www.ibrahimuylas.com/category/doga-yuruyusleri/"',
    'href="/doga-yuruyusleri-icin-gerekli-ekipmanlar/"',
    'href="/doga-yuruyuslerinde-corap-tercihi/"',
    'href="/trekking-ayakkabisi-nasil-olmali/"'
  ]
  const missingHikingGuideContent = requiredHikingGuideContent.filter(
    value => !hikingGuide.includes(value)
  )
  const h1Count = (hikingGuide.match(/<h1\b/gi) || []).length

  if (missingHikingGuideContent.length || h1Count !== 1) {
    console.error('Generated hiking guide SSR contract is invalid:')
    missingHikingGuideContent.forEach(value =>
      console.error(`- Missing: ${value}`)
    )
    if (h1Count !== 1) {
      console.error(`- Expected one h1, found ${h1Count}`)
    }
    process.exitCode = 1
  } else {
    console.log('Generated hiking guide SSR contract is valid.')
  }
}

if (!fs.existsSync(equipmentGuidePath)) {
  console.error('Generated equipment guide HTML is missing.')
  process.exitCode = 1
} else {
  const equipmentGuide = fs.readFileSync(equipmentGuidePath, 'utf8')
  const requiredEquipmentGuideContent = [
    'Ekipmanlar Rehberi',
    'Ekipmanını kullanımına göre seç',
    'Barınma ve uyku sistemi',
    'Giyim ve yürüyüş ekipmanları',
    'Kamp mutfağı ve küçük ekipmanlar',
    'Tüm içerikler',
    'CollectionPage',
    'ItemList',
    'rel="canonical" href="https://www.ibrahimuylas.com/category/doga-yuruyusleri-ve-kamp-ekipmanlari/"',
    'href="/doga-yuruyusleri-icin-gerekli-ekipmanlar/"',
    'href="/yagmurluk-nasil-secilir/"',
    'href="/cadir-alirken-nelere-dikkat-edilmeli/"',
    'href="/ferrino-lightent-2-kamp-cadiri/"',
    'href="/trangia-kamp-tencere-seti/"',
    'href="/xiaomi-mi-arac-sarji/"'
  ]
  const missingEquipmentGuideContent = requiredEquipmentGuideContent.filter(
    value => !equipmentGuide.includes(value)
  )
  const h1Count = (equipmentGuide.match(/<h1\b/gi) || []).length

  if (missingEquipmentGuideContent.length || h1Count !== 1) {
    console.error('Generated equipment guide SSR contract is invalid:')
    missingEquipmentGuideContent.forEach(value =>
      console.error(`- Missing: ${value}`)
    )
    if (h1Count !== 1) {
      console.error(`- Expected one h1, found ${h1Count}`)
    }
    process.exitCode = 1
  } else {
    console.log('Generated equipment guide SSR contract is valid.')
  }
}

const pagefindFailures = []
const articlePages = findPageDataFiles(pageDataDirectory).flatMap(file => {
  const pageData = JSON.parse(fs.readFileSync(file, 'utf8'))
  const { post, translation } = pageData.result?.data || {}
  return post
    ? [{ route: pageData.path, post: localizeArticle(post, translation) }]
    : []
})

const englishSample = routeToHtmlPath(
  publicDirectory,
  '/en/what-does-outdoor-mean/'
)
if (fs.existsSync(englishSample)) {
  const articleHtml = fs.readFileSync(englishSample, 'utf8')
  const visibleArticleText = decodeHtmlText(articleHtml)
  const missingSections = [
    'Tags',
    'Share',
    'Camping guide',
    'Related posts',
    'Get new route and camping guides'
  ].filter(label => !visibleArticleText.includes(label))
  if (missingSections.length || visibleArticleText.includes('(Türkçe)')) {
    pagefindFailures.push(
      `English article layout or link labels failed: missing ${missingSections.join(', ') || 'none'}, parenthesized language labels: ${visibleArticleText.includes('(Türkçe)')}`
    )
  }
}
const eligibleArticleFiles = new Set()
const eligibleCounts = { tr: 0, en: 0 }

articlePages.forEach(({ route, post }) => {
  const articlePath = routeToHtmlPath(publicDirectory, route)

  if (!fs.existsSync(articlePath)) {
    pagefindFailures.push(`${route}: generated article HTML is missing`)
    return
  }

  const html = fs.readFileSync(articlePath, 'utf8')
  const bodyCount = countMatches(html, /\bdata-pagefind-body(?:=""|(?=[\s>]))/g)

  if (post.private === true) {
    if (bodyCount !== 0) {
      pagefindFailures.push(`${route}: private article has a body marker`)
    }
    return
  }

  eligibleArticleFiles.add(articlePath)
  const language = getPageLanguage(route)
  const labels = copy[language]
  eligibleCounts[language] += 1

  if (bodyCount !== 1) {
    pagefindFailures.push(
      `${route}: expected one Pagefind body marker, found ${bodyCount}`
    )
  }

  const scope = extractElement(html, 'data-pagefind-body(?:=""|(?=[\\s>]))')
  const title = extractPagefindMeta(scope || '', 'title')
  const category = extractPagefindMeta(scope || '', 'category')

  if (title.count !== 1 || title.value !== decodeHtmlText(post.title)) {
    pagefindFailures.push(`${route}: title metadata does not match page data`)
  }
  if (
    category.count !== 1 ||
    category.value !== decodeHtmlText(post.category?.name || '')
  ) {
    pagefindFailures.push(
      `${route}: category metadata does not match page data`
    )
  }
  if (!new RegExp(`<html\\b[^>]*\\blang="${language}"`, 'i').test(html)) {
    pagefindFailures.push(
      `${route}: generated document language is not ${language}`
    )
  }
  if (!html.includes('data-pagefind-ignore="index"')) {
    pagefindFailures.push(`${route}: running-head metadata is not ignored`)
  }
  if (!html.includes('data-pagefind-ignore="all"')) {
    pagefindFailures.push(`${route}: article contents are not fully ignored`)
  }

  const deferredEmbedCount = countMatches(html, /\bdata-deferred-embed=/g)
  const fullyIgnoredCount = countMatches(html, /\bdata-pagefind-ignore="all"/g)

  if (fullyIgnoredCount < deferredEmbedCount + 1) {
    pagefindFailures.push(`${route}: a deferred embed is not fully ignored`)
  }

  const searchableScope = scope && removeIgnoredElements(scope)

  if (searchableScope === null) {
    pagefindFailures.push(`${route}: Pagefind ignore markup is unbalanced`)
  } else {
    const scopedText = decodeHtmlText(scope || '')
    const searchableText = decodeHtmlText(searchableScope || '')
    const runningHeadLabels = [
      post.author && `${labels.author} ${post.author.name}`,
      post.category && `${labels.category} ${post.category.name}`,
      post.date && `${labels.published}: ${post.date}`,
      post.modified && `${labels.updated}: ${post.modified}`,
      post.timeToRead && labels.minutes(post.timeToRead)
    ].filter(Boolean)
    const conditionalChromeLabels = [
      'İçindekiler',
      'Haritayı yükle',
      'Videoyu yükle',
      'Contents',
      'Load map',
      'Load video'
    ]
    const countText = (text, label) => text.split(label).length - 1
    const leakedChrome = runningHeadLabels.filter(
      label => countText(scopedText, label) <= countText(searchableText, label)
    )
    leakedChrome.push(
      ...conditionalChromeLabels.filter(
        label =>
          scopedText.includes(label) &&
          countText(scopedText, label) <= countText(searchableText, label)
      )
    )

    if (leakedChrome.length) {
      pagefindFailures.push(
        `${route}: repeated chrome remains searchable (${leakedChrome.join(', ')})`
      )
    }
  }
})

findHtmlFiles(publicDirectory).forEach(file => {
  const html = fs.readFileSync(file, 'utf8')
  const isMarked = /\bdata-pagefind-body(?:=""|(?=[\s>]))/.test(html)
  const shouldBeMarked = eligibleArticleFiles.has(file)

  if (isMarked !== shouldBeMarked) {
    pagefindFailures.push(
      `${path.relative(publicDirectory, file)}: Pagefind eligibility mismatch`
    )
  }
})

const pagefindEntryPath = path.join(pagefindDirectory, 'pagefind-entry.json')
const pagefindArtifactsExist =
  fs.existsSync(pagefindDirectory) &&
  fs.existsSync(path.join(pagefindDirectory, 'pagefind.js')) &&
  fs.existsSync(pagefindEntryPath) &&
  fs.existsSync(path.join(pagefindDirectory, 'wasm.tr.pagefind')) &&
  fs
    .readdirSync(pagefindDirectory)
    .some(file => /^pagefind\.tr_.+\.pf_meta$/.test(file)) &&
  fs.existsSync(path.join(pagefindDirectory, 'index')) &&
  fs
    .readdirSync(path.join(pagefindDirectory, 'index'))
    .some(file => /^tr_.+\.pf_index$/.test(file))

if (!pagefindArtifactsExist) {
  pagefindFailures.push(
    'Turkish Pagefind runtime or index artifacts are missing'
  )
} else {
  const pagefindEntry = JSON.parse(fs.readFileSync(pagefindEntryPath, 'utf8'))
  pagefindFailures.push(
    ...validatePagefindEntry(pagefindEntry, eligibleCounts.tr),
    ...validatePagefindEntry(pagefindEntry, eligibleCounts.en, 'en')
  )
}

if (pagefindFailures.length) {
  console.error('Generated Pagefind article contract is invalid:')
  pagefindFailures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Generated Pagefind article contract is valid (${eligibleCounts.tr} Turkish, ${eligibleCounts.en} English, ${articlePages.length - eligibleArticleFiles.size} private).`
  )
}

const sitemapIndex = fs.readFileSync(
  path.join(publicDirectory, 'sitemap-index.xml'),
  'utf8'
)
const sitemapUrls = new Set(
  [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].flatMap(([, url]) => {
    const sitemap = fs.readFileSync(
      path.join(publicDirectory, path.basename(new URL(url).pathname)),
      'utf8'
    )
    return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  })
)
const siteUrl = 'https://www.ibrahimuylas.com'
const mappedRoutes = new Set(translations.flatMap(({ tr, en }) => [tr, en]))
const anchorIdsByRoute = new Map()
const getAnchorIds = route => {
  if (!anchorIdsByRoute.has(route)) {
    const file = routeToHtmlPath(publicDirectory, route)
    const ids = fs.existsSync(file)
      ? [...fs.readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map(
          ([, id]) => decodeHtmlText(id)
        )
      : []
    anchorIdsByRoute.set(route, new Set(ids))
  }
  return anchorIdsByRoute.get(route)
}
const untranslatedControls = [
  'aria-label="Sayfalama"',
  '>Gömülü içerik<',
  '>Haritayı yükle<',
  '>Videoyu yükle<',
  '>YouTube videosu<'
]
const languageFailures = translations.flatMap(({ tr, en }) =>
  [tr, en].flatMap(route => {
    const language = getPageLanguage(route)
    const file = routeToHtmlPath(publicDirectory, route)
    if (!fs.existsSync(file)) return [`${route}: missing generated HTML`]

    const html = fs.readFileSync(file, 'utf8')
    const canonical = `${siteUrl}${route}`
    const head = html.split('</head>', 1)[0]
    const headLinks = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => tag)
    const hasLink = (rel, href, lang) =>
      headLinks.some(
        tag =>
          tag.includes(`rel="${rel}"`) &&
          tag.includes(`href="${href}"`) &&
          (!lang || tag.toLowerCase().includes(`hreflang="${lang}"`))
      )
    const failures = []
    if (!head.match(/<html\b[^>]*>/i)?.[0].includes(`lang="${language}"`))
      failures.push(`${route}: incorrect HTML language`)
    if (!hasLink('canonical', canonical))
      failures.push(`${route}: missing self-referencing canonical`)
    for (const [lang, alternate] of Object.entries({
      tr,
      en,
      'x-default': tr
    })) {
      if (!hasLink('alternate', `${siteUrl}${alternate}`, lang))
        failures.push(`${route}: missing ${lang} alternate to ${alternate}`)
    }
    if (sitemapUrls.has(canonical) === shouldNoIndex(route))
      failures.push(`${route}: incorrect sitemap inclusion`)

    if (language === 'en') {
      for (const control of untranslatedControls) {
        if (html.includes(control))
          failures.push(`${route}: untranslated control ${control}`)
      }
      for (const [tag, href] of html.matchAll(
        /<a\b[^>]*\shref="([^"]+)"[^>]*>/g
      )) {
        if (
          !href.startsWith('/') &&
          !href.startsWith('#') &&
          !href.startsWith(siteUrl + '/')
        )
          continue
        const url = new URL(decodeHtmlText(href), `${siteUrl}${route}`)
        const target = normalizePath(url.pathname)
        if (url.origin !== siteUrl || !mappedRoutes.has(target)) continue
        if (getPageLanguage(target) === 'tr' && !/\shreflang="tr"/i.test(tag))
          failures.push(
            `${route}: links to Turkish page ${href} without a language indication`
          )
        if (
          url.hash &&
          !getAnchorIds(target).has(decodeURIComponent(url.hash.slice(1)))
        )
          failures.push(`${route}: missing anchor target ${href}`)
      }
    }

    const alternate = language === 'tr' ? en : tr
    const alternateLanguage = getPageLanguage(alternate)
    const languageSwitch =
      extractElement(html, 'data-language-switch="true"') || ''
    const switchLinks = [...languageSwitch.matchAll(/<a\b[^>]*>/gi)].map(
      ([tag]) => tag
    )
    const switchLink = switchLinks.some(
      tag =>
        tag.includes(`href="${alternate}"`) &&
        tag.toLowerCase().includes(`hreflang="${alternateLanguage}"`) &&
        tag.includes(` lang="${alternateLanguage}"`)
    )
    if (!switchLink)
      failures.push(
        `${route}: missing static language switch link to ${alternate}`
      )
    if (
      switchLinks.length !== 2 ||
      !switchLinks.some(
        tag =>
          tag.includes('aria-current="page"') && tag.includes(`href="${route}"`)
      ) ||
      decodeHtmlText(languageSwitch) !== 'TREN'
    )
      failures.push(
        `${route}: expected a compact TR/EN switch with the current language marked`
      )

    return failures
  })
)

const inventory = JSON.parse(
  fs.readFileSync(
    path.resolve(publicDirectory, '../.cache/translation-inventory.json'),
    'utf8'
  )
)
for (const entry of inventory) {
  if (entry.status !== 'translated')
    languageFailures.push(`${entry.tr}: translation status is ${entry.status}`)
}

if (languageFailures.length) {
  console.error('Generated language pairs are invalid:')
  languageFailures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Generated language pairs are valid (${translations.length} pairs).`
  )
}
