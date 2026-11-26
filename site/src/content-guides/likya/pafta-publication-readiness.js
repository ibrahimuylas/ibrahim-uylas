const { hasEligibleResearchEvidence } = require('./stage-research')
const {
  buildPaftaReconciliationReviewIndex
} = require('./pafta-reconciliation-reviews')

const isCompletePaftaPublicationRecord = record =>
  record?.publicationStatus === 'ready' &&
  Boolean(record.sectionId) &&
  Boolean(record.primaryResearchRecordId) &&
  Boolean(record.guidePath) &&
  typeof record.summary === 'string' &&
  record.summary.trim().length >= 80 &&
  typeof record.routeNarrative === 'string' &&
  record.routeNarrative.trim().length >= 160 &&
  Array.isArray(record.decisionPoints) &&
  record.decisionPoints.length >= 2 &&
  record.decisionPoints.every(
    point =>
      typeof point?.title === 'string' &&
      point.title.trim().length > 0 &&
      typeof point?.description === 'string' &&
      point.description.trim().length >= 40
  ) &&
  Boolean(record.contentReviewedAt) &&
  Boolean(record.contentReviewedBy) &&
  Array.isArray(record.sourceIds) &&
  record.sourceIds.length > 0

const buildPaftaPublicationReadiness = ({
  routeSections = [],
  stageResearchRecords = [],
  paftaReconciliationReviews = [],
  officialPaftaObservations = [],
  paftaPublicationRecords = []
} = {}) => {
  const verifiedReviews = buildPaftaReconciliationReviewIndex(
    paftaReconciliationReviews
  )

  return routeSections.map(section => {
    const eligibleResearch = stageResearchRecords.filter(
      record =>
        record.officialSectionIds?.includes(section.id) &&
        hasEligibleResearchEvidence(record)
    )
    const publicationRecord = paftaPublicationRecords.find(
      record => record.sectionId === section.id
    )
    const checks = [
      {
        id: 'official-context',
        passed: officialPaftaObservations.some(
          observation => observation.sectionId === section.id
        )
      },
      {
        id: 'official-match-review',
        passed: Boolean(verifiedReviews[section.id])
      },
      {
        id: 'eligible-stage-evidence',
        passed: eligibleResearch.some(
          record => record.id === publicationRecord?.primaryResearchRecordId
        )
      },
      {
        id: 'content-review',
        passed: isCompletePaftaPublicationRecord(publicationRecord)
      }
    ]
    const blockers = checks
      .filter(check => !check.passed)
      .map(check => check.id)

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      publicationRecordId: publicationRecord?.id || null,
      eligibleResearchRecordIds: eligibleResearch.map(record => record.id),
      decision: blockers.length === 0 ? 'ready' : 'hold',
      canPublish: blockers.length === 0,
      checks,
      blockers,
      nextAction:
        blockers.length === 0
          ? 'Pafta rehberi bağımsız olarak yayımlanabilir; ana rehber yayın kapısı ayrıca değerlendirilir.'
          : 'Eksik pafta kanıtlarını tamamla; ana rehberin tüm rota kapsamını beklemeden yalnızca bu paftayı tekrar değerlendir.'
    }
  })
}

const formatPaftaPublicationReadiness = readiness => {
  const lines = ['Likya pafta bazlı yayın uygunluğu', '']

  readiness.forEach(item => {
    lines.push(
      `- ${item.sequence}. ${item.officialTitle}: ${item.decision}; eksikler: ${item.blockers.length ? item.blockers.join(', ') : 'yok'}.`
    )
  })

  return lines.join('\n')
}

// A pafta is added only after its own page content is editorially ready. This
// deliberately does not open the all-route canonical guide.
const paftaPublicationRecords = []

module.exports = {
  buildPaftaPublicationReadiness,
  formatPaftaPublicationReadiness,
  isCompletePaftaPublicationRecord,
  paftaPublicationRecords
}
