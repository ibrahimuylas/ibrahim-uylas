const hikingGuide = {
  id: 'doga-yuruyusleri',
  path: '/category/doga-yuruyusleri/',
  primaryCategory: 'Doğa Yürüyüşleri',
  hubCategories: ['Doğa Yürüyüşleri', 'Ekipmanlar', 'Rotalar'],
  tagNames: ['#doğayürüyüşleri'],
  contentCountScope: 'primary',
  editorialLayout: 'split-first-row',
  title: 'Doğa Yürüyüşleri Rehberi',
  description:
    'Hiking ve trekking’e başlarken doğru yürüyüş türünü seç, ekipmanını hazırla ve rotaya daha güvenli çık.',
  hero: {
    eyebrow: 'Açık hava günlüğü',
    ctaLabel: 'Yürüyüşe başla',
    image: '../../content/assets/doga-yuruyusleri-guide-hero.png',
    imageAlt: 'Göl kenarındaki patikada yürüyüş yapan bir kişi',
    imageType: 'static'
  },
  beginner: {
    navLabel: 'Başlangıç ve yürüyüş türleri',
    eyebrow: 'Yeni başlayanlar için okuma yolu',
    title: 'Doğa yürüyüşüne adım adım hazırlan',
    description:
      'Bu sırayı takip ederek hiking ve trekking arasındaki farkları anlayabilir, ekipmanını seçebilir ve yürüyüşe daha hazırlıklı çıkabilirsin.'
  },
  allContentDescription:
    'Doğa yürüyüşü rehberlerini, ekipman incelemelerini ve rota yazılarını tek yerde keşfet.',
  readingPath: [
    {
      slug: 'hiking-ne-demek',
      label: 'Hiking’i tanı',
      summary: 'Günübirlik doğa yürüyüşünün temel özelliklerini öğren.'
    },
    {
      slug: 'trekking-ne-demek',
      label: 'Trekking’i tanı',
      summary: 'Daha uzun ve planlı yürüyüşler için temel kavramları öğren.'
    },
    {
      slug: 'trekking-ile-hiking-arasindaki-farklar-nelerdir',
      label: 'Sana uygun yürüyüşü seç',
      summary: 'Hiking ve trekking arasındaki temel farkları karşılaştır.'
    },
    {
      slug: 'doga-yuruyusleri-icin-gerekli-ekipmanlar',
      label: 'Çantanı hazırla',
      summary: 'Rota, hava ve yürüyüş süresine göre gerekli ekipmanları ayır.'
    },
    {
      slug: 'doga-yuruyuslerinde-nasil-giyinilmelidir',
      label: 'Doğru giyin',
      summary: 'Hava koşullarına göre katmanlı giyim sistemini oluştur.'
    },
    {
      slug: 'doga-yuruyuslerinde-dikkat-edilmesi-gerekenler',
      label: 'Güvenli yürü',
      summary: 'Yola çıkmadan önce temel güvenlik kontrolünü tamamla.'
    }
  ],
  sections: [
    {
      id: 'hazirlik-guvenlik',
      title: 'Hazırlık ve güvenlik',
      description:
        'Yürüyüşe çıkmadan önce kendini, rotayı ve karşılaşabileceğin koşulları değerlendir.',
      slugs: ['doga-yuruyusunun-faydalari-nelerdir', 'tek-basina-doga-yuruyusu']
    },
    {
      id: 'giyim-ekipman',
      title: 'Giyim ve ekipman seçimi',
      description:
        'Ayaklarını koru, yürüyüş ekipmanlarını doğru seç ve daha konforlu ilerle.',
      layout: 'editorial',
      slugs: [
        'doga-yuruyuslerinde-corap-tercihi',
        'trekking-ayakkabisi-nasil-olmali',
        'yuruyus-batonu-ne-ise-yarar'
      ],
      moreLink: {
        label: 'Tüm ekipman yazılarını gör',
        path: '/category/ekipmanlar/'
      }
    },
    {
      id: 'rotalar-ilham',
      title: 'Rotalar ve ilham',
      description:
        'Yeni yürüyüş rotaları keşfet, farklı parkurları ve doğa deneyimlerini incele.',
      slugs: ['likya-yolu-rotasi'],
      randomCategory: 'Rotalar',
      randomCount: 3,
      moreLink: {
        label: 'Tüm rotaları gör',
        path: '/category/rotalar/'
      }
    }
  ],
  featuredSlugs: [
    'hiking-ne-demek',
    'doga-yuruyusleri-icin-gerekli-ekipmanlar',
    'doga-yuruyuslerinde-dikkat-edilmesi-gerekenler',
    'trekking-ayakkabisi-nasil-olmali'
  ],
  imageSectionIds: ['giyim-ekipman', 'rotalar-ilham'],
  imageExcludedSlugs: []
}

module.exports = hikingGuide
