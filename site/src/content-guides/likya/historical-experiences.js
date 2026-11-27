const historicalExperiences = [
  {
    id: 'ibrahim-2014-full-plan',
    articleSlug: 'likya-yolu-2014-planim',
    experienceDate: '2014-09',
    routeCoverage: 'Ölüdeniz–Hisarçandır hazırlık planı',
    distanceKm: 465,
    contentKind: 'planned-itinerary',
    sourceIds: ['ibrahim-2014-likya-route-plan'],
    relatedSectionIds: [],
    reconciliationStatus: 'needs-reconciliation',
    historicalDisclaimer:
      'Bu, 2014 için hazırlanmış 16 yürüyüş günlük plandır; güncel rota, hizmet veya güvenlik bilgisi değildir.'
  },
  {
    id: 'ibrahim-2014-route-variants',
    articleSlug: 'likya-yolu-2014-planim',
    experienceDate: '2014-09',
    routeCoverage: 'Alternatif kolları içeren tarihsel plan',
    distanceKm: 509,
    contentKind: 'planned-itinerary',
    sourceIds: ['ibrahim-2014-likya-route-plan'],
    relatedSectionIds: [],
    reconciliationStatus: 'needs-reconciliation',
    historicalDisclaimer:
      '509 km, 2014 planında alternatif kollarla birlikte kullanılan toplamdır; resmî güncel toplam olarak kullanılmaz.'
  },
  {
    id: 'ibrahim-2014-historical-gps-context',
    articleSlug: 'likya-yolu-rotasi',
    experienceDate: '2014-09',
    routeCoverage: 'Ölüdeniz–Hisarçandır tek hat tarihsel GPS bağlamı',
    distanceKm: 430,
    contentKind: 'historical-gps',
    sourceIds: ['wikiloc-10846819'],
    relatedSectionIds: [],
    reconciliationStatus: 'needs-reconciliation',
    historicalDisclaimer:
      '430 km, mevcut yazıda gömülü tek hat GPS kaydının tarihsel bağlamıdır; lisans/sahiplik doğrulanmadan yeniden dağıtılmaz.'
  },
  {
    id: 'ibrahim-2014-walked-itinerary',
    articleSlug: 'likya-yolu-11-gunde-yurudugum-parkur',
    experienceDate: '2014-09-20/2014-09-30',
    routeCoverage: 'Ölüdeniz–Kaleüçağız',
    distanceKm: 230,
    contentKind: 'walked-itinerary',
    sourceIds: ['ibrahim-2014-likya-walk'],
    relatedSectionIds: [],
    reconciliationStatus: 'needs-reconciliation',
    historicalDisclaimer:
      '20–30 Eylül 2014 arasında gerçekten yürünmüş 11 günlük deneyimdir; tam rota veya güncel koşul kaynağı değildir.'
  },
  ...Array.from({ length: 11 }, (_, index) => {
    const day = index + 1

    return {
      id: `ibrahim-2014-journal-day-${day}`,
      articleSlug: `likya-yolu-${day}.-gun`,
      experienceDate: `2014-09-${String(19 + day).padStart(2, '0')}`,
      routeCoverage: `2014 yürüyüş günlüğü ${day}. gün`,
      distanceKm: null,
      contentKind: 'daily-journal',
      sourceIds: ['ibrahim-2014-likya-walk'],
      relatedSectionIds: [],
      reconciliationStatus: 'needs-reconciliation',
      historicalDisclaimer:
        'Bu günlük 2014 yürüyüş deneyimini anlatır; su, işletme, fiyat, işaret veya geçiş durumu güncel kabul edilmez.'
    }
  })
]

module.exports = historicalExperiences
