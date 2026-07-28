const FOCUSABLE_SELECTOR = [
  `a[href]`,
  `button:not([disabled])`,
  `input:not([disabled])`,
  `select:not([disabled])`,
  `textarea:not([disabled])`,
  `[tabindex]:not([tabindex="-1"])`
].join(`,`)

const RESULT_PAGE_SIZE = 10
const MAX_RESULT_URL_LENGTH = 2048
const MAX_TITLE_LENGTH = 240
const MAX_CATEGORY_LENGTH = 120
const MAX_EXCERPT_LENGTH = 1000
const MAX_CONTEXT_SOURCE_LENGTH = 250000
const CONTEXT_EXCERPT_LENGTH = 280

const collapseSearchTerm = value =>
  typeof value === `string` ? value.replace(/\s+/gu, ` `).trim() : ``

const normalizeSearchTerm = value =>
  collapseSearchTerm(value).toLocaleLowerCase(`tr`)

const hasMinimumSearchLength = value =>
  Array.from(collapseSearchTerm(value)).length >= 2

const foldTurkishCharacter = value =>
  value
    .toLocaleLowerCase(`tr`)
    .normalize(`NFD`)
    .replace(/\p{M}/gu, ``)
    .replace(/ı/gu, `i`)

const foldSearchText = value =>
  Array.from(collapseSearchTerm(value), foldTurkishCharacter).join(``)

const foldTextWithOffsets = value => {
  let folded = ``
  const offsets = []
  let sourceOffset = 0

  for (const character of value) {
    const foldedCharacter = foldTurkishCharacter(character)

    for (const foldedPart of foldedCharacter) {
      folded += foldedPart
      offsets.push(sourceOffset)
    }

    sourceOffset += character.length
  }

  return { folded, offsets }
}

const characterLengthAt = (value, offset) => {
  const codePoint = value.codePointAt(offset)
  return codePoint && codePoint > 0xffff ? 2 : 1
}

const mergeRanges = ranges =>
  ranges
    .sort((left, right) => left.start - right.start || left.end - right.end)
    .reduce((merged, range) => {
      const previous = merged[merged.length - 1]

      if (previous && range.start <= previous.end) {
        previous.end = Math.max(previous.end, range.end)
      } else {
        merged.push({ ...range })
      }

      return merged
    }, [])

const findFoldedRanges = (value, foldedTerms) => {
  const { folded, offsets } = foldTextWithOffsets(value)
  const ranges = []

  foldedTerms.forEach(term => {
    let searchFrom = 0
    let matchAt

    while ((matchAt = folded.indexOf(term, searchFrom)) !== -1) {
      const foldedEnd = matchAt + term.length - 1
      const start = offsets[matchAt]
      const lastCharacterStart = offsets[foldedEnd]

      ranges.push({
        start,
        end: lastCharacterStart + characterLengthAt(value, lastCharacterStart)
      })
      searchFrom = matchAt + Math.max(term.length, 1)
    }
  })

  return mergeRanges(ranges)
}

const createContextualExcerpt = (
  value,
  query,
  maximumLength = CONTEXT_EXCERPT_LENGTH
) => {
  if (
    typeof value !== `string` ||
    value.includes(`\0`) ||
    value.length > MAX_CONTEXT_SOURCE_LENGTH ||
    !Number.isInteger(maximumLength) ||
    maximumLength < 80
  ) {
    return null
  }

  const source = value.replace(/\s+/gu, ` `).trim()
  const foldedQuery = foldSearchText(query)

  if (!source || !foldedQuery) return null

  const sourceMapping = foldTextWithOffsets(source)
  const foldedMatchAt = sourceMapping.folded.indexOf(foldedQuery)

  if (foldedMatchAt === -1) return null

  const foldedMatchEnd = foldedMatchAt + foldedQuery.length - 1
  const matchStart = sourceMapping.offsets[foldedMatchAt]
  const lastMatchCharacterStart = sourceMapping.offsets[foldedMatchEnd]
  const matchEnd =
    lastMatchCharacterStart + characterLengthAt(source, lastMatchCharacterStart)
  const leftContext = Math.floor(maximumLength * 0.35)
  let excerptStart = Math.max(0, matchStart - leftContext)
  let excerptEnd = Math.min(
    source.length,
    excerptStart + Math.max(maximumLength, matchEnd - matchStart)
  )

  if (excerptStart > 0) {
    const nextSpace = source.indexOf(` `, excerptStart)
    if (nextSpace !== -1 && nextSpace < matchStart) excerptStart = nextSpace + 1
  }

  if (excerptEnd < source.length) {
    const previousSpace = source.lastIndexOf(` `, excerptEnd)
    if (previousSpace > matchEnd) excerptEnd = previousSpace
  }

  const excerpt = source.slice(excerptStart, excerptEnd).trim()
  const foldedTerms = foldedQuery
    .split(` `)
    .filter(term => term.length > 0)
    .sort((left, right) => right.length - left.length)
  const ranges = findFoldedRanges(excerpt, foldedTerms)

  if (!ranges.length) return null

  const segments = []
  let cursor = 0

  if (excerptStart > 0) segments.push({ text: `… `, highlighted: false })

  ranges.forEach(range => {
    if (range.start > cursor) {
      segments.push({
        text: excerpt.slice(cursor, range.start),
        highlighted: false
      })
    }

    segments.push({
      text: excerpt.slice(range.start, range.end),
      highlighted: true
    })
    cursor = range.end
  })

  if (cursor < excerpt.length) {
    segments.push({ text: excerpt.slice(cursor), highlighted: false })
  }
  if (excerptEnd < source.length) {
    segments.push({ text: ` …`, highlighted: false })
  }

  return {
    segments,
    text: segments.map(segment => segment.text).join(``)
  }
}

