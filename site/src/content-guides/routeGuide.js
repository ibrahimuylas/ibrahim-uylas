const likyaStages = [
  {
    slug: 'likya-yolu-rotasi-oludenizden-kabak-koyuna',
    context: '1. etap · 25 km',
    journalSlug: 'likya-yolu-1.-gun',
    journalLabel: '1. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-kabak-koyundan-sidyma-antik-kentine',
    context: '2. etap · 23 km',
    journalSlug: 'likya-yolu-2.-gun',
    journalLabel: '2. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-sidymadan-karadereye',
    context: '3. etap · 17 km',
    journalSlug: 'likya-yolu-3.-gun',
    journalLabel: '3. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-karadereden-kinika',
    context: '4. etap · 15 km',
    journalSlug: 'likya-yolu-4.-gun',
    journalLabel: '4. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-kinikdan-uzumluye',
    context: '5. etap · 22 km',
    journalSlug: 'likya-yolu-5.-gun',
    journalLabel: '5. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-uzumluden-bezirgan-koyune',
    context: '6. etap · 22 km',
    journalSlug: 'likya-yolu-6.-gun',
    journalLabel: '6. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-bezirgandan-saribelene',
    context: '7. etap · 12 km',
    journalSlug: 'likya-yolu-7.-gun',
    journalLabel: '7. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-saribelenden-gokceorene',
    context: '8. etap · 12 km',
    journalSlug: 'likya-yolu-8.-gun',
    journalLabel: '8. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-gokceorenden-kasa',
    context: '9. etap · 28 km',
    journalSlug: 'likya-yolu-9.-gun',
    journalLabel: '9. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-kasdan-kormen-adasina',
    context: '10. etap · 13 km',
    journalSlug: 'likya-yolu-10.-gun',
    journalLabel: '10. gün günlüğü'
  },
  {
    slug: 'likya-yolu-rotasi-kormen-adasindan-kaleucagiza',
    context: '11. etap · 23 km',
    journalSlug: 'likya-yolu-11.-gun',
    journalLabel: '11. gün günlüğü'
  }
]

const routeGroups = {
  'kamp-alanlari-goller': [
    'aktur-camping',
    'aytepe-kamp-yerleri',
    'barakli-goleti',
    'bozcaarmut-goleti',
    'bolu-abant-golu',
    'bolu-yedigoller',
    'borcka-karagol',
    'gebze-denizli-goleti',
    'igneada-longozlar',
    'karaaslan-kamping',
    'karacakoy-goleti',
    'keramet-koyu-kaplicasi',
    'kerpe-kamp-yerleri',
    'papaz-cayiri',
    'savsat-karagol',
    'trabzon-uzungol',
    'sile-sakligol'
  ],
  'yaylalar-ormanlar': [
    'acelle-yaylasi',
    'belgrad-ormanlari',
    'delmece-yaylasi',
    'ercuva-yaylasi',
    'inonu-yaylasi',
    'karlik-yaylasi',
    'kayaustu-yaylasi',
    'menekse-subatimi-yaylasi',
    'menekse-yaylasi',
    'olgunlar-meretet-yaylasi',
    'purenli-yaylasi',
    'sinekli-yaylasi',
    'tarakli-karagol-yaylasi',
    'turnalik-yaylasi',
    'yukari-kavrun-yaylasi'
  ],
  'kanyonlar-selaleler': [
    'asiklar-nebiler-selalesi',
    'cehennem-selaleleri',
    'dupnisa-magarasi',
    'erfelek-tatlica-selaleleri',
    'erikli-yaylasi-erikli-selalesi',
    'hacili-koyu-selaleleri',
    'safranbolu-tokatli-kanyonu',
    'saklikent-kanyonu',
    'sansarak-kanyonu',
    'serindere-kanyonu-kamp-alani',
    'sicakdere-kanyonu'
  ],
  'kiyilar-koylar': [
    'begendik-koyu',
    'kaputas-plaji',
    'kilimli-koyu',
    'patara-plaji',
    'sakli-koy',
    'sardala-koyu',
    'cakrazseyhler-plaji'
  ]
}

const likyaSlugs = [
  'likya-yolu-rotasi',
  ...likyaStages.map(stage => stage.slug)
]

const articleGroups = Object.fromEntries([
  ...likyaSlugs.map(slug => [slug, 'likya-yolu']),
  ...Object.entries(routeGroups).flatMap(([group, slugs]) =>
    slugs.map(slug => [slug, group])
  )
])

