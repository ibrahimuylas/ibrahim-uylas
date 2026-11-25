const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const { stageResearchRecords } = require('./stage-research')
const {
  buildPaftaResearchBoard,
  researchChecklist
} = require('./pafta-research-board')

const eligibleRecordFor = sectionId => ({
  id: `eligible-research-${sectionId}`,
  researchStatus: 'eligible',
  name: 'Doğrulanmış başlangıç – Doğrulanmış bitiş',
  start: 'Doğrulanmış başlangıç',
  end: 'Doğrulanmış bitiş',
  direction: 'eastbound',
  officialSectionIds: [sectionId],
  sourceIds: ['ktb-likya-route-home'],
  routeFactsCheckedAt: '2026-08-28',
  operationalFactsCheckedAt: '2026-08-28',
  reviewedAt: '2026-08-28',
  reviewedBy: 'Editoryal ekip',
  gpsEvidence: {
    sourceId: 'ktb-likya-route-home',
    owner: 'Test sahibi',
    permission: 'file-reuse-permitted',
    recordedAt: '2026-08-28'
  },
  routeMetrics: {
    distanceKm: { value: 1, sourceId: 'ktb-likya-route-home' },
    ascentM: { value: 1, sourceId: 'ktb-likya-route-home' },
    descentM: { value: 1, sourceId: 'ktb-likya-route-home' },
    expectedHours: { value: 1, sourceId: 'ktb-likya-route-home' }
  },
  logisticsEvidence: Object.fromEntries(
    ['water', 'resupply', 'lodging', 'transport', 'emergencyExit'].map(
      field => [field, { status: 'unavailable' }]
    )
  )
})

test('creates one non-public research card for every official pafta', () => {
  const board = buildPaftaResearchBoard({
    routeSections,
    stageResearchRecords
  })

  assert.equal(board.length, 31)
  assert.deepEqual(
    board.map(card => card.sequence),
    Array.from({ length: 31 }, (_, index) => index + 1)
  )
  assert.ok(board.every(card => card.doNotPublish))
  assert.equal(
    board.find(card => card.sectionId === 'ktb-pafta-3').coverageStatus,
    'research'
  )
  assert.equal(
    board.filter(card => card.coverageStatus === 'research').length,
    30
  )
  assert.equal(
    board.filter(card => card.coverageStatus === 'unmapped').length,
    0
  )
  assert.equal(
    board.find(card => card.sectionId === 'ktb-pafta-17').coverageStatus,
    'needs-review'
  )
  assert.ok(
    board.every(
      card =>
        card.officialReference.sourceId &&
        card.officialReference.url &&
        card.checklist.length === researchChecklist.length
    )
  )
})

test('completes only the card covered by rights-cleared research evidence', () => {
  const [first, second] = routeSections
  const board = buildPaftaResearchBoard({
    routeSections: [first, second],
    stageResearchRecords: [eligibleRecordFor(first.id)]
  })

  assert.equal(board[0].coverageStatus, 'eligible')
  assert.equal(board[0].doNotPublish, false)
  assert.ok(board[0].checklist.every(item => item.status === 'complete'))
  assert.equal(board[1].coverageStatus, 'unmapped')
  assert.equal(board[1].doNotPublish, true)
  assert.ok(board[1].checklist.every(item => item.status === 'required'))
})
