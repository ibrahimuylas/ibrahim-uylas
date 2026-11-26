const { sources, sourceById } = require('./sources')
const {
  paftaInventory,
  routeSections,
  routeSectionById
} = require('./route-sections')
const historicalExperiences = require('./historical-experiences')
const {
  historicalWalkingStages,
  publishedWalkingStages
} = require('./walking-stages')
const { routePlanCatalog, routePlans } = require('./route-plans')
const { stageGuides, stageGuideByArticleSlug } = require('./stage-guides')
const westernLikyaRegion = require('./western-region')
const centralLikyaRegion = require('./central-region')
const easternLikyaRegion = require('./eastern-region')
const {
  checklistItems,
  historicalArchiveLinks,
  preparationTopics
} = require('./preparation-center')
const { conditionCategories, conditions } = require('./conditions')
const {
  buildStageResearchCoverage,
  stageResearchRecords
} = require('./stage-research')
const { buildPaftaResearchBoard } = require('./pafta-research-board')
const {
  buildOfficialPaftaReconciliationQueue
} = require('./official-pafta-reconciliation')
const { paftaReconciliationReviews } = require('./pafta-reconciliation-reviews')
const {
  buildOperationalEvidenceCoverage,
  stageOperationalEvidence
} = require('./stage-operational-evidence')
const {
  buildRouteMetricCoverage,
  stageRouteMetrics
} = require('./stage-route-metrics')
const {
  buildOfficialObservationCoverage,
  officialPaftaObservations
} = require('./official-pafta-observations')
const {
  bookReferenceEvidence,
  buildBookReferenceEvidenceCoverage
} = require('./book-reference-evidence')
const {
  buildPaftaPublicationReadiness,
  paftaPublicationRecords
} = require('./pafta-publication-readiness')
const { buildPublishedPaftaGuidePages } = require('./pafta-guide-pages')

module.exports = {
  conditions,
  bookReferenceEvidence,
  centralLikyaRegion,
  checklistItems,
  conditionCategories,
  easternLikyaRegion,
  historicalExperiences,
  historicalArchiveLinks,
  historicalWalkingStages,
  paftaInventory,
  paftaPublicationRecords,
  paftaReconciliationReviews,
  officialPaftaObservations,
  publishedWalkingStages,
  preparationTopics,
  routePlanCatalog,
  routePlans,
  routeSectionById,
  routeSections,
  stageResearchRecords,
  stageOperationalEvidence,
  stageRouteMetrics,
  stageGuideByArticleSlug,
  stageGuides,
  buildStageResearchCoverage,
  buildPaftaResearchBoard,
  buildPaftaPublicationReadiness,
  buildPublishedPaftaGuidePages,
  buildOfficialPaftaReconciliationQueue,
  buildOperationalEvidenceCoverage,
  buildRouteMetricCoverage,
  buildOfficialObservationCoverage,
  buildBookReferenceEvidenceCoverage,
  sourceById,
  sources,
  westernLikyaRegion
}
