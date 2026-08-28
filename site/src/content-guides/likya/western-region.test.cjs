const assert = require('node:assert/strict')
const test = require('node:test')

const westernLikyaRegion = require('./western-region')
const { routeSectionById } = require('./route-sections')
const { sourceById } = require('./sources')

test('keeps the western guide scope bound to the verified ten-pafta inventory', () => {
  assert.equal(westernLikyaRegion.officialSectionIds.length, 10)
  westernLikyaRegion.officialSectionIds.forEach(id => {
    assert.equal(routeSectionById[id].editorialRegion, 'west')
  })
})

test('links western historical stages without presenting them as official coverage', () => {
  assert.equal(westernLikyaRegion.historicalStageLinks.length, 4)
  westernLikyaRegion.historicalStageLinks.forEach(link => {
    assert.equal(link.relationshipStatus, 'historical-article-link-only')
  })
  westernLikyaRegion.officialMapSourceIds.forEach(id => {
    assert.ok(sourceById[id])
  })
})
