const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const {
  buildStageResearchCoverage,
  hasEligibleResearchEvidence,
  stageResearchRecords
} = require('./stage-research')

test('keeps GPS candidates in research until practical-stage evidence exists', () => {
  const report = buildStageResearchCoverage({
    routeSections,
    stageResearchRecords
  })

  assert.equal(report.sections.length, 31)
  assert.equal(report.missingSectionIds.length, 31)
  assert.deepEqual(
    report.regions.map(region => region.total),
    [10, 8, 13]
  )
  assert.equal(
    report.sections.find(section => section.sectionId === 'ktb-pafta-3').status,
    'research'
  )
  assert.equal(
    report.sections.filter(section => section.status === 'research').length,
    30
  )
  assert.equal(
    report.sections.filter(section => section.status === 'unmapped').length,
    0
  )
  assert.equal(
    report.sections.find(section => section.sectionId === 'ktb-pafta-17')
      .status,
    'needs-review'
  )
  for (const section of routeSections) {
    const candidates = stageResearchRecords
      .filter(record => record.officialSectionIds.includes(section.id))
      .flatMap(record => record.externalGpsLinks || [])
      .filter(link => link.routeMatchStatus === 'candidate')
    assert.ok(candidates.length > 0, `${section.id} GPS adayı içermeli`)
    assert.ok(candidates.every(link => link.externalDownloadOnly === true))
  }
  const southernBranch = stageResearchRecords.find(record =>
    record.officialSectionIds.includes('ktb-pafta-17')
  )
  assert.equal(
    southernBranch.externalGpsLinks.find(link => link.recordId === '31198631')
      .routeMatchStatus,
    'rejected'
  )
  assert.equal(hasEligibleResearchEvidence(southernBranch), false)
})

test('keeps incomplete research distinct from eligible evidence', () => {
  const report = buildStageResearchCoverage({
    routeSections: routeSections.slice(0, 2),
    stageResearchRecords: [
      {
        id: 'research-pafta-1',
        researchStatus: 'research',
        officialSectionIds: ['ktb-pafta-1']
      },
      {
        id: 'eligible-pafta-2',
        researchStatus: 'eligible',
        officialSectionIds: ['ktb-pafta-2']
      }
    ]
  })

  assert.deepEqual(
    report.sections.map(section => section.status),
    ['research', 'eligible']
  )
  assert.deepEqual(report.missingSectionIds, ['ktb-pafta-1'])
})

test('accepts a verified external Wikiloc link as navigation evidence without a local GPX', () => {
  const baseRecord = {
    id: 'external-wikiloc-evidence',
    researchStatus: 'eligible',
    name: 'Test başlangıç – Test bitiş',
    start: 'Test başlangıç',
    end: 'Test bitiş',
    direction: 'eastbound',
    officialSectionIds: ['ktb-pafta-1'],
    sourceIds: ['wikiloc-terms'],
    routeFactsCheckedAt: '2026-08-28',
    operationalFactsCheckedAt: '2026-08-28',
    reviewedAt: '2026-08-28',
    reviewedBy: 'Editoryal ekip',
    routeMetrics: {
      distanceKm: { value: 1, sourceId: 'wikiloc-terms' },
      ascentM: { value: 1, sourceId: 'wikiloc-terms' },
      descentM: { value: 1, sourceId: 'wikiloc-terms' },
      expectedHours: { value: 1, sourceId: 'wikiloc-terms' }
    },
    logisticsEvidence: Object.fromEntries(
      ['water', 'resupply', 'lodging', 'transport', 'emergencyExit'].map(
        field => [field, { status: 'unavailable' }]
      )
    )
  }
  const externalGpsLink = {
    provider: 'wikiloc',
    url: 'https://www.wikiloc.com/hiking-trails/example-123',
    sourceId: 'wikiloc-terms',
    recordId: '123',
    author: 'Test author',
    recordedAt: '2026-08-01',
    uploadedAt: '2026-08-02',
    reviewedAt: '2026-08-28',
    routeMatchStatus: 'verified',
    externalDownloadOnly: true
  }

  assert.equal(
    hasEligibleResearchEvidence({
      ...baseRecord,
      externalGpsLinks: [externalGpsLink]
    }),
    true
  )
  assert.equal(
    hasEligibleResearchEvidence({
      ...baseRecord,
      externalGpsLinks: [{ ...externalGpsLink, routeMatchStatus: 'candidate' }]
    }),
    false
  )
})
