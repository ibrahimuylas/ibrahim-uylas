const equipmentGuide = {
  id: 'ekipmanlar',
  path: '/category/doga-yuruyusleri-ve-kamp-ekipmanlari/',
  primaryCategory: 'Ekipmanlar',
  hubCategories: ['Ekipmanlar'],
  tagNames: [],
  contentCountScope: 'primary',
  editorialLayout: 'split-first-row',
  title: 'Ekipmanlar Rehberi',
  description:
    'Çadırdan yağmurluğa, trekking botundan kamp ocağına kadar doğada daha doğru seçimler yapman için ekipman rehberlerini ve gerçek kullanım notlarını tek yerde keşfet.',
  hero: {
    eyebrow: 'Daha hazırlıklı yola çık',
    ctaLabel: 'Ekipman seçmeye başla',
    secondaryCtaLabel: 'Tüm ekipmanları gör',
    imageType: 'static',
    imageAlt: 'Dağ yamacında çadır, sırt çantası, yürüyüş botları ve batonlar'
  },
  beginner: {
    navLabel: 'Ekipman seçimine başla',
    eyebrow: 'İlk alışverişten önce okuma yolu',
    title: 'Ekipmanını kullanımına göre seç',
    description:
      'Önce nerede ve nasıl kullanacağını belirle; sonra ağırlık, hava koşulları, konfor ve dayanıklılık arasında sana uyan dengeyi kur.'
  },
  allContentDescription:
    'Ekipman incelemelerini, satın alma rehberlerini ve doğada işine yarayacak pratik notları tek yerde bul.',
  readingPath: [
    {
      slug: 'doga-yuruyusleri-icin-gerekli-ekipmanlar',
      label: 'Temel listeyi çıkar',
      summary:
        'Yürüyüş süresine, rotaya ve hava durumuna göre gerçekten gerekenleri ayır.'
    },
    {
      slug: 'yagmurluk-nasil-secilir',
      label: 'Yağmurdan korun',
      summary:
        'Su geçirmezlik, nefes alabilirlik ve katman uyumunu birlikte değerlendir.'
    },
    {
      slug: 'cadir-alirken-nelere-dikkat-edilmeli',
      label: 'Barınma sistemini kur',
      summary:
        'Çadırı kişi sayısına değil, kullanım biçimine ve taşıma şekline göre seç.'
    },
    {
      slug: 'ferrino-lightent-2-kamp-cadiri',
      label: 'Gerçek kullanımı incele',
      summary:
        'Bir çadırın ağırlık, paket hacmi ve zemin uyumunu sahadaki deneyimle karşılaştır.'
    },
    {
      slug: 'msr-pocket-rocket-kamp-ocağı',
      label: 'Kamp mutfağını sadeleştir',
      summary: 'Küçük bir ocak ve doğru pişirme setiyle taşıdığın yükü azalt.'
    },
    {
      slug: 'trekking-ayakkabisi-nasil-olmali',
      label: 'Ayağına uygun olanı bul',
      summary: 'Zemin, bilek desteği, taban tutuşu ve konforu birlikte düşün.'
    }
  ],
  sections: [
    {
      id: 'barinma-uyku',
      title: 'Barınma ve uyku sistemi',
      description:
        'Çadırı, uyku ekipmanını ve kurulum detaylarını gideceğin yere ve taşıma biçimine göre değerlendir.',
      layout: 'editorial',
      slugs: [
        'cadir-alirken-nelere-dikkat-edilmeli',
        'ferrino-lightent-2-kamp-cadiri',
        '2-seconds-easy-3-kamp-cadiri',
        'uyku-tulumu-alirken-nelere-dikkat-edilmelidir'
      ],
      moreLink: {
        label: 'Kampçılık rehberine geç',
        path: '/category/kampcilik/'
      }
    },
    {
      id: 'giyim-yuruyus',
      title: 'Giyim ve yürüyüş ekipmanları',
      description:
        'Ayaklarını, vücudunu ve çantanı hava koşullarına göre hazırla; konforu yalnızca marka adına bırakma.',
      slugs: [
        'yagmurluk-nasil-secilir',
        'trekking-ayakkabisi-nasil-olmali',
        'doga-yuruyuslerinde-corap-tercihi',
        'yuruyus-batonu-nedir-nasil-olmalidir',
        'su-gecirmez-yuruyus-tozlugu'
      ],
      moreLink: {
        label: 'Doğa yürüyüşleri rehberine geç',
        path: '/category/doga-yuruyusleri/'
      }
    },
    {
      id: 'kamp-mutfagi',
      title: 'Kamp mutfağı ve küçük ekipmanlar',
      description:
        'Ocağını, pişirme setini ve küçük yardımcı ekipmanları taşıma alanına ve kamp tarzına göre sadeleştir.',
      slugs: [
        'msr-pocket-rocket-kamp-ocağı',
        'nurgaz-vidali-kamp-ocagi-kartusu',
        'trangia-kamp-tencere-seti',
        'kamp-hamağı',
        'xiaomi-mi-arac-sarji'
      ]
    }
  ],
  featuredSlugs: [
    'doga-yuruyusleri-icin-gerekli-ekipmanlar',
    'yagmurluk-nasil-secilir',
    'cadir-alirken-nelere-dikkat-edilmeli',
    'ferrino-lightent-2-kamp-cadiri'
  ],
  imageSectionIds: ['barinma-uyku', 'giyim-yuruyus', 'kamp-mutfagi'],
  imageExcludedSlugs: []
}

module.exports = equipmentGuide
