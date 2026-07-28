const fs = require('node:fs')
const path = require('node:path')

const publicDirectory = path.resolve(__dirname, '..', 'public')

const findHtmlFiles = directory =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap(entry => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) return findHtmlFiles(entryPath)
      return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : []
    })

const removeNullBytes = input => {
  let removedBytes = 0

  for (const byte of input) {
    if (byte === 0) removedBytes += 1
  }

  if (removedBytes === 0) return { output: input, removedBytes }

  const output = Buffer.allocUnsafe(input.length - removedBytes)
  let outputIndex = 0

  for (const byte of input) {
    if (byte !== 0) {
      output[outputIndex] = byte
      outputIndex += 1
    }
  }

  return { output, removedBytes }
}

const sanitizeGeneratedHtml = (directory, log = console.log) => {
  const htmlFiles = findHtmlFiles(directory)
  let affectedFiles = 0
  let removedBytes = 0

  htmlFiles.forEach(file => {
    const input = fs.readFileSync(file)
    const sanitized = removeNullBytes(input)

    if (sanitized.removedBytes === 0) return

    fs.writeFileSync(file, sanitized.output)
    affectedFiles += 1
    removedBytes += sanitized.removedBytes
  })

  const filesWithNulls = htmlFiles.filter(file =>
    fs.readFileSync(file).includes(0)
  )

  if (filesWithNulls.length > 0) {
    throw new Error(
      `Generated HTML still contains NUL bytes: ${filesWithNulls
        .map(file => path.relative(directory, file))
        .join(', ')}`
    )
  }

  const report = {
    htmlFiles: htmlFiles.length,
    affectedFiles,
    removedBytes
  }

  log(
    `Sanitized generated HTML: removed ${removedBytes} NUL byte(s) from ${affectedFiles} file(s) across ${htmlFiles.length} HTML file(s).`
  )

  return report
}

if (require.main === module) {
  sanitizeGeneratedHtml(publicDirectory)
}

module.exports = {
  findHtmlFiles,
  removeNullBytes,
  sanitizeGeneratedHtml
}
