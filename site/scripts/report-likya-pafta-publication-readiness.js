const likya = require('../src/content-guides/likya')
const {
  formatPaftaPublicationReadiness
} = require('../src/content-guides/likya/pafta-publication-readiness')

const readiness = likya.buildPaftaPublicationReadiness({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  paftaReconciliationReviews: likya.paftaReconciliationReviews,
  officialPaftaObservations: likya.officialPaftaObservations,
  paftaPublicationRecords: likya.paftaPublicationRecords
})

process.stdout.write(`${formatPaftaPublicationReadiness(readiness)}\n`)
