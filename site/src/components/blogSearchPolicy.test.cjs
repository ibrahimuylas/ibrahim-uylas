const test = require('node:test')
const assert = require('node:assert/strict')
const {
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
} = require('./blogSearchPolicy')

const createElement = initialAttributes => {
  const attributes = new Map(Object.entries(initialAttributes))
  const element = {
    hasAttribute: name => attributes.has(name),
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, String(value)),
    removeAttribute: name => attributes.delete(name)
  }

  element.attributes = {
    removeNamedItem: name => attributes.delete(name)
  }
  element.style = {
    setProperty: (name, value, priority) => {
      const declaration = `${name}: ${value}${priority ? ` !${priority}` : ``};`
      element.setAttribute(
        `style`,
        `${element.getAttribute(`style`) || ``}${declaration}`
      )
    }
  }

  return element
}

test('captures, locks, and exactly restores document attributes and scroll', () => {
  const appRoot = createElement({ inert: `pre-existing` })
  const documentElement = createElement({
    style: `color: red !important; margin: 0;`
  })
  const body = createElement({ style: `padding: 1px; direction: ltr;` })
  const scrollCalls = []
  const windowObject = {
    scrollX: 17,
    scrollY: 231,
    scrollTo: value => scrollCalls.push(value)
  }
  const documentObject = {
    documentElement,
    body,
    getElementById: id => (id === `___gatsby` ? appRoot : null)
  }

  const state = captureDocumentState(documentObject, windowObject)

  assert.equal(lockDocumentState(state), true)
  assert.equal(lockDocumentState(state), false)
  assert.equal(appRoot.getAttribute(`inert`), ``)
  assert.match(documentElement.getAttribute(`style`), /overflow: hidden/)
  assert.match(body.getAttribute(`style`), /top: -231px !important/)

  assert.equal(restoreDocumentState(state, windowObject), true)
  assert.equal(restoreDocumentState(state, windowObject), false)
  assert.equal(appRoot.getAttribute(`inert`), `pre-existing`)
  assert.equal(
    documentElement.getAttribute(`style`),
    `color: red !important; margin: 0;`
  )
  assert.equal(body.getAttribute(`style`), `padding: 1px; direction: ltr;`)
  assert.deepEqual(scrollCalls, [{ left: 17, top: 231, behavior: `instant` }])
})

test('restores absent inert and style attributes as absent', () => {
  const appRoot = createElement({})
  const documentElement = createElement({})
  const body = createElement({})
  documentElement.removeAttribute = name => {
    if (name === `style`) documentElement.setAttribute(name, ``)
  }
  body.removeAttribute = name => {
    if (name === `style`) body.setAttribute(name, ``)
  }
  const windowObject = {
    scrollX: 0,
    scrollY: 0,
    scrollTo: () => {}
  }
  const state = captureDocumentState(
    {
      documentElement,
      body,
      getElementById: () => appRoot
    },
    windowObject
  )

  lockDocumentState(state)
  restoreDocumentState(state, windowObject)

  assert.equal(appRoot.hasAttribute(`inert`), false)
  assert.equal(documentElement.hasAttribute(`style`), false)
  assert.equal(body.hasAttribute(`style`), false)
})

test('returns only current, exposed, keyboard-focusable dialog controls', () => {
  const controls = [
    { hidden: false, tabIndex: 0, getAttribute: () => null },
    { hidden: true, tabIndex: 0, getAttribute: () => null },
    { hidden: false, tabIndex: -1, getAttribute: () => null },
    {
      hidden: false,
      tabIndex: 0,
      getAttribute: name => (name === `aria-hidden` ? `true` : null)
    },
    {
      hidden: false,
      tabIndex: 0,
      getAttribute: () => null,
      getClientRects: () => []
    },
    { hidden: false, tabIndex: 0, getAttribute: () => null }
  ]
  const dialog = {
    querySelectorAll: selector => {
      assert.match(selector, /button:not/)
      return controls
    }
  }

  assert.deepEqual(getDialogFocusableElements(dialog), [
    controls[0],
    controls[5]
  ])
})

test('normalizes Turkish session identity without changing the visible input', () => {
  const visibleInput = '  IĞDIR \n  İÇİN  '

  assert.equal(collapseSearchTerm(visibleInput), 'IĞDIR İÇİN')
  assert.equal(normalizeSearchTerm(visibleInput), 'ığdır için')
  assert.equal(visibleInput, '  IĞDIR \n  İÇİN  ')
  assert.equal(hasMinimumSearchLength(' '), false)
  assert.equal(hasMinimumSearchLength(' ç '), false)
  assert.equal(hasMinimumSearchLength(' çadır '), true)
})

