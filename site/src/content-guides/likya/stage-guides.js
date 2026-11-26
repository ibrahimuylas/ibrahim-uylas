const { historicalWalkingStages } = require('./walking-stages')

const stageGuides = historicalWalkingStages.map((stage, index) => {
  const sequence = index + 1
  const articleSlug = stage.relatedArticleSlugs[0]
  const journalSlug = stage.relatedArticleSlugs[1]

  return {
    id: stage.id,
    sequence,
    articleSlug,
    journalSlug,
    name: stage.name,
    start: stage.start,
    end: stage.end,
    editorialRegion: 'not-yet-reconciled',
    officialSectionIds: [],
    planningEligibility: stage.planningEligibility,
    experienceDate: `2014-09-${String(19 + sequence).padStart(2, '0')}`,
    sourceIds: stage.sourceIds,
    distanceKm: stage.distanceKm,
    routeAndEffortStatus: 'not-yet-verified',
    gpsTracks: [],
    currentChecks: [
      'Hava ve resmî kısıtlamalar yakın tarihte doğrulanmadı.',
      'Su, işletme ve ulaşım bilgileri yakın tarihte doğrulanmadı.'
    ],
    historicalDisclaimer:
      'Bu sayfa 2014 yürüyüş deneyimini saklar. Güncel etap uygunluğu, su, konaklama, erişim ve güvenlik bilgisi olarak kullanılmamalıdır.'
  }
})

const stageGuideByArticleSlug = Object.fromEntries(
  stageGuides.map(stage => [stage.articleSlug, stage])
)

module.exports = {
  stageGuides,
  stageGuideByArticleSlug
}
