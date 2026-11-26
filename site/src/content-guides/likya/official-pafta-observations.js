const permittedUses = ['editorial-review', 'route-context']
const prohibitedUses = [
  'current-route-condition',
  'current-water-or-service-availability',
  'route-metric',
  'publication-eligibility'
]

const officialPaftaObservations = [
  ...[
    [
      '1',
      'Ovacık–Kirme',
      'Ovacık–Kirme adayının resmî başlangıç bağlamını ve Ölüdeniz/Kayaköy alternatiflerini resmî haritada karşılaştır; su ve yerel hizmet ifadelerini güncel kabul etme.'
    ],
    [
      '2',
      'Faralya–Alıncak',
      'Faralya–Kabak–Alınca adayının kapsamını resmî haritada karşılaştır; dik iniş, kamp ve hizmet açıklamalarını güncel operasyonel bilgi sayma.'
    ],
    [
      '12',
      'Çoban–Boğazcık',
      'Limanağzı ve Boğazcık arasındaki kıyı/tepe hattı için aday yönünü resmî haritayla karşılaştır.'
    ],
    [
      '13',
      'Boğazcık–Üçağız',
      'Boğazcık–Üçağız adayının kıyı ve arkeolojik alan çevresindeki kapsamını resmî haritayla karşılaştır.'
    ],
    [
      '15',
      'Demre–Vadi–Belören',
      'Demre–Vadi–Belören adayındaki kara/kıyı seçeneklerini resmî pafta üzerinde ayır.'
    ],
    [
      '17',
      'Demre–Beymelek–Yeni Yol',
      'Alternatif güney rota bağlamını kullanarak adayın varyantını resmî haritayla karşılaştır.'
    ],
    [
      '19',
      'Hasyurt–Kumluca',
      'Pafta başlığı ile Sahilkent–Hasyurt–Kumluca ayrıntı kapsamını aynı kabul etme; adayın yönünü ve kıyı hattını resmî harita üzerinde doğrula.'
    ],
    [
      '20',
      'Mavikent–Gagai',
      'Pafta başlığı ile Mavikent–Karaöz ayrıntı kapsamı arasındaki farkı resmî haritada çöz; mevsimsel yerleşim ve market bilgilerini güncel kabul etme.'
    ],
    [
      '25',
      'Ulupınar–Beycik',
      'Ulupınar–Beycik adayının batı rota dalını resmî paftayla karşılaştır; yiyecek, konaklama ve alışveriş ifadelerini güncel hizmet bilgisi olarak kullanma.'
    ],
    [
      '28',
      'Phaselis–Kuzdere',
      'Phaselis–Çamyuva–Kuzdere adayını resmî haritada karşılaştır; Çamyuva için verilen ihtiyaç bilgisini güncel kabul etme.'
    ],
    [
      '29',
      'Tekedağı–Güneşli',
      'Pafta başlığı ile Yayla Kuzdere–Gedelma / Kuzdere–Gedelma ayrıntı kapsamını resmî harita üzerinde ayır; iki rota dalını ve Gedelma yönünü varsayma.'
    ]
  ].map(([sequence, title, reviewPrompt]) => ({
    id: `official-observation-pafta-${sequence}`,
    sectionId: `ktb-pafta-${sequence}`,
    sourceId: `ktb-pafta-${sequence}-detail`,
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext: `Bakanlık açıklaması Pafta ${sequence}: ${title} için rota bağlamı sunar.`,
    reviewPrompt
  })),
  {
    id: 'official-observation-pafta-5',
    sectionId: 'ktb-pafta-5',
    sourceId: 'ktb-pafta-5-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Karadere, Kumluova, Letoon, Kınık ve Çavdır çevresindeki hattı bağlam olarak tarif eder.',
    reviewPrompt:
      'Karadere–Letoon–Xanthos adayının resmî pafta kapsamıyla ilişkisinde doğu devamını ve rota varyantını elle karşılaştır.'
  },
  {
    id: 'official-observation-pafta-6',
    sectionId: 'ktb-pafta-6',
    sourceId: 'ktb-pafta-6-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Çayköy, Üzümlü, İslamlar ve Akbel çevresindeki geçişleri bağlam olarak anlatır.',
    reviewPrompt:
      'Geniş kapsamlı Üzümlü–İslamlar adayını resmî paftaya kırpma veya metindeki su/market ifadelerini güncel kabul etme.'
  },
  {
    id: 'official-observation-pafta-8',
    sectionId: 'ktb-pafta-8',
    sourceId: 'ktb-pafta-8-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Kalkan, Bezirgan, Sarıbelen ve Gökçeören yönündeki hattı bağlam olarak tarif eder.',
    reviewPrompt:
      'Kalkan–Bezirgan–Sarıbelen adayını resmî sınır ve yönle karşılaştır; hizmet ve işaret ifadelerini güncel saha bilgisi olarak kullanma.'
  },
  {
    id: 'official-observation-pafta-9',
    sectionId: 'ktb-pafta-9',
    sourceId: 'ktb-pafta-9-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Gökçeören, Gökdere ve Hacıoğlan çevresindeki hattı bağlam olarak anlatır.',
    reviewPrompt:
      'Tek yer adlı resmî paftanın kapsamını aday başlığından çıkarma; başlangıç, bitiş ve rotadaki olası yol değişimlerini resmî haritayla kontrol et.'
  },
  {
    id: 'official-observation-pafta-22',
    sectionId: 'ktb-pafta-22',
    sourceId: 'ktb-pafta-22-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Karaöz, Gelidonya Feneri, Melanippe ve Adrasan yönündeki orman/kıyı hattını bağlam olarak tarif eder.',
    reviewPrompt:
      'Gelidonya Feneri–Melanippe adayını resmî haritayla karşılaştır; açıklamadaki su ve işaret bilgilerini güncel kabul etme.'
  },
  {
    id: 'official-observation-pafta-23',
    sectionId: 'ktb-pafta-23',
    sourceId: 'ktb-pafta-23-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Adrasan’dan Musa Dağı çevresi üzerinden Olympos yönüne giden hattı tarif eder.',
    reviewPrompt:
      'Musa Dağı–Olympos adayını resmî paftayla karşılaştır; yerleşim ve su ifadelerini güncel operasyonel bilgi sayma.'
  },
  {
    id: 'official-observation-pafta-24',
    sectionId: 'ktb-pafta-24',
    sourceId: 'ktb-pafta-24-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Olympos–Çıralı kesiminden sonra doğu ve batı rota ayrımını bağlam olarak anlatır.',
    reviewPrompt:
      'Çıralı–Chimaera–Maden Ayrım Yeri adayında doğru dalı resmî harita üzerinde belirle; tesis ifadelerini güncel kabul etme.'
  },
  {
    id: 'official-observation-pafta-26',
    sectionId: 'ktb-pafta-26',
    sourceId: 'ktb-pafta-26-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Çıralı’dan Tekirova ve Phaselis yönüne ilerleyen doğu rotasını bağlam olarak tarif eder.',
    reviewPrompt:
      'Tekirova–Phaselis adayını resmî paftayla karşılaştır; sayfadaki ihtiyaç bilgisini güncel hizmet durumu sayma.'
  },
  {
    id: 'official-observation-pafta-11',
    sectionId: 'ktb-pafta-11',
    sourceId: 'ktb-pafta-11-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Kaş yerleşimi ile Limanağzı arasındaki kıyı hattı ve ara geçişleri bağlam olarak anlatır.',
    reviewPrompt:
      'Kaş–Limanağzı adayını resmî harita üzerinde karşılaştır; metindeki ihtiyaç noktalarını güncel hizmet bilgisi kabul etme.'
  },
  {
    id: 'official-observation-pafta-14',
    sectionId: 'ktb-pafta-14',
    sourceId: 'ktb-pafta-14-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Üçağız, Kapaklı, Andriake ve çevredeki olası ayrımları rota bağlamı olarak tarif eder.',
    reviewPrompt:
      'Üçağız–Andriake–Demre adayının pafta kapsamını ve kıyı/arka rota ayrımlarını resmî harita üzerinde karşılaştır.'
  },
  {
    id: 'official-observation-pafta-16',
    sectionId: 'ktb-pafta-16',
    sourceId: 'ktb-pafta-16-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Zeytin, Alakilise ve Bonda Tepesi çevresinde orman ve patika geçişlerinin bağlamını verir.',
    reviewPrompt:
      'Zeytin–Alakilise–Üstyol adayını resmî paftayla karşılaştır; anlatımdaki eğim ve zemin ifadelerini sayısal metrik sayma.'
  },
  {
    id: 'official-observation-pafta-18',
    sectionId: 'ktb-pafta-18',
    sourceId: 'ktb-pafta-18-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Bonda Tepesi, Finike ve Sahilkent çevresini bir rota bağlamı olarak tarif eder.',
    reviewPrompt:
      'Tek yer adlı Finike paftasının pratik kapsamını varsayma; adayın başlangıç, bitiş ve yönünü resmî haritada doğrula.'
  },
  {
    id: 'official-observation-pafta-3',
    sectionId: 'ktb-pafta-3',
    sourceId: 'ktb-pafta-3-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Alınca çevresinden Gey, Yediburunlar, Sidyma ve Bel yönlerine uzanan pafta içi seçenekleri tarif eder.',
    reviewPrompt:
      'Alınca–Sidyma–Gey-Bel adayındaki bitiş, yön ve varyantı resmî harita üzerinde karşılaştır; sayfadaki hizmet ifadelerini güncel kabul etme.'
  },
  {
    id: 'official-observation-pafta-4',
    sectionId: 'ktb-pafta-4',
    sourceId: 'ktb-pafta-4-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Belceğiz, Gavurağılı ve Kumluova çevresindeki inişli hattı bağlam olarak anlatır.',
    reviewPrompt:
      'Aday başlığındaki Bel ve resmî başlıktaki Belceğiz ilişkisini varsayma; pafta sınırı, yön ve bitişi resmî harita üzerinde karşılaştır.'
  },
  {
    id: 'official-observation-pafta-7',
    sectionId: 'ktb-pafta-7',
    sourceId: 'ktb-pafta-7-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Akbel, Delikkemer ve Patara yönündeki hattı ve bir rota ayrımını tarif eder.',
    reviewPrompt:
      'Akbel–Patara adayını resmî hatla karşılaştır; metindeki işaret ve hizmet ifadelerini güncel saha bilgisi olarak kullanma.'
  },
  {
    id: 'official-observation-pafta-10',
    sectionId: 'ktb-pafta-10',
    sourceId: 'ktb-pafta-10-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Phellos, Çukurbağ ve Pınarbaşı çevresindeki ilişkiyi anlatır; sayfa başlığı ile ayrıntı kapsamı ayrıca kontrol gerektirir.',
    reviewPrompt:
      'Dereköy–Çukurbağ paftasıyla adayın başlangıç/bitişini resmî harita üzerinde karşılaştır; ayrıntı metnindeki yer adlarını etap sınırı sayma.'
  },
  {
    id: 'official-observation-pafta-21',
    sectionId: 'ktb-pafta-21',
    sourceId: 'ktb-pafta-21-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması, Karaöz’den Gelidonya çevresinden Adrasan’a inen hattın pafta düzeniyle ilişkisini tarif eder.',
    reviewPrompt:
      'Aday iziyle Karaöz, Gelidonya çevresi ve Adrasan yönünü resmî harita üzerinde karşılaştır; sayfadaki hizmet ifadelerini güncel kabul etme.'
  },
  {
    id: 'official-observation-pafta-27',
    sectionId: 'ktb-pafta-27',
    sourceId: 'ktb-pafta-27-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Tahtalı çevresindeki batı rotasını Yayla Kuzdere yönüyle birlikte anlatır.',
    reviewPrompt:
      'Tek yer adlı resmî paftanın pratik kapsamını Tahtalı–Yayla Kuzdere adayından varsayma; başlangıç, bitiş, yön ve varyantı resmî harita ile elle doğrula.'
  },
  {
    id: 'official-observation-pafta-30',
    sectionId: 'ktb-pafta-30',
    sourceId: 'ktb-pafta-30-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Göynük Yaylası ve Göynük Kanyonu çevresindeki hattı ve dere içindeki rota ayrımının önemini anlatır.',
    reviewPrompt:
      'Adayın Ovacık–Göynük Kanyon başlığını yeterli görme; pafta sınırı, dere içindeki ayrım ve yönü resmî harita üzerinde karşılaştır.'
  },
  {
    id: 'official-observation-pafta-31',
    sectionId: 'ktb-pafta-31',
    sourceId: 'ktb-pafta-31-detail',
    accessedAt: '2026-08-28',
    sourceFreshness: 'undated-official-description',
    permittedUses,
    prohibitedUses,
    routeContext:
      'Bakanlık açıklaması Göynük Kanyonu çevresinden Sarıçınar ve Hisarçandır yönüne uzanan hattı tarif eder; ileride olası resmî başlangıç değişikliğinden de söz eder.',
    reviewPrompt:
      'Sarıçınar–Hisarçandır adayını resmî haritayla karşılaştır ve sayfadaki ileriye dönük değişiklik ifadesini yürürlükte kabul etme.'
  }
]

const buildOfficialObservationCoverage = ({
  routeSections = [],
  officialPaftaObservations: observations = []
} = {}) =>
  routeSections.map(section => {
    const matchingObservations = observations.filter(
      observation => observation.sectionId === section.id
    )

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      observationIds: matchingObservations.map(observation => observation.id),
      status:
        matchingObservations.length > 0
          ? 'official-context-indexed'
          : 'official-detail-source-not-indexed',
      doNotPublish: true
    }
  })

module.exports = {
  buildOfficialObservationCoverage,
  officialPaftaObservations,
  permittedUses,
  prohibitedUses
}
