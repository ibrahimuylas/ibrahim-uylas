const likya = require('../src/content-guides/likya')
const {
  buildOperationalEvidenceCoverage
} = require('../src/content-guides/likya/stage-operational-evidence')

const coverage = buildOperationalEvidenceCoverage({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords,
  stageOperationalEvidence: likya.stageOperationalEvidence
})

process.stdout.write('Likya operasyonel kanıt kapsamı\n\n')
coverage.forEach(item => {
  process.stdout.write(
    `- ${item.sequence}. ${item.officialTitle}: ${item.status}; eksik: ${item.missingFactTypes.join(', ') || 'yok'}.\n`
  )
})
