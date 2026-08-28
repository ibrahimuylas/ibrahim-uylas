const likya = require('../src/content-guides/likya')
const {
  formatValidationReport,
  validateLikyaData
} = require('../src/content-guides/likya/validation')

const report = validateLikyaData(likya)

process.stdout.write(`${formatValidationReport(report)}\n`)

if (report.errors.length) {
  process.exitCode = 1
}
