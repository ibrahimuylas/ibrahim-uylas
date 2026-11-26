const routePlans = []

const routePlanCatalog = {
  status: 'withheld-until-verified',
  reviewedAt: '2026-08-28',
  title: 'Gün gün Likya planları doğrulanıyor',
  summary:
    '3, 5 ve 7 günlük hazır planlar henüz yayımlanmadı. Resmî pafta sırası mevcut olsa da her plan için kesintisiz etap, GPS kolu, hizmet/konaklama, ulaşım ve çıkış bilgisinin ayrı ayrı doğrulanması gerekiyor.',
  requirements: [
    'Birbiriyle bağlantılı ve resmî paftalara eşlenmiş yürüyüş etapları',
    'Her gün için tarihli GPS kolu, efor, su/yiyecek, geceleme ve kaçış kaydı',
    'Başlangıç/bitiş ulaşımı ile konaklama biçimi için güncel doğrulama yolu',
    'Mevsim, orman/yangın ve diğer değişken koşullar için yola çıkış öncesi kontrol listesi'
  ],
  nextBestActions: [
    {
      label: '31 resmî paftayı incele',
      href: '#tum-etaplar'
    },
    {
      label: 'Hazırlık rehberini aç',
      href: '/likya-yolu-hazirliklari/'
    },
    {
      label: '2014 yürüyüş arşivini oku',
      href: '/likya-yolu-11-gunde-yurudugum-parkur/'
    }
  ]
}

module.exports = {
  routePlanCatalog,
  routePlans
}
