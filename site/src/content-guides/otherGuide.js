const storyGroups = {
  'likya-yolu-anilari': [
    'likya-yolu-hazirliklari',
    'likyaya-1-kala',
    'bunun-adi-ask-likya-yolu',
    'likya-parkuru-sirt-cantam',
    'likya-yolu-1.-gun',
    'likya-yolu-2.-gun',
    'likya-yolu-3.-gun',
    'likya-yolu-4.-gun',
    'likya-yolu-5.-gun',
    'likya-yolu-6.-gun',
    'likya-yolu-7.-gun',
    'likya-yolu-8.-gun',
    'likya-yolu-9.-gun',
    'likya-yolu-10.-gun',
    'likya-yolu-11.-gun',
    'likya-yolu-11-gunde-yurudugum-parkur',
    'likya-yolu-rotasi',
    'likya-yoluna-neden-tek-gidiyorsun'
  ],
  'iskocya-gezisi': [
    'bir-hayale-yolculuk-isle-of-skye',
    'iskoc-yaylalari-inverness-1.-bolum',
    'iskoc-yaylalari-ben-nevis-2.-bolum',
    'iskoc-yaylalari-isle-of-skye-3.-bolum',
    'iskoc-yaylalari-nc500-rotasi-4.-bolum',
    'tek-basina-iskoc-yaylalarinda-29-gunde-5500km'
  ],
  'nordkapp-yolculugu': [
    'hedef-nordkapp-peki-neden',
    'avrupanin-en-kuzeyine-nordkappa'
  ],
  'kackarlar-dogu-karadeniz': [
    'dag-basinda-bekle-geliyorum',
    'dagin-basinda-da-dunya-kucukmus',
    'dogu-karadeniz-kampi',
    'kackar-daglari-anlik-bilinc-kaybi',
    'kackar-daglari-naletleme-gecidi',
    'kackarlardan-gelen-telefon'
  ],
  'turkiye-kamp-trekking': [
    'abant-golunde-kamp-yapmali-mi',
    'kaya-ustu-yaylasi-kampi',
    'ayi-sesi-mi-o',
    'azrail-bu-kez-beni-teget-gecti',
    'yedigoller-trekking-tek-basima-ilk-yolculuk',
    'esenkoy-delmece-yaylasi-narli-trekking',
    'cifte-selaleler-erikli-yaylasi-trekking',
    'erikli-selalesi-bahar-kampi',
    'esek-saldirisi-nedir-arkadas',
    'endurocuyuz-biz-mi-acaba',
    'frig-yolu-da-nedir-ki',
    'inonu-yaylasi-sonbahar-kampi',
    'inonu-yaylasindan-aytepeye-trekking',
    'iznik-sansarak-kanyonu',
    'yuvacik-iznik-trekking',
    'igneada-kampi',
    'kaz-daglari-trekking',
    'kerpe-kampi',
    'mahcup-saskin-ve-mutlu',
    'menekse-subatimi-yaylasi-kampi',
    'ormandan-gelen-ciglik',
    'serindere-kanyonu',
    'suluklu-gol-azrail-teget-gecti',
    'suluklu-gol-trekking',
    'ya-kampta-biri-kaybolursa',
    'yalova-fistikli-trekking'
  ],
  'kamp-kulturu-ekipman': [
    '8-bin-kisiyle-kamp-alkislar-interrail-turkiyeye',
    'botlarin-kiymeti-bilinmeli',
    'evde-kano-yapimi'
  ],
  'hayat-yol-ilham': [
    'bir-hayalin-pesinde-kosmaya-var-misin',
    'hayalleri-olanlara-selam-olsun',
    'gezgin-olmak',
    'kurumsal-hayat-mi-dogal-hayat-mi',
    'neden-yola-cikmali',
    'rubicon-bir-baska-hayalin-baslangici',
    'son-6dk'
  ],
  hakkimda: ['ibrahim-uylas-kimdir', 'ibrahim-uylas-kimdir-2014'],
  'kosu-hikayeleri': ['32.km-ilk-maraton-kosusu']
}

const articleGroups = Object.fromEntries(
  Object.entries(storyGroups).flatMap(([group, slugs]) =>
    slugs.map(slug => [slug, group])
  )
)

