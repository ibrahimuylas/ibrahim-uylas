const fs = require('fs')
const path = require('path')

const siteRoot = path.resolve(__dirname, '../..')
const inventory = require('./likya-canonical-inventory.json')
const retiredRedirects = require('./likya-retired-redirects.json')
const baseUrl = (process.argv[2] || 'http://localhost:8888').replace(/\/$/, '')
const retiredDomain = /yolacikmali\.com/i
const failures = []

const fail = message => failures.push(message)

const markdownLinkEntries = contents => {
  const links = []
  const pattern = /(?<!!)\[([^\]]+)\]\(<?([^\s)>]+)>?(?:\s+['"][^'"]*['"])?\)/g
  let match

  while ((match = pattern.exec(contents))) {
    links.push({ label: match[1], href: match[2] })
  }

  return links
}

const iframeSources = contents => {
  const sources = []
  const pattern = /<iframe\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi
  let match

  while ((match = pattern.exec(contents))) {
    sources.push(match[1].replace(/&amp;/gi, '&'))
  }

  return sources
}

const request = async (url, options = {}) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeout || 20000)

  try {
    const response = await fetch(url, {
      redirect: options.redirect || 'manual',
      signal: controller.signal,
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; IbrahimUylas pre-deployment validator)'
      }
    })

    return {
      status: response.status,
      location: response.headers.get('location'),
      finalUrl: response.url
    }
  } catch (error) {
    return { error: error.message }
  } finally {
    clearTimeout(timeout)
  }
}

const run = async () => {
  const editorialDestinations = new Set()
  const embedUrls = []

  inventory.forEach(entry => {
    const source = fs.readFileSync(path.join(siteRoot, entry.source), 'utf8')

    if (retiredDomain.test(source)) {
      fail(`Retired domain remains in ${entry.source}`)
    }

    markdownLinkEntries(source).forEach(({ href }) => {
      if (href.startsWith('/')) editorialDestinations.add(href)
      else {
        try {
          const url = new URL(href)
          if (url.hostname === 'www.ibrahimuylas.com') {
            editorialDestinations.add(url.pathname)
          }
        } catch {
          // Non-HTTP links are outside the crawl.
        }
      }
    })
  })

  const canonicalResults = await Promise.all(
    inventory.map(async entry => ({
      path: entry.canonical,
      result: await request(`${baseUrl}${entry.canonical}`)
    }))
  )
  canonicalResults.forEach(({ path: canonical, result }) => {
    if (result.status !== 200 || result.location) {
      fail(
        `Canonical ${canonical} must return direct HTTP 200; got ${
          result.error || result.status
        }${result.location ? ` -> ${result.location}` : ''}`
      )
    }
  })

  const editorialResults = await Promise.all(
    [...editorialDestinations].map(async href => ({
      href,
      result: await request(`${baseUrl}${href}`)
    }))
  )
  editorialResults.forEach(({ href, result }) => {
    if (result.status !== 200 || result.location) {
      fail(
        `Editorial destination ${href} must return direct HTTP 200; got ${
          result.error || result.status
        }${result.location ? ` -> ${result.location}` : ''}`
      )
    }
  })

  const journals = inventory
    .filter(entry => entry.kind === 'journal')
    .sort((a, b) => a.day - b.day)
  const aliasResults = await Promise.all(
    journals.map(async journal => {
      const alias = await request(`${baseUrl}${journal.alias}`)
      const destination = await request(`${baseUrl}${journal.canonical}`)
      return { journal, alias, destination }
    })
  )

  aliasResults.forEach(({ journal, alias, destination }) => {
    const expectedLocation = journal.canonical
    let actualLocation = alias.location
    if (actualLocation) {
      try {
        actualLocation = new URL(actualLocation, baseUrl).pathname
      } catch {
        // Keep the raw header for the failure message.
      }
    }

    if (alias.status !== 301 || actualLocation !== expectedLocation) {
      fail(
        `Alias ${
          journal.alias
        } must return one 301 to ${expectedLocation}; got ${
          alias.error || alias.status
        }${alias.location ? ` -> ${alias.location}` : ''}`
      )
    }
    if (destination.status !== 200 || destination.location) {
      fail(
        `Alias destination ${
          journal.canonical
        } must return direct HTTP 200; got ${
          destination.error || destination.status
        }`
      )
    }
  })

  const retiredResults = await Promise.all(
    retiredRedirects.map(async redirect => ({
      redirect,
      source: await request(`${baseUrl}${redirect.from}`),
      destination: await request(`${baseUrl}${redirect.to}`)
    }))
  )

  retiredResults.forEach(({ redirect, source, destination }) => {
    let actualLocation = source.location
    if (actualLocation) {
      try {
        actualLocation = new URL(actualLocation, baseUrl).pathname
      } catch {
        // Keep the raw header for the failure message.
      }
    }

    if (source.status !== 301 || actualLocation !== redirect.to) {
      fail(
        `Retired path ${redirect.from} must return one 301 to ${
          redirect.to
        }; got ${source.error || source.status}${
          source.location ? ` -> ${source.location}` : ''
        }`
      )
    }
    if (destination.status !== 200 || destination.location) {
      fail(
        `Retired destination ${redirect.to} must return direct HTTP 200; got ${
          destination.error || destination.status
        }`
      )
    }
  })

  for (const entry of inventory) {
    const htmlPath = path.join(
      siteRoot,
      'public',
      entry.canonical.replace(/^\/+|\/+$/g, ''),
      'index.html'
    )
    const html = fs.readFileSync(htmlPath, 'utf8')

    iframeSources(html).forEach(src => {
      if (
        src.startsWith('https://tr.wikiloc.com/') ||
        src.startsWith('https://www.google.com/maps/') ||
        src.startsWith('https://www.youtube.com/embed/')
      ) {
        embedUrls.push({ page: entry.canonical, src })
      }
    })
  }

  const embedResults = await Promise.all(
    embedUrls.map(async embed => ({
      ...embed,
      result: await request(embed.src, { redirect: 'follow' })
    }))
  )

  if (failures.length) {
    console.error(`Likya HTTP validation failed (${failures.length}):`)
    failures.forEach(message => console.error(`- ${message}`))
    process.exitCode = 1
  } else {
    console.log(
      `Runtime crawl passed: ${canonicalResults.length} canonicals and ${editorialResults.length} unique editorial destinations returned direct HTTP 200.`
    )
    console.log(
      `Runtime aliases passed: ${aliasResults.length} clean aliases returned one 301 hop to direct HTTP 200 dotted canonicals.`
    )
    console.log(
      `Runtime retirements passed: ${retiredResults.length} overlap URLs returned one 301 hop to their direct HTTP 200 destinations.`
    )
  }

  console.log('Third-party embed status (reported separately):')
  embedResults.forEach(({ page, src, result }) => {
    console.log(
      `- ${
        result.error ? `ERROR ${result.error}` : `HTTP ${result.status}`
      } | ${page} | ${src}`
    )
  })
}

run().catch(error => {
  console.error(error)
  process.exitCode = 1
})
