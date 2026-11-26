const likya = require('../src/content-guides/likya')
const {
  buildOfficialPaftaReconciliationQueue,
  formatOfficialPaftaReviewPackets
} = require('../src/content-guides/likya/official-pafta-reconciliation')

const queue = buildOfficialPaftaReconciliationQueue({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  paftaReconciliationReviews: likya.paftaReconciliationReviews,
  officialPaftaObservations: likya.officialPaftaObservations,
  sourcesById: likya.sourceById
})

process.stdout.write(`${formatOfficialPaftaReviewPackets(queue)}\n`)
