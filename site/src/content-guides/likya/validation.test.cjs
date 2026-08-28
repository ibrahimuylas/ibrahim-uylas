const assert = require('node:assert/strict')
const test = require('node:test')

const likya = require('./index')
const { validateLikyaData } = require('./validation')

const validationInput = overrides => ({
  ...likya,
  ...overrides
})

test('keeps the official 31-pafta inventory and historical distances separate', () => {
  const report = validateLikyaData(validationInput())

  assert.equal(likya.routeSections.length, 31)
  assert.deepEqual(
    likya.historicalExperiences
      .filter(experience => experience.distanceKm !== null)
      .map(experience => experience.distanceKm)
      .sort((left, right) => left - right),
    [230, 430, 465, 509]
  )
  assert.deepEqual(report.errors, [])
})

test('rejects a pafta whose source cannot be resolved', () => {
  const routeSections = likya.routeSections.map(section => ({ ...section }))
  routeSections[0].officialMapSourceId = 'missing-source'

  const report = validateLikyaData(validationInput({ routeSections }))

  assert.ok(
    report.errors.some(error => error.includes('çözümlenemeyen resmî kaynak'))
  )
})

test('rejects a published stage without official pafta coverage', () => {
  const publishedWalkingStages = [
    {
      id: 'published-stage-without-coverage',
      name: 'Test başlangıç – Test bitiş',
      start: 'Test başlangıç',
      end: 'Test bitiş',
      officialSectionIds: [],
      sourceIds: ['ktb-likya-route-home'],
      relatedArticleSlugs: [],
      reviewedAt: '2026-08-27',
      reviewStatus: 'ready',
      planningEligibility: 'eligible'
    }
  ]

  const report = validateLikyaData(validationInput({ publishedWalkingStages }))

  assert.ok(
    report.errors.some(error => error.includes('en az bir resmî paftaya'))
  )
})

test('rejects eligible research without GPS redistribution permission', () => {
  const stageResearchRecords = [
    {
      id: 'research-stage-without-gps-permission',
      researchStatus: 'eligible',
      name: 'Test başlangıç – Test bitiş',
      start: 'Test başlangıç',
      end: 'Test bitiş',
      direction: 'eastbound',
      officialSectionIds: ['ktb-pafta-1'],
      sourceIds: ['ktb-likya-route-home'],
      researchOwner: 'Editoryal ekip',
      updatedAt: '2026-08-28',
      routeFactsCheckedAt: '2026-08-28',
      operationalFactsCheckedAt: '2026-08-28',
      reviewedAt: '2026-08-28',
      reviewedBy: 'Editoryal ekip',
      gpsEvidence: {
        sourceId: 'ktb-likya-route-home',
        owner: 'Test sahibi',
        permission: 'unknown',
        recordedAt: '2026-08-28'
      }
    }
  ]

  const report = validateLikyaData(validationInput({ stageResearchRecords }))

  assert.ok(
    report.errors.some(error => error.includes('GPS yeniden kullanım izni'))
  )
})

test('rejects a Wikiloc record configured for local file delivery', () => {
  const stageResearchRecords = [
    {
      id: 'mirrored-wikiloc-record',
      researchStatus: 'research',
      updatedAt: '2026-08-28',
      researchOwner: 'Editoryal ekip',
      sourceIds: ['wikiloc-terms'],
      officialSectionIds: ['ktb-pafta-1'],
      externalGpsLinks: [
        {
          provider: 'wikiloc',
          url: 'https://www.wikiloc.com/hiking-trails/example-123',
          sourceId: 'wikiloc-terms',
          recordId: '123',
          author: 'Test author',
          recordedAt: '2026-08-01',
          uploadedAt: '2026-08-02',
          reviewedAt: '2026-08-28',
          routeMatchStatus: 'candidate',
          externalDownloadOnly: false,
          localFilePath: '/gpx/example.gpx'
        }
      ]
    }
  ]

  const report = validateLikyaData(validationInput({ stageResearchRecords }))

  assert.ok(
    report.errors.some(error => error.includes('sağlayıcıda indirmeye'))
  )
})

