const { sourceById } = require('./sources')

const bookReferenceClaimTypes = [
  'route-context',
  'official-boundary',
  'endpoint-and-direction',
  'route-variant',
  'historical-context'
]

const isDateLike = value =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

const isCompleteBookReferenceEvidence = (
  evidence,
  sourcesById = sourceById
) => {
  const source = sourcesById[evidence?.sourceId]

  return (
    source?.sourceType === 'book' &&
    Array.isArray(evidence?.sectionIds) &&
    evidence.sectionIds.length > 0 &&
    typeof evidence.edition === 'string' &&
    Boolean(evidence.edition) &&
    typeof evidence.pageReference === 'string' &&
    Boolean(evidence.pageReference) &&
    bookReferenceClaimTypes.includes(evidence.claimType) &&
    typeof evidence.paraphrase === 'string' &&
    evidence.paraphrase.trim().length >= 30 &&
    evidence.paraphrase.trim().length <= 500 &&
    !evidence.quote &&
    isDateLike(evidence.capturedAt) &&
    Boolean(evidence.reviewedBy) &&
    evidence.rightsStatus === 'citation-only'
  )
}

const buildBookReferenceEvidenceCoverage = ({
  routeSections = [],
  bookReferenceEvidence = []
} = {}) =>
  routeSections.map(section => {
    const evidence = bookReferenceEvidence.filter(item =>
      item.sectionIds?.includes(section.id)
    )

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      evidenceIds: evidence.map(item => item.id),
      status:
        evidence.length > 0
          ? 'book-context-indexed'
          : 'book-context-not-yet-indexed',
      doNotPublish: true,
      nextAction:
        evidence.length > 0
          ? 'Kaydı resmî pafta ve bağımsız kaynak karşılaştırmasında kullan; güncel koşul veya metrik üretme.'
          : 'Kitaptan kaynak künyesi, baskı, sayfa ve kısa bir özet geldiğinde kaynak kaydını ekle.'
    }
  })

// Deliberately empty. Book information is added only from a page-specific,
// paraphrased user or editor submission; no text is copied from a guidebook.
const bookReferenceEvidence = []

module.exports = {
  bookReferenceClaimTypes,
  bookReferenceEvidence,
  buildBookReferenceEvidenceCoverage,
  isCompleteBookReferenceEvidence
}