const createGenerationGuard = (initialGeneration = 0) => {
  let generation = initialGeneration

  return {
    issue: () => {
      generation += 1
      return generation
    },
    invalidate: () => {
      generation += 1
      return generation
    },
    isCurrent: candidate => candidate === generation,
    commit: (candidate, callback) => {
      if (candidate !== generation) return false
      callback()
      return true
    }
  }
}

const createPagefindLoader = importer => {
  let loadedModule = null
  let inFlight = null
  let attempt = 0

  return () => {
    if (loadedModule) return Promise.resolve(loadedModule)
    if (inFlight) return inFlight

    inFlight = Promise.resolve()
      .then(() => {
        attempt += 1
        return importer(attempt)
      })
      .then(async pagefindModule => {
        if (
          !pagefindModule ||
          typeof pagefindModule.init !== `function` ||
          typeof pagefindModule.debouncedSearch !== `function`
        ) {
          throw new Error(`Invalid Pagefind browser module`)
        }

        await pagefindModule.init()
        loadedModule = pagefindModule
        return loadedModule
      })
      .catch(error => {
        inFlight = null
        throw error
      })

    return inFlight
  }
}

const boundedText = (value, maximum) => {
  if (typeof value !== `string` || value.includes(`\0`)) return null

  const collapsed = value.replace(/\s+/gu, ` `).trim()
  if (!collapsed || Array.from(collapsed).length > maximum) return null

  return collapsed
}

