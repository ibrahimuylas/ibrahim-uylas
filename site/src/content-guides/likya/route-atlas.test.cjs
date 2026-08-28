const assert = require('node:assert/strict')
const test = require('node:test')

const { routeSections } = require('./route-sections')
const {
  filterRouteSections,
  regionBoundary,
  sectionsByRegion
} = require('./route-atlas')

test('keeps all official sections in a single ordered atlas inventory', () => {
  const groups = sectionsByRegion(routeSections)

  assert.equal(groups.flatMap(group => group.sections).length, 31)
  assert.deepEqual(
    groups.flatMap(group => group.sections).map(section => section.sequence),
    Array.from({ length: 31 }, (_, index) => index + 1)
  )
})

test('filters the local static inventory without inventing missing distances', () => {
  assert.equal(
    filterRouteSections(routeSections, { region: 'west' }).length,
    10
  )
  assert.equal(
    filterRouteSections(routeSections, { distance: 'verified' }).length,
    0
  )
  assert.deepEqual(
    filterRouteSections(routeSections, { search: 'Patara' }).map(
      section => section.sequence
    ),
    [7]
  )
})

test('reports region boundaries from the official ordered inventory', () => {
  const west = sectionsByRegion(routeSections)[0]

  assert.deepEqual(regionBoundary(west.sections), {
    start: 'Ovacık',
    end: 'Çukurbağ'
  })
})
