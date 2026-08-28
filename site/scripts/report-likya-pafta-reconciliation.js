const likya = require('../src/content-guides/likya')
const {
  buildOfficialPaftaReconciliationQueue,
  formatOfficialPaftaReconciliationQueue
} = require('../src/content-guides/likya/official-pafta-reconciliation')

const queue = buildOfficialPaftaReconciliationQueue({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  paftaReconciliationReviews: likya.paftaReconciliationReviews,
  officialPaftaObservations: likya.officialPaftaObservations
})

process.stdout.write(`${formatOfficialPaftaReconciliationQueue(queue)}\n`)