const routeGuide = {
  id: 'rotalar',
  path: '/category/rotalar/',
  primaryCategory: 'Rotalar',
  hubCategories: ['Rotalar'],
  tagNames: ['#kampyerleriverotalar'],
  contentCountScope: 'hub',
  compactSpacing: false,
  editorialLayout: 'split-first-row',
  title: 'Rotalar Rehberi',
  description:
    'Likya Yolu’ndan kamp alanlarına, yaylalardan kanyonlara kadar doğada keşfedebileceğin rotaları incele.',
  hero: {
    eyebrow: 'Açık hava günlüğü',
    ctaLabel: 'Likya Yolu’nu planla',
    ctaHref: '#likya-yolu',
    secondaryCtaLabel: 'Tüm rotaları keşfet',
    imageAlt: 'Pusula, topoğrafik harita ve Likya Yolu’nda yürüyüş rotası',
    imageType: 'static',
    stats: [
      { key: 'content', label: 'İçerik' },
      { key: 'likya', label: 'Likya Yolu' },
      { key: 'other', label: 'Diğer rota' }
    ]
  },
  notice: {
    label: 'Tarihsel saha notu',
    text: 'Bazı rota, su, ulaşım ve kamp bilgileri geçmiş saha deneyimlerine dayanır. Yola çıkmadan önce güncel koşulları ayrıca doğrula.'
  },
  beginner: {
    navLabel: 'İlk rotanı seç',
    eyebrow: 'Yeni başlayanlar için rota seçimi',
    title: 'İlk rotanı adım adım seç',
    description:
      'Uzun bir parkuru planlamak, günübirlik bir rota bulmak veya kamp yapılabilecek bir yer seçmek için içerikleri kullanım amacına göre keşfet.'
  },
  research: {
    id: 'rota-arastir',
    navLabel: 'Rota araştırma rehberi',
    eyebrow: 'Rota araştırma rehberi',
    title: 'Rota nasıl bulunur ve araştırılır?',
    description:
      'Bir rotayı kaydetmeden önce haritada neye bakacağını, hangi bilgileri doğrulayacağını ve yola çıkmadan nasıl bir yedek plan hazırlayacağını öğren.',
    steps: [
      {
        title: 'İhtiyacını netleştir',
        description:
          'Günübirlik mi, kamp konaklamalı mı, yoksa çok günlük bir parkur mu aradığını belirle.'
      },
      {
        title: 'Haritayı ve izi karşılaştır',
        description:
          'Başlangıç-bitiş noktası, mesafe, yükselti, zemin ve işaretli patikayı birlikte kontrol et.'
      },
      {
        title: 'Saha koşullarını doğrula',
        description:
          'Su, ulaşım, kamp imkânı, hava durumu ve güncel yol durumunu birden fazla kaynaktan araştır.'
      },
      {
        title: 'Yedek plan hazırla',
        description:
          'Çevrimdışı harita indir, dönüş saatini belirle ve gerektiğinde çıkabileceğin alternatif noktaları not et.'
      }
    ]
  },
  allContentDescription:
    'Likya Yolu rehberlerini, kamp noktalarını ve Türkiye’den doğa rotalarını tek yerde keşfet.',
  readingPath: [
    {
      slug: 'likya-yolu-rotasi',
      label: 'Likya Yolu’nu planla',
      summary: 'Haritayı, etapları ve 509 km’lik tarihsel planı incele.'
    },
    {
      slug: 'likya-yolu-rotasi-oludenizden-kabak-koyuna',
      label: 'Bir etabı yakından tanı',
      summary: 'Ölüdeniz–Kabak Koyu etabının mesafe ve saha notlarını oku.'
    },
    {
      slug: 'barakli-goleti',
      label: 'Kamp rotası keşfet',
      summary: 'Kamp ve doğa deneyimi için kısa rota fikirlerine göz at.'
    }
  ],
  sections: [
    {
      id: 'likya-yolu',
      title: 'Likya Yolu rotaları',
      description:
        '509 km’lik tarihsel planı, 11 etap rehberini ve her etaba eşlik eden yürüyüş günlüklerini tek bir akışta incele.',
      layout: 'route',
      featuredSlug: 'likya-yolu-rotasi',
      items: likyaStages,
      links: [
        {
          label: '11 günde yürüdüğüm 230 km',
          path: '/likya-yolu-11-gunde-yurudugum-parkur/'
        },
        { label: 'Likya Yolu hazırlıkları', path: '/likya-yolu-hazirliklari/' },
        {
          label: 'Likya parkuru sırt çantam',
          path: '/likya-parkuru-sirt-cantam/'
        }
      ]
    },
    {
      id: 'kamp-alanlari-goller',
      title: 'Kamp alanları ve göller',
      description:
        'Göl, gölet, longoz ve kamp alanı çevresindeki rota fikirlerini keşfet.',
      layout: 'editorial',
      slugs: routeGroups['kamp-alanlari-goller'],
      moreLink: { label: 'Tüm rotaları gör', path: '#tum-icerikler' }
    },
    {
      id: 'yaylalar-ormanlar',
      title: 'Yaylalar ve ormanlar',
      description:
        'Yayla havası, orman patikaları ve şehirden uzaklaşmak için rota önerilerine göz at.',
      slugs: routeGroups['yaylalar-ormanlar']
    },
    {
      id: 'kanyonlar-selaleler',
      title: 'Kanyonlar ve şelaleler',
      description:
        'Su, kaya ve patika deneyimini bir araya getiren doğa noktalarını incele.',
      slugs: routeGroups['kanyonlar-selaleler']
    },
    {
      id: 'kiyilar-koylar',
      title: 'Kıyılar, koylar ve plajlar',
      description:
        'Deniz kenarında yürüyüş, kamp ve kısa kaçamak için farklı rotaları bul.',
      slugs: routeGroups['kiyilar-koylar']
    }
  ],
  groupFilters: [
    { id: 'likya-yolu', label: 'Likya Yolu' },
    { id: 'kamp-alanlari-goller', label: 'Kamp ve göller' },
    { id: 'yaylalar-ormanlar', label: 'Yaylalar ve ormanlar' },
    { id: 'kanyonlar-selaleler', label: 'Kanyonlar ve şelaleler' },
    { id: 'kiyilar-koylar', label: 'Kıyılar ve koylar' }
  ],
  articleGroups,
  likyaSlugs,
  featuredSlugs: [
    'likya-yolu-rotasi',
    'likya-yolu-rotasi-oludenizden-kabak-koyuna',
    'barakli-goleti',
    'borcka-karagol'
  ],
  imageSectionIds: [
    'likya-yolu',
    'kamp-alanlari-goller',
    'yaylalar-ormanlar',
    'kanyonlar-selaleler',
    'kiyilar-koylar'
  ],
  imageExcludedSlugs: []
}

module.exports = routeGuide
module.exports.likyaStages = likyaStages
module.exports.routeGroups = routeGroups
module.exports.allRouteSlugs = [
  ...likyaSlugs,
  ...Object.values(routeGroups).flat()
]
