const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')

const {
  findHtmlFiles,
  removeNullBytes,
  sanitizeGeneratedHtml
} = require('./sanitize-generated-html')

const withFixture = callback => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'sanitize-generated-html-')
  )

  try {
    callback(directory)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
}

test('leaves generated HTML without NUL bytes unchanged', () => {
  withFixture(directory => {
    const file = path.join(directory, 'index.html')
    const original = Buffer.from('<main>Türkçe içerik</main>')
    fs.writeFileSync(file, original)

    const report = sanitizeGeneratedHtml(directory, () => {})

    assert.deepEqual(fs.readFileSync(file), original)
    assert.deepEqual(report, {
      htmlFiles: 1,
      affectedFiles: 0,
      removedBytes: 0
    })
  })
})

test('removes one or multiple NUL bytes without changing other bytes', () => {
  const input = Buffer.concat([
    Buffer.from('<p>Doğa Y'),
    Buffer.from([0]),
    Buffer.from('ürüyüşleri'),
    Buffer.from([0, 0]),
    Buffer.from('</p>')
  ])

  const { output, removedBytes } = removeNullBytes(input)

  assert.equal(removedBytes, 3)
  assert.deepEqual(output, Buffer.from('<p>Doğa Yürüyüşleri</p>'))
})

test('discovers generated HTML recursively', () => {
  withFixture(directory => {
    const nestedDirectory = path.join(directory, 'nested', 'article')
    fs.mkdirSync(nestedDirectory, { recursive: true })
    fs.writeFileSync(path.join(directory, 'index.html'), '')
    fs.writeFileSync(path.join(nestedDirectory, 'index.html'), '')

    assert.deepEqual(
      findHtmlFiles(directory).map(file => path.relative(directory, file)),
      ['index.html', path.join('nested', 'article', 'index.html')]
    )
  })
})

test('excludes non-HTML files from discovery and sanitization', () => {
  withFixture(directory => {
    const htmlFile = path.join(directory, 'index.html')
    const dataFile = path.join(directory, 'page-data.json')
    const binaryFixture = Buffer.from([65, 0, 66])
    fs.writeFileSync(htmlFile, Buffer.from([60, 0, 112, 62]))
    fs.writeFileSync(dataFile, binaryFixture)

    const report = sanitizeGeneratedHtml(directory, () => {})

    assert.deepEqual(fs.readFileSync(htmlFile), Buffer.from('<p>'))
    assert.deepEqual(fs.readFileSync(dataFile), binaryFixture)
    assert.deepEqual(report, {
      htmlFiles: 1,
      affectedFiles: 1,
      removedBytes: 1
    })
  })
})
