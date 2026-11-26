const assert = require('node:assert/strict')
const test = require('node:test')

const { sourceById } = require('./sources')
const {
  conditionRowsForScope,
  displayedConditionStatus
} = require('./condition-status')

test('renders all four condition categories as explicit unknown rows without records', () => {
  const rows = conditionRowsForScope({
    conditions: [],
    scope: { regionIds: ['west'] },
    sourceById,
    buildDate: '2026-08-28'
  })

  assert.equal(rows.length, 4)
  rows.forEach(row => {
    assert.equal(row.status, 'unknown')
    assert.ok(row.sourceUrl)
    assert.ok(row.replacementCheck)
  })
})

test('degrades an expired seasonal review to review due without mutating its source record', () => {
  const condition = {
    status: 'season-reviewed',
    reviewDueAt: '2026-04-01'
  }

  assert.equal(displayedConditionStatus(condition, '2026-08-28'), 'review-due')
  assert.equal(condition.status, 'season-reviewed')
})
