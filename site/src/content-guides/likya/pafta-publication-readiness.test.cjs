const assert = require('node:assert/strict')
const test = require('node:test')

const {
  buildPaftaPublicationReadiness,
  isCompletePaftaPublicationRecord
} = require('./pafta-publication-readiness')

const section = {
  id: 'ktb-pafta-1',
  sequence: 1,
  officialTitle: 'Ovacık – Kirme',
  officialMapSourceId: 'ktb-likya-map-1',
  officialMapUrl: 'https://example.com/official-map'
}

const verifiedReview = {
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
  decisionNote: 'Test amaçlı doğrulanmış inceleme.'
}

const eligibleResearch = {
  id: 'candidate-pafta-1',
  researchStatus: 'eligible',
  officialSectionIds: [section.id],
  sourceIds: ['ktb-likya-route-home'],
  name: 'Ovacık – Kirme',
  start: 'Ovacık',
  end: 'Kirme',
  direction: 'eastbound',
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
  routeMetrics: Object.fromEntries(
    ['distanceKm', 'ascentM', 'descentM', 'expectedHours'].map(field => [
      field,
      { value: 1, sourceId: 'ktb-likya-route-home' }
    ])
  ),
  logisticsEvidence: Object.fromEntries(
    ['water', 'resupply', 'lodging', 'transport', 'emergencyExit'].map(
      field => [field, { status: 'unavailable' }]
    )
  )
}

const publicationRecord = {
  id: 'guide-pafta-1',
  sectionId: section.id,
  publicationStatus: 'ready',
  primaryResearchRecordId: eligibleResearch.id,
  guidePath: '/likya-yolu/pafta-1-ovacik-kirme/',
  summary:
    'Ovacık ile Kirme arasındaki doğrulanmış pafta rehberi; yürüyüşe başlamadan önce güncel duyuru ve koşul kontrolleri ayrıca yapılmalıdır.',
  routeNarrative:
    'Bu test kaydı, pafta sayfası için gereken rehber anlatısının yalnızca editoryal inceleme ve kaynak kontrolünden sonra yayımlandığını doğrular. Rota kararları, güncel koşullar ve resmî sınır bilgisi bu anlatıdan bağımsız olarak her yürüyüş öncesi tekrar kontrol edilmelidir.',
  decisionPoints: [
    {
      title: 'Başlangıç kontrolü',
      description:
        'Başlamadan önce resmî paftayı ve güncel duyuruları açarak günün koşullarını ayrı ayrı kontrol et.'
    },
    {
      title: 'Yolda yeniden değerlendirme',
      description:
        'İşaret, hava veya erişim değiştiğinde plana bağlı kalmadan güvenli çıkış seçeneğini yeniden değerlendir.'
    }
  ],
  contentReviewedAt: '2026-08-28',
  contentReviewedBy: 'Editoryal ekip',
  sourceIds: ['ktb-likya-route-home']
}

test('holds an individual pafta until every local publication requirement is met', () => {
  const [result] = buildPaftaPublicationReadiness({
    routeSections: [section],
    officialPaftaObservations: [{ sectionId: section.id }]
  })

  assert.equal(result.decision, 'hold')
  assert.equal(result.canPublish, false)
  assert.deepEqual(result.blockers, [
    'official-match-review',
    'eligible-stage-evidence',
    'content-review'
  ])
})

test('allows one fully evidenced pafta without opening the all-route guide', () => {
  const [result] = buildPaftaPublicationReadiness({
    routeSections: [section],
    stageResearchRecords: [eligibleResearch],
    paftaReconciliationReviews: [verifiedReview],
    officialPaftaObservations: [{ sectionId: section.id }],
    paftaPublicationRecords: [publicationRecord]
  })

  assert.equal(isCompletePaftaPublicationRecord(publicationRecord), true)
  assert.equal(result.decision, 'ready')
  assert.equal(result.canPublish, true)
})
