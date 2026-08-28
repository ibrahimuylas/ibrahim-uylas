const { routeSections } = require('./route-sections')

const easternSectionIds = routeSections
  .filter(section => section.editorialRegion === 'east')
  .map(section => section.id)

const easternLikyaRegion = {
  id: 'eastern-likya',
  title: 'Doğu Likya pafta envanteri',
  editorialRegion: 'east',
  officialSectionIds: easternSectionIds,
  officialMapSourceIds: [
    'ktb-likya-route-home',
    'ktb-likya-map-collection',
    'ktb-likya-map-2'
  ],
  reviewStatus: 'research-hold',
  reviewedAt: '2026-08-27',
  overview:
    'Bu bölüm, Bakanlığın 19–31 numaralı paftalarını sıralı olarak bir araya getirir. Doğu Likya adı, yalnızca rehberde gezinmeyi kolaylaştıran editoryal bir gruptur; resmî etap, günlük plan veya güncel rota koşulu iddiası değildir.',
  currentConditionStatus: 'not-yet-published',
  editorialAttribution:
    'Editoryal araştırma envanteri: Bu paftalar için sitede doğrulanmış güncel etap rehberi veya birinci el yürüyüş anlatısı henüz yok.',
  historicalPlanLinks: [
    {
      id: 'ibrahim-2014-full-plan',
      articleSlug: 'likya-yolu-rotasi',
      label: '2014 tarihsel tam rota planını aç',
      relationshipStatus: 'planned-not-confirmed-as-walked',
      disclaimer:
        '2014 planındaki Finike, Kumluca, Karaöz, Adrasan, Olympos/Çıralı, Tekirova, Beycik, Gedelme, Göynük ve Hisarçandır notları yürüyüş kanıtı değildir; güncel pafta veya etap kapsamıyla birebir eşleştirilmemiştir.'
    }
  ],
  researchChecklist: [
    'Her pratik etap için tarihli ve kol yönü belirtilmiş GPS kapsamı',
    'Mesafe, yükselti, zorlu geçiş ve kaçış seçenekleri için kaynaklı doğrulama',
    'Su, yiyecek, konaklama ve ulaşım için tarihli saha veya işletme kaydı',
    'Orman/yangın kısıtlaması ile korunan alan geçişleri için resmî doğrulama yolu'
  ],
  publicationStatus:
    'Bu kontroller tamamlanmadan Doğu Likya için etap sayfası, günlük plan veya öneri yayımlanmaz.',
  candidatePlanStatus: 'not-published-until-spec-017'
}

module.exports = easternLikyaRegion
