const assert = require('node:assert/strict')
const test = require('node:test')

const {
  checklistItems,
  historicalArchiveLinks,
  preparationTopics
} = require('./preparation-center')

test('keeps all nine preparation topics available with the three editorial layers', () => {
  assert.equal(preparationTopics.length, 9)
  preparationTopics.forEach(topic => {
    assert.ok(topic.id)
    assert.ok(topic.title)
    assert.ok(topic.shortAnswer.length >= 5)
    assert.ok(topic.apply.length >= 3)
  })
})

test('keeps universal essentials visible regardless of checklist choices', () => {
  assert.ok(checklistItems.filter(item => item.universal).length >= 5)
  assert.ok(checklistItems.some(item => item.lodgingModes?.includes('camp')))
  assert.ok(checklistItems.some(item => item.lodgingModes?.includes('pension')))
  assert.ok(
    historicalArchiveLinks.every(link => link.note.includes('değildir'))
  )
})
