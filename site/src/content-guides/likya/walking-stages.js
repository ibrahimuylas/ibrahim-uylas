const historicalWalkingStages = [
  ['Ölüdeniz – Kabak Koyu', 25, 'likya-yolu-rotasi-oludenizden-kabak-koyuna'],
  [
    'Kabak Koyu – Sidyma Antik Kenti',
    23,
    'likya-yolu-rotasi-kabak-koyundan-sidyma-antik-kentine'
  ],
  ['Sidyma – Karadere', 17, 'likya-yolu-rotasi-sidymadan-karadereye'],
  ['Karadere – Kınık', 15, 'likya-yolu-rotasi-karadereden-kinika'],
  ['Kınık – Üzümlü', 22, 'likya-yolu-rotasi-kinikdan-uzumluye'],
  ['Üzümlü – Bezirgan', 22, 'likya-yolu-rotasi-uzumluden-bezirgan-koyune'],
  ['Bezirgan – Sarıbelen', 12, 'likya-yolu-rotasi-bezirgandan-saribelene'],
  ['Sarıbelen – Gökçeören', 12, 'likya-yolu-rotasi-saribelenden-gokceorene'],
  ['Gökçeören – Kaş', 28, 'likya-yolu-rotasi-gokceorenden-kasa'],
  ['Kaş – Körmen Adası', 13, 'likya-yolu-rotasi-kasdan-kormen-adasina'],
  [
    'Körmen Adası – Kaleüçağız',
    23,
    'likya-yolu-rotasi-kormen-adasindan-kaleucagiza'
  ]
].map(([name, distanceKm, articleSlug], index) => ({
  id: `ibrahim-2014-stage-${index + 1}`,
  name,
  start: name.split(' – ')[0],
  end: name.split(' – ')[1],
  officialSectionIds: [],
  distanceKm: {
    value: distanceKm,
    sourceId: 'ibrahim-2014-likya-walk',
    qualification: '2014 yürüyüş günlüğü mesafesi'
  },
  ascentM: null,
  descentM: null,
  expectedHours: null,
  difficulty: null,
  difficultyReason: null,
  dailyLoad: null,
  terrainTags: [],
  experienceTags: [],
  seasonTags: [],
  lodgingModes: [],
  transportStart: null,
  transportEnd: null,
  exitPoints: [],
  waterNotes: [],
  serviceNotes: [],
  gpsTracks: [],
  sourceIds: ['ibrahim-2014-likya-walk'],
  relatedArticleSlugs: [articleSlug, `likya-yolu-${index + 1}.-gun`],
  reviewedAt: '2026-08-27',
  reviewStatus: 'historical-only',
  planningEligibility: 'not-eligible-until-reconciled',
  notes:
    'Bu kayıt, mevcut 2014 günlük/etap içeriğini kaybetmeden modele taşır. Resmî paftalarla birebir eşleştirme ve güncel plan uygunluğu henüz doğrulanmadı.'
}))

const publishedWalkingStages = []

module.exports = {
  historicalWalkingStages,
  publishedWalkingStages
}
