const researchStates = [
  'unmapped',
  'research',
  'needs-review',
  'withheld',
  'eligible',
  'published'
]
const { isVerifiedExternalGpsLink } = require('./external-gps-links')

const stageResearchRecords = [
  {
    id: 'western-pafta-1-ovacik-kirme-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-1'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-24692574'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-ovacik-kozagac-kirme-faralya-24692574',
        sourceId: 'wikiloc-24692574',
        recordId: '24692574',
        author: 'Metin ULUIŞIK',
        recordedAt: '2018-04',
        uploadedAt: '2018-05-07',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'İz Ovacık–Kirme ortak noktalarını içerir fakat Faralya’ya devam eder. Pafta 1 sınırı ve yönü ayrı doğrulanmalıdır.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-2-faralya-alinca-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-2'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-58521662'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-yuruyusu-faralya-alinca-etabi-58521662',
        sourceId: 'wikiloc-58521662',
        recordId: '58521662',
        author: 'aliyesido',
        recordedAt: '2020-10',
        uploadedAt: '2020-10-13',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 2 ile örtüşür; geometri, yön, rota varyantı ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-3-alinca-sidyma-gey-bel-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-3'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-45522573'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-05ay-alinca-sidyma-bel-45522573',
        sourceId: 'wikiloc-45522573',
        recordId: '45522573',
        author: 'altugsenel',
        recordedAt: '2011-05',
        uploadedAt: '2020-01-14',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Wikiloc başlığı Alınca–Sidyma–Bel, resmî pafta başlığı Alınca–Sidyma–Gey-Bel. Bitiş adı, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Bu kayıt sadece haricî GPS adayıdır. Mesafe, irtifa, su, rota işaretleri veya güncel koşul iddiası taşımaz; ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-4-belcegiz-gavuragli-karadere-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-4'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-249383008'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-5-gun-bel-gavuragli-karadere-15-km-249383008',
        sourceId: 'wikiloc-249383008',
        recordId: '249383008',
        author: 'erolgeygel',
        recordedAt: '2026-02',
        uploadedAt: '2026-02-05',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Bel–Gavurağlı–Karadere başlığını taşır. Resmî paftadaki Belceğiz sınırı, yön, geometri ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-5-karadere-letoon-xanthos-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-5'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-249385073'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-6-gun-karadere-letoon-xantos-19-km-249385073',
        sourceId: 'wikiloc-249385073',
        recordId: '249385073',
        author: 'erolgeygel',
        recordedAt: '2026-02',
        uploadedAt: '2026-02-05',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 5 ile örtüşür, ancak kaynak açıklaması çoklu referans iz kullanımından söz eder. İlk-el iz/provenans, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-6-uzumlu-islamlar-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-6'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-41617254'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-4-xanthos-cavdir-caykoy-inpinar-uzumler-islamlar-akbel-41617254',
        sourceId: 'wikiloc-41617254',
        recordId: '41617254',
        author: 'arducerdal',
        recordedAt: '2019-09',
        uploadedAt: '2019-09-23',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Geniş hat Üzümlü ve İslamlar’dan geçer, ancak Pafta 6’dan daha fazlasını kapsar. Sınırlar, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-7-akbel-patara-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-7'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-16611531'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-akbel-delikkemer-patara-yuruyusu-16611531',
        sourceId: 'wikiloc-16611531',
        recordId: '16611531',
        author: 'Metin ULUIŞIK',
        recordedAt: '2017-02',
        uploadedAt: '2017-03-01',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 7 ile örtüşür; geometri, yön, rota varyantı ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-8-kalkan-bezirgan-saribelen-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-8'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-35437239'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-kalkan-bezirgan-yaylasi-ve-saribelen-35437239',
        sourceId: 'wikiloc-35437239',
        recordId: '35437239',
        author: 'GezErsin',
        recordedAt: '2019-04',
        uploadedAt: '2019-04-20',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 8 ile örtüşür; geometri, yön, rota varyantı ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-9-hacioglan-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-9'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-249421274'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-9-gun-saribelen-gokceoren-hacioglan-19-km-249421274',
        sourceId: 'wikiloc-249421274',
        recordId: '249421274',
        author: 'erolgeygel',
        recordedAt: '2026-02',
        uploadedAt: '2026-02-05',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Hacıoğlan’da biter. Resmî Pafta 9 kapsamı tek yer adıyla sınırlı olduğundan sınırlar, yön, geometri ve çoklu referans iz/provenansı ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'western-pafta-10-derekoy-cukurbag-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-10'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-54664242'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/derekoy-phellos-cukurbag-likya-yolu-lycian-way-16072020-54664242',
        sourceId: 'wikiloc-54664242',
        recordId: '54664242',
        author: 'Fatih Sz',
        recordedAt: '2020-07',
        uploadedAt: '2020-08-14',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 10 ile örtüşür. Kaynak, bazı kesimlerde daha kolay bir rota varyantı tercih edildiğini söylüyor; resmî hat, varyant, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-11-kas-limanagzi-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-11'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-73446903'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/kas-limanagzi-likya-yolu-73446903',
        sourceId: 'wikiloc-73446903',
        recordId: '73446903',
        author: 'Oktatlon Doğa Sporları Kulübü',
        recordedAt: '2021-05',
        uploadedAt: '2021-05-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Kaş–Limanağzı ile doğrudan örtüşür; iz geometrisi, yön, başlangıç/bitiş noktaları ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-12-coban-bogazcik-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-12'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-60785877'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-01-15-uzumluden-bogazcik-ve-kilincliya-2020-10-60785877',
        sourceId: 'wikiloc-60785877',
        recordId: '60785877',
        author: 'Yaban Adımlar Likya',
        recordedAt: '2020-10',
        uploadedAt: '2020-11-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Üzümlü’den Boğazcık ve Kılınçlı’ya uzanır. Resmî Çoban–Boğazcık pafta sınırı, iz geometrisi, yön ve varyant ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-13-bogazcik-ucagiz-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-13'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-76403817'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-9-bogazcik-aperlai-ucagiz-kalekoy-cayagzi-76403817',
        sourceId: 'wikiloc-76403817',
        recordId: '76403817',
        author: 'arducerdal',
        recordedAt: '2021-06',
        uploadedAt: '2021-06-21',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Boğazcık–Aperlai–Üçağız ana hattından sonra Kaleüçağız ve Çayağzı’na uzanır. Resmî pafta sınırı, iz geometrisi, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-14-ucagiz-andriake-demre-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-14'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-167948987'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/kaleucagiz-simena-kalesi-cakil-plaji-andriake-demre-167948987',
        sourceId: 'wikiloc-167948987',
        recordId: '167948987',
        author: 'hafize.yigit',
        recordedAt: '2024-04',
        uploadedAt: '2024-04-20',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Kaleüçağız’dan Andriake’ye gider. Resmî Üçağız–Andriake–Demre başlangıç adının eşleşmesi, Demre uzantısı, iz geometrisi ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-15-demre-vadi-beloren-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-15'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-167357934'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/likya-yolu-demre-alakilise-14-04-2024-167357934',
        sourceId: 'wikiloc-167357934',
        recordId: '167357934',
        author: 'Özgür Arda BAYRAM',
        recordedAt: '2024-04',
        uploadedAt: '2024-04-14',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Demre–Alakilise başlığını taşır. Resmî Demre–Vadi–Belören ara yer adları, pafta sınırı, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-16-zeytin-alakilise-ustyol-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-16'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-167482893'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-alakilise-yukaribeymelek-15-04-2024-167482893',
        sourceId: 'wikiloc-167482893',
        recordId: '167482893',
        author: 'Özgür Arda BAYRAM',
        recordedAt: '2024-04',
        uploadedAt: '2024-04-15',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Alakilise–Yukarıbeymelek hattını taşır. Resmî Zeytin–Alakilise–Üstyol kapsamı, pafta sınırı, geometri, yön ve varyant ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-17-demre-beymelek-yeni-yol-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-17'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-31198631'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-finike-demre-beymelek-31198631',
        sourceId: 'wikiloc-31198631',
        recordId: '31198631',
        author: 'Mustafa Aygün',
        recordedAt: '2018-12',
        uploadedAt: '2018-12-08',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Finike–Demre (Beymelek) başlığını taşır; sahibi rotadan saptığını ve yürüyüşü tamamlayamadığını belirtir. Bu nedenle Demre–Beymelek–Yeni Yol için yalnızca düşük güvenli adaydır.'
      }
    ],
    notes:
      'Düşük güvenli haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'central-pafta-18-finike-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-18'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-167567463'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/likya-yolu-yukaribeymelek-finike-16-04-2024-167567463',
        sourceId: 'wikiloc-167567463',
        recordId: '167567463',
        author: 'Özgür Arda BAYRAM',
        recordedAt: '2024-04',
        uploadedAt: '2024-04-16',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Yukarıbeymelek–Finike hattını taşır. Tek yer adlı resmî Finike paftasının kapsamı, başlangıç/bitiş, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-19-hasyurt-kumluca-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-19'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-168492600'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-hasyurt-plaji-kamp-alani-kumluca-karagoz-korsan-koyu-mevkki-kamp-alani-168492600',
        sourceId: 'wikiloc-168492600',
        recordId: '168492600',
        author: 'nusret_ykl',
        recordedAt: '2024-04',
        uploadedAt: '2024-04-25',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Hasyurt–Kumluca geçişini içerir ancak Karagöz ve Korsan Koyu’na uzanır. Resmî pafta sınırı, geometri, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-21-karaoz-adrasan-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-21'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774217'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-21-karaoz-gelidonya-feneri-adrasan-22774217',
        sourceId: 'wikiloc-22774217',
        recordId: '22774217',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 21 ile doğrudan örtüşür; resmî pafta sınırı, iz geometrisi, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-22-gelidonya-melanippe-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-22'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774217'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-21-karaoz-gelidonya-feneri-adrasan-22774217',
        sourceId: 'wikiloc-22774217',
        recordId: '22774217',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Gelidonya Feneri ve Melanippe ara noktalarını içerir ama Karaöz–Adrasan tam hattını kapsar. Pafta 22 sınırı, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-23-musa-dagi-olympos-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-23'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-71361789'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-olympos-musa-dagi-adrasan-71361789',
        sourceId: 'wikiloc-71361789',
        recordId: '71361789',
        author: 'tansel.unsal',
        recordedAt: '2021-04',
        uploadedAt: '2021-04-24',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Olympos–Musa Dağı–Adrasan hattını taşır. Resmî Pafta 23 sınırı, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-24-cirali-chimaera-maden-ayrim-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-24'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774290'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-23a-cirali-yanartas-ulupinar-beycik-22774290',
        sourceId: 'wikiloc-22774290',
        recordId: '22774290',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Çıralı–Yanartaş–Ulupınar–Beycik hattını taşır. Resmî Pafta 24’teki Maden Ayrım Yeri sınırı, geometri, yön ve varyant ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-25-ulupinar-beycik-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-25'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774290'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-23a-cirali-yanartas-ulupinar-beycik-22774290',
        sourceId: 'wikiloc-22774290',
        recordId: '22774290',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Ulupınar ve Beycik yer adlarını içerir fakat Çıralı’dan başlar. Resmî Pafta 25 sınırı, geometri, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-26-tekirova-phaselis-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-26'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774582'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-24b-tekirova-phaselis-asagi-kuzdere-22774582',
        sourceId: 'wikiloc-22774582',
        recordId: '22774582',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Tekirova–Phaselis–Aşağı Kuzdere hattını taşır. Resmî Pafta 26 sınırı, geometri, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-20-mavikent-gagai-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-20'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-22774199'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-20-finike-mavikent-karaoz-22774199',
        sourceId: 'wikiloc-22774199',
        recordId: '22774199',
        author: 'altugsenel',
        recordedAt: '2018-02',
        uploadedAt: '2018-02-19',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Mavikent ve Gagai yer adlarını içerir ancak Finike–Karaöz hattının tamamına uzanır. Resmî Pafta 20 sınırı, geometri, yön ve varyant ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-27-tahtali-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-27'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-58025240'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-beycik-tahtali-dagi-yayla-kuzdere-58025240',
        sourceId: 'wikiloc-58025240',
        recordId: '58025240',
        author: 'Cengiz İspir',
        recordedAt: '2020-10',
        uploadedAt: '2020-10-05',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Beycik–Tahtalı Dağı–Yayla Kuzdere hattını taşır. Tek yer adlı resmî Tahtalı paftasının kapsamı, geometri, yön ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-28-phaselis-kuzdere-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-28'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-117706933'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-tekirova-phaselis-kuzdere-117706933',
        sourceId: 'wikiloc-117706933',
        recordId: '117706933',
        author: 'brkgoktas',
        recordedAt: '2022-10',
        uploadedAt: '2022-10-30',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Tekirova–Phaselis–Kuzdere hattını taşır. Resmî Pafta 28 sınırı, geometri, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Geniş kapsamlı haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-30-ovacik-goynuk-kanyon-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-30'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-102922041'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://www.wikiloc.com/hiking-trails/hiking-012-ovacik-goynuk-kanyonu-likya-yolu-lycia-way-antalya-102922041',
        sourceId: 'wikiloc-102922041',
        recordId: '102922041',
        author: 'guideofadventure',
        recordedAt: '2022-05',
        uploadedAt: '2022-05-15',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Başlık Pafta 30 ile doğrudan örtüşür; iz geometrisi, yön, varyant ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  },
  {
    id: 'eastern-pafta-31-saricinar-hisarcandir-wikiloc-candidate',
    researchStatus: 'research',
    researchOwner: 'Likya rehber editoryal araştırması',
    updatedAt: '2026-08-28',
    officialSectionIds: ['ktb-pafta-31'],
    sourceIds: ['ktb-likya-route-home', 'wikiloc-23809595'],
    externalGpsLinks: [
      {
        provider: 'wikiloc',
        url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/goynuk-kanyonu-sari-cinar-likya-yolu-23809595',
        sourceId: 'wikiloc-23809595',
        recordId: '23809595',
        author: 'ilker gök',
        recordedAt: '2018-04',
        uploadedAt: '2018-04-07',
        reviewedAt: '2026-08-28',
        routeMatchStatus: 'candidate',
        externalDownloadOnly: true,
        matchNotes:
          'Kayıt Göynük Kanyonu–Sarıçınar alt kesimini içerir ve açıklama Hisarçandır–Göynük Kanyonu etabına atıf yapar. Resmî Sarıçınar–Hisarçandır sınırı, yön, geometri ve güncel geçilebilirlik ikinci inceleme bekliyor.'
      }
    ],
    notes:
      'Kısmi haricî GPS adayı; kilometre, su, zorluk veya güncel koşul iddiası taşımaz ve ziyaretçiye gösterilmez.'
  }
]

