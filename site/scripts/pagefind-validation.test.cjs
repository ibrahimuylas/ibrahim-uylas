const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const {
  decodeHtmlText,
  extractElement,
  extractPagefindMeta,
  removeIgnoredElements,
  routeToHtmlPath,
  validatePagefindEntry
} = require('./pagefind-validation')

test('extracts the complete nested Pagefind body element', () => {
  const html =
    '<main><div data-pagefind-body=""><div>Body</div></div><footer>Chrome</footer></main>'

  assert.equal(
    extractElement(html, 'data-pagefind-body(?:=""|(?=[\\s>]))'),
    '<div data-pagefind-body=""><div>Body</div></div>'
  )
  assert.equal(
    extractElement('<main>Missing</main>', 'data-pagefind-body'),
    null
  )
})

test('removes complete Pagefind ignore regions from searchable text', () => {
  const scope =
    '<div data-pagefind-body=""><h1>Başlık</h1><span data-pagefind-ignore="index">Yazan <strong>İbrahim</strong></span><div data-pagefind-ignore="all"><nav>İçindekiler</nav></div><p>Gövde</p></div>'
  const searchable = removeIgnoredElements(scope)

  assert.equal(decodeHtmlText(searchable), 'BaşlıkGövde')
  assert.equal(removeIgnoredElements('<div data-pagefind-ignore="all">'), null)
})

test('requires exactly one metadata annotation and decodes visible text', () => {
  assert.deepEqual(
    extractPagefindMeta(
      '<h1><span data-pagefind-meta="title">Çadır <!-- --> &amp; Kamp</span></h1>',
      'title'
    ),
    { count: 1, value: 'Çadır & Kamp' }
  )
  assert.deepEqual(
    extractPagefindMeta(
      '<span data-pagefind-meta="title">Bir</span><span data-pagefind-meta="title">İki</span>',
      'title'
    ),
    { count: 2, value: null }
  )
})

test('maps Gatsby routes to generated HTML paths', () => {
  assert.equal(
    routeToHtmlPath('/public', '/'),
    path.join('/public', 'index.html')
  )
  assert.equal(
    routeToHtmlPath('/public', '/cadir-secimi/'),
    path.join('/public', 'cadir-secimi', 'index.html')
  )
})

test('compares Turkish Pagefind metadata with the derived eligible count', () => {
  const validEntry = {
    version: '1.5.2',
    languages: {
      tr: { hash: 'tr_abc', wasm: 'tr', page_count: 171 }
    }
  }

  assert.deepEqual(validatePagefindEntry(validEntry, 171), [])
  assert.deepEqual(validatePagefindEntry(validEntry, 170), [
    'Pagefind reports 171 indexed pages; expected 170'
  ])
  assert.match(
    validatePagefindEntry({ version: 'other', languages: {} }, 1).join('\n'),
    /version 1\.5\.2|Turkish index metadata|expected 1/
  )
})
