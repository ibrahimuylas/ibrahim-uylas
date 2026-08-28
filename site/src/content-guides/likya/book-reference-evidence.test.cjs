const assert = require('node:assert/strict')
const test = require('node:test')

const {
  buildBookReferenceEvidenceCoverage,
  isCompleteBookReferenceEvidence
} = require('./book-reference-evidence')

const sourceById = {
  'likya-guidebook-test': {
    sourceType: 'book',
    publisher: 'Test Yayıncısı'
  }
}

const completeEvidence = {
  id: 'book-pafta-1-context',
  sourceId: 'likya-guidebook-test',
  sectionIds: ['ktb-pafta-1'],
  edition: '1. baskı',
  pageReference: 's. 42',
  claimType: 'route-context',
  paraphrase:
    'Kaynak, paftanın başlangıç çevresini ve resmî haritayla karşılaştırılması gereken rota bağlamını tarif eder.',
  capturedAt: '2026-08-28',
  reviewedBy: 'Editoryal ekip',
  rightsStatus: 'citation-only'
}

test('accepts only page-specific, paraphrased book evidence', () => {
  assert.equal(
    isCompleteBookReferenceEvidence(completeEvidence, sourceById),
    true
  )
  assert.equal(
    isCompleteBookReferenceEvidence(
      { ...completeEvidence, quote: 'Kitaptan doğrudan bir alıntı.' },
      sourceById
    ),
    false
  )
})

test('keeps book context out of the public release path', () => {
  const coverage = buildBookReferenceEvidenceCoverage({
    routeSections: [
      { id: 'ktb-pafta-1', sequence: 1, officialTitle: 'Ovacık – Kirme' }
    ],
    bookReferenceEvidence: [completeEvidence]
  })

  assert.equal(coverage[0].status, 'book-context-indexed')
  assert.equal(coverage[0].doNotPublish, true)
})