const statusPriority = Object.fromEntries(
  researchStates.map((status, index) => [status, index])
)

const hasEligibleResearchEvidence = record => {
  const gps = record.gpsEvidence || {}
  const hasLocalGpsEvidence =
    ['sourceId', 'owner', 'recordedAt'].every(field => Boolean(gps[field])) &&
    gps.permission === 'file-reuse-permitted'
  const hasExternalGpsEvidence = (record.externalGpsLinks || []).some(
    isVerifiedExternalGpsLink
  )
  const metrics = record.routeMetrics || {}
  const logistics = record.logisticsEvidence || {}
  const metricFields = ['distanceKm', 'ascentM', 'descentM', 'expectedHours']
  const logisticsFields = [
    'water',
    'resupply',
    'lodging',
    'transport',
    'emergencyExit'
  ]

  return (
    ['eligible', 'published'].includes(record.researchStatus) &&
    (record.officialSectionIds || []).length > 0 &&
    (record.sourceIds || []).length > 0 &&
    [
      'name',
      'start',
      'end',
      'direction',
      'routeFactsCheckedAt',
      'operationalFactsCheckedAt',
      'reviewedAt',
      'reviewedBy'
    ].every(field => Boolean(record[field])) &&
    (hasLocalGpsEvidence || hasExternalGpsEvidence) &&
    metricFields.every(
      field =>
        Number.isFinite(metrics[field]?.value) && metrics[field]?.sourceId
    ) &&
    logisticsFields.every(field => {
      const evidence = logistics[field]

      return (
        evidence &&
        ['verified', 'unavailable'].includes(evidence.status) &&
        (evidence.status === 'unavailable' || evidence.sourceIds?.length > 0)
      )
    })
  )
}

