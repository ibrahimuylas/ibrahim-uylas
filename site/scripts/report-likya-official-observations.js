const likya = require('../src/content-guides/likya')
const {
  buildOfficialObservationCoverage
} = require('../src/content-guides/likya/official-pafta-observations')

const coverage = buildOfficialObservationCoverage({
  routeSections: likya.routeSections,
  officialPaftaObservations: likya.officialPaftaObservations
})

process.stdout.write('Likya resmî pafta bağlam kaynakları\n\n')
coverage.forEach(item => {
  process.stdout.write(
    `- ${item.sequence}. ${item.officialTitle}: ${item.status}.\n`
  )
})
