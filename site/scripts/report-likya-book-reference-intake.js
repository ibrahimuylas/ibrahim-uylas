const likya = require('../src/content-guides/likya')

const coverage = likya.buildBookReferenceEvidenceCoverage({
  routeSections: likya.routeSections,
  bookReferenceEvidence: likya.bookReferenceEvidence
})

const lines = ['Likya kitap kaynak giriş durumu', '']

coverage.forEach(item => {
  lines.push(
    `- ${item.sequence}. ${item.officialTitle}: ${item.status}; ${item.evidenceIds.length} kaynak notu.`
  )
})

process.stdout.write(`${lines.join('\n')}\n`)
