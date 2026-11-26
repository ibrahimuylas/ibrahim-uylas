const assert = require('node:assert/strict')
const test = require('node:test')

const { stageGuideByArticleSlug, stageGuides } = require('./stage-guides')
const { historicalWalkingStages } = require('./walking-stages')

test('models every retained Likya stage article through one central lookup', () => {
  assert.equal(stageGuides.length, 11)
  assert.equal(Object.keys(stageGuideByArticleSlug).length, 11)
  assert.deepEqual(
    stageGuides.map(stage => stage.articleSlug),
    historicalWalkingStages.map(stage => stage.relatedArticleSlugs[0])
  )
})

test('keeps retained stages historical until official coverage is reconciled', () => {
  stageGuides.forEach(stage => {
    assert.equal(stage.planningEligibility, 'not-eligible-until-reconciled')
    assert.deepEqual(stage.officialSectionIds, [])
    assert.equal(stage.routeAndEffortStatus, 'not-yet-verified')
  })
})
