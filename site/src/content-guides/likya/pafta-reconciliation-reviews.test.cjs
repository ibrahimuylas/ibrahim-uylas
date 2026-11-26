const assert = require('node:assert/strict')
const test = require('node:test')

const {
  buildPaftaReconciliationReviewIndex,
  isCompleteOfficialPaftaReview,
  isRecordedNeedsEvidenceReview
} = require('./pafta-reconciliation-reviews')

const completeReview = {
  id: 'review-pafta-1',
  sectionId: 'ktb-pafta-1',
  candidateRecordId: 'western-pafta-1-ovacik-kirme-wikiloc-candidate',
  status: 'verified',
  officialReference: {
    sourceId: 'ktb-likya-map-1',
    url: 'https://likyayolu.ktb.gov.tr/TR-237128/likya-yolu-haritasi-1.html',
    checkedAt: '2026-08-28'
  },
  comparison: {
    start: 'matches-official-reference',
    end: 'matches-official-reference',
    direction: 'matches-official-reference',
    variant: 'matches-official-reference'
  },
  independentCorroboration: {
    sourceIds: ['ibrahim-2014-likya-walk'],
    checkedAt: '2026-08-28'
  },
  reviewedAt: '2026-08-28',
  reviewedBy: 'Editoryal ekip',
  decisionNote: 'Test amaçlı tam inceleme.'
}

test('requires a complete manual comparison before accepting a pafta review', () => {
  assert.equal(isCompleteOfficialPaftaReview(completeReview), true)
  assert.equal(
    isCompleteOfficialPaftaReview({
      ...completeReview,
      comparison: {
        ...completeReview.comparison,
        variant: 'uncertain'
      }
    }),
    false
  )
})

test('rejects a Ministry source as the purported independent corroboration', () => {
  assert.equal(
    isCompleteOfficialPaftaReview({
      ...completeReview,
      independentCorroboration: {
        ...completeReview.independentCorroboration,
        sourceIds: ['ktb-likya-route-home']
      }
    }),
    false
  )
})

test('records an evidence-needed review without treating it as a verified decision', () => {
  const review = {
    id: 'review-pafta-1',
    sectionId: 'ktb-pafta-1',
    candidateRecordId: 'candidate-pafta-1',
    status: 'needs-evidence',
    officialReference: {
      sourceId: 'ktb-likya-map-1',
      url: 'https://likyayolu.ktb.gov.tr/TR-237128/likya-yolu-haritasi-1.html',
      checkedAt: '2026-08-28'
    },
    observationSourceIds: ['ktb-pafta-1-detail', 'wikiloc-24692574'],
    candidateScopeStatus: 'broader-than-official-pafta',
    reviewedAt: '2026-08-28',
    reviewedBy: 'Editoryal ekip',
    decisionNote: 'Aday pafta sınırını aşmaktadır.'
  }

  assert.equal(isRecordedNeedsEvidenceReview(review), true)
  assert.equal(isCompleteOfficialPaftaReview(review), false)
})

test('indexes only complete verified decisions', () => {
  const index = buildPaftaReconciliationReviewIndex([
    completeReview,
    {
      ...completeReview,
      id: 'draft-pafta-2',
      sectionId: 'ktb-pafta-2',
      status: 'draft'
    }
  ])

  assert.deepEqual(Object.keys(index), ['ktb-pafta-1'])
})
