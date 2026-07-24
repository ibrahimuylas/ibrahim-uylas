const fs = require('node:fs')
const path = require('node:path')

const publicDirectory = path.resolve(__dirname, '..', 'public')
const invalidParagraphChildren = /<(?:div|pre)\b/i
const paragraph = /<p\b[^>]*>[\s\S]*?<\/p>/gi

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
