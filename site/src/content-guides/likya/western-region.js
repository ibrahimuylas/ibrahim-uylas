const { routeSections } = require('./route-sections')
const { stageGuides } = require('./stage-guides')

const westernSectionIds = routeSections
  .filter(section => section.editorialRegion === 'west')
  .map(section => section.id)

const westernLikyaRegion = {
  id: 'western-likya',
  title: 'Batı Likya pafta envanteri',
  editorialRegion: 'west',
  officialSectionIds: westernSectionIds,
  officialMapSourceIds: ['ktb-likya-map-1', 'ktb-likya-route-home'],
  reviewStatus: 'inventory-only',
  reviewedAt: '2026-08-27',
  overview:
    'Bu bölüm, Bakanlığın ilk 10 paftasını sıralı olarak bir araya getirir. Batı Likya adı, yalnızca rehberde gezinmeyi kolaylaştıran editoryal bir gruptur; resmî etap, günlük plan veya güncel rota koşulu iddiası değildir.',
  currentConditionStatus: 'not-yet-published',
  historicalStageLinks: stageGuides.slice(0, 4).map(stage => ({
    stageId: stage.id,
    articleSlug: stage.articleSlug,
    journalSlug: stage.journalSlug,
    relationshipStatus: 'historical-article-link-only',
    disclaimer:
      'Mevcut 2014 etap yazısı bu pafta envanteriyle henüz birebir eşleştirilmedi; bağlantı yalnızca tarihsel okumaya yönlendirir.'
  })),
  candidatePlanStatus: 'not-published-until-spec-017'
}

module.exports = westernLikyaRegion
