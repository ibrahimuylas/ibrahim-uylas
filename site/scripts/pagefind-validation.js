const path = require('node:path')

const countMatches = (value, pattern) => (value.match(pattern) || []).length

const decodeHtmlText = value =>
  value
    .replace(
      /<(?:style|script|noscript|template)\b[^>]*>[\s\S]*?<\/(?:style|script|noscript|template)>/gi,
      ''
    )
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10))
    )
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

const extractElement = (html, attributePattern) => {
  const openingTag = html.match(
    new RegExp(`<([a-z][\\w:-]*)\\b[^>]*${attributePattern}[^>]*>`, 'i')
  )

  if (!openingTag) return null

  const tagName = openingTag[1]
  const start = openingTag.index
  const tokenPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tokenPattern.lastIndex = start
  let depth = 0
  let token

  while ((token = tokenPattern.exec(html))) {
    depth += token[0].startsWith('</') ? -1 : 1
    if (depth === 0) return html.slice(start, tokenPattern.lastIndex)
  }

  return null
}

const removeIgnoredElements = html => {
  let output = html
  const ignoredOpeningTag =
    /<([a-z][\w:-]*)\b[^>]*data-pagefind-ignore="(?:all|index)"[^>]*>/i
  let match

  while ((match = output.match(ignoredOpeningTag))) {
    const ignoredElement = extractElement(
      output.slice(match.index),
      'data-pagefind-ignore="(?:all|index)"'
    )

    if (!ignoredElement) return null
    output =
      output.slice(0, match.index) +
      output.slice(match.index + ignoredElement.length)
  }

  return output
}

const extractPagefindMeta = (html, key) => {
  const matches = [
    ...html.matchAll(
      new RegExp(
        `<[^>]+data-pagefind-meta="${key}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`,
        'gi'
      )
    )
  ]

  return {
    count: matches.length,
    value: matches.length === 1 ? decodeHtmlText(matches[0][1]) : null
  }
}

const routeToHtmlPath = (publicDirectory, route) => {
  const relativePath =
    route === '/' ? 'index.html' : `${route.replace(/^\/|\/$/g, '')}/index.html`

  return path.join(publicDirectory, relativePath)
}

const validatePagefindEntry = (entry, eligibleCount) => {
  const failures = []
  const languages = entry?.languages
  const turkish = languages?.tr

  if (entry?.version !== '1.5.2') {
    failures.push('Pagefind entry does not report version 1.5.2')
  }
  if (!turkish || typeof turkish.hash !== 'string' || turkish.wasm !== 'tr') {
    failures.push('Pagefind entry does not contain Turkish index metadata')
  }
  if (turkish?.page_count !== eligibleCount) {
    failures.push(
      `Pagefind reports ${turkish?.page_count ?? 'no'} indexed pages; expected ${eligibleCount}`
    )
  }

  return failures
}

module.exports = {
  countMatches,
  decodeHtmlText,
  extractElement,
  extractPagefindMeta,
  removeIgnoredElements,
  routeToHtmlPath,
  validatePagefindEntry
}
