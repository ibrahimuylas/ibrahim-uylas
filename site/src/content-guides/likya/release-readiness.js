const publishedPlansForDuration = (plans, duration) =>
  plans.filter(
    plan =>
      plan.publicationStatus === 'published' &&
      plan.planningEligibility === 'eligible' &&
      plan.supportedDurations?.includes(duration)
  )
const { hasEligibleResearchEvidence } = require('./stage-research')

const missingPublishedSectionIds = ({
  publishedWalkingStages = [],
  routeSections = []
} = {}) => {
  const coveredSectionIds = new Set(
    publishedWalkingStages
      .filter(stage => stage.planningEligibility === 'eligible')
      .flatMap(stage => stage.officialSectionIds || [])
  )

  return routeSections
    .filter(section => !coveredSectionIds.has(section.id))
    .map(section => section.id)
}

const missingResearchSectionIds = ({
  routeSections = [],
  stageResearchRecords = []
} = {}) => {
  const coveredSectionIds = new Set(
    stageResearchRecords
      .filter(hasEligibleResearchEvidence)
      .flatMap(record => record.officialSectionIds || [])
  )

  return routeSections
    .filter(section => !coveredSectionIds.has(section.id))
    .map(section => section.id)
}

const evaluateLikyaRelease = ({
  conditionCategories = [],
  conditions = [],
  guideMeta = {},
  historicalArchiveLinks = [],
  preparationTopics = [],
  publishedWalkingStages = [],
  routePlans = [],
  routeSections = [],
  stageResearchRecords = [],
  regions = []
} = {}) => {
  const checks = [
    {
      id: 'official-route-inventory',
      label: '31 paftalık resmî rota envanteri',
      passed: routeSections.length === 31
    },
    {
      id: 'regional-coverage',
      label: 'Batı, Orta ve Doğu için yayıma uygun etap kapsamı',
      passed:
        regions.length === 3 &&
        regions.every(region => region.reviewStatus === 'published')
    },
    {
      id: 'published-stages',
      label: 'Yayımlanmış pratik etaplar resmî paftalarla eşleşiyor',
      passed:
        publishedWalkingStages.length > 0 &&
        publishedWalkingStages.every(
          stage =>
            stage.planningEligibility === 'eligible' &&
            stage.officialSectionIds?.length > 0
        )
    },
    {
      id: 'published-stage-coverage',
      label: 'Yayımlanmış pratik etaplar 31 resmî paftanın tamamını kapsıyor',
      passed:
        publishedWalkingStages.length > 0 &&
        missingPublishedSectionIds({
          publishedWalkingStages,
          routeSections
        }).length === 0,
      missingSectionIds: missingPublishedSectionIds({
        publishedWalkingStages,
        routeSections
      })
    },
    {
      id: 'research-evidence-coverage',
      label:
        '31 resmî pafta için kaynaklı, hakları doğrulanmış etap araştırması',
      passed:
        missingResearchSectionIds({ routeSections, stageResearchRecords })
          .length === 0,
      missingSectionIds: missingResearchSectionIds({
        routeSections,
        stageResearchRecords
      })
    },
    {
      id: 'short-plans',
      label: '3, 5 ve 7 gün için birincil ve alternatif planlar',
      passed: ['3', '5', '7'].every(
        duration => publishedPlansForDuration(routePlans, duration).length === 2
      )
    },
    {
      id: 'full-route-orientation',
      label: 'Baştan sona yürüyüş için kaynaklı yönlendirme planı',
      passed: publishedPlansForDuration(routePlans, 'full').length === 1
    },
    {
      id: 'freshness-model',
      label: 'Dört güncel koşul kategorisi ve kaynak yönetimi',
      passed: conditionCategories.length === 4 && Array.isArray(conditions)
    },
    {
      id: 'preparation-and-archive',
      label: 'Hazırlık merkezi ve tarihsel arşiv bağlantıları',
      passed:
        preparationTopics.length === 9 && historicalArchiveLinks.length >= 3
    },
    {
      id: 'canonical-release-gate',
      label: 'Kanonik sayfa yalnızca hazır durumunda açılır',
      passed: !guideMeta.shellEnabled || guideMeta.releaseStatus === 'ready'
    }
  ]
  const blockers = checks.filter(check => !check.passed)

  return {
    decision: blockers.length === 0 ? 'ready' : 'hold',
    canEnableCanonicalShell: blockers.length === 0,
    checks,
    blockers
  }
}

const formatLikyaReleaseReadiness = report => {
  const heading =
    report.decision === 'ready'
      ? 'Likya rehber yayın kararı: HAZIR'
      : 'Likya rehber yayın kararı: BEKLET'
  const lines = [heading, '']

  report.checks.forEach(check => {
    lines.push(`- [${check.passed ? 'x' : ' '}] ${check.label}`)
    if (!check.passed && check.missingSectionIds?.length) {
      lines.push(`  Eksik paftalar: ${check.missingSectionIds.join(', ')}`)
    }
  })

  if (report.blockers.length) {
    lines.push(
      '',
      'Kanonik rehber kabuğu açılmamalı; yukarıdaki eksikler tamamlanmadan releaseStatus hazır durumuna alınmamalı.'
    )
  }

  return lines.join('\n')
}

module.exports = {
  evaluateLikyaRelease,
  formatLikyaReleaseReadiness,
  missingPublishedSectionIds,
  missingResearchSectionIds
}
