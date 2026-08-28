const { routeSections } = require('./route-sections')
const { stageGuides } = require('./stage-guides')

const centralSectionIds = routeSections
  .filter(section => section.editorialRegion === 'central')
  .map(section => section.id)

const centralLikyaRegion = {
  id: 'central-likya',
  title: 'Orta Likya pafta envanteri',
  editorialRegion: 'central',
  officialSectionIds: centralSectionIds,
  officialMapSourceIds: ['ktb-likya-route-home'],
  reviewStatus: 'inventory-only',
  reviewedAt: '2026-08-27',
  overview:
    'Bu bölüm, Bakanlığın 11–18 numaralı paftalarını sıralı olarak bir araya getirir. Orta Likya adı, yalnızca rehberde gezinmeyi kolaylaştıran editoryal bir gruptur; resmî etap, günlük plan veya güncel rota koşulu iddiası değildir.',
  currentConditionStatus: 'not-yet-published',
  historicalStageLinks: stageGuides.slice(4).map(stage => ({
    stageId: stage.id,
    articleSlug: stage.articleSlug,
    journalSlug: stage.journalSlug,
    relationshipStatus: 'historical-article-link-only',
    disclaimer:
      'Mevcut 2014 etap yazısı bu pafta envanteriyle henüz birebir eşleştirilmedi; bağlantı yalnızca tarihsel okumaya yönlendirir.'
  })),
  walkedRouteContext: {
    historicalDistanceKm: 230,
    articleSlug: 'likya-yolu-11-gunde-yurudugum-parkur',
    disclaimer:
      '230 km, 20–30 Eylül 2014 arasında yürünmüş 11 günlük deneyimdir; Orta Likya paftalarının tamamını veya güncel rota kapsamını temsil etmez.'
  },
  candidatePlanStatus: 'not-published-until-spec-017'
}

module.exports = centralLikyaRegion
