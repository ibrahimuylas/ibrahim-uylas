const { conditionCategories } = require('./conditions')

const conditionStatusLabels = {
  'official-notice': 'Resmî duyuru var',
  'season-reviewed': 'Bu sezon kaynak kontrol edildi',
  'historical-note': 'Tarihsel saha notu',
  'review-due': 'Yakın tarihte doğrulanmadı',
  unknown: 'Güncel bilgi bulunamadı'
}

const dateOnly = value =>
  typeof value === 'string' ? value.slice(0, 10) : null

const isPastDue = (reviewDueAt, buildDate) =>
  Boolean(
    reviewDueAt && buildDate && dateOnly(reviewDueAt) < dateOnly(buildDate)
  )

const displayedConditionStatus = (condition, buildDate) => {
  if (!condition) return 'unknown'
  if (condition.archivedAt) return 'review-due'
  if (isPastDue(condition.reviewDueAt, buildDate)) return 'review-due'

  return condition.status
}

const matchesScope = (condition, scope = {}) => {
  const matches = (recordIds, scopeIds) =>
    Array.isArray(recordIds) &&
    Array.isArray(scopeIds) &&
    recordIds.some(id => scopeIds.includes(id))

  return (
    matches(condition.routeSectionIds, scope.routeSectionIds) ||
    matches(condition.stageIds, scope.stageIds) ||
    matches(condition.regionIds, scope.regionIds)
  )
}

const latestApplicableCondition = (conditions, category, scope) =>
  conditions
    .filter(
      condition =>
        condition.category === category &&
        !condition.archivedAt &&
        matchesScope(condition, scope)
    )
    .sort((left, right) =>
      String(right.checkedAt || right.observedAt).localeCompare(
        String(left.checkedAt || left.observedAt)
      )
    )[0]

const conditionRowsForScope = ({
  conditions = [],
  scope = {},
  sourceById,
  buildDate
}) =>
  conditionCategories.map(category => {
    const condition = latestApplicableCondition(conditions, category.id, scope)

    if (!condition) {
      const source = sourceById[category.fallbackSourceId]

      return {
        id: category.id,
        category: category.label,
        status: 'unknown',
        statusLabel: conditionStatusLabels.unknown,
        summary: category.fallbackSummary,
        source,
        sourceUrl: source?.url,
        checkedAt: null,
        observedAt: null,
        effectiveFrom: null,
        effectiveTo: null,
        reviewDueAt: null,
        replacementCheck: category.defaultReviewRule,
        blocksRecommendation: false,
        isFallback: true
      }
    }

    const source = sourceById[condition.sourceId]
    const status = displayedConditionStatus(condition, buildDate)

    return {
      ...condition,
      status,
      statusLabel: conditionStatusLabels[status],
      source,
      sourceUrl: condition.sourceUrl || source?.url,
      isFallback: false
    }
  })

module.exports = {
  conditionRowsForScope,
  conditionStatusLabels,
  displayedConditionStatus,
  isPastDue,
  matchesScope
}
