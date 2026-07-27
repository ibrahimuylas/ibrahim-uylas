const fs = require('fs')
const path = require('path')

const siteRoot = path.resolve(__dirname, '../..')
const publicRoot = path.join(siteRoot, 'public')
const fixturePath = path.join(__dirname, 'likya-canonical-inventory.json')
const retiredFixturePath = path.join(__dirname, 'likya-retired-redirects.json')
const redirectsPath = path.join(siteRoot, '.cache', 'redirects.json')
const staticRedirectsPath = path.join(siteRoot, 'static', '_redirects')
const builtRedirectsPath = path.join(publicRoot, '_redirects')
const sitemapPath = path.join(publicRoot, 'sitemap-0.xml')
const siteUrl = 'https://www.ibrahimuylas.com'

const expectedKindCounts = {
  hub: 1,
  itinerary: 1,
  guide: 11,
  journal: 11,
  support: 5
}

const failures = []
const warnings = []
const fail = message => failures.push(message)
const warn = message => warnings.push(message)

const readJson = filePath => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(
      `Could not read ${path.relative(siteRoot, filePath)}: ${error.message}`
    )
    return null
  }
}

const readSourceTitle = sourcePath => {
  const contents = fs.readFileSync(sourcePath, 'utf8')
  const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const title = frontmatter && frontmatter[1].match(/^title:\s*(.+?)\s*$/m)

  return title && title[1].replace(/^(['"])(.*)\1$/, '$2')
}

const frontmatterValue = (contents, field) => {
  const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const value =
    frontmatter &&
    frontmatter[1].match(new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'))

  return value && value[1].replace(/^(['"])(.*)\1$/, '$2')
}

const markdownBody = contents =>
  contents.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '')

const markdownSection = (contents, heading) => {
  const lines = contents.split(/\r?\n/)
  const start = lines.findIndex(line => line.trim() === heading)
  if (start === -1) return ''

  const level = heading.match(/^#+/)?.[0].length || 6
  const end = lines.findIndex(
    (line, index) => index > start && new RegExp(`^#{1,${level}}\\s`).test(line)
  )

  return lines.slice(start + 1, end === -1 ? lines.length : end).join('\n')
}

const answerFirstOpening = contents => {
  const lines = markdownBody(contents).split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line || /^(?:#{1,6}\s|>|[-*+]\s|\d+\.\s|`|!\[)/.test(line)) {
      continue
    }

    const paragraph = [line]
    for (let next = index + 1; next < lines.length; next += 1) {
      const nextLine = lines[next].trim()
      if (!nextLine) break
      paragraph.push(nextLine)
    }
    return normalizeText(paragraph.join(' '))
  }

  return ''
}

const pageDataPathFor = canonical =>
  path.join(
    publicRoot,
    'page-data',
    canonical.replace(/^\/+|\/+$/g, ''),
    'page-data.json'
  )

const htmlPathFor = canonical =>
  path.join(publicRoot, canonical.replace(/^\/+|\/+$/g, ''), 'index.html')

const markdownLinkEntries = contents => {
  const links = []
  const linkPattern =
    /(?<!!)\[([^\]]+)\]\(<?([^\s)>]+)>?(?:\s+['"][^'"]*['"])?\)/g
  let match

  while ((match = linkPattern.exec(contents))) {
    links.push({ label: match[1], href: match[2] })
  }

  return links
}

const markdownLinks = contents =>
  markdownLinkEntries(contents).map(({ href }) => href)

const markdownImageEntries = contents => {
  const images = []
  const imagePattern =
    /!\[([^\]]*)\]\(<?([^\s)>]+)>?(?:\s+['"]([^'"]*)['"])?\)/g
  let match

  while ((match = imagePattern.exec(contents))) {
    images.push({ alt: normalizeText(match[1]), src: match[2] })
  }

  return images
}

const netlifyRedirects = filePath => {
  let contents

  try {
    contents = fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    fail(
      `Could not read ${path.relative(siteRoot, filePath)}: ${error.message}`
    )
    return []
  }

  return contents
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, value: line.trim() }))
    .filter(({ value }) => value && !value.startsWith('#'))
    .map(({ line, value }) => {
      const fields = value.split(/\s+/)
      if (fields.length !== 3) {
        fail(
          `${path.relative(
            siteRoot,
            filePath
          )}:${line} must contain source, destination, and status`
        )
      }

      return {
        from: fields[0],
        to: fields[1],
        status: fields[2]
      }
    })
}

const canonicalHref = canonical => `${siteUrl}${canonical}`

const htmlCanonicalHrefs = contents => {
  const hrefs = []
  const linkPattern = /<link\b[^>]*>/gi
  let match

  while ((match = linkPattern.exec(contents))) {
    const tag = match[0]
    if (!/\brel=["']canonical["']/i.test(tag)) continue
    const href = tag.match(/\bhref=["']([^"']+)["']/i)
    if (href) hrefs.push(href[1])
  }

  return hrefs
}

const htmlMetaContents = (contents, attribute, value) => {
  const matches = []
  const metaPattern = /<meta\b[^>]*>/gi
  let match

  while ((match = metaPattern.exec(contents))) {
    const tag = match[0]
    const key = tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))
    if (!key || key[1] !== value) continue
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)
    if (content) matches.push(decodeHtmlText(content[1]))
  }

  return matches
}