const preferredStatus = statuses =>
  statuses.reduce(
    (current, status) =>
      statusPriority[status] > statusPriority[current] ? status : current,
    'unmapped'
  )

const buildStageResearchCoverage = ({
  routeSections = [],
  stageResearchRecords: records = []
} = {}) => {
  const recordsBySection = new Map()

  records.forEach(record => {
    ;(record.officialSectionIds || []).forEach(sectionId => {
      const entries = recordsBySection.get(sectionId) || []

      entries.push(record)
      recordsBySection.set(sectionId, entries)
    })
  })

  const sections = routeSections.map(section => {
    const recordsForSection = recordsBySection.get(section.id) || []
    const statuses = recordsForSection.map(record => record.researchStatus)

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      editorialRegion: section.editorialRegion,
      status: preferredStatus(statuses),
      recordIds: recordsForSection.map(record => record.id)
    }
  })

  const regions = ['west', 'central', 'east'].map(region => {
    const regionSections = sections.filter(
      section => section.editorialRegion === region
    )

    return {
      region,
      total: regionSections.length,
      counts: researchStates.reduce(
        (counts, status) => ({
          ...counts,
          [status]: regionSections.filter(section => section.status === status)
            .length
        }),
        {}
      ),
      missingSectionIds: regionSections
        .filter(
          section =>
            section.status !== 'eligible' && section.status !== 'published'
        )
        .map(section => section.sectionId)
    }
  })

  return {
    sections,
    regions,
    missingSectionIds: sections
      .filter(
        section =>
          section.status !== 'eligible' && section.status !== 'published'
      )
      .map(section => section.sectionId)
  }
}

const formatStageResearchCoverage = report => {
  const lines = [
    'Likya etap araştırma kapsamı',
    '',
    ...report.regions.map(region => {
      const counts = researchStates
        .filter(status => region.counts[status])
        .map(status => `${status}: ${region.counts[status]}`)
        .join(', ')

      return `- ${region.region}: ${region.total} pafta (${counts || 'kayıt yok'})`
    })
  ]

  if (report.missingSectionIds.length) {
    lines.push(
      '',
      `Yayıma uygun pratik etap eşleştirmesi bekleyen paftalar: ${report.missingSectionIds.join(', ')}`
    )
  }

  return lines.join('\n')
}

module.exports = {
  buildStageResearchCoverage,
  formatStageResearchCoverage,
  hasEligibleResearchEvidence,
  researchStates,
  stageResearchRecords
}
