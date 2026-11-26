const monthToSeasonBand = {
  1: 'winter',
  2: 'winter',
  3: 'spring',
  4: 'spring',
  5: 'spring',
  6: 'summer',
  7: 'summer',
  8: 'summer',
  9: 'autumn',
  10: 'autumn',
  11: 'autumn',
  12: 'winter'
}

const experienceRank = {
  'first-multiday': 0,
  'some-multiday': 1,
  experienced: 2
}

const deriveSeasonBand = ({ startDate, month, when } = {}) => {
  if (when === 'unknown') return 'unknown'

  const dateMonth = startDate ? Number(startDate.slice(5, 7)) : null
  const selectedMonth = dateMonth || Number(month)

  return monthToSeasonBand[selectedMonth] || 'unknown'
}

const normalizeRequest = request => ({
  duration: request?.duration || null,
  experience: request?.experience || null,
  load: request?.load || null,
  lodging: request?.lodging || null,
  priority: request?.priority || null,
  transport: request?.transport || null,
  solo: request?.solo || null,
  when: request?.when || null,
  month: request?.month || null,
  startDate: request?.startDate || null,
  seasonBand: deriveSeasonBand(request)
})

const includes = (items, value) =>
  Array.isArray(items) && Boolean(value) && items.includes(value)

const meetsExperienceRequirement = (plan, request) => {
  if (!plan.minimumExperience || !request.experience) return true

  return (
    experienceRank[request.experience] >= experienceRank[plan.minimumExperience]
  )
}

const planHardConflicts = (plan, request) => {
  const conflicts = []

  if (!includes(plan.supportedDurations, request.duration)) {
    conflicts.push('duration')
  }
  if (
    request.seasonBand !== 'unknown' &&
    includes(plan.excludedSeasonBands, request.seasonBand)
  ) {
    conflicts.push('season')
  }
  if (!meetsExperienceRequirement(plan, request)) {
    conflicts.push('experience')
  }
  if (!includes(plan.lodgingModes, request.lodging)) {
    conflicts.push('lodging')
  }

  return conflicts
}

const scorePlan = (plan, request) => {
  let score = 0

  if (plan.dailyLoadBand === request.load) score += 3
  if (includes(plan.tripCharacterTags, request.priority)) score += 4
  if (includes(plan.transportModes, request.transport)) score += 1
  if (
    request.seasonBand !== 'unknown' &&
    includes(plan.recommendedSeasonBands, request.seasonBand)
  ) {
    score += 2
  }
  if (request.solo === 'solo' && plan.soloSuitable) score += 1

  return score
}

const compareCandidates = (left, right) =>
  right.score - left.score ||
  (right.plan.editorialPriority || 0) - (left.plan.editorialPriority || 0) ||
  left.plan.id.localeCompare(right.plan.id, 'tr')

const matchReason = (plan, request) => {
  const reasons = []

  if (plan.dailyLoadBand === request.load) {
    reasons.push('Günlük yürüyüş temposu seçtiğin yükle uyumlu.')
  }
  if (includes(plan.tripCharacterTags, request.priority)) {
    reasons.push('Gezinin önceliği bu planın karakteriyle örtüşüyor.')
  }
  if (
    request.seasonBand !== 'unknown' &&
    includes(plan.recommendedSeasonBands, request.seasonBand)
  ) {
    reasons.push('Seçtiğin dönem bu planın önerilen mevsimleri arasında.')
  }

  return reasons.slice(0, 3)
}

const noMatchRecovery = ({ candidates, request }) => {
  const conflicts = candidates.flatMap(candidate => candidate.conflicts)

  if (conflicts.includes('season')) {
    return 'Bu dönem için mevsim tercihini değiştir veya planların uygun sezonlarını incele.'
  }
  if (conflicts.includes('experience')) {
    return 'Daha kısa ve rahat günleri olan bir planı ya da deneyim tercihini yeniden değerlendir.'
  }
  if (conflicts.includes('lodging')) {
    return 'Konaklama tercihini karma seçeneğine genişletmeyi değerlendirebilirsin.'
  }

  return request.duration
    ? 'Yürüyüş günü sayısını değiştirmeyi veya tüm etapları incelemeyi deneyebilirsin.'
    : 'Başlamak için yürüyüş günü sayısını seç.'
}

const recommendRoute = ({ plans = [], request } = {}) => {
  const normalizedRequest = normalizeRequest(request)
  const publishablePlans = plans.filter(
    plan =>
      plan.publicationStatus === 'published' &&
      plan.planningEligibility === 'eligible'
  )
  const candidates = publishablePlans.map(plan => ({
    plan,
    conflicts: planHardConflicts(plan, normalizedRequest)
  }))
  const eligible = candidates
    .filter(candidate => candidate.conflicts.length === 0)
    .map(candidate => ({
      ...candidate,
      reasons: matchReason(candidate.plan, normalizedRequest),
      score: scorePlan(candidate.plan, normalizedRequest)
    }))
    .sort(compareCandidates)

  if (eligible.length === 0) {
    return {
      status: 'no-match',
      request: normalizedRequest,
      recovery: noMatchRecovery({ candidates, request: normalizedRequest }),
      candidates
    }
  }

  return {
    status: 'match',
    request: normalizedRequest,
    primary: eligible[0],
    alternatives: eligible.slice(1, 3),
    candidates
  }
}

const resultSearchParams = (
  request,
  { includeExactDate = false, planId = null } = {}
) => {
  const normalizedRequest = normalizeRequest(request)
  const params = new URLSearchParams()

  ;[
    'duration',
    'experience',
    'load',
    'lodging',
    'priority',
    'transport',
    'solo'
  ].forEach(key => {
    if (normalizedRequest[key]) params.set(key, normalizedRequest[key])
  })

  if (normalizedRequest.month) params.set('month', normalizedRequest.month)
  if (includeExactDate && normalizedRequest.startDate) {
    params.set('date', normalizedRequest.startDate)
  }
  if (planId) params.set('plan', planId)

  return params.toString()
}

const requestFromSearch = search => {
  const params = new URLSearchParams(search || '')
  const startDate = params.get('date')
  const month = params.get('month')

  return {
    duration: params.get('duration'),
    experience: params.get('experience'),
    load: params.get('load'),
    lodging: params.get('lodging'),
    priority: params.get('priority'),
    transport: params.get('transport'),
    solo: params.get('solo'),
    planId: params.get('plan'),
    startDate,
    month,
    when: startDate ? 'date' : month ? 'month' : 'unknown'
  }
}

module.exports = {
  deriveSeasonBand,
  normalizeRequest,
  planHardConflicts,
  recommendRoute,
  requestFromSearch,
  resultSearchParams,
  scorePlan
}