test('reuses a successful Pagefind load and retries a rejected load', async () => {
  let importCalls = 0
  let initCalls = 0
  const importAttempts = []
  const module = {
    init: async () => {
      initCalls += 1
    },
    debouncedSearch: async () => ({ results: [] })
  }
  const load = createPagefindLoader(async attempt => {
    importCalls += 1
    importAttempts.push(attempt)
    return module
  })

  const first = load()
  const concurrent = load()
  assert.equal(first, concurrent)
  assert.equal(await first, module)
  assert.equal(await load(), module)
  assert.equal(importCalls, 1)
  assert.equal(initCalls, 1)
  assert.deepEqual(importAttempts, [1])

  let attempts = 0
  const retryAttempts = []
  const retryingLoad = createPagefindLoader(async attempt => {
    attempts += 1
    retryAttempts.push(attempt)
    if (attempts === 1) throw new Error('missing bundle')
    return module
  })

  await assert.rejects(retryingLoad(), /missing bundle/)
  assert.equal(await retryingLoad(), module)
  assert.equal(attempts, 2)
  assert.deepEqual(retryAttempts, [1, 2])
})

test('rejects invalid Pagefind modules and initializer failures', async () => {
  await assert.rejects(
    createPagefindLoader(async () => ({ init: async () => {} }))(),
    /Invalid Pagefind/
  )
  await assert.rejects(
    createPagefindLoader(async () => ({
      init: async () => {
        throw new Error('initialization failed')
      },
      debouncedSearch: async () => null
    }))(),
    /initialization failed/
  )
})

test('accepts only local root-relative result URLs', () => {
  assert.equal(
    validateResultUrl('/cadir/?highlight=uyku#ekipman'),
    '/cadir/?highlight=uyku#ekipman'
  )
  assert.equal(validateResultUrl('/a/../cadir/'), '/cadir/')
  assert.equal(validateResultUrl('https://ibrahimuylas.com/cadir/'), null)
  assert.equal(validateResultUrl('//example.com/cadir/'), null)
  assert.equal(validateResultUrl('/\\example.com/cadir/'), null)
  assert.equal(validateResultUrl('javascript:alert(1)'), null)
})

test('allows only balanced attribute-free mark elements in excerpts', () => {
  assert.equal(
    validateHighlightedExcerpt(
      'Doğru <mark>çadır</mark> seçimi &lt;önemlidir&gt;.'
    ),
    'Doğru <mark>çadır</mark> seçimi &lt;önemlidir&gt;.'
  )
  assert.equal(
    validateHighlightedExcerpt('<mark class="match">çadır</mark>'),
    null
  )
  assert.equal(validateHighlightedExcerpt('<mark>çadır'), null)
  assert.equal(
    validateHighlightedExcerpt('<mark>çadır</mark><script>alert(1)</script>'),
    null
  )
})

test('builds a safe contextual excerpt around an ASCII-folded Turkish match', () => {
  const unrelatedIntroduction =
    'Yazının başlangıcında yalnızca yolculuk hazırlıkları anlatılıyor. '.repeat(
      8
    )
  const contextual = createContextualExcerpt(
    `${unrelatedIntroduction}Uzun bir girişten sonra kumsala çadırlarımızı kurmaya karar verdik ve geceyi denizin yanında geçirdik.`,
    'cadir'
  )

  assert.ok(contextual)
  assert.match(contextual.text, /çadırlarımızı kurmaya karar verdik/)
  assert.doesNotMatch(contextual.text, /Yazının başlangıcında/)
  assert.deepEqual(
    contextual.segments.filter(segment => segment.highlighted),
    [{ text: 'çadır', highlighted: true }]
  )
  assert.equal(
    createContextualExcerpt(
      'Bu metinde yalnızca yürüyüş anlatılıyor.',
      'cadir'
    ),
    null
  )
})

