const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const {
  buildRouteMetricCoverage,
  isCompleteRouteMetric,
  routeMetricTypes
} = require('./stage-route-metrics')

const completeMetric = metricType => ({
  id: `metric-${metricType}`,
  stageResearchRecordId: 'candidate-pafta-1',
  metricType,
  value: 1,
  measurementMethod: 'official-source',
  sourceIds: ['ktb-likya-route-home'],
  checkedAt: '2026-08-28',
  reviewDueAt: '2026-10-01',
  reviewedBy: 'Editoryal ekip',
  note: 'Test amaçlı kaynaklı ölçüm.'
})

test('does not accept a metric without an explicit measurement method', () => {
  assert.equal(isCompleteRouteMetric(completeMetric('distance-km')), true)
  assert.equal(
    isCompleteRouteMetric({
      ...completeMetric('distance-km'),
      measurementMethod: null
    }),
    false
  )
})

test('keeps a candidate pafta non-public until all route metrics are evidenced', () => {
  const [section] = routeSections
  const partial = buildRouteMetricCoverage({
    routeSections: [section],
    stageResearchRecords: [
      { id: 'candidate-pafta-1', officialSectionIds: [section.id] }
    ],
    stageRouteMetrics: [completeMetric('distance-km')]
  })

  assert.equal(partial[0].status, 'route-metrics-needed')
  assert.deepEqual(partial[0].missingMetricTypes, routeMetricTypes.slice(1))
  assert.equal(partial[0].doNotPublish, true)

  const complete = buildRouteMetricCoverage({
    routeSections: [section],
    stageResearchRecords: [
      { id: 'candidate-pafta-1', officialSectionIds: [section.id] }
    ],
    stageRouteMetrics: routeMetricTypes.map(completeMetric)
  })

  assert.equal(complete[0].status, 'route-metrics-complete')
  assert.equal(complete[0].doNotPublish, false)
})
