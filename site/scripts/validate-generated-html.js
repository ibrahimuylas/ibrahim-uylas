const fs = require('node:fs')
const path = require('node:path')
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
const campingGuidePath = path.join(
  publicDirectory,
  'category',
  'kampcilik',
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

if (!fs.existsSync(homepagePath)) {
  console.error('Generated homepage HTML is missing.')
  process.exitCode = 1
} else {
  const homepage = fs.readFileSync(homepagePath, 'utf8')
  const requiredHomepageContent = [
    'Yolda beni takip et',
    'İbrahim Uylaş',
    '@uylasonwheels',
    'Londra’dan vahşi doğaya',
    'Son 6 paylaşım',
    'https://www.instagram.com/uylasonwheels/',
    'https://ig.me/m/uylasonwheels'
  ]
  const missingContent = requiredHomepageContent.filter(
    value => !homepage.includes(value)
  )
  const showcasePosition = homepage.indexOf('Yolda beni takip et')
  const campingPosition = homepage.lastIndexOf('Kampçılık', showcasePosition)
  const hikingPosition = homepage.indexOf('Doğa Yürüyüşleri', showcasePosition)
  const categoryOrderIsValid =
    campingPosition !== -1 &&
    showcasePosition > campingPosition &&
    hikingPosition > showcasePosition

  if (
    missingContent.length ||
    !categoryOrderIsValid ||
    /<iframe\b/i.test(homepage)
  ) {
    console.error('Generated homepage Instagram SSR contract is invalid:')
    missingContent.forEach(value => console.error(`- Missing: ${value}`))
    if (!categoryOrderIsValid) {
      console.error('- Expected Kampçılık, showcase, Doğa Yürüyüşleri order')
    }
    if (/<iframe\b/i.test(homepage)) {
      console.error('- Homepage contains an iframe')
    }
    process.exitCode = 1
  } else {
    console.log('Generated homepage Instagram SSR contract is valid.')
  }
}

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
    'href="/kamp-hayatina-bulasmak-ister-misiniz/"',
    'href="/outdoor-ne-demek/"',
    'href="/r-degeri-nedir/"',
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

const pagefindFailures = []
const articlePages = findPageDataFiles(pageDataDirectory).flatMap(file => {
  const pageData = JSON.parse(fs.readFileSync(file, 'utf8'))
  const post = pageData.result?.data?.post

  return post ? [{ route: pageData.path, post }] : []
})
const eligibleArticleFiles = new Set()

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
  if (!/<html\b[^>]*\blang="tr"/i.test(html)) {
    pagefindFailures.push(
      `${route}: generated document language is not Turkish`
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
      `Yazan ${post.author?.name || ''}`.trim(),
      `Kategori ${post.category?.name || ''}`.trim(),
      post.date ? `Yayımlandı: ${post.date}` : null,
      post.modified ? `Güncellendi: ${post.modified}` : null,
      post.timeToRead ? `${post.timeToRead} dk` : null
    ].filter(Boolean)
    const conditionalChromeLabels = [
      'İçindekiler',
      'Haritayı yükle',
      'Videoyu yükle'
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
    ...validatePagefindEntry(pagefindEntry, eligibleArticleFiles.size)
  )
}

if (pagefindFailures.length) {
  console.error('Generated Pagefind article contract is invalid:')
  pagefindFailures.forEach(failure => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log(
    `Generated Pagefind article contract is valid (${eligibleArticleFiles.size} eligible, ${articlePages.length - eligibleArticleFiles.size} private).`
  )
}
