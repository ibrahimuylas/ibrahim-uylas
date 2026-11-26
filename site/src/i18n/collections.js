const homeCategoryPostsPerGroup = 6

const tagNames = {
  antalyakampyerleri: 'Campsites in Antalya',
  artvinkampyerleri: 'Campsites in Artvin',
  batinkampyerleri: 'Campsites in Bartın',
  bilecikkampyerleri: 'Campsites in Bilecik',
  bolukampyerleri: 'Campsites in Bolu',
  bursakampyerleri: 'Campsites in Bursa',
  cadir: 'Tents',
  digerhersey: 'Everything else',
  djipocket2: 'DJI Pocket 2',
  dogadakamp: 'Wild camping',
  dogayuruyusleri: 'Nature walks',
  duzcekampyerleri: 'Campsites in Düzce',
  elektronikekipmanlar: 'Electronics',
  frigyolu: 'Phrygian Way',
  hiking: 'Hiking',
  'ilk-kamp': 'First camping trip',
  iskocya: 'Scotland',
  istanbulkampyerleri: 'Campsites in İstanbul',
  izmirkampyerleri: 'Campsites in İzmir',
  kampalani: 'Campsites',
  kampcadiri: 'Camping tents',
  kampcantalistesi: 'Camping checklist',
  kampcilik: 'Camping',
  kampekipmanlari: 'Camping gear',
  kampguvenligi: 'Camping safety',
  kampmati: 'Sleeping mats',
  kampmutfagi: 'Camp cooking',
  kampyerleriverotalar: 'Campsites and routes',
  karabukkampyerleri: 'Campsites in Karabük',
  kirklarelikampyerleri: 'Campsites in Kırklareli',
  kitap: 'Books',
  kocaelikampyerleri: 'Campsites in Kocaeli',
  likyayolu: 'Lycian Way',
  likyayolurotasi: 'Lycian Way route',
  muglakampyerleri: 'Campsites in Muğla',
  quechua: 'Quechua',
  rdegeri: 'R-value',
  rizekampyerleri: 'Campsites in Rize',
  sakaryakampyerleri: 'Campsites in Sakarya',
  sinopkampyerleri: 'Campsites in Sinop',
  trabzonkampyerleri: 'Campsites in Trabzon',
  trekking: 'Trekking',
  uykutulumu: 'Sleeping bags',
  yagmurluk: 'Waterproof jackets',
  yalovakampyerleri: 'Campsites in Yalova',
  yolhikayeleri: 'Stories from the road',
  yuruyusekipmanlari: 'Hiking gear'
}

const parseCollectionPath = path => {
  const match = path.match(
    /^\/(category|author|tag)\/([^/]+)\/(?:page\/(\d+)\/)?$/
  )
  if (!match) return null
  const [, kind, name, page = '1'] = match
  return { kind, name, page: Number(page), slug: `/${kind}/${name}/` }
}

const tagName = slug => tagNames[parseCollectionPath(slug)?.name]

module.exports = { homeCategoryPostsPerGroup, parseCollectionPath, tagName }
