const campingGuide = {
  id: 'kampcilik',
  title: 'Kampçılık Rehberi',
  description:
    'İlk kampını planlamaktan doğru uyku sistemini kurmaya, güvenlikten ekipman seçimine kadar ihtiyaç duyduğun kampçılık içeriklerini tek yerde keşfet.',
  readingPath: [
    {
      slug: 'kamp-hayatina-bulasmak-ister-misiniz',
      label: 'Kamp hayatını tanı',
      summary: 'İlk kamp fikrini gözünde büyütmeden temel ihtiyaçları öğren.'
    },
    {
      slug: 'dogada-kamp-yapmak-guvenli-midir',
      label: 'Güvenli bir başlangıç yap',
      summary: 'Kamp yeri ve çevre koşullarını güvenlik açısından değerlendir.'
    },
    {
      slug: 'uyku-tulumu-alirken-nelere-dikkat-edilmelidir',
      label: 'Uyku tulumunu seç',
      summary: 'Konfor değerlerini ve ihtiyacına uygun tulumu karşılaştır.'
    },
    {
      slug: 'uyku-tulumu-nasil-kullanilir',
      label: 'Uyku sistemini doğru kullan',
      summary: 'Mat, kıyafet ve tulumu birlikte kullanarak sıcak kal.'
    },
    {
      slug: 'r-degeri-nedir',
      label: 'Zemin yalıtımını tamamla',
      summary: 'Kamp matındaki R değerini ve gerçek kullanım karşılığını öğren.'
    }
  ],
  sections: [
    {
      id: 'uyku-sistemi',
      title: 'Uyku sistemi ve sıcak kalmak',
      description:
        'Soğuk zeminden korun, uyku tulumunu doğru kullan ve geceyi daha rahat geçir.',
      slugs: [
        'uyku-tulumu-yetersiz-kalirsa-ne-yapilmalidir',
        'iki-kisilik-uyku-tulumu-hakkinda'
      ]
    },
    {
      id: 'guvenlik',
      title: 'Güvenlik ve kamp ateşi',
      description:
        'Kendini, çevrendekileri ve doğayı koruyacak temel kamp alışkanlıklarını edin.',
      slugs: ['guvenli-kamp-atesi-icin-en-iyi-10-ipucu']
    },
    {
      id: 'ekipman',
      title: 'Ekipman seçimi',
      description:
        'Kamp malzemelerini kullanım amacına, ağırlığına ve hava koşullarına göre değerlendir.',
      slugs: [
        'buff-nedir-ne-ise-yarar',
        'gtx-ayakkabi-ne-demek',
        'doga-yuruyusleri-icin-gerekli-ekipmanlar',
        'ferrino-lightent-2-kamp-cadiri',
        'msr-pocket-rocket-kamp-ocagi',
        '2-seconds-easy-3-kamp-cadiri'
      ],
      moreLink: {
        label: 'Tüm ekipman yazılarını gör',
        path: '/category/ekipmanlar/'
      }
    },
    {
      id: 'kamp-yerleri',
      title: 'Kamp yerleri ve rotalar',
      description:
        'Camping alanlarını, yaylaları ve doğada kamp yapabileceğin rotaları incele.',
      slugs: ['acelle-yaylasi', 'aktur-camping', 'karaaslan-kamping'],
      moreLink: {
        label: 'Tüm rota ve kamp yerlerini gör',
        path: '/category/rotalar/'
      }
    },
    {
      id: 'terimler',
      title: 'Terimler, kitaplar ve ilham',
      description:
        'Outdoor dünyasında karşına çıkan kavramları ve faydalı kaynakları tanı.',
      slugs: [
        'outdoor-ne-demek',
        'carsak-ne-demek',
        'cliff-jacobson-ile-kampcilik'
      ]
    }
  ],
  featuredSlugs: [
    'kamp-hayatina-bulasmak-ister-misiniz',
    'uyku-tulumu-nasil-kullanilir',
    'r-degeri-nedir',
    'guvenli-kamp-atesi-icin-en-iyi-10-ipucu'
  ],
  imageSectionIds: ['ekipman', 'kamp-yerleri']
}

module.exports = campingGuide