const otherGuide = {
  id: 'diger',
  path: '/category/diger-her-sey/',
  primaryCategory: 'Diğer',
  hubCategories: ['Diğer'],
  tagNames: [],
  contentCountScope: 'primary',
  editorialLayout: 'split-first-row',
  title: 'Yol Hikâyeleri ve Diğer Yazılar',
  description:
    'Likya Yolu anılarından İskoçya ve Nordkapp yolculuklarına, Türkiye rotalarından kişisel notlara kadar yolun ve hayatın farklı hikâyelerini keşfet.',
  hero: {
    eyebrow: 'Yolun ve hayatın notları',
    ctaLabel: 'Bir hikâyeyle başla',
    ctaHref: '#iskocya-gezisi',
    secondaryCtaLabel: 'Tüm yazıları gör',
    imageType: 'static',
    imageAlt: 'Sisli dağ manzarasında çatı çadırlı bir kamp aracı ve gezgin'
  },
  allContentDescription:
    'Yol hikâyelerini, kamp ve trekking anılarını, kişisel yazıları ve farklı maceraları konu başlıklarına göre incele.',
  readingPath: [
    {
      slug: 'likya-yolu-rotasi',
      label: 'Likya Yolu’nu tanı',
      summary: 'Etapları ve 509 km’lik yürüyüş planını incele.'
    },
    {
      slug: 'likya-yolu-1.-gun',
      label: 'Bir günlük anıyla başla',
      summary: 'Likya Yolu’nun ilk gününü saha notlarıyla oku.'
    },
    {
      slug: 'tek-basina-iskoc-yaylalarinda-29-gunde-5500km',
      label: 'İskoçya’ya git',
      summary:
        '29 günlük, 5500 kilometrelik yolculuğun genel hikâyesine göz at.'
    },
    {
      slug: 'hedef-nordkapp-peki-neden',
      label: 'Uzak bir hedef seç',
      summary: 'Nordkapp yolculuğunun arkasındaki fikri öğren.'
    },
    {
      slug: 'yedigoller-trekking-tek-basima-ilk-yolculuk',
      label: 'Türkiye’de bir rota keşfet',
      summary: 'Tek başına başlayan bir trekking macerasına eşlik et.'
    },
    {
      slug: 'kim-bu-adam',
      label: 'Yazarla tanış',
      summary: 'Bu hikâyelerin arkasındaki kişiyi ve yolculuğu tanı.'
    }
  ],
  sections: [
    {
      id: 'iskocya-gezisi',
      title: 'İskoçya Gezisi',
      description:
        'İskoç yaylalarında motosikletle geçen yolculuğu Inverness’ten Ben Nevis’e ve NC500 rotasına kadar takip et.',
      layout: 'editorial',
      slugs: storyGroups['iskocya-gezisi']
    },
    {
      id: 'likya-yolu-anilari',
      title: 'Likya Yolu anıları',
      description:
        'Hazırlıklardan 11 günlük yürüyüş günlüğüne ve parkurun genel planına kadar Likya Yolu serisini tek akışta oku.',
      layout: 'editorial',
      slugs: storyGroups['likya-yolu-anilari']
    },
    {
      id: 'kackarlar-dogu-karadeniz',
      title: 'Kaçkarlar ve Doğu Karadeniz',
      description:
        'Yaylaları, dağ geçitlerini ve Doğu Karadeniz’in sürprizlerini kişisel anılarla birlikte incele.',
      layout: 'editorial',
      slugs: storyGroups['kackarlar-dogu-karadeniz']
    },
    {
      id: 'turkiye-kamp-trekking',
      title: 'Türkiye’den kamp ve trekking hikâyeleri',
      description:
        'Göllerden yaylalara, kanyonlardan kıyılara uzanan kamp ve yürüyüş anılarını bir arada bul.',
      layout: 'editorial',
      slugs: storyGroups['turkiye-kamp-trekking']
    },
    {
      id: 'kamp-kulturu-ekipman',
      title: 'Kamp kültürü ve ekipman notları',
      description:
        'Kamp organizasyonlarından ekipman bakımına ve el emeği projelere uzanan yazılara göz at.',
      layout: 'editorial',
      slugs: storyGroups['kamp-kulturu-ekipman']
    },
    {
      id: 'hayat-yol-ilham',
      title: 'Hayat, yol ve ilham',
      description:
        'Yola çıkma cesareti, gezginlik, hayaller ve hayatın içinden kişisel düşünceler üzerine yazıları oku.',
      layout: 'editorial',
      slugs: storyGroups['hayat-yol-ilham']
    },
    {
      id: 'hakkimda',
      title: 'Hakkımda',
      description:
        'Bu sitenin ve yol hikâyelerinin arkasındaki kişiyi farklı dönemlerden yazılarla tanı.',
      layout: 'editorial',
      slugs: storyGroups.hakkimda
    },
    {
      id: 'kosu-hikayeleri',
      title: 'Koşu hikâyeleri',
      description:
        'Dayanıklılık, sınırlar ve ilk maraton deneyimi üzerine samimi bir koşu günlüğü.',
      layout: 'editorial',
      slugs: storyGroups['kosu-hikayeleri']
    }
  ],
  groupFilters: [
    { id: 'iskocya-gezisi', label: 'İskoçya Gezisi' },
    { id: 'likya-yolu-anilari', label: 'Likya Yolu anıları' },
    { id: 'kackarlar-dogu-karadeniz', label: 'Kaçkarlar ve Doğu Karadeniz' },
    { id: 'turkiye-kamp-trekking', label: 'Türkiye kamp ve trekking' },
    { id: 'kamp-kulturu-ekipman', label: 'Kamp kültürü ve ekipman' },
    { id: 'hayat-yol-ilham', label: 'Hayat, yol ve ilham' },
    { id: 'hakkimda', label: 'Hakkımda' },
    { id: 'kosu-hikayeleri', label: 'Koşu hikâyeleri' }
  ],
  articleGroups,
  featuredSlugs: [
    'likya-yolu-rotasi',
    'tek-basina-iskoc-yaylalarinda-29-gunde-5500km',
    'hedef-nordkapp-peki-neden',
    'yedigoller-trekking-tek-basima-ilk-yolculuk'
  ],
  imageSectionIds: [
    'iskocya-gezisi',
    'likya-yolu-anilari',
    'turkiye-kamp-trekking',
    'hayat-yol-ilham'
  ],
  imageExcludedSlugs: []
}

module.exports = otherGuide
module.exports.storyGroups = storyGroups
module.exports.allOtherSlugs = Object.values(storyGroups).flat()
