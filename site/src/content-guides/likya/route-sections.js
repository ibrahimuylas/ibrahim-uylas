const { sourceById } = require('./sources')

const officialRouteUrl = sourceById['ktb-likya-route-home'].url
const officialMapCollectionUrl = sourceById['ktb-likya-map-collection'].url

const paftaInventory = [
  ['Ovacık – Kirme', 'Ovacık', 'Kirme'],
  ['Faralya – Alınca', 'Faralya', 'Alınca'],
  ['Alınca – Sidyma – Gey-Bel', 'Alınca', 'Gey-Bel'],
  ['Belceğiz – Gavurağılı – Karadere', 'Belceğiz', 'Karadere'],
  ['Karadere – Letoon – Xanthos', 'Karadere', 'Xanthos'],
  ['Üzümlü – İslamlar', 'Üzümlü', 'İslamlar'],
  ['Akbel – Patara', 'Akbel', 'Patara'],
  ['Kalkan – Bezirgan – Sarıbelen', 'Kalkan', 'Sarıbelen'],
  ['Hacıoğlan', 'Hacıoğlan', null],
  ['Dereköy – Çukurbağ', 'Dereköy', 'Çukurbağ'],
  ['Kaş – Limanağzı', 'Kaş', 'Limanağzı'],
  ['Çoban – Boğazcık', 'Çoban', 'Boğazcık'],
  ['Boğazcık – Üçağız', 'Boğazcık', 'Üçağız'],
  ['Üçağız – Andriake – Demre', 'Üçağız', 'Demre'],
  ['Demre – Vadi – Belören', 'Demre', 'Belören'],
  ['Zeytin – Alakilise – Üstyol', 'Zeytin', 'Üstyol'],
  ['Demre – Beymelek – Yeni Yol', 'Demre', 'Yeni Yol'],
  ['Finike', 'Finike', null],
  ['Hasyurt – Kumluca', 'Hasyurt', 'Kumluca'],
  ['Mavikent – Gagai', 'Mavikent', 'Gagai'],
  ['Karaöz – Adrasan', 'Karaöz', 'Adrasan'],
  ['Gelidonya Feneri – Melanippe', 'Gelidonya Feneri', 'Melanippe'],
  ['Musa Dağı – Olympos', 'Musa Dağı', 'Olympos'],
  ['Çıralı – Chimaera – Maden Ayrım Yeri', 'Çıralı', 'Maden Ayrım Yeri'],
  ['Ulupınar – Beycik', 'Ulupınar', 'Beycik'],
  ['Tekirova – Phaselis', 'Tekirova', 'Phaselis'],
  ['Tahtalı', 'Tahtalı', null],
  ['Phaselis – Kuzdere', 'Phaselis', 'Kuzdere'],
  ['Tekedağı – Güneşli', 'Tekedağı', 'Güneşli'],
  ['Ovacık – Göynük Kanyon', 'Ovacık', 'Göynük Kanyon'],
  ['Sarıçınar – Hisarçandır', 'Sarıçınar', 'Hisarçandır']
]

const editorialRegionFor = sequence => {
  if (sequence <= 10) return 'west'
  if (sequence <= 18) return 'central'
  return 'east'
}

const routeSections = paftaInventory.map(([title, start, end], index) => {
  const sequence = index + 1

  return {
    id: `ktb-pafta-${sequence}`,
    sequence,
    name: `Pafta ${sequence}: ${title}`,
    officialTitle: `Pafta ${sequence}: ${title}`,
    start,
    end,
    editorialRegion: editorialRegionFor(sequence),
    editorialRegionStatus: 'provisional',
    officialMapSourceId:
      sequence <= 10 ? 'ktb-likya-map-1' : 'ktb-likya-route-home',
    officialMapNumber: sequence,
    officialMapUrl:
      sequence <= 10 ? sourceById['ktb-likya-map-1'].url : officialRouteUrl,
    officialMapCollectionUrl,
    routeVariants: [],
    geometryStatus: 'external-reference',
    distanceKm: {
      value: null,
      sourceId: null,
      qualification:
        'Pafta envanteri aşamasında mesafe değeri henüz kaydedilmedi; yürüyüş günü veya rota toplamı olarak gösterilmez.'
    },
    relatedStageIds: [],
    relatedArticleSlugs: [],
    verifiedAt: '2026-08-27',
    verifiedBy: 'Editoryal pafta envanteri',
    reviewStatus: 'inventory-verified',
    notes: end
      ? null
      : 'Bakanlık ana sayfası bu pafta için tek yer adı başlığı veriyor. Bitiş/kapsam, pafta dosyası veya ayrıntı sayfası üzerinden doğrulanmalı.'
  }
})

const routeSectionById = Object.fromEntries(
  routeSections.map(section => [section.id, section])
)

module.exports = {
  paftaInventory,
  routeSections,
  routeSectionById
}
