const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const readSource = relativePath =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8')

test('mobile search keeps iOS controls tappable and focuses the query input', () => {
  const dialog = readSource('site/src/components/BlogSearchDialog.jsx')

  assert.match(dialog, /touchAction: `auto`/)
  assert.match(dialog, /fontSize: `16px`/)
  assert.match(dialog, /type='search'[\s\S]*autoFocus/)
  assert.match(dialog, /WebkitOverflowScrolling: `touch`/)
})

test('page contents navigation uses page wording outside article contents', () => {
  const contents = readSource('site/src/components/ArticleContents.jsx')
  const sheet = readSource('site/src/components/ArticleContentsSheet.jsx')

  assert.match(
    contents,
    /const navigationLabel = showInlineNavigation \? `Bu yazıda` : `Bu sayfada`/
  )
  assert.match(contents, /label=\{navigationLabel\}/)
  assert.match(sheet, /label,/)
  assert.match(sheet, /\{label\}/)
})
