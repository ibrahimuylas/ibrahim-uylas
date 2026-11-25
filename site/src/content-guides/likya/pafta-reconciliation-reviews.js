const { sourceById } = require('./sources')

const paftaReconciliationReviewStates = [
  'draft',
  'needs-evidence',
  'verified',
  'rejected'
]

const verifiedReviewFields = [
  'id',
  'sectionId',
  'candidateRecordId',
  'status',
  'officialReference',
  'comparison',
  'independentCorroboration',
  'reviewedAt',
  'reviewedBy',
  'decisionNote'
]

const comparisonFields = ['start', 'end', 'direction', 'variant']

const isRecordedNeedsEvidenceReview = review =>
  review?.status === 'needs-evidence' &&
  Boolean(review.id) &&
  Boolean(review.sectionId) &&
  Boolean(review.candidateRecordId) &&
  Boolean(review.officialReference?.sourceId) &&
  Boolean(review.officialReference?.url) &&
  Boolean(review.officialReference?.checkedAt) &&
  Array.isArray(review.observationSourceIds) &&
  review.observationSourceIds.length >= 2 &&
  Boolean(review.candidateScopeStatus) &&
  Boolean(review.reviewedAt) &&
  Boolean(review.reviewedBy) &&
  Boolean(review.decisionNote)

const independentCorroborationSourceTypes = [
  'book',
  'community',
  'first-hand',
  'editorial'
]

const hasIndependentCorroboration = (review, sourcesById = sourceById) => {
  const officialSource = sourcesById[review?.officialReference?.sourceId]

  return (review?.independentCorroboration?.sourceIds || []).some(sourceId => {
    const source = sourcesById[sourceId]

    return (
      source &&
      sourceId !== review.officialReference?.sourceId &&
      source.publisher !== officialSource?.publisher &&
      independentCorroborationSourceTypes.includes(source.sourceType)
    )
  })
}

const isCompleteOfficialPaftaReview = review =>
  review?.status === 'verified' &&
  verifiedReviewFields.every(field => Boolean(review[field])) &&
  Boolean(review.officialReference?.sourceId) &&
  Boolean(review.officialReference?.url) &&
  Boolean(review.officialReference?.checkedAt) &&
  comparisonFields.every(
    field => review.comparison?.[field] === 'matches-official-reference'
  ) &&
  Array.isArray(review.independentCorroboration?.sourceIds) &&
  review.independentCorroboration.sourceIds.length > 0 &&
  Boolean(review.independentCorroboration?.checkedAt) &&
  hasIndependentCorroboration(review)

const buildPaftaReconciliationReviewIndex = reviews =>
  Object.fromEntries(
    (reviews || [])
      .filter(isCompleteOfficialPaftaReview)
      .map(review => [review.sectionId, review])
  )

const buildPaftaReviewHistoryIndex = reviews =>
  (reviews || []).reduce((index, review) => {
    if (!review?.sectionId) return index

    const current = index[review.sectionId]
    if (!current || String(review.reviewedAt) > String(current.reviewedAt)) {
      index[review.sectionId] = review
    }

    return index
  }, {})