const validateResultUrl = value => {
  if (
    typeof value !== `string` ||
    !value.startsWith(`/`) ||
    value.startsWith(`//`) ||
    value.includes(`\\`) ||
    /[\u0000-\u001f\u007f]/u.test(value) ||
    value.length > MAX_RESULT_URL_LENGTH
  ) {
    return null
  }

  try {
    const base = `https://pagefind.invalid`
    const url = new URL(value, base)

    if (url.origin !== base) return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

const validateHighlightedExcerpt = value => {
  if (
    typeof value !== `string` ||
    !value.trim() ||
    value.includes(`\0`) ||
    Array.from(value).length > MAX_EXCERPT_LENGTH
  ) {
    return null
  }

  const tokens = value.match(/<\/?mark>/gu) || []
  const textOnly = value.replace(/<\/?mark>/gu, ``)
  if (/[<>]/u.test(textOnly)) return null

  let depth = 0
  for (const token of tokens) {
    if (token === `<mark>`) {
      depth += 1
    } else {
      depth -= 1
      if (depth < 0) return null
    }
  }

  return depth === 0 ? value : null
}

const validateSearchResult = (value, position, query) => {
  if (!Number.isInteger(position) || position < 1) return null

  const url = validateResultUrl(value?.url)
  const title = boundedText(value?.meta?.title, MAX_TITLE_LENGTH)
  const category = boundedText(value?.meta?.category, MAX_CATEGORY_LENGTH)
  const plainExcerpt = boundedText(value?.plain_excerpt, MAX_EXCERPT_LENGTH)

  if (!url || !title || !category || !plainExcerpt) return null

  const highlightedExcerpt = validateHighlightedExcerpt(value?.excerpt)
  const contextualExcerpt = createContextualExcerpt(value?.content, query)

  return {
    position,
    url,
    title,
    category,
    excerptHtml: contextualExcerpt ? null : highlightedExcerpt,
    excerptText: contextualExcerpt
      ? null
      : highlightedExcerpt
        ? null
        : plainExcerpt,
    ...(contextualExcerpt
      ? { excerptSegments: contextualExcerpt.segments }
      : {})
  }
}

const getRankedResultSlice = (
  handles,
  loadedCount,
  pageSize = RESULT_PAGE_SIZE
) => {
  if (
    !Array.isArray(handles) ||
    !Number.isInteger(loadedCount) ||
    loadedCount < 0 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1
  ) {
    return []
  }

  return handles
    .slice(loadedCount, loadedCount + pageSize)
    .map((handle, index) => ({
      handle,
      position: loadedCount + index + 1
    }))
}

const appendRankedResults = (currentResults, nextResults) => {
  const existingPositions = new Set(
    currentResults.map(result => result.position)
  )

  return [
    ...currentResults,
    ...nextResults.filter(result => !existingPositions.has(result.position))
  ].sort((left, right) => left.position - right.position)
}

const createSearchAnalyticsSession = ({ sourcePath, track }) => {
  const trackedTerms = new Set()
  const validatedSourcePath = validateResultUrl(sourcePath)

  return {
    trackSearch: ({ normalizedTerm, resultCount }) => {
      const searchTerm = normalizeSearchTerm(normalizedTerm)

      if (
        typeof track !== `function` ||
        !validatedSourcePath ||
        !hasMinimumSearchLength(searchTerm) ||
        !Number.isInteger(resultCount) ||
        resultCount < 0 ||
        trackedTerms.has(searchTerm)
      ) {
        return false
      }

      trackedTerms.add(searchTerm)
      track(`search`, {
        search_term: searchTerm,
        result_count: resultCount,
        source_path: validatedSourcePath
      })
      return true
    }
  }
}

const createResultActivation = ({
  normalizedTerm,
  result,
  sourcePath,
  track
}) => {
  const validatedSourcePath = validateResultUrl(sourcePath)
  const searchTerm = normalizeSearchTerm(normalizedTerm)
  const resultUrl = validateResultUrl(result?.url)
  const resultCategory = boundedText(result?.category, MAX_CATEGORY_LENGTH)
  let activated = false

  return () => {
    if (
      activated ||
      typeof track !== `function` ||
      !validatedSourcePath ||
      !hasMinimumSearchLength(searchTerm) ||
      !result ||
      !resultUrl ||
      !Number.isInteger(result.position) ||
      result.position < 1 ||
      !resultCategory
    ) {
      return false
    }

    activated = true
    track(`search_result_click`, {
      search_term: searchTerm,
      result_url: resultUrl,
      result_position: result.position,
      result_category: resultCategory,
      source_path: validatedSourcePath
    })
    return true
  }
}

const captureAttribute = (element, name) => ({
  present: element.hasAttribute(name),
  value: element.getAttribute(name)
})

const restoreAttribute = (element, name, snapshot) => {
  if (snapshot.present) {
    element.setAttribute(name, snapshot.value)
  } else if (
    element.hasAttribute(name) &&
    typeof element.attributes?.removeNamedItem === `function`
  ) {
    element.attributes.removeNamedItem(name)
  } else {
    element.removeAttribute(name)
  }
}

const captureDocumentState = (documentObject, windowObject) => {
  const documentElement = documentObject.documentElement
  const body = documentObject.body
  const appRoot = documentObject.getElementById(`___gatsby`)

  return {
    appRoot,
    body,
    documentElement,
    inert: appRoot ? captureAttribute(appRoot, `inert`) : null,
    bodyStyle: captureAttribute(body, `style`),
    documentStyle: captureAttribute(documentElement, `style`),
    scrollX: windowObject.scrollX,
    scrollY: windowObject.scrollY,
    locked: false,
    restored: false
  }
}

const lockDocumentState = state => {
  if (!state || state.locked || state.restored) return false

  if (state.appRoot) state.appRoot.setAttribute(`inert`, ``)

  state.documentElement.style.setProperty(`overflow`, `hidden`, `important`)
  state.documentElement.style.setProperty(
    `overscroll-behavior`,
    `none`,
    `important`
  )
  state.body.style.setProperty(`position`, `fixed`, `important`)
  state.body.style.setProperty(`overflow`, `hidden`, `important`)
  state.body.style.setProperty(`width`, `100%`, `important`)
  state.body.style.setProperty(`left`, `${-state.scrollX}px`, `important`)
  state.body.style.setProperty(`top`, `${-state.scrollY}px`, `important`)
  state.body.style.setProperty(`right`, `0`, `important`)
  state.locked = true

  return true
}

const restoreDocumentState = (state, windowObject) => {
  if (!state || state.restored) return false

  if (state.appRoot) restoreAttribute(state.appRoot, `inert`, state.inert)
  restoreAttribute(state.documentElement, `style`, state.documentStyle)
  restoreAttribute(state.body, `style`, state.bodyStyle)
  windowObject.scrollTo({
    left: state.scrollX,
    top: state.scrollY,
    behavior: `instant`
  })

  state.restored = true
  state.locked = false

  return true
}

const getDialogFocusableElements = dialog =>
  Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    element =>
      !element.hidden &&
      element.tabIndex >= 0 &&
      element.getAttribute(`aria-hidden`) !== `true` &&
      (typeof element.getClientRects !== `function` ||
        element.getClientRects().length > 0)
  )

module.exports = {
  appendRankedResults,
  captureDocumentState,
  collapseSearchTerm,
  createContextualExcerpt,
  createGenerationGuard,
  createPagefindLoader,
  createResultActivation,
  createSearchAnalyticsSession,
  getDialogFocusableElements,
  getRankedResultSlice,
  hasMinimumSearchLength,
  lockDocumentState,
  normalizeSearchTerm,
  restoreDocumentState,
  validateHighlightedExcerpt,
  validateResultUrl,
  validateSearchResult
}
