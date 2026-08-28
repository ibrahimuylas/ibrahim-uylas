const conditionCategories = [
  {
    id: 'weather',
    label: 'Hava',
    fallbackSourceId: 'official-mgm-antalya-weather',
    fallbackSummary:
      'Bu kapsam için güncel hava kaydı eklenmedi; resmî tahmin ve uyarıları çıkıştan hemen önce kontrol et.',
    defaultReviewRule:
      'Tahmin veya uyarı gün içinde değişebileceği için aynı gün yeniden kontrol edilir.'
  },
  {
    id: 'fire-forest',
    label: 'Yangın / orman erişimi',
    fallbackSourceId: 'official-ogm-fire-notices',
    fallbackSummary:
      'Bu kapsam için güncel yangın veya orman erişim kaydı eklenmedi; resmî ve yerel duyuruları yeniden kontrol et.',
    defaultReviewRule:
      'Kısıtlar yerel ve dönemsel olabilir; yola çıkmadan hemen önce yeniden kontrol edilir.'
  },
  {
    id: 'route-transport',
    label: 'Rota / ulaşım kesintisi',
    fallbackSourceId: 'ktb-likya-route-home',
    fallbackSummary:
      'Bu kapsam için güncel rota veya ulaşım kesintisi kaydı eklenmedi; resmî rota kaynağını ve ulaşım işletmesini yeniden kontrol et.',
    defaultReviewRule:
      'Rota varyantı ve ulaşım bağlantısı için yola çıkmadan hemen önce kaynak kontrolü yapılır.'
  },
  {
    id: 'water-services',
    label: 'Su / hizmetler',
    fallbackSourceId: 'ktb-likya-route-home',
    fallbackSummary:
      'Bu kapsam için güncel su veya hizmet kaydı eklenmedi; eski saha notlarını garanti kabul etme ve yerel doğrulama yap.',
    defaultReviewRule:
      'Su ve işletme bilgisi değişkendir; karar günü yakınında doğrudan doğrulanır.'
  }
]

const conditions = []

module.exports = {
  conditionCategories,
  conditions
}
