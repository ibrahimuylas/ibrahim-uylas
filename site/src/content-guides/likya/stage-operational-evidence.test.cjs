const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const {
  buildOperationalEvidenceCoverage,
  isCompleteOperationalEvidence,
  operationalFactTypes
} = require('./stage-operational-evidence')

const completeEvidence = factType => ({
  id: `evidence-${factType}`,
  stageResearchRecordId: 'candidate-pafta-1',
  factType,
  status: 'verified',
  sourceIds: ['ktb-likya-route-home'],
  checkedAt: '2026-08-28',
  reviewDueAt: '2026-10-01',
  reviewedBy: 'Editoryal ekip',
  note: 'Test amaçlı tarihli kanıt.'
})

test('does not accept an undated operational claim as complete evidence', () => {
  assert.equal(isCompleteOperationalEvidence(completeEvidence('water')), true)
  assert.equal(
    isCompleteOperationalEvidence({
      ...completeEvidence('water'),
      reviewDueAt: null
    }),
    false
  )
})

test('keeps a candidate pafta non-public until every operational fact is evidenced', () => {
  const [section] = routeSections
  const partial = buildOperationalEvidenceCoverage({
    routeSections: [section],
    stageResearchRecords: [
      { id: 'candidate-pafta-1', officialSectionIds: [section.id] }
    ],
    stageOperationalEvidence: [completeEvidence('water')]
  })

  assert.equal(partial[0].status, 'operational-evidence-needed')
  assert.deepEqual(partial[0].missingFactTypes, operationalFactTypes.slice(1))
  assert.equal(partial[0].doNotPublish, true)

  const complete = buildOperationalEvidenceCoverage({
    routeSections: [section],
    stageResearchRecords: [
      { id: 'candidate-pafta-1', officialSectionIds: [section.id] }
    ],
    stageOperationalEvidence: operationalFactTypes.map(completeEvidence)
  })

  assert.equal(complete[0].status, 'operational-evidence-complete')
  assert.equal(complete[0].doNotPublish, false)
})