test('rejects a verified pafta review without the pafta official reference', () => {
  const paftaReconciliationReviews = [
    {
      id: 'review-pafta-1',
      sectionId: 'ktb-pafta-1',
      candidateRecordId: 'candidate-pafta-1',
      status: 'verified',
      officialReference: {
        sourceId: 'wikiloc-terms',
        url: 'https://example.com/not-official',
        checkedAt: '2026-08-28'
      },
      comparison: Object.fromEntries(
        ['start', 'end', 'direction', 'variant'].map(field => [
          field,
          'matches-official-reference'
        ])
      ),
      independentCorroboration: {
        sourceIds: ['ibrahim-2014-likya-walk'],
        checkedAt: '2026-08-28'
      },
      reviewedAt: '2026-08-28',
      reviewedBy: 'Editoryal ekip',
      decisionNote: 'Test incelemesi.'
    }
  ]
  const stageResearchRecords = [
    {
      id: 'candidate-pafta-1',
      researchStatus: 'research',
      researchOwner: 'Editoryal ekip',
      updatedAt: '2026-08-28',
      officialSectionIds: ['ktb-pafta-1'],
      sourceIds: []
    }
  ]

  const report = validateLikyaData(
    validationInput({ paftaReconciliationReviews, stageResearchRecords })
  )

  assert.ok(
    report.errors.some(error => error.includes('resmî referansını kullanmalı'))
  )
})

test('rejects a Ministry page as the only independent pafta corroboration', () => {
  const section = likya.routeSections[0]
  const candidateRecordId = 'candidate-pafta-1'
  const paftaReconciliationReviews = [
    {
      id: 'review-pafta-1',
      sectionId: section.id,
      candidateRecordId,
      status: 'verified',
      officialReference: {
        sourceId: section.officialMapSourceId,
        url: section.officialMapUrl,
        checkedAt: '2026-08-28'
      },
      comparison: Object.fromEntries(
        ['start', 'end', 'direction', 'variant'].map(field => [
          field,
          'matches-official-reference'
        ])
      ),
      independentCorroboration: {
        sourceIds: ['ktb-likya-route-home'],
        checkedAt: '2026-08-28'
      },
      reviewedAt: '2026-08-28',
      reviewedBy: 'Editoryal ekip',
      decisionNote: 'Tek resmî kaynağa dayalı test incelemesi.'
    }
  ]
  const stageResearchRecords = [
    {
      id: candidateRecordId,
      researchStatus: 'research',
      researchOwner: 'Editoryal ekip',
      updatedAt: '2026-08-28',
      officialSectionIds: [section.id],
      sourceIds: []
    }
  ]

  const report = validateLikyaData(
    validationInput({ paftaReconciliationReviews, stageResearchRecords })
  )

  assert.ok(
    report.errors.some(error => error.includes('bağımsız kaynak içermeli'))
  )
})

test('rejects an undated operational availability claim', () => {
  const stageResearchRecords = [
    {
      id: 'candidate-pafta-1',
      researchStatus: 'research',
      researchOwner: 'Editoryal ekip',
      updatedAt: '2026-08-28',
      officialSectionIds: ['ktb-pafta-1'],
      sourceIds: []
    }
  ]
  const stageOperationalEvidence = [
    {
      id: 'water-pafta-1',
      stageResearchRecordId: 'candidate-pafta-1',
      factType: 'water',
      status: 'verified',
      sourceIds: []
    }
  ]

  const report = validateLikyaData(
    validationInput({ stageResearchRecords, stageOperationalEvidence })
  )

  assert.ok(
    report.errors.some(error => error.includes('en az bir kaynak içermeli'))
  )
  assert.ok(report.errors.some(error => error.includes('checkedAt zorunlu')))
})