const normalizeText = contents =>
  contents
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const decodeHtmlText = contents =>
  normalizeText(
    contents
      .replace(/<[^>]+>/g, '')
      .replace(/&(?:#0*39|#x0*27|apos);/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/[‘’]/g, "'")
  )

const htmlLinkEntries = contents => {
  const links = []
  const linkPattern = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match

  while ((match = linkPattern.exec(contents))) {
    links.push({ href: match[1], label: decodeHtmlText(match[2]) })
  }

  return links
}

const htmlIframeSources = contents => {
  const sources = []
  const iframePattern = /<iframe\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi
  const deferredPattern = /\bdata-deferred-src=["']([^"']+)["']/gi
  let match

  while ((match = iframePattern.exec(contents))) {
    sources.push(match[1].replace(/&amp;/gi, '&'))
  }
  while ((match = deferredPattern.exec(contents))) {
    sources.push(match[1].replace(/&amp;/gi, '&'))
  }

  return sources
}

const htmlResponsiveImageAlts = contents => {
  const alts = []
  const imagePattern = /<img\b[^>]*>/gi
  let match

  while ((match = imagePattern.exec(contents))) {
    const tag = match[0]
    if (!/\bclass=["'][^"']*gatsby-resp-image-image\b/i.test(tag)) continue
    const alt = tag.match(/\balt=["']([^"']*)["']/i)
    alts.push(alt ? decodeHtmlText(alt[1]) : null)
  }

  return alts
}

const jsonLdEntries = contents => {
  const entries = []
  const scriptPattern =
    /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match

  while ((match = scriptPattern.exec(contents))) {
    try {
      entries.push(JSON.parse(match[1]))
    } catch (error) {
      fail(`Invalid JSON-LD: ${error.message}`)
    }
  }

  return entries
}

const headingLevels = contents => {
  const levels = []
  const headingPattern = /<h([1-6])\b[^>]*>/gi
  let match

  while ((match = headingPattern.exec(contents))) {
    levels.push(Number(match[1]))
  }

  return levels
}

const internalPath = href => {
  if (href.startsWith('/')) {
    return new URL(href, siteUrl).pathname
  }

  try {
    const url = new URL(href)
    return url.origin === siteUrl ? url.pathname : null
  } catch {
    return null
  }
}

const generatedHtmlPathFor = hrefPath => {
  if (hrefPath === '/') return path.join(publicRoot, 'index.html')
  return htmlPathFor(hrefPath)
}

const turkishDate = isoDate => {
  const months = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
  ]
  const [year, month, day] = isoDate.split('-').map(Number)

  return `${day} ${months[month - 1]} ${year}`
}

const itineraryDayBlock = (contents, day) => {
  const normalized = normalizeText(contents)
  const start = normalized.indexOf(`**${day}.Gün`)
  const end =
    day === 11 ? normalized.length : normalized.indexOf(`**${day + 1}.Gün`)

  return start === -1 || end === -1 ? '' : normalized.slice(start, end)
}

const stageEndpoints = stage =>
  stage.section.split(' – ').map(value => value.toLocaleLowerCase('tr-TR'))

const containsStageEndpoints = (contents, stage) => {
  const normalized = normalizeText(contents).toLocaleLowerCase('tr-TR')

  return stageEndpoints(stage).every(endpoint => normalized.includes(endpoint))
}

const containsExactStageDistance = (contents, stage) => {
  const normalized = normalizeText(contents).toLocaleLowerCase('tr-TR')
  const distance = new RegExp(
    `(^|[^\\d.])${stage.distanceKm}(?:\\.0+)?\\s*km(?![\\d.])`
  )

  return distance.test(normalized)
}

const containsStageFacts = (contents, stage) => {
  const normalized = normalizeText(contents).toLocaleLowerCase('tr-TR')

  return (
    normalized.includes(turkishDate(stage.date).toLocaleLowerCase('tr-TR')) &&
    containsStageEndpoints(contents, stage) &&
    containsExactStageDistance(contents, stage)
  )
}

const inventory = readJson(fixturePath)
const retiredRedirects = readJson(retiredFixturePath)

if (!Array.isArray(retiredRedirects)) {
  fail('The retired redirect inventory must be a JSON array')
}

if (!Array.isArray(inventory)) {
  fail('The canonical inventory must be a JSON array')
} else {
  if (inventory.length !== 29) {
    fail(`Expected 29 retained inventory entries, found ${inventory.length}`)
  }

  const canonicalPaths = new Set()
  const sourcePaths = new Set()
  const sourceTitles = new Set()
  const sourceOpenings = new Set()
  const renderedDescriptions = new Set()
  const kindCounts = {}

  inventory.forEach(entry => {
    const { canonical, kind, source } = entry
    const canonicalIsValid =
      typeof canonical === 'string' && /^\/[a-z0-9./-]+\/$/.test(canonical)

    if (!Object.hasOwn(expectedKindCounts, kind)) {
      fail(`Unknown inventory kind "${kind}" for ${source || 'missing source'}`)
    }
    kindCounts[kind] = (kindCounts[kind] || 0) + 1

    if (!canonicalIsValid) {
      fail(
        `Invalid canonical path for ${source || 'missing source'}: ${canonical}`
      )
    } else if (canonicalPaths.has(canonical)) {
      fail(`Duplicate canonical path: ${canonical}`)
    } else {
      canonicalPaths.add(canonical)
    }

    if (typeof source !== 'string' || sourcePaths.has(source)) {
      fail(`Missing or duplicate source path: ${source}`)
      return
    }
    sourcePaths.add(source)

    const absoluteSource = path.join(siteRoot, source)
    if (!fs.existsSync(absoluteSource)) {
      fail(`Missing source: ${source}`)
      return
    }

    const sourceContents = fs.readFileSync(absoluteSource, 'utf8')
    const sourceTitle = readSourceTitle(absoluteSource)
    const explicitSlug = frontmatterValue(sourceContents, 'slug')
    const publishedDate = frontmatterValue(sourceContents, 'date')?.slice(0, 10)
    const modifiedDate = frontmatterValue(sourceContents, 'modified')
    const sourceOpening = answerFirstOpening(sourceContents)
    const expectedExplicitSlug = canonical?.replace(/^\/|\/$/g, '')

    if (!sourceTitle) {
      fail(`Missing frontmatter title: ${source}`)
    } else if (sourceTitles.has(sourceTitle)) {
      fail(`Duplicate source title: ${sourceTitle}`)
    } else {
      sourceTitles.add(sourceTitle)
    }

    if (!explicitSlug || explicitSlug !== expectedExplicitSlug) {
      fail(
        `${source} must lock canonical ${canonical} with explicit slug "${expectedExplicitSlug}"; found "${explicitSlug}"`
      )
    }
    if (modifiedDate !== '2026-07-22') {
      fail(
        `${source} must declare its substantive review date as 2026-07-22; found "${modifiedDate}"`
      )
    }
    if (!publishedDate) {
      fail(`${source} is missing its original publication date`)
    }
    if (sourceOpening.length < 80) {
      fail(`${source} is missing a useful answer-first opening`)
    } else if (sourceOpenings.has(sourceOpening)) {
      fail(`${source} repeats another retained page's answer-first opening`)
    } else {
      sourceOpenings.add(sourceOpening)
    }

    if (!canonicalIsValid) return

    const pageDataPath = pageDataPathFor(canonical)
    const pageData = readJson(pageDataPath)
    const builtPost = pageData?.result?.data?.post

    if (pageData && pageData.path !== canonical) {
      fail(`Built page path differs for ${source}: ${pageData.path}`)
    }
    if (!builtPost) {
      fail(`Built article data is missing for ${canonical}`)
    } else {
      if (builtPost.slug !== canonical) {
        fail(`Resolved GraphQL slug differs for ${source}: ${builtPost.slug}`)
      }
      if (sourceTitle && builtPost.title !== sourceTitle) {
        fail(
          `Built title does not match ${source}: "${builtPost.title}" versus "${sourceTitle}"`
        )
      }
      if (builtPost.datePublished !== publishedDate) {
        fail(
          `Built publication date differs for ${source}: ${builtPost.datePublished} versus ${publishedDate}`
        )
      }
      if (builtPost.dateModified !== modifiedDate) {
        fail(
          `Built modification date differs for ${source}: ${builtPost.dateModified} versus ${modifiedDate}`
        )
      }
      if (!builtPost.date || !builtPost.modified) {
        fail(`${source} must expose visible publication and modification dates`)
      }
    }

    const generatedHtmlPath = htmlPathFor(canonical)
    if (!fs.existsSync(generatedHtmlPath)) {
      fail(`Generated HTML is missing for ${canonical}`)
    } else {
      const html = fs.readFileSync(generatedHtmlPath, 'utf8')
      const descriptions = htmlMetaContents(html, 'name', 'description')
      const renderedText = decodeHtmlText(html)
      const expectedDescription = decodeHtmlText(builtPost?.excerpt || '')

      if (
        descriptions.length !== 1 ||
        !normalizeText(descriptions[0]) ||
        normalizeText(descriptions[0]) !== expectedDescription
      ) {
        fail(`${canonical} must render one generated nonempty meta description`)
      } else if (renderedDescriptions.has(normalizeText(descriptions[0]))) {
        fail(`${canonical} repeats another retained page's meta description`)
      } else {
        renderedDescriptions.add(normalizeText(descriptions[0]))
      }

      if (
        !renderedText.includes(`Yayımlandı: ${builtPost?.date}`) ||
        !renderedText.includes(`Güncellendi: ${builtPost?.modified}`)
      ) {
        fail(
          `${canonical} must label publication and modification dates visibly`
        )
      }
    }
  })

  Object.entries(expectedKindCounts).forEach(([kind, expected]) => {
    const actual = kindCounts[kind] || 0
    if (actual !== expected) {
      fail(`Expected ${expected} ${kind} entries, found ${actual}`)
    }
  })

  const journals = inventory
    .filter(entry => entry.kind === 'journal')
    .sort((a, b) => a.day - b.day)
  const guides = inventory
    .filter(entry => entry.kind === 'guide')
    .sort((a, b) => a.day - b.day)
  const expectedDays = Array.from({ length: 11 }, (_, index) => index + 1)

  for (const entries of [journals, guides]) {
    const days = entries.map(entry => entry.day).sort((a, b) => a - b)
    if (JSON.stringify(days) !== JSON.stringify(expectedDays)) {
      fail(
        `${entries[0] && entries[0].kind} entries must cover days 1 through 11`
      )
    }
  }

  const aliases = new Set()

  journals.forEach(({ alias, canonical, day }) => {
    if (canonical !== `/likya-yolu-${day}.-gun/`) {
      fail(`Day ${day} must retain its dotted journal canonical: ${canonical}`)
    }
    if (alias !== `/likya-yolu-${day}-gun/`) {
      fail(`Day ${day} must declare its clean journal alias: ${alias}`)
    } else if (aliases.has(alias)) {
      fail(`Duplicate journal alias: ${alias}`)
    } else {
      aliases.add(alias)
    }
  })

  const hub = inventory.find(entry => entry.kind === 'hub')
  const itinerary = inventory.find(entry => entry.kind === 'itinerary')
  const sourceRedirects = netlifyRedirects(staticRedirectsPath)
  const guideOpeningHeadings = new Set()
  const guideOpeningParagraphs = new Set()
  const guideEditorialHeadings = [
    '### Etap özeti',
    '### Arazi, zorluk ve yön bulma',
    '### Su ve yiyecek — 2014 kaydı',
    '### Konaklama, kamp ve çıkış — 2014 kaydı',
    '### Öne çıkan yerler',
    '### Bu etaptan çıkarılan ders',
    '### 2014 saha notları ve rota çizimi'
  ]
  const unverifiedCurrentStatus =
    '- **Güncel doğrulama:** Yapılmadı; güncel koşullar ve bunları doğrulayacak kaynak bu çalışmada belirlenmedi.'

  guides.forEach((guide, index) => {
    const previousGuide = guides[index - 1]
    const nextGuide = guides[index + 1]
    const journal = journals.find(entry => entry.day === guide.day)
    const compactSection = guide.section.replace(/ – /g, '–')
    const expectedNavigation = []

    if (previousGuide) {
      expectedNavigation.push({
        label: `Önceki etap: ${previousGuide.section.replace(
          / – /g,
          '–'
        )} etap rehberi`,
        href: previousGuide.canonical
      })
    }
    if (hub) {
      expectedNavigation.push({
        label: "Ana rota: Likya Yolu'nun 11 etaplık rota rehberi",
        href: hub.canonical
      })
    }
    if (journal) {
      expectedNavigation.push({
        label: `${guide.day}. gün günlüğü: ${compactSection} yürüyüşü`,
        href: journal.canonical
      })
    }
    if (nextGuide) {
      expectedNavigation.push({
        label: `Sonraki etap: ${nextGuide.section.replace(
          / – /g,
          '–'
        )} etap rehberi`,
        href: nextGuide.canonical
      })
    }

    const guidePath = path.join(siteRoot, guide.source)
    const guideContents = fs.readFileSync(guidePath, 'utf8')
    const guideOpening =
      guideContents.match(
        /^##\s+(.+?)\s*$\r?\n\r?\n([\s\S]*?)\r?\n\r?\n> \*\*Tarihsel saha kaydı:\*\*/m
      ) || []
    const guideOpeningHeading = guideOpening[1] || ''
    const guideOpeningParagraph = normalizeText(guideOpening[2] || '')
    const guideEditorialWrapper =
      guideContents.match(
        /^##\s+.+?\s*$[\s\S]*?(?=^### 2014 saha notları ve rota çizimi\s*$)/m
      )?.[0] || ''
    const guideRouteHeading =
      guideContents.match(/^####\s+(.+?)\s*$/m)?.[1] || ''
    const sourceNavigation = markdownLinkEntries(guideContents)
    const navigationHeadingCount = (
      guideContents.match(/^## Likya Yolu etap navigasyonu\s*$/gm) || []
    ).length

    if (navigationHeadingCount !== 1) {
      fail(
        `Day ${guide.day} guide must contain one series-navigation heading; found ${navigationHeadingCount}`
      )
    }
    if (/okumak için buradan devam edin/i.test(guideContents)) {
      fail(`Day ${guide.day} guide still contains a generic journal anchor`)
    }
    if (
      /Likya yolu Fethiye’den başlayıp Antalya’ya kadar uzanan/i.test(
        guideContents
      )
    ) {
      fail(`Day ${guide.day} guide still contains the repeated generic opening`)
    }
    if (!guideOpeningHeading || !guideOpeningParagraph) {
      fail(
        `Day ${guide.day} guide is missing its answer-first editorial opening`
      )
    } else {
      if (guideOpeningHeadings.has(guideOpeningHeading)) {
        fail(`Day ${guide.day} guide repeats an editorial opening heading`)
      }
      if (guideOpeningParagraphs.has(guideOpeningParagraph)) {
        fail(`Day ${guide.day} guide repeats an editorial opening paragraph`)
      }
      guideOpeningHeadings.add(guideOpeningHeading)
      guideOpeningParagraphs.add(guideOpeningParagraph)
    }
    if (!containsStageEndpoints(guideEditorialWrapper, guide)) {
      fail(
        `Day ${guide.day} editorial wrapper does not name the checked section endpoints`
      )
    }
    if (
      !guideContents.includes(
        `> **Tarihsel saha kaydı:** Aşağıdaki pratik bilgiler ${turkishDate(
          guide.date
        )} deneyimine dayanır.`
      ) ||
      !guideContents.includes('güncel bilgi olarak kullanılmamalıdır.')
    ) {
      fail(`Day ${guide.day} guide is missing its dated historical-use warning`)
    }
    const expectedChecklistFacts = [
      `- **Etap sırası:** ${guide.day} / 11`,
      `- **Başlangıç ve bitiş:** ${guide.section}`,
      `- **Mesafe:** Tabelalardan hesaplanan ${guide.distanceKm} km`,
      '- **Yürüyüş süresi:**',
      `- **Deneyim tarihi:** ${turkishDate(guide.date)}`,
      unverifiedCurrentStatus
    ]
    expectedChecklistFacts.forEach(fact => {
      const occurrences = guideContents.split(fact).length - 1
      if (occurrences !== 1) {
        fail(
          `Day ${guide.day} guide checklist must contain "${fact}" once; found ${occurrences}`
        )
      }
    })
    guideEditorialHeadings.forEach(heading => {
      const occurrences = guideContents.split(heading).length - 1
      if (occurrences !== 1) {
        fail(
          `Day ${guide.day} guide must contain "${heading}" once; found ${occurrences}`
        )
      }
    })
    if (
      !containsStageEndpoints(guideRouteHeading, guide) ||
      !containsExactStageDistance(guideRouteHeading, guide)
    ) {
      fail(
        `Day ${guide.day} guide route heading differs from the checked section or distance`
      )
    }
    const expectedExperienceNote = `Not: Bu bilgiler ${turkishDate(
      guide.date
    )} tarihli yürüyüşe aittir.`
    const experienceNoteOccurrences =
      guideContents.split(expectedExperienceNote).length - 1
    if (experienceNoteOccurrences !== 1) {
      fail(
        `Day ${guide.day} guide must contain the checked experience date once; found ${experienceNoteOccurrences}`
      )
    }
    if (!containsStageFacts(guideContents, guide)) {
      fail(`Day ${guide.day} guide facts differ from the stage matrix`)
    }
    if (
      JSON.stringify(sourceNavigation) !== JSON.stringify(expectedNavigation)
    ) {
      fail(`Day ${guide.day} guide navigation differs from the checked series`)
    }
    if (
      (
        guideContents.match(/wikiloc\.com\/wikiloc\/spatialArtifacts\.do/g) ||
        []
      ).length !== 1
    ) {
      fail(`Day ${guide.day} guide must retain its Wikiloc embed`)
    }

    expectedNavigation.forEach(({ href }) => {
      if (!canonicalPaths.has(href)) {
        fail(
          `Day ${guide.day} guide link is not a collection canonical: ${href}`
        )
      }
      if (sourceRedirects.some(redirect => redirect.from === href)) {
        fail(
          `Day ${guide.day} guide link ends in a documented redirect: ${href}`
        )
      }
    })

    let guideHtml = ''
    try {
      guideHtml = fs.readFileSync(htmlPathFor(guide.canonical), 'utf8')
    } catch (error) {
      fail(
        `Could not read generated guide HTML for ${guide.canonical}: ${error.message}`
      )
    }

    if (
      !/<h2\b[^>]*>[\s\S]*?Likya Yolu etap navigasyonu[\s\S]*?<\/h2>/i.test(
        guideHtml
      )
    ) {
      fail(`Day ${guide.day} rendered guide is missing its navigation heading`)
    }

    const renderedGuideText = decodeHtmlText(guideHtml)
    const expectedRenderedChecklist = [
      `Etap sırası: ${guide.day} / 11`,
      `Başlangıç ve bitiş: ${guide.section}`,
      `Mesafe: Tabelalardan hesaplanan ${guide.distanceKm} km`,
      'Yürüyüş süresi:',
      `Deneyim tarihi: ${turkishDate(guide.date)}`,
      unverifiedCurrentStatus.replace(/^- |\*\*/g, '')
    ]
    expectedRenderedChecklist.forEach(fact => {
      if (!renderedGuideText.includes(fact)) {
        fail(`Day ${guide.day} rendered guide is missing "${fact}"`)
      }
    })

    const guideLevels = headingLevels(guideHtml)
    for (
      let headingIndex = 1;
      headingIndex < guideLevels.length;
      headingIndex += 1
    ) {
      if (guideLevels[headingIndex] > guideLevels[headingIndex - 1] + 1) {
        fail(
          `Day ${guide.day} rendered guide skips H${
            guideLevels[headingIndex - 1]
          } to H${guideLevels[headingIndex]}`
        )
        break
      }
    }

    const renderedLinks = htmlLinkEntries(guideHtml)
    expectedNavigation.forEach(expectedLink => {
      const occurrences = renderedLinks.filter(
        link =>
          link.href === expectedLink.href && link.label === expectedLink.label
      ).length
      if (occurrences !== 1) {
        fail(
          `Day ${guide.day} rendered navigation must contain "${expectedLink.label}" once; found ${occurrences}`
        )
      }
    })
  })

  const expectedJournalImageCounts = [2, 2, 2, 3, 2, 5, 3, 5, 3, 2, 3]
  const journalImageAlts = new Set()
  let journalImageCount = 0

  journals.forEach((journal, index) => {
    const previousJournal = journals[index - 1]
    const nextJournal = journals[index + 1]
    const guide = guides.find(entry => entry.day === journal.day)
    const expectedNavigation = []

    if (!guide) {
      fail(`Day ${journal.day} journal has no matching checked guide`)
      return
    }

    if (previousJournal) {
      const previousGuide = guides.find(
        entry => entry.day === previousJournal.day
      )
      expectedNavigation.push({
        label: `Önceki gün: ${previousJournal.day}. gün ${previousGuide.section} günlüğü`,
        href: previousJournal.canonical
      })
    }
    if (itinerary) {
      expectedNavigation.push({
        label: '11 günlük yürüyüş dizini: Ölüdeniz – Kaleüçağız parkuru',
        href: itinerary.canonical
      })
    }
    if (hub) {
      expectedNavigation.push({
        label: "Ana rota: Likya Yolu'nun 11 etaplık rota rehberi",
        href: hub.canonical
      })
    }
    expectedNavigation.push({
      label: `Pratik etap rehberi: ${guide.section} yürüyüşü`,
      href: guide.canonical
    })
    if (nextJournal) {
      const nextGuide = guides.find(entry => entry.day === nextJournal.day)
      expectedNavigation.push({
        label: `Sonraki gün: ${nextJournal.day}. gün ${nextGuide.section} günlüğü`,
        href: nextJournal.canonical
      })
    }

    const journalPath = path.join(siteRoot, journal.source)
    const journalContents = fs.readFileSync(journalPath, 'utf8')
    const sourceNavigation = markdownLinkEntries(
      markdownSection(journalContents, '### Likya Yolu günlük navigasyonu')
    )
    const continuationHeading = nextJournal
      ? '## Yürüyüşe devam et'
      : '## Yürüyüşün tamamına dön'
    const continuationNavigation = markdownLinkEntries(
      markdownSection(journalContents, continuationHeading)
    )
    const expectedContinuationNavigation = nextJournal
      ? [
          {
            label: `Sonraki gün: ${nextJournal.day}. gün ${guides
              .find(entry => entry.day === nextJournal.day)
              .section.replace(/\s+[–-]\s+/g, '–')} günlüğü →`,
            href: nextJournal.canonical
          },
          {
            label: '11 günlük yürüyüş dizinine dön',
            href: itinerary.canonical
          }
        ]
      : [
          {
            label:
              '11 günlük Ölüdeniz–Kaleüçağız parkurunu ve tüm günlükleri gör →',
            href: itinerary.canonical
          },
          {
            label: 'Likya Yolu ana rota rehberine dön',
            href: hub.canonical
          }
        ]
    const sourceImages = markdownImageEntries(journalContents)
    const quickFactsHeadingCount = (
      journalContents.match(/^## 2014 yürüyüş günlüğü: hızlı bilgiler\s*$/gm) ||
      []
    ).length
    const navigationHeadingCount = (
      journalContents.match(/^### Likya Yolu günlük navigasyonu\s*$/gm) || []
    ).length
    const expectedFacts = [
      `- **Gün:** ${journal.day}`,
      `- **Tarih:** ${turkishDate(guide.date)}`,
      `- **Etap:** ${guide.section}`,
      `- **Mesafe:** ${guide.distanceKm} km`
    ]

    journalImageCount += sourceImages.length
    if (sourceImages.length !== expectedJournalImageCounts[index]) {
      fail(
        `Day ${journal.day} journal must contain ${expectedJournalImageCounts[index]} body images; found ${sourceImages.length}`
      )
    }
    sourceImages.forEach(({ alt, src }) => {
      if (!alt) {
        fail(`Day ${journal.day} journal image has an empty alt: ${src}`)
      } else if (journalImageAlts.has(alt)) {
        fail(`Day ${journal.day} journal image repeats an alt: ${alt}`)
      } else {
        journalImageAlts.add(alt)
      }
      if (!fs.existsSync(path.resolve(path.dirname(journalPath), src))) {
        fail(`Day ${journal.day} journal image is missing: ${src}`)
      }
    })

    if (quickFactsHeadingCount !== 1) {
      fail(
        `Day ${journal.day} journal must contain one quick-facts heading; found ${quickFactsHeadingCount}`
      )
    }
    if (navigationHeadingCount !== 1) {
      fail(
        `Day ${journal.day} journal must contain one series-navigation heading; found ${navigationHeadingCount}`
      )
    }
    const journalBody = markdownBody(journalContents)
    const quickFactsOffset = journalBody.indexOf(
      '## 2014 yürüyüş günlüğü: hızlı bilgiler'
    )
    if (quickFactsOffset === -1 || quickFactsOffset > 500) {
      fail(
        `Day ${journal.day} journal quick facts must follow its answer-first opening`
      )
    }
    if (
      !journalContents.includes(
        '> **Editoryal bağlam:** Bu sayfadaki günlük notları 2014 yürüyüşü sırasında yazıldı; aşağıdaki bilgiler dönemin etap kaydını özetler.'
      )
    ) {
      fail(`Day ${journal.day} journal is missing its historical context note`)
    }
    expectedFacts.forEach(fact => {
      const occurrences = journalContents.split(fact).length - 1
      if (occurrences !== 1) {
        fail(
          `Day ${journal.day} journal quick facts must contain "${fact}" once; found ${occurrences}`
        )
      }
    })
    if (
      JSON.stringify(sourceNavigation) !== JSON.stringify(expectedNavigation)
    ) {
      fail(
        `Day ${journal.day} journal navigation differs from the checked series`
      )
    }
    if (
      JSON.stringify(continuationNavigation) !==
      JSON.stringify(expectedContinuationNavigation)
    ) {
      fail(
        `Day ${journal.day} journal end navigation differs from the checked series`
      )
    }

    ;[...expectedNavigation, ...expectedContinuationNavigation].forEach(
      ({ href }) => {
        if (!canonicalPaths.has(href)) {
          fail(
            `Day ${journal.day} journal link is not a collection canonical: ${href}`
          )
        }
        if (sourceRedirects.some(redirect => redirect.from === href)) {
          fail(
            `Day ${journal.day} journal link ends in a documented redirect: ${href}`
          )
        }
        if (!fs.existsSync(htmlPathFor(href))) {
          fail(
            `Day ${journal.day} journal link has no generated canonical page: ${href}`
          )
        }
      }
    )

    let journalHtml = ''
    try {
      journalHtml = fs.readFileSync(htmlPathFor(journal.canonical), 'utf8')
    } catch (error) {
      fail(
        `Could not read generated journal HTML for ${journal.canonical}: ${error.message}`
      )
    }

    if (
      !/<h2\b[^>]*>[\s\S]*?2014 yürüyüş günlüğü: hızlı bilgiler[\s\S]*?<\/h2>/i.test(
        journalHtml
      )
    ) {
      fail(`Day ${journal.day} rendered journal is missing its quick facts`)
    }
    if (
      !/<h3\b[^>]*>[\s\S]*?Likya Yolu günlük navigasyonu[\s\S]*?<\/h3>/i.test(
        journalHtml
      )
    ) {
      fail(
        `Day ${journal.day} rendered journal is missing its navigation heading`
      )
    }

    const renderedText = decodeHtmlText(journalHtml)
    const expectedRenderedFacts = [
      `Gün: ${journal.day}`,
      `Tarih: ${turkishDate(guide.date)}`,
      `Etap: ${guide.section}`,
      `Mesafe: ${guide.distanceKm} km`
    ]
    expectedRenderedFacts.forEach(fact => {
      if (!renderedText.includes(fact)) {
        fail(`Day ${journal.day} rendered journal is missing "${fact}"`)
      }
    })

    const renderedLinks = htmlLinkEntries(journalHtml)
    expectedNavigation.forEach(expectedLink => {
      const occurrences = renderedLinks.filter(
        link =>
          link.href === expectedLink.href && link.label === expectedLink.label
      ).length
      if (occurrences !== 1) {
        fail(
          `Day ${journal.day} rendered navigation must contain "${expectedLink.label}" once; found ${occurrences}`
        )
      }
    })

    const renderedImageAlts = htmlResponsiveImageAlts(journalHtml)
    const expectedImageAlts = sourceImages.map(({ alt }) => alt)
    if (
      JSON.stringify(renderedImageAlts) !== JSON.stringify(expectedImageAlts)
    ) {
      fail(
        `Day ${journal.day} rendered image accessible names differ from the journal source`
      )
    }
  })

  if (journalImageCount !== 32 || journalImageAlts.size !== 32) {
    fail(
      `Expected 32 journal body images with unique nonempty alts; found ${journalImageCount} images and ${journalImageAlts.size} unique alts`
    )
  }

  const builtRedirects = netlifyRedirects(builtRedirectsPath)
  const expectedRedirects = [
    ...journals.map(({ alias, canonical }) => ({
      from: alias,
      to: canonical,
      status: '301'
    })),
    ...(Array.isArray(retiredRedirects)
      ? retiredRedirects.map(({ from, to }) => ({
          from,
          to,
          status: '301'
        }))
      : [])
  ]
  const checkedRedirectSources = new Set(
    expectedRedirects.map(({ from }) => from)
  )
  const checkedSourceRedirects = sourceRedirects.filter(({ from }) =>
    checkedRedirectSources.has(from)
  )
  const checkedBuiltRedirects = builtRedirects.filter(({ from }) =>
    checkedRedirectSources.has(from)
  )

  if (
    JSON.stringify(checkedSourceRedirects) !== JSON.stringify(expectedRedirects)
  ) {
    fail(
      `static/_redirects must contain the ${expectedRedirects.length} checked Likya redirect mappings`
    )
  }
  if (
    JSON.stringify(checkedBuiltRedirects) !== JSON.stringify(expectedRedirects)
  ) {
    fail(
      `The production build must copy all ${expectedRedirects.length} checked Likya redirect mappings to public/_redirects`
    )
  }

  let sitemap = ''
  try {
    sitemap = fs.readFileSync(sitemapPath, 'utf8')
  } catch (error) {
    fail(`Could not read sitemap-0.xml: ${error.message}`)
  }

  const retiredSources = new Set()
  const retiredPaths = new Set()
  if (Array.isArray(retiredRedirects)) {
    retiredRedirects.forEach(({ source, from, to }) => {
      if (
        typeof source !== 'string' ||
        typeof from !== 'string' ||
        typeof to !== 'string'
      ) {
        fail('Every retired redirect must declare source, from, and to strings')
        return
      }
      if (retiredSources.has(source)) {
        fail(`Duplicate retired source: ${source}`)
      }
      if (retiredPaths.has(from)) {
        fail(`Duplicate retired redirect path: ${from}`)
      }
      retiredSources.add(source)
      retiredPaths.add(from)

      if (fs.existsSync(path.join(siteRoot, source))) {
        fail(`Retired article source still exists: ${source}`)
      }
      if (canonicalPaths.has(from)) {
        fail(`Retired path remains in the canonical inventory: ${from}`)
      }
      if (!canonicalPaths.has(to)) {
        fail(`Retired redirect destination is not retained: ${from} -> ${to}`)
      }
      if (
        fs.existsSync(htmlPathFor(from)) ||
        fs.existsSync(pageDataPathFor(from))
      ) {
        fail(`Retired path unexpectedly generated a Gatsby page: ${from}`)
      }

      const retiredUrl = canonicalHref(from)
      const sitemapOccurrences =
        sitemap.split(`<loc>${retiredUrl}</loc>`).length - 1
      if (sitemapOccurrences !== 0) {
        fail(`Retired path must be absent from the sitemap: ${from}`)
      }
    })
  }

  const editorialInternalLinks = []
  const externalMaps = []
  const externalVideos = []

  inventory.forEach(entry => {
    const sourcePath = path.join(siteRoot, entry.source)
    const sourceContents = fs.readFileSync(sourcePath, 'utf8')
    const expectedPublished = frontmatterValue(sourceContents, 'date')?.slice(
      0,
      10
    )
    const expectedModified = frontmatterValue(sourceContents, 'modified')
    const htmlPath = htmlPathFor(entry.canonical)
    let html = ''

    try {
      html = fs.readFileSync(htmlPath, 'utf8')
    } catch (error) {
      fail(
        `Could not read generated HTML for ${entry.canonical}: ${error.message}`
      )
      return
    }

    if (/yolacikmali\.com/i.test(sourceContents)) {
      fail(`Retired yolacikmali.com reference remains in ${entry.source}`)
    }

    markdownLinkEntries(sourceContents).forEach(({ label, href }) => {
      const hrefPath = internalPath(href)
      if (!hrefPath) return

      editorialInternalLinks.push({
        from: entry.canonical,
        href: hrefPath,
        label
      })

      if (sourceRedirects.some(redirect => redirect.from === hrefPath)) {
        fail(
          `Editorial link from ${entry.canonical} ends in a documented redirect: ${hrefPath}`
        )
      }
      if (!fs.existsSync(generatedHtmlPathFor(hrefPath))) {
        fail(
          `Editorial link from ${entry.canonical} has no generated HTTP 200 page: ${hrefPath}`
        )
      }
    })

    const canonicalUrl = canonicalHref(entry.canonical)
    const canonicalHrefs = htmlCanonicalHrefs(html)
    if (canonicalHrefs.length !== 1 || canonicalHrefs[0] !== canonicalUrl) {
      fail(
        `${
          entry.canonical
        } must have one self-referencing canonical tag: ${canonicalHrefs.join(
          ', '
        )}`
      )
    }

    const canonicalOccurrences =
      sitemap.split(`<loc>${canonicalUrl}</loc>`).length - 1
    if (canonicalOccurrences !== 1) {
      fail(
        `${entry.canonical} must occur once in the sitemap; found ${canonicalOccurrences}`
      )
    }

    const levels = headingLevels(html)
    const h1Count = levels.filter(level => level === 1).length
    if (h1Count !== 1) {
      fail(`${entry.canonical} must contain one H1; found ${h1Count}`)
    }
    for (let index = 1; index < levels.length; index += 1) {
      if (levels[index] > levels[index - 1] + 1) {
        fail(
          `${entry.canonical} skips H${levels[index - 1]} to H${levels[index]}`
        )
        break
      }
    }

    const structuredData = jsonLdEntries(html)
    const articles = structuredData.filter(data => data['@type'] === 'Article')
    const breadcrumbs = structuredData.filter(
      data => data['@type'] === 'BreadcrumbList'
    )

    if (articles.length !== 1) {
      fail(`${entry.canonical} must contain one Article JSON-LD object`)
    } else {
      const article = articles[0]
      if (
        article['@context'] !== 'https://schema.org' ||
        typeof article.headline !== 'string' ||
        !article.headline.trim() ||
        article.datePublished !== expectedPublished ||
        article.dateModified !== expectedModified ||
        article.author?.['@type'] !== 'Person' ||
        typeof article.author?.name !== 'string' ||
        article.mainEntityOfPage !== canonicalUrl
      ) {
        fail(`${entry.canonical} has incomplete or mismatched Article JSON-LD`)
      }
    }

    const publishedMeta = htmlMetaContents(
      html,
      'name',
      'article:published_time'
    )
    const modifiedMeta = htmlMetaContents(html, 'name', 'article:modified_time')
    if (
      publishedMeta.length !== 1 ||
      publishedMeta[0] !== expectedPublished ||
      modifiedMeta.length !== 1 ||
      modifiedMeta[0] !== expectedModified
    ) {
      fail(`${entry.canonical} has incomplete publication metadata`)
    }

    if (breadcrumbs.length !== 1) {
      fail(`${entry.canonical} must contain one BreadcrumbList JSON-LD object`)
    } else {
      const breadcrumb = breadcrumbs[0]
      const items = breadcrumb.itemListElement
      const itemsAreValid =
        breadcrumb['@context'] === 'https://schema.org' &&
        Array.isArray(items) &&
        items.length >= 2 &&
        items.every(
          (item, index) =>
            item['@type'] === 'ListItem' &&
            item.position === index + 1 &&
            typeof item.name === 'string' &&
            item.name.trim() &&
            typeof item.item === 'string'
        ) &&
        items[items.length - 1].item === canonicalUrl

      if (!itemsAreValid) {
        fail(`${entry.canonical} has invalid or mismatched breadcrumb JSON-LD`)
      }
    }

    const renderedIframes = htmlIframeSources(html)
    const sourceIframes = htmlIframeSources(sourceContents)

    sourceIframes.forEach(src => {
      if (
        src.startsWith('https://tr.wikiloc.com/') ||
        src.startsWith('https://www.google.com/maps/')
      ) {
        externalMaps.push({ page: entry.canonical, src })
        if (!renderedIframes.includes(src)) {
          fail(
            `${entry.canonical} does not render its checked map embed: ${src}`
          )
        }
      }
    })

    const youtubeDirectives = [
      ...sourceContents.matchAll(
        /`youtube:\s*https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)`/g
      )
    ]
    youtubeDirectives.forEach(match => {
      const src = `https://www.youtube.com/embed/${match[1]}?rel=0`
      externalVideos.push({ page: entry.canonical, src })
      if (!renderedIframes.includes(src)) {
        fail(
          `${entry.canonical} does not render its checked video embed: ${src}`
        )
      }
    })
  })

  const uniqueEditorialDestinations = new Set(
    editorialInternalLinks.map(link => link.href)
  )
  if (editorialInternalLinks.length !== 177) {
    fail(
      `Expected 177 editorial internal-link occurrences, found ${editorialInternalLinks.length}`
    )
  }
  if (uniqueEditorialDestinations.size !== 30) {
    fail(
      `Expected 30 unique editorial internal destinations, found ${uniqueEditorialDestinations.size}`
    )
  }
  if (externalMaps.length !== 13) {
    fail(`Expected 13 third-party map embeds, found ${externalMaps.length}`)
  }
  if (externalVideos.length !== 1) {
    fail(`Expected one retained video embed, found ${externalVideos.length}`)
  }

  journals.forEach(({ alias, canonical, day }) => {
    if (canonicalPaths.has(alias)) {
      fail(`Day ${day} alias is also a canonical inventory path: ${alias}`)
    }
    if (
      fs.existsSync(htmlPathFor(alias)) ||
      fs.existsSync(pageDataPathFor(alias))
    ) {
      fail(`Day ${day} alias unexpectedly generated a Gatsby page: ${alias}`)
    }
    if (sourceRedirects.some(redirect => redirect.from === canonical)) {
      fail(`Day ${day} dotted canonical starts another redirect: ${canonical}`)
    }

    const canonicalUrl = canonicalHref(canonical)
    const aliasUrl = canonicalHref(alias)
    const canonicalOccurrences =
      sitemap.split(`<loc>${canonicalUrl}</loc>`).length - 1
    const aliasOccurrences = sitemap.split(`<loc>${aliasUrl}</loc>`).length - 1

    if (canonicalOccurrences !== 1) {
      fail(
        `Day ${day} dotted canonical must occur once in the sitemap; found ${canonicalOccurrences}`
      )
    }
    if (aliasOccurrences !== 0) {
      fail(`Day ${day} clean alias must be absent from the sitemap: ${alias}`)
    }

    let html = ''
    try {
      html = fs.readFileSync(htmlPathFor(canonical), 'utf8')
    } catch (error) {
      fail(`Could not read generated HTML for ${canonical}: ${error.message}`)
    }
    const canonicalHrefs = htmlCanonicalHrefs(html)
    if (canonicalHrefs.length !== 1 || canonicalHrefs[0] !== canonicalUrl) {
      fail(
        `Day ${day} must have one self-referencing dotted canonical tag: ${canonicalHrefs.join(
          ', '
        )}`
      )
    }
  })

  if (itinerary) {
    const itineraryPath = path.join(siteRoot, itinerary.source)
    const itineraryContents = fs.readFileSync(itineraryPath, 'utf8')
    const links = markdownLinks(itineraryContents)

    if (/yolacikmali\.com/i.test(itineraryContents)) {
      fail('The itinerary still contains the retired yolacikmali.com domain')
    }

    const itineraryHtml = fs.readFileSync(
      htmlPathFor(itinerary.canonical),
      'utf8'
    )
    const itineraryVideo = 'https://www.youtube.com/embed/k2G3v7FS7gw?rel=0'
    const itineraryImage = path.join(
      path.dirname(itineraryPath),
      'likya-yolu-son-not.jpg'
    )
    if (
      !itineraryContents.includes(
        '`youtube: https://www.youtube.com/watch?v=k2G3v7FS7gw`'
      ) ||
      !htmlIframeSources(itineraryHtml).includes(itineraryVideo)
    ) {
      fail('The itinerary must preserve and render the retired page video')
    }
    if (
      !fs.existsSync(itineraryImage) ||
      !itineraryContents.includes('(likya-yolu-son-not.jpg') ||
      !htmlResponsiveImageAlts(itineraryHtml).includes(
        "Kaleüçağız'da 30 Eylül 2014 tarihli yürüyüşün son notu"
      )
    ) {
      fail('The itinerary must preserve and render the retired page photograph')
    }
    ;[
      'Olay 1 adam 21 gün ve 509 km olarak başladı',
      'Bu yolculuğa nasıl hazırlandığımı ve nasıl motive olduğumu',
      'Bu, 2014 yürüyüşünün ardından yazılmış tarihsel hedefimdi'
    ].forEach(snippet => {
      if (!itineraryContents.includes(snippet)) {
        fail(`The itinerary is missing preserved video-page copy: ${snippet}`)
      }
    })

    links.forEach(link => {
      if (!canonicalPaths.has(link)) {
        fail(`Itinerary link is not a generated collection canonical: ${link}`)
      }
    })

    for (const entry of [...guides, ...journals]) {
      const occurrences = links.filter(link => link === entry.canonical).length
      if (occurrences !== 1) {
        fail(
          `Itinerary must link once to day ${entry.day} ${entry.kind} ${entry.canonical}; found ${occurrences}`
        )
      }
    }

    guides.forEach(stage => {
      const journal = journals.find(entry => entry.day === stage.day)
      const journalContents = journal
        ? fs.readFileSync(path.join(siteRoot, journal.source), 'utf8')
        : ''
      const itineraryContentsForDay = itineraryDayBlock(
        itineraryContents,
        stage.day
      )

      if (
        typeof stage.date !== 'string' ||
        typeof stage.section !== 'string' ||
        typeof stage.distanceKm !== 'number'
      ) {
        fail(`Day ${stage.day} guide is missing checked stage facts`)
      } else {
        if (!containsStageFacts(itineraryContentsForDay, stage)) {
          fail(`Day ${stage.day} itinerary facts differ from the stage fixture`)
        }
        if (!containsStageFacts(journalContents, stage)) {
          fail(`Day ${stage.day} journal facts differ from the stage fixture`)
        }
      }
    })

    const redirects = readJson(redirectsPath)
    if (Array.isArray(redirects)) {
      const redirectedPaths = new Set(
        redirects
          .map(redirect => redirect.fromPath || redirect.from)
          .filter(Boolean)
      )
      links.forEach(link => {
        if (redirectedPaths.has(link)) {
          fail(`Itinerary link ends in a Gatsby redirect: ${link}`)
        }
      })
    }
  }

  if (hub) {
    const hubPath = path.join(siteRoot, hub.source)
    const hubContents = fs.readFileSync(hubPath, 'utf8')
    const hubLinks = markdownLinks(hubContents)
    const hubPageData = readJson(pageDataPathFor(hub.canonical))
    const hubPost = hubPageData?.result?.data?.post
    let hubHtml = ''

    try {
      hubHtml = fs.readFileSync(htmlPathFor(hub.canonical), 'utf8')
    } catch (error) {
      fail(`Could not read generated hub HTML: ${error.message}`)
    }

    const expectedHubEntries = inventory.filter(entry =>
      ['itinerary', 'guide', 'journal', 'support'].includes(entry.kind)
    )
    const normalizedHubRows = new Set(
      hubContents
        .split(/\r?\n/)
        .filter(line => line.trim().startsWith('|'))
        .map(line =>
          line
            .split('|')
            .map(cell => cell.trim())
            .join('|')
        )
    )

    expectedHubEntries.forEach(entry => {
      const occurrences = hubLinks.filter(
        link => link === entry.canonical
      ).length
      if (occurrences < 1) {
        fail(
          `Hub must link to ${entry.kind} ${entry.canonical}; found ${occurrences}`
        )
      }
    })

    const sourceRedirects = netlifyRedirects(staticRedirectsPath)
    hubLinks.forEach(link => {
      if (!link.startsWith('/')) return
      if (sourceRedirects.some(redirect => redirect.from === link)) {
        fail(`Hub link ends in a documented redirect: ${link}`)
      }
      if (!fs.existsSync(htmlPathFor(link))) {
        fail(`Hub link has no generated canonical page: ${link}`)
      }
    })

    guides.forEach(stage => {
      const journal = journals.find(entry => entry.day === stage.day)
      if (!journal || typeof stage.date !== 'string') return
      const expectedRow = `| ${stage.day} | ${turkishDate(stage.date)} | ${
        stage.section
      } | ${stage.distanceKm} km | [${stage.section} etap rehberi](${
        stage.canonical
      }) | [${stage.day}. gün: ${stage.section} günlüğü](${
        journal.canonical
      }) |`

      const normalizedExpectedRow = expectedRow
        .split('|')
        .map(cell => cell.trim())
        .join('|')

      if (!normalizedHubRows.has(normalizedExpectedRow)) {
        fail(`Hub stage table row differs for day ${stage.day}`)
      }
    })

    if (!/^category:\s*Rotalar\s*$/m.test(hubContents)) {
      fail('Hub frontmatter category must be Rotalar')
    }
    if (hubPost?.category?.name !== 'Rotalar') {
      fail(`Built hub category must be Rotalar: ${hubPost?.category?.name}`)
    }

    const h1Count = (hubHtml.match(/<h1\b/gi) || []).length
    if (h1Count !== 1) {
      fail(`Rendered hub must contain one H1; found ${h1Count}`)
    }
    if (!/<table\b/i.test(hubHtml)) {
      fail('Rendered hub is missing the 11-stage table')
    }
    const hubMapSources = htmlIframeSources(hubHtml)
    if (
      !hubContents.includes('id=10846819') ||
      !hubContents.includes('www.google.com/maps/embed') ||
      !hubMapSources.some(src => src.includes('id=10846819')) ||
      !hubMapSources.some(src => src.includes('www.google.com/maps/embed')) ||
      !decodeHtmlText(hubHtml).includes('likyayolu.org')
    ) {
      fail(
        'The hub must preserve and render the retired 430 km maps and attribution'
      )
    }
    ;[
      "Likya Yolu Fethiye'den başlayıp Antalya'ya uzanıyor.",
      'Parkurun zorluk, su, konaklama ve yiyecek koşulları',
      "Bu 430 km'lik tek hat GPS kaydını"
    ].forEach(snippet => {
      if (!hubContents.includes(snippet)) {
        fail(`The hub is missing preserved map-page copy: ${snippet}`)
      }
    })
    if (
      !/"@type":"BreadcrumbList"/.test(hubHtml) ||
      !/"name":"Rotalar"/.test(hubHtml)
    ) {
      fail('Rendered hub breadcrumb data must use the Rotalar category')
    }
  }

  if (failures.length === 0) {
    console.log(
      `Likya canonical inventory passed: ${inventory.length} pages, ${guides.length} guides, ${journals.length} dotted journals.`
    )
    console.log(
      `Itinerary links passed: ${
        guides.length + journals.length
      } stage destinations resolve directly to generated canonicals.`
    )
    console.log(
      `Journal aliases passed: ${aliases.size} permanent clean-to-dotted Netlify redirects, canonical tags, and sitemap entries.`
    )
    console.log(
      `Overlap consolidation passed: ${retiredRedirects.length} retired paths are absent from Gatsby and the sitemap, redirect once, and preserve their media and useful copy.`
    )
    console.log(
      `Hub navigation passed: ${guides.length} checked stage rows and all retained collection/support links resolve directly.`
    )
    console.log(
      `Guide navigation passed: ${guides.length} rendered series blocks use descriptive direct-canonical links and retain their Wikiloc embeds.`
    )
    console.log(
      `Guide editorial templates passed: ${guides.length} unique openings, complete historical/unknown checklists, dated context, and logical rendered heading outlines.`
    )
    console.log(
      `Journal wrappers passed: ${journals.length} rendered quick-facts and series-navigation blocks match the checked stage inventory.`
    )
    console.log(
      `Journal image accessibility passed: ${journalImageCount} body images have unique nonempty source and rendered accessible names.`
    )
    console.log(
      `Chronology matrix passed: ${guides.length} day/date/section/distance rows match the hub, itinerary, guide introductions/headings, and journal quick facts.`
    )
    console.log(
      `Page-level SEO passed: ${inventory.length} explicit slugs, unique titles, answer-first openings and descriptions, logical heading outlines, and matching visible/structured publication dates.`
    )
    console.log(
      `Complete crawl passed: ${inventory.length} retained pages have self-referencing canonicals, sitemap membership, one H1, valid Article/Breadcrumb JSON-LD, and ${editorialInternalLinks.length} editorial internal links to ${uniqueEditorialDestinations.size} generated HTTP 200 destinations.`
    )
    console.log(
      `External embed inventory passed: ${externalMaps.length} rendered third-party maps and ${externalVideos.length} retained video.`
    )
  }
}

if (failures.length > 0) {
  console.error(`Likya canonical validation failed (${failures.length}):`)
  failures.forEach(message => console.error(`- ${message}`))
  process.exitCode = 1
}

if (warnings.length > 0) {
  console.warn(`Likya validation follow-up findings (${warnings.length}):`)
  warnings.forEach(message => console.warn(`- ${message}`))
}
