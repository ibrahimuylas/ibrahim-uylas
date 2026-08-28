const likya = require('../src/content-guides/likya')
const {
  buildStageResearchCoverage,
  formatStageResearchCoverage
} = require('../src/content-guides/likya/stage-research')

const report = buildStageResearchCoverage({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords
})

process.stdout.write(`${formatStageResearchCoverage(report)}\n`)
