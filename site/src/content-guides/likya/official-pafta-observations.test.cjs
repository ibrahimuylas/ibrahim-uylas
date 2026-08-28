const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const { sourceById } = require('./sources')
const {
  buildOfficialObservationCoverage,
  officialPaftaObservations,
  prohibitedUses
} = require('./official-pafta-observations')

test('indexes only bounded, non-current official route context', () => {
  assert.equal(officialPaftaObservations.length, 31)
  assert.ok(
    officialPaftaObservations.every(
      observation =>
        sourceById[observation.sourceId]?.sourceType === 'official-route' &&
        observation.sourceFreshness === 'undated-official-description' &&
        observation.prohibitedUses.includes('current-route-condition') &&
        observation.prohibitedUses.includes('publication-eligibility')
    )
  )
  assert.ok(prohibitedUses.includes('current-water-or-service-availability'))
})

test('keeps indexed official context out of the public release path', () => {
  const coverage = buildOfficialObservationCoverage({
    routeSections,
    officialPaftaObservations
  })

  assert.equal(coverage.length, 31)
  assert.equal(
    coverage.filter(item => item.status === 'official-context-indexed').length,
    31
  )
  assert.ok(coverage.every(item => item.doNotPublish))
})
