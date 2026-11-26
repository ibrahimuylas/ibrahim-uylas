const likya = require('../src/content-guides/likya')
const {
  buildRouteMetricCoverage
} = require('../src/content-guides/likya/stage-route-metrics')

const coverage = buildRouteMetricCoverage({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  stageRouteMetrics: likya.stageRouteMetrics
})

process.stdout.write('Likya rota metriği kapsamı\n\n')
coverage.forEach(item => {
  process.stdout.write(
    `- ${item.sequence}. ${item.officialTitle}: ${item.status}; eksik: ${item.missingMetricTypes.join(', ') || 'yok'}.\n`
  )
})
