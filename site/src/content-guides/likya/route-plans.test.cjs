const assert = require('node:assert/strict')
const test = require('node:test')

const { routePlanCatalog, routePlans } = require('./route-plans')

test('withholds speculative route plans from the published catalog', () => {
  assert.deepEqual(routePlans, [])
  assert.equal(routePlanCatalog.status, 'withheld-until-verified')
  assert.ok(routePlanCatalog.requirements.length >= 4)
  assert.ok(routePlanCatalog.nextBestActions.length >= 3)
})
