const assert = require('node:assert/strict')
const test = require('node:test')

const likya = require('./index')
const guideMeta = require('./guide-meta')
const { evaluateLikyaRelease } = require('./release-readiness')

const releaseInput = overrides => ({
  conditionCategories: likya.conditionCategories,
  conditions: likya.conditions,
  guideMeta,
  historicalArchiveLinks: likya.historicalArchiveLinks,
  preparationTopics: likya.preparationTopics,
  publishedWalkingStages: likya.publishedWalkingStages,
  routePlans: likya.routePlans,
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  regions: [
    likya.westernLikyaRegion,
    likya.centralLikyaRegion,
    likya.easternLikyaRegion
  ],
  ...overrides
})

test('holds the canonical guide release while required practical coverage is missing', () => {
  const report = evaluateLikyaRelease(releaseInput())

  assert.equal(report.decision, 'hold')
  assert.equal(report.canEnableCanonicalShell, false)
  assert.ok(report.blockers.some(check => check.id === 'short-plans'))
  assert.ok(report.blockers.some(check => check.id === 'regional-coverage'))
  assert.ok(
    report.blockers.some(check => check.id === 'research-evidence-coverage')
  )
})

test('allows the canonical shell only when every release requirement is fulfilled', () => {
  const eligibleStage = {
    id: 'verified-stage',
    planningEligibility: 'eligible',
    officialSectionIds: likya.routeSections.map(section => section.id)
  }
  const makePlan = (id, duration) => ({
    id,
    publicationStatus: 'published',
    planningEligibility: 'eligible',
    supportedDurations: [duration]
  })
  const verifiedResearch = {
    id: 'verified-research',
    researchStatus: 'eligible',
    name: 'Doğrulanmış başlangıç – Doğrulanmış bitiş',
    start: 'Doğrulanmış başlangıç',
    end: 'Doğrulanmış bitiş',
    direction: 'eastbound',
    officialSectionIds: likya.routeSections.map(section => section.id),
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
  }
  const report = evaluateLikyaRelease(
    releaseInput({
      guideMeta: { shellEnabled: true, releaseStatus: 'ready' },
      publishedWalkingStages: [eligibleStage],
      stageResearchRecords: [verifiedResearch],
      routePlans: [
        makePlan('three-primary', '3'),
        makePlan('three-alternative', '3'),
        makePlan('five-primary', '5'),
        makePlan('five-alternative', '5'),
        makePlan('seven-primary', '7'),
        makePlan('seven-alternative', '7'),
        makePlan('full-route', 'full')
      ],
      regions: [
        { reviewStatus: 'published' },
        { reviewStatus: 'published' },
        { reviewStatus: 'published' }
      ]
    })
  )

  assert.equal(report.decision, 'ready')
  assert.equal(report.canEnableCanonicalShell, true)
})

test('reports exactly which official sections still lack published practical-stage coverage', () => {
  const report = evaluateLikyaRelease(
    releaseInput({
      publishedWalkingStages: [
        {
          id: 'partially-covered-stage',
          planningEligibility: 'eligible',
          officialSectionIds: ['ktb-pafta-1']
        }
      ]
    })
  )
  const coverage = report.checks.find(
    check => check.id === 'published-stage-coverage'
  )

  assert.deepEqual(coverage.missingSectionIds, [
    ...likya.routeSections.slice(1).map(section => section.id)
  ])
})
