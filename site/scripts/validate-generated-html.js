const fs = require('node:fs')
const path = require('node:path')

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

const findHtmlFiles = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) return findHtmlFiles(entryPath)
    return entry.name.endsWith('.html') ? [entryPath] : []
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