const paftaReconciliationReviews = [
  {
    id: 'review-pafta-29-official-description-2026-10-15',
    sectionId: 'ktb-pafta-29',
    candidateRecordId:
      'eastern-pafta-29-yayla-kuzdere-gedelme-wikiloc-candidate',
    status: 'needs-evidence',
    officialReference: {
      sourceId: 'ktb-pafta-29-detail',
      url: 'https://likyayolu.ktb.gov.tr/TR-236474/pafta-29-tekedagi---gunesli.html',
      checkedAt: '2026-10-15'
    },
    observationSourceIds: ['ktb-pafta-29-detail', 'wikiloc-48750651'],
    candidateScopeStatus:
      'western-branch-description-aligned-geometry-unchecked',
    reviewedAt: '2026-10-15',
    reviewedBy: 'Likya rehber editoryal araştırması',
    decisionNote:
      'Resmî sayfanın Tekedağı–Güneşli başlığına rağmen ayrıntı Yayla Kuzdere–Gedelma batı kolunu ve Kuzdere’den gelen doğu koluyla birleşmeyi anlatır. 48750651, batı kolu ve Gedelme sonrası devamı için adaydır. Göynük Yayla uzantısı, pafta sınırı, eski/yeni giriş ve doğu kolunun ayrı iz gereksinimi harita üzerinde çözülmeden tam eşleşme sayılmaz.'
  },
  {
    id: 'review-pafta-31-hisarcandir-extension-2026-10-15',
    sectionId: 'ktb-pafta-31',
    candidateRecordId:
      'eastern-pafta-31-saricinar-hisarcandir-wikiloc-candidate',
    status: 'needs-evidence',
    officialReference: {
      sourceId: 'ktb-pafta-31-detail',
      url: 'https://likyayolu.ktb.gov.tr/TR-236479/pafta-31-saricinar---hisarcandir.html',
      checkedAt: '2026-10-15'
    },
    observationSourceIds: ['ktb-pafta-31-detail', 'wikiloc-22774675'],
    candidateScopeStatus: 'hisarcandir-continuation-found-geometry-unchecked',
    reviewedAt: '2026-10-15',
    reviewedBy: 'Likya rehber editoryal araştırması',
    decisionNote:
      '22774675, Göynük çıkışlı tek yönlü kayıtta Sarıçınar Düzlüğü, Dayısı/Hüdacık, Elmayanı ve Hisarçandır ara noktalarını içerir. 23809595 kaydının yalnızca alt kesim gidiş-dönüş olması sorununu kapsam düzeyinde giderir. Resmî pafta sınırı ve geometri eşleştirmesi henüz tamamlanmadı.'
  },
  {
    id: 'review-pafta-1-candidate-scope-2026-08-28',
    sectionId: 'ktb-pafta-1',
    candidateRecordId: 'western-pafta-1-ovacik-kirme-wikiloc-candidate',
    status: 'needs-evidence',
    officialReference: {
      sourceId: 'ktb-likya-map-1',
      url: 'https://likyayolu.ktb.gov.tr/TR-237128/likya-yolu-haritasi-1.html',
      checkedAt: '2026-08-28'
    },
    observationSourceIds: ['ktb-pafta-1-detail', 'wikiloc-24692574'],
    candidateScopeStatus: 'broader-than-official-pafta',
    reviewedAt: '2026-08-28',
    reviewedBy: 'Likya rehber editoryal araştırması',
    decisionNote:
      'Adayın görünür başlığı Ovacık, Kozağaç, Kirme ve Faralya’yı kapsıyor. Resmî Pafta 1 Ovacık–Kirme bağlamını tarif ediyor; Faralya uzantısı nedeniyle aday pafta sınırını tek başına doğrulamaz. Resmî harita üzerinde iz sınırı ve yön karşılaştırması ile bağımsız ikinci kaynak gerekir.'
  },
  {
    id: 'review-pafta-2-title-scope-2026-08-28',
    sectionId: 'ktb-pafta-2',
    candidateRecordId: 'western-pafta-2-faralya-alinca-wikiloc-candidate',
    status: 'needs-evidence',
    officialReference: {
      sourceId: 'ktb-likya-map-1',
      url: 'https://likyayolu.ktb.gov.tr/TR-237128/likya-yolu-haritasi-1.html',
      checkedAt: '2026-08-28'
    },
    observationSourceIds: ['ktb-pafta-2-detail', 'wikiloc-58521662'],
    candidateScopeStatus: 'title-aligned-geometry-unchecked',
    reviewedAt: '2026-08-28',
    reviewedBy: 'Likya rehber editoryal araştırması',
    decisionNote:
      'Adayın görünür başlığı Faralya–Alınca olup resmî Pafta 2 başlığı ve ayrıntı sayfasındaki Faralya–Kabak–Alınca bağlamıyla uyumludur. Başlık uyumu, iz geometrisini, başlangıç/bitiş sınırlarını, yönü veya rota varyantını doğrulamaz; resmî harita karşılaştırması ve bağımsız ikinci kaynak gerekir.'
  }
]

module.exports = {
  buildPaftaReconciliationReviewIndex,
  buildPaftaReviewHistoryIndex,
  comparisonFields,
  isRecordedNeedsEvidenceReview,
  hasIndependentCorroboration,
  independentCorroborationSourceTypes,
  isCompleteOfficialPaftaReview,
  paftaReconciliationReviews,
  paftaReconciliationReviewStates,
  verifiedReviewFields
}
