const campingGuide = {
  id: 'kampcilik',
  path: '/category/kampcilik/',
  primaryCategory: 'Kampçılık',
  hubCategories: ['Kampçılık', 'Ekipmanlar', 'Rotalar', 'Doğa Yürüyüşleri'],
  tagNames: ['#kampçılık'],
  contentCountScope: 'hub',
  editorialLayout: 'split-first-row',
  title: 'Kampçılık Rehberi',
  description:
    'İlk kamp alanını seçmekten doğru uyku sistemini kurmaya, güvenlikten ekipman seçimine kadar ihtiyaç duyduğun kampçılık içeriklerini tek yerde keşfet.',
  hero: {
    eyebrow: 'Açık hava günlüğü',
    ctaLabel: 'İlk kampına başla',
    image: '../../content/assets/camping-guide-hero.png',
    imageAlt: 'Dağ yamacında gün batımında kurulu kamp çadırı',
    imageType: 'static'
  },
  beginner: {
    navLabel: 'İlk kamp ve hazırlık',
    eyebrow: 'Yeni başlayanlar için okuma yolu',
    title: 'İlk kampını adım adım planla',
    description:
      'Bu sırayı takip ederek kamp hayatını tanıyabilir, temel güvenlik kararlarını verebilir ve sıcak bir uyku sistemi kurabilirsin.'
  },
  allContentDescription:
    'Kampçılık rehberlerini, ekipman incelemelerini ve rota yazılarını tek yerde keşfet.',
  readingPath: [
    {
      slug: 'kamp-hayatina-bulasmak-ister-misiniz',
      label: 'Kamp hayatını tanı',
      summary: 'İlk kamp fikrini gözünde büyütmeden temel ihtiyaçları öğren.'
    },
    {
      slug: 'ilk-kamp-nerede-yapilir',
      label: 'İlk kamp yerini seç',
      summary:
        'Ulaşım, hava, izinler ve temel ihtiyaçlara göre kamp alanını değerlendir.'
    },
    {
      slug: 'ilk-kamp-icin-gerekli-malzemeler',
      label: 'Çantanı gereği kadar hazırla',
      summary: 'Barınma, uyku, su ve güvenlik için gerçekten gerekenleri ayır.'
    },
    {
      slug: 'cadir-alirken-nelere-dikkat-edilmeli',
      label: 'Çadırını doğru seç',
      summary:
        'Taşıma biçimine, kişi sayısına ve hava koşullarına uygun çadırı bul.'
    },
    {
      slug: 'dogada-kamp-yapmak-guvenli-midir',
      label: 'Güvenli bir başlangıç yap',
      summary: 'Kamp yeri ve çevre koşullarını güvenlik açısından değerlendir.'
    },
    {
      slug: 'uyku-tulumu-nasil-kullanilir',
      label: 'Uyku sistemini doğru kullan',
      summary: 'Mat, kıyafet ve tulumu birlikte kullanarak sıcak kal.'
    }
  ],
  sections: [
    {
      id: 'uyku-sistemi',
      title: 'Uyku sistemi ve sıcak kalmak',
      description:
        'Soğuk zeminden korun, uyku tulumunu doğru kullan ve geceyi daha rahat geçir.',
      slugs: [
        'uyku-tulumu-alirken-nelere-dikkat-edilmelidir',
        'r-degeri-nedir',
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
        'Kamp malzemelerini kullanım amacına, ağırlığına ve hava koşullarına göre değerlendir; alışverişten önce sistemi kur.',
      layout: 'editorial',
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
      slugs: ['likya-yolu-rotasi'],
      randomCategory: 'Rotalar',
      randomCount: 3,
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
        'cliff-jacobson-ile-kampcilik',
        'hiking-ne-demek'
      ]
    }
  ],
  featuredSlugs: [
    'kamp-hayatina-bulasmak-ister-misiniz',
    'ilk-kamp-icin-gerekli-malzemeler',
    'uyku-tulumu-nasil-kullanilir',
    'guvenli-kamp-atesi-icin-en-iyi-10-ipucu'
  ],
  imageSectionIds: ['ekipman', 'kamp-yerleri'],
  imageExcludedSlugs: []
}

module.exports = campingGuide
