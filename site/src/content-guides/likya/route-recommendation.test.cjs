const assert = require('node:assert/strict')
const test = require('node:test')

const {
  recommendRoute,
  requestFromSearch,
  resultSearchParams
} = require('./route-recommendation')

const plans = [
  {
    id: 'five-day-coastal',
    publicationStatus: 'published',
    planningEligibility: 'eligible',
    supportedDurations: ['5'],
    recommendedSeasonBands: ['spring', 'autumn'],
    excludedSeasonBands: ['summer'],
    minimumExperience: 'first-multiday',
    dailyLoadBand: 'balanced',
    lodgingModes: ['pension', 'mixed'],
    tripCharacterTags: ['sea', 'balanced'],
    transportModes: ['public', 'private'],
    soloSuitable: true,
    editorialPriority: 20
  },
  {
    id: 'five-day-quiet',
    publicationStatus: 'published',
    planningEligibility: 'eligible',
    supportedDurations: ['5'],
    recommendedSeasonBands: ['spring'],
    excludedSeasonBands: [],
    minimumExperience: 'some-multiday',
    dailyLoadBand: 'demanding',
    lodgingModes: ['camp', 'mixed'],
    tripCharacterTags: ['quiet-nature'],
    transportModes: ['private'],
    soloSuitable: false,
    editorialPriority: 30
  }
]

const baseRequest = {
  when: 'month',
  month: '4',
  duration: '5',
  experience: 'first-multiday',
  load: 'balanced',
  lodging: 'pension',
  priority: 'sea',
  transport: 'public',
  solo: 'solo'
}

test('returns the deterministically best authored route plan', () => {
  const result = recommendRoute({ plans, request: baseRequest })

  assert.equal(result.status, 'match')
  assert.equal(result.primary.plan.id, 'five-day-coastal')
  assert.equal(result.alternatives.length, 0)
  assert.equal(result.primary.reasons.length, 3)
})

test('removes plans that violate hard season, experience or lodging constraints', () => {
  const result = recommendRoute({
    plans,
    request: { ...baseRequest, month: '7', lodging: 'camp' }
  })

  assert.equal(result.status, 'no-match')
  assert.match(result.recovery, /mevsim/i)
})

test('never recommends a withheld or ineligible plan', () => {
  const result = recommendRoute({
    plans: [
      {
        ...plans[0],
        id: 'withheld-five-day-plan',
        publicationStatus: 'withheld'
      },
      {
        ...plans[0],
        id: 'ineligible-five-day-plan',
        planningEligibility: 'not-eligible-until-reconciled'
      }
    ],
    request: baseRequest
  })

  assert.equal(result.status, 'no-match')
  assert.deepEqual(result.candidates, [])
})

test('keeps exact dates out of regular result links and restores explicit shares', () => {
  const request = { ...baseRequest, when: 'date', startDate: '2026-04-14' }

  assert.doesNotMatch(resultSearchParams(request), /date=/)
  assert.match(
    resultSearchParams(request, {
      includeExactDate: true,
      planId: 'five-day-coastal'
    }),
    /date=2026-04-14&plan=five-day-coastal/
  )
  assert.deepEqual(requestFromSearch('?duration=5&month=4&load=balanced'), {
    duration: '5',
    experience: null,
    load: 'balanced',
    lodging: null,
    priority: null,
    transport: null,
    solo: null,
    planId: null,
    startDate: null,
    month: '4',
    when: 'month'
  })
})
