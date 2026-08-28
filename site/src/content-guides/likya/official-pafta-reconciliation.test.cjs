const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const { stageResearchRecords } = require('./stage-research')
const { officialPaftaObservations } = require('./official-pafta-observations')
const {
  buildOfficialPaftaReconciliationQueue,
  reconciliationChecks
} = require('./official-pafta-reconciliation')

test('creates a non-public official-pafta review item for every pafta', () => {
  const queue = buildOfficialPaftaReconciliationQueue({
    routeSections,
    stageResearchRecords,
    officialPaftaObservations
  })

  assert.equal(queue.length, 31)
  assert.ok(queue.every(item => item.doNotPublish))
  assert.ok(
    queue.every(
      item =>
        item.reviewPacket.officialContext.length === 1 &&
        item.reviewPacket.officialContext[0].sourceUrl &&
        item.reviewPacket.requiredChecks.length === reconciliationChecks.length
    )
  )
  assert.equal(
    queue.find(item => item.sectionId === 'ktb-pafta-1').status,
    'candidate-review'
  )
  assert.equal(
    queue.find(item => item.sectionId === 'ktb-pafta-29').status,
    'unmapped'
  )
  assert.ok(
    queue.every(
      item =>
        item.officialReference.sourceId &&
        item.officialReference.url &&
        item.checks.length === reconciliationChecks.length
    )
  )
})

test('adds official context to a review packet without treating it as a review decision', () => {
  const [section] = routeSections
  const [observation] = officialPaftaObservations.filter(
    item => item.sectionId === section.id
  )
  const queue = buildOfficialPaftaReconciliationQueue({
    routeSections: [section],
    officialPaftaObservations: [observation]
  })

  assert.equal(queue[0].status, 'unmapped')
  assert.equal(queue[0].doNotPublish, true)
  assert.deepEqual(queue[0].reviewPacket.officialContext, [
    {
      observationId: observation.id,
      sourceId: observation.sourceId,
      accessedAt: observation.accessedAt,
      sourceFreshness: observation.sourceFreshness,
      sourceTitle: 'Pafta 1: Ovacık – Kirme',
      sourceUrl:
        'https://likyayolu.ktb.gov.tr/TR-236149/pafta-1-ovacik--kirme.html',
      routeContext: observation.routeContext,
      reviewPrompt: observation.reviewPrompt
    }
  ])
  assert.deepEqual(queue[0].reviewPacket.candidateLinks, [])
})

test('shows an evidence-needed review without changing candidate status', () => {
  const [section] = routeSections
  const queue = buildOfficialPaftaReconciliationQueue({
    routeSections: [section],
    stageResearchRecords: [
      {
        id: 'candidate-pafta-1',
        officialSectionIds: [section.id],
        externalGpsLinks: [{ routeMatchStatus: 'candidate' }]
      }
    ],
    paftaReconciliationReviews: [
      {
        id: 'review-pafta-1',
        sectionId: section.id,
        candidateRecordId: 'candidate-pafta-1',
        status: 'needs-evidence',
        reviewedAt: '2026-08-28',
        reviewedBy: 'Editoryal ekip',
        decisionNote: 'Aday pafta sınırını aşmaktadır.'
      }
    ]
  })

  assert.equal(queue[0].status, 'candidate-review')
  assert.equal(queue[0].doNotPublish, true)
  assert.equal(queue[0].reviewPacket.latestReview.status, 'needs-evidence')
})

test('does not treat a candidate link as an official-pafta verification', () => {
  const [section] = routeSections
  const queue = buildOfficialPaftaReconciliationQueue({
    routeSections: [section],
    stageResearchRecords: [
      {
        id: 'candidate-pafta-1',
        officialSectionIds: [section.id],
        externalGpsLinks: [{ routeMatchStatus: 'candidate' }]
      }
    ]
  })

  assert.equal(queue[0].status, 'candidate-review')
  assert.equal(queue[0].doNotPublish, true)
  assert.equal(
    queue[0].checks.find(check => check.id === 'navigation-link').status,
    'candidate'
  )
  assert.ok(
    queue[0].checks
      .filter(check => check.id !== 'navigation-link')
      .every(check => check.status === 'required')
  )
})

test('keeps a manually reviewed pafta non-public until all eligibility evidence exists', () => {
  const [section] = routeSections
  const queue = buildOfficialPaftaReconciliationQueue({
    routeSections: [section],
    paftaReconciliationReviews: [
      {
        id: 'review-pafta-1',
        sectionId: section.id,
        candidateRecordId: 'candidate-pafta-1',
        status: 'verified',
        officialReference: {
          sourceId: section.officialMapSourceId,
          url: section.officialMapUrl,
          checkedAt: '2026-08-28'
        },
        comparison: Object.fromEntries(
          ['start', 'end', 'direction', 'variant'].map(field => [
            field,
            'matches-official-reference'
          ])
        ),
        independentCorroboration: {
          sourceIds: ['ibrahim-2014-likya-walk'],
          checkedAt: '2026-08-28'
        },
        reviewedAt: '2026-08-28',
        reviewedBy: 'Editoryal ekip',
        decisionNote: 'Test amaçlı resmî eşleştirme.'
      }
    ]
  })

  assert.equal(queue[0].status, 'official-match-reviewed')
  assert.equal(queue[0].doNotPublish, true)
})
