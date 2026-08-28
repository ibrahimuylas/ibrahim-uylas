const operationalFactTypes = [
  'water',
  'resupply',
  'lodging',
  'transport',
  'emergency-exit'
]

const operationalEvidenceStates = ['not-confirmed', 'verified', 'unavailable']

const isDateLike = value =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

const isCompleteOperationalEvidence = evidence =>
  ['verified', 'unavailable'].includes(evidence?.status) &&
  operationalFactTypes.includes(evidence?.factType) &&
  Array.isArray(evidence.sourceIds) &&
  evidence.sourceIds.length > 0 &&
  isDateLike(evidence.checkedAt) &&
  isDateLike(evidence.reviewDueAt) &&
  Boolean(evidence.reviewedBy) &&
  Boolean(evidence.note)

const buildOperationalEvidenceCoverage = ({
  routeSections = [],
  stageResearchRecords = [],
  stageOperationalEvidence = []
} = {}) => {
  const evidenceByRecordId = new Map()

  stageOperationalEvidence.forEach(evidence => {
    const entries = evidenceByRecordId.get(evidence.stageResearchRecordId) || []
    entries.push(evidence)
    evidenceByRecordId.set(evidence.stageResearchRecordId, entries)
  })

  return routeSections.map(section => {
    const records = stageResearchRecords.filter(record =>
      record.officialSectionIds?.includes(section.id)
    )
    const evidence = records.flatMap(
      record => evidenceByRecordId.get(record.id) || []
    )
    const completeFactTypes = new Set(
      evidence.filter(isCompleteOperationalEvidence).map(item => item.factType)
    )
    const missingFactTypes = operationalFactTypes.filter(
      factType => !completeFactTypes.has(factType)
    )

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      relatedResearchRecordIds: records.map(record => record.id),
      evidenceIds: evidence.map(item => item.id),
      status:
        records.length === 0
          ? 'no-candidate'
          : missingFactTypes.length === 0
            ? 'operational-evidence-complete'
            : 'operational-evidence-needed',
      missingFactTypes,
      doNotPublish: missingFactTypes.length > 0,
      nextAction:
        records.length === 0
          ? 'Önce resmî paftayla ilişkilendirilebilecek bir aday veya birincil saha kanıtı bul.'
          : 'Her operasyonel başlık için kaynak, kontrol tarihi, yeniden inceleme tarihi ve inceleyen kişi kaydet.'
    }
  })
}

// Deliberately empty. Current water, service and exit conditions must be entered
// only after a dated source review; no historical or candidate-route data is copied.
const stageOperationalEvidence = []

module.exports = {
  buildOperationalEvidenceCoverage,
  isCompleteOperationalEvidence,
  operationalEvidenceStates,
  operationalFactTypes,
  stageOperationalEvidence
}
