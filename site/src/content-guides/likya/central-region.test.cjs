const assert = require('node:assert/strict')
const test = require('node:test')

const centralLikyaRegion = require('./central-region')
const { routeSectionById } = require('./route-sections')
const { sourceById } = require('./sources')

test('keeps the central guide scope bound to the verified eight-pafta inventory', () => {
  assert.equal(centralLikyaRegion.officialSectionIds.length, 8)
  centralLikyaRegion.officialSectionIds.forEach(id => {
    assert.equal(routeSectionById[id].editorialRegion, 'central')
  })
})

test('keeps the 230 km walk as historical context rather than route coverage', () => {
  assert.equal(centralLikyaRegion.historicalStageLinks.length, 7)
  assert.match(centralLikyaRegion.walkedRouteContext.disclaimer, /2014/)
  centralLikyaRegion.officialMapSourceIds.forEach(id => {
    assert.ok(sourceById[id])
  })
})
