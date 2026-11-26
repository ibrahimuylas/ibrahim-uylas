const routeMetricTypes = [
  'distance-km',
  'ascent-m',
  'descent-m',
  'expected-hours'
]

const metricMeasurementMethods = [
  'official-source',
  'rights-cleared-gps-analysis',
  'field-observation'
]

const isDateLike = value =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

const isCompleteRouteMetric = metric =>
  routeMetricTypes.includes(metric?.metricType) &&
  Number.isFinite(metric?.value) &&
  metric.value >= 0 &&
  metricMeasurementMethods.includes(metric?.measurementMethod) &&
  Array.isArray(metric.sourceIds) &&
  metric.sourceIds.length > 0 &&
  isDateLike(metric.checkedAt) &&
  isDateLike(metric.reviewDueAt) &&
  Boolean(metric.reviewedBy) &&
  Boolean(metric.note)

const buildRouteMetricCoverage = ({
  routeSections = [],
  stageResearchRecords = [],
  stageRouteMetrics = []
} = {}) => {
  const metricsByRecordId = new Map()

  stageRouteMetrics.forEach(metric => {
    const entries = metricsByRecordId.get(metric.stageResearchRecordId) || []
    entries.push(metric)
    metricsByRecordId.set(metric.stageResearchRecordId, entries)
  })

  return routeSections.map(section => {
    const records = stageResearchRecords.filter(record =>
      record.officialSectionIds?.includes(section.id)
    )
    const metrics = records.flatMap(
      record => metricsByRecordId.get(record.id) || []
    )
    const completeMetricTypes = new Set(
      metrics.filter(isCompleteRouteMetric).map(metric => metric.metricType)
    )
    const missingMetricTypes = routeMetricTypes.filter(
      metricType => !completeMetricTypes.has(metricType)
    )

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      relatedResearchRecordIds: records.map(record => record.id),
      metricIds: metrics.map(metric => metric.id),
      status:
        records.length === 0
          ? 'no-candidate'
          : missingMetricTypes.length === 0
            ? 'route-metrics-complete'
            : 'route-metrics-needed',
      missingMetricTypes,
      doNotPublish: missingMetricTypes.length > 0,
      nextAction:
        records.length === 0
          ? 'Önce resmî paftayla ilişkilendirilebilecek bir aday veya birincil saha kanıtı bul.'
          : 'Her metriği ölçüm yöntemi, izinli kaynak, kontrol tarihi ve yeniden inceleme tarihiyle kaydet.'
    }
  })
}

// Deliberately empty. Candidate route pages and their displayed figures are not
// copied into local metric data without an eligible, rights-compatible source.
const stageRouteMetrics = []

module.exports = {
  buildRouteMetricCoverage,
  isCompleteRouteMetric,
  metricMeasurementMethods,
  routeMetricTypes,
  stageRouteMetrics
}