test('rejects a route metric copied from a link-only GPS candidate', () => {
  const stageResearchRecords = [
    {
      id: 'candidate-pafta-1',
      researchStatus: 'research',
      researchOwner: 'Editoryal ekip',
      updatedAt: '2026-08-28',
      officialSectionIds: ['ktb-pafta-1'],
      sourceIds: []
    }
  ]
  const stageRouteMetrics = [
    {
      id: 'distance-pafta-1',
      stageResearchRecordId: 'candidate-pafta-1',
      metricType: 'distance-km',
      value: 10,
      measurementMethod: 'rights-cleared-gps-analysis',
      sourceIds: ['wikiloc-terms'],
      checkedAt: '2026-08-28',
      reviewDueAt: '2026-10-01',
      reviewedBy: 'Editoryal ekip',
      note: 'Test metriği.'
    }
  ]

  const report = validateLikyaData(
    validationInput({ stageResearchRecords, stageRouteMetrics })
  )

  assert.ok(
    report.errors.some(error => error.includes('dosya yeniden kullanım izni'))
  )
})

test('rejects a published plan that uses an ineligible historical stage', () => {
  const routePlans = [
    {
      id: 'unsafe-published-plan',
      publicationStatus: 'published',
      name: 'Test planı',
      durationDays: 3,
      start: 'Başlangıç',
      end: 'Bitiş',
      sourceIds: ['ktb-likya-route-home'],
      stageIds: ['ibrahim-2014-stage-1'],
      detailPath: '/test-plani/',
      direction: 'eastbound',
      regionCoverage: ['west'],
      totalDistanceKm: 25,
      totalAscentM: 0,
      minimumExperience: 'first-multiday',
      recommendedSeasonBands: ['spring'],
      excludedSeasonBands: ['summer'],
      dailyLoadBand: 'balanced',
      lodgingModes: ['mixed'],
      transportModes: ['public'],
      gpsTracks: [{ status: 'not-yet-verified' }],
      fallbackExitStrategy: 'Test çıkışı',
      reviewedAt: '2026-08-28',
      reviewStatus: 'ready',
      planningEligibility: 'eligible'
    }
  ]

  const report = validateLikyaData(validationInput({ routePlans }))

  assert.ok(
    report.errors.some(error => error.includes('planlamaya uygun olmayan etap'))
  )
})

test('rejects an expired seasonal condition review', () => {
  const conditions = [
    {
      id: 'expired-weather-review',
      category: 'weather',
      summary: 'Kaynak kontrolü kaydı.',
      status: 'season-reviewed',
      sourceId: 'official-mgm-antalya-weather',
      sourceUrl: 'https://antalya.mgm.gov.tr/',
      checkedAt: '2026-03-01',
      reviewDueAt: '2026-04-01',
      editorialOwner: 'Editoryal ekip',
      blocksRecommendation: false,
      replacementCheck: 'MGM kaynağını yeniden kontrol et.',
      routeSectionIds: ['ktb-pafta-1'],
      stageIds: [],
      regionIds: []
    }
  ]

  const report = validateLikyaData(
    validationInput({ conditions, buildDate: '2026-08-28' })
  )

  assert.ok(
    report.errors.some(error => error.includes('gözden geçirme tarihini geçti'))
  )
})

test('rejects an official notice that does not use an official condition source', () => {
  const conditions = [
    {
      id: 'invalid-notice-source',
      category: 'fire-forest',
      summary: 'Doğrulanmamış test duyurusu.',
      status: 'official-notice',
      sourceId: 'ibrahim-2014-likya-walk',
      sourceUrl: '/likya-yolu-11-gunde-yurudugum-parkur/',
      checkedAt: '2026-08-28',
      effectiveFrom: '2026-08-28',
      reviewDueAt: '2026-08-29',
      editorialOwner: 'Editoryal ekip',
      blocksRecommendation: true,
      blockReason: 'Kaynak türü test için geçersiz.',
      replacementCheck: 'Resmî kaynağı kontrol et.',
      routeSectionIds: ['ktb-pafta-1'],
      stageIds: [],
      regionIds: []
    }
  ]

  const report = validateLikyaData(
    validationInput({ conditions, buildDate: '2026-08-28' })
  )

  assert.ok(
    report.errors.some(error => error.includes('birincil resmî kaynak'))
  )
})
