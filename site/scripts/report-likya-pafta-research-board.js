const likya = require('../src/content-guides/likya')
const {
  buildPaftaResearchBoard,
  formatPaftaResearchBoard
} = require('../src/content-guides/likya/pafta-research-board')

const board = buildPaftaResearchBoard({
  routeSections: likya.routeSections,
  stageResearchRecords: likya.stageResearchRecords
})

process.stdout.write(`${formatPaftaResearchBoard(board)}\n`)