test('validates bounded result fields and falls back to plain excerpt text', () => {
  const valid = {
    url: '/cadir-secimi/',
    meta: {
      title: '  Çadır \n Seçimi ',
      category: ' Kampçılık '
    },
    excerpt: 'İyi bir <mark>çadır</mark> nasıl seçilir?',
    plain_excerpt: 'İyi bir çadır nasıl seçilir?',
    content: '<script>private body</script>',
    arbitrary: 'visitor-secret'
  }

  assert.deepEqual(validateSearchResult(valid, 4), {
    position: 4,
    url: '/cadir-secimi/',
    title: 'Çadır Seçimi',
    category: 'Kampçılık',
    excerptHtml: 'İyi bir <mark>çadır</mark> nasıl seçilir?',
    excerptText: null
  })

  assert.deepEqual(
    validateSearchResult(
      {
        ...valid,
        excerpt: '<img src=x onerror=alert(1)>',
        plain_excerpt: 'Güvenli düz metin'
      },
      1
    ),
    {
      position: 1,
      url: '/cadir-secimi/',
      title: 'Çadır Seçimi',
      category: 'Kampçılık',
      excerptHtml: null,
      excerptText: 'Güvenli düz metin'
    }
  )

  assert.equal(
    validateSearchResult(
      {
        ...valid,
        url: 'https://example.com/cadir/',
        meta: { ...valid.meta, title: 'x'.repeat(241) }
      },
      1
    ),
    null
  )
  assert.doesNotMatch(
    JSON.stringify(validateSearchResult(valid, 4)),
    /private body|visitor-secret/
  )
})

test('slices and appends ranked results in stable ten-item pages', () => {
  const handles = Array.from(
    { length: 25 },
    (_, index) => `handle-${index + 1}`
  )
  const first = getRankedResultSlice(handles, 0)
  const second = getRankedResultSlice(handles, 10)
  const third = getRankedResultSlice(handles, 20)

  assert.equal(first.length, 10)
  assert.deepEqual(
    first.map(result => result.position),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  )
  assert.equal(second.length, 10)
  assert.deepEqual(
    third.map(result => result.position),
    [21, 22, 23, 24, 25]
  )

  const current = first.map(({ position }) => ({ position }))
  const next = [
    { position: 10 },
    ...second.map(({ position }) => ({ position }))
  ]
  assert.deepEqual(
    appendRankedResults(current, next).map(result => result.position),
    Array.from({ length: 20 }, (_, index) => index + 1)
  )
})

test('deduplicates search analytics per normalized term with allowlisted keys', () => {
  const calls = []
  const session = createSearchAnalyticsSession({
    sourcePath: '/kampcilik/',
    track: (eventName, parameters) => calls.push([eventName, parameters])
  })

  assert.equal(
    session.trackSearch({
      normalizedTerm: '  ÇADIR  SEÇİMİ ',
      resultCount: 14,
      excerpt: 'private excerpt',
      visitorId: 'visitor-secret'
    }),
    true
  )
  assert.equal(
    session.trackSearch({
      normalizedTerm: 'çadır seçimi',
      resultCount: 99
    }),
    false
  )
  assert.deepEqual(calls, [
    [
      'search',
      {
        search_term: 'çadır seçimi',
        result_count: 14,
        source_path: '/kampcilik/'
      }
    ]
  ])
  assert.doesNotMatch(JSON.stringify(calls), /private|visitor/)
})

test('emits one allowlisted result activation and remains inert without tracking', () => {
  const calls = []
  const activate = createResultActivation({
    normalizedTerm: '  ÇADIR ',
    result: {
      url: '/a/../cadir/',
      position: 3,
      category: ' Kampçılık ',
      title: 'private title',
      excerpt: 'private excerpt'
    },
    sourcePath: '/',
    track: (eventName, parameters) => calls.push([eventName, parameters])
  })

  assert.equal(activate(), true)
  assert.equal(activate(), false)
  assert.deepEqual(calls, [
    [
      'search_result_click',
      {
        search_term: 'çadır',
        result_url: '/cadir/',
        result_position: 3,
        result_category: 'Kampçılık',
        source_path: '/'
      }
    ]
  ])
  assert.doesNotMatch(JSON.stringify(calls), /private/)
  assert.equal(
    createResultActivation({
      normalizedTerm: 'çadır',
      result: { url: '/cadir/', position: 1, category: 'Kampçılık' },
      sourcePath: '/',
      track: undefined
    })(),
    false
  )
})

test('blocks stale completion after query changes and teardown', async () => {
  const guard = createGenerationGuard(20)
  const firstGeneration = guard.issue()
  let releaseFirst
  const firstCompletion = new Promise(resolve => {
    releaseFirst = resolve
  }).then(() => guard.commit(firstGeneration, () => values.push('stale')))
  const values = []

  guard.invalidate()
  const secondGeneration = guard.issue()
  assert.equal(
    guard.commit(secondGeneration, () => values.push('current')),
    true
  )
  releaseFirst()
  assert.equal(await firstCompletion, false)

  const teardownGeneration = guard.issue()
  guard.invalidate()
  assert.equal(
    guard.commit(teardownGeneration, () => values.push('after teardown')),
    false
  )
  assert.deepEqual(values, ['current'])
})
