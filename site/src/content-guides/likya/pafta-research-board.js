const {
  buildStageResearchCoverage,
  hasEligibleResearchEvidence
} = require('./stage-research')

const researchChecklist = [
  'official-boundary',
  'practical-stage-decision',
  'gps-rights',
  'route-metrics',
  'terrain-and-hazards',
  'water',
  'resupply',
  'sleep-or-camping',
  'transport',
  'emergency-exit',
  'editorial-review'
]

const checklistStatusFor = ({ sectionId, records }) => {
  const relatedRecords = records.filter(record =>
    record.officialSectionIds?.includes(sectionId)
  )
  const evidenceComplete = relatedRecords.some(hasEligibleResearchEvidence)

  return researchChecklist.map(id => ({
    id,
    status: evidenceComplete ? 'complete' : 'required'
  }))
}

const buildPaftaResearchBoard = ({
  routeSections = [],
  stageResearchRecords = []
} = {}) => {
  const coverage = buildStageResearchCoverage({
    routeSections,
    stageResearchRecords
  })
  const coverageBySectionId = Object.fromEntries(
    coverage.sections.map(section => [section.sectionId, section])
  )

  return routeSections.map(section => {
    const sectionCoverage = coverageBySectionId[section.id]
    const matchingRecords = stageResearchRecords.filter(record =>
      record.officialSectionIds?.includes(section.id)
    )
    const evidenceComplete = matchingRecords.some(hasEligibleResearchEvidence)

    return {
      id: `research-board-${section.id}`,
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      editorialRegion: section.editorialRegion,
      officialReference: {
        sourceId: section.officialMapSourceId,
        url: section.officialMapUrl || section.officialMapCollectionUrl
      },
      coverageStatus: sectionCoverage.status,
      relatedResearchRecordIds: sectionCoverage.recordIds,
      doNotPublish: !evidenceComplete,
      checklist: checklistStatusFor({
        sectionId: section.id,
        records: stageResearchRecords
      }),
      nextAction: evidenceComplete
        ? 'Etap verisini ikinci editör incelemesine ve yayın kapısı kontrolüne gönder.'
        : 'Resmî pafta referansını incele; pratik etap kararı ve hakları net GPS kanıtı topla.'
    }
  })
}

const formatPaftaResearchBoard = board => {
  const lines = ['Likya pafta araştırma panosu', '']

  board.forEach(card => {
    const pendingCount = card.checklist.filter(
      item => item.status === 'required'
    ).length

    lines.push(
      `- ${card.sequence}. ${card.officialTitle}: ${card.coverageStatus}; ${pendingCount} araştırma adımı bekliyor.`
    )
  })

  return lines.join('\n')
}

module.exports = {
  buildPaftaResearchBoard,
  formatPaftaResearchBoard,
  researchChecklist
}
