const assert = require('node:assert/strict')
const test = require('node:test')

const easternLikyaRegion = require('./eastern-region')
const { routeSectionById } = require('./route-sections')
const { sourceById } = require('./sources')

test('keeps the eastern guide scope bound to the verified thirteen-pafta inventory', () => {
  assert.equal(easternLikyaRegion.officialSectionIds.length, 13)
  easternLikyaRegion.officialSectionIds.forEach(id => {
    assert.equal(routeSectionById[id].editorialRegion, 'east')
  })
})

test('keeps 2014 eastern material as a plan lead rather than walked coverage', () => {
  const [historicalPlan] = easternLikyaRegion.historicalPlanLinks

  assert.equal(
    historicalPlan.relationshipStatus,
    'planned-not-confirmed-as-walked'
  )
  assert.match(historicalPlan.disclaimer, /yürüyüş kanıtı değildir/)
  assert.match(easternLikyaRegion.publicationStatus, /yayımlanmaz/)
  easternLikyaRegion.officialMapSourceIds.forEach(id => {
    assert.ok(sourceById[id])
  })
})
