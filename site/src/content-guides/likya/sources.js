const sources = [
  {
    id: 'ktb-likya-route-home',
    title: 'Likya Yolu',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-order', 'official-pafta-title'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'link-only',
    notes:
      '31 paftalık başlangıç envanteri bu sayfadaki sıralı Bakanlık listesine dayanır. Paftalar, yürüyüş günü veya güncel koşul kaynağı değildir.'
  },
  {
    id: 'ktb-likya-map-collection',
    title: 'Likya Yolu Haritaları',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-237174/likya-yolu-haritalari.html',
    sourceType: 'official-route',
    authorityScope: ['official-map-collection'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'link-only',
    notes:
      'Harita dosyalarının telif/yeniden kullanım koşulları ayrı doğrulanmadan yerel kopya veya geometri saklanmaz.'
  },
  {
    id: 'book-altug-senel-adim-adim',
    title: 'Adım Adım Likya Yolu',
    publisher: 'Librum Kitap — Altuğ Şenel',
    url: 'https://www.kitapyurdu.com/kitap/adim-adim-likya-yolu-harita-ilaveli/455200.html',
    sourceType: 'book',
    authorityScope: ['historical-route-context', 'book-stage-description'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-09-08',
    reuse: 'link-only',
    notes:
      'Kullanıcının paylaştığı nüshadan, 51–122. sayfalar arasındaki Batı Likya etap notları sayfa referanslı ve özetlenmiş biçimde kaydedildi. Baskı yılı doğrulanmadı; kayıtlar güncel mesafe, su, işletme veya geçiş kanıtı değildir.'
  },
  {
    id: 'ktb-likya-map-1',
    title: 'Likya Yolu Haritası (1)',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-237128/likya-yolu-haritasi-1.html',
    sourceType: 'official-route',
    authorityScope: ['official-map-resource'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'link-only',
    notes:
      'Bakanlığın indirilebilir harita kaynağıdır. Dosya boyutu ve yeniden kullanım koşulları nedeniyle harita görseli, geometri veya türetilmiş rota verisi sitede kopyalanmaz.'
  },
  {
    id: 'ktb-likya-map-2',
    title: 'Likya Yolu Haritası (2)',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-237278/likya-yolu-haritasi-2.html',
    sourceType: 'official-route',
    authorityScope: ['official-map-resource'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'link-only',
    notes:
      'Bakanlığın indirilebilir harita kaynağıdır. Dosya boyutu ve yeniden kullanım koşulları nedeniyle harita görseli, geometri veya türetilmiş rota verisi sitede kopyalanmaz.'
  },
  {
    id: 'ktb-pafta-1-detail',
    title: 'Pafta 1: Ovacık – Kirme',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236149/pafta-1-ovacik--kirme.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-2-detail',
    title: 'Pafta 2: Faralya - Alıncak',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236152/pafta-2-faralya---alincak.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-19-detail',
    title: 'Pafta 19: Hasyurt-Kumluca',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236440/pafta-19-hasyurt-kumluca.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-20-detail',
    title: 'Pafta 20: Mavikent - Gagai',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236441/pafta-20-mavikent---gagai.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-25-detail',
    title: 'Pafta 25: Ulupınar-Beycik',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236453/pafta-25-ulupinar-beycik.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-28-detail',
    title: 'Pafta 28: Phaselis - Kuzdere',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236456/pafta-28-phaselis---kuzdere.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-29-detail',
    title: 'Pafta 29: Tekedağı - Güneşli',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236474/pafta-29-tekedagi---gunesli.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-21-detail',
    title: 'Pafta 21: Karaöz-Adrasan',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236442/pafta-21-karaoz-adrasan.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 21 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-12-detail',
    title: 'Pafta 12: Çoban-Boğazcık',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236271/pafta-12-coban-bogazcik.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-13-detail',
    title: 'Pafta 13: Boğazcık-Üçağız',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236355/pafta-13-bogazcik-ucagiz.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-15-detail',
    title: 'Pafta 15: Demre-Vadi-Belören',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236367/pafta-15-demre-vadi-beloren.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-17-detail',
    title: 'Pafta 17: Demre-Beymelek-Yeni Yol',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236389/pafta-17-demre-beymelek-yeni-yol.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Resmî ayrıntı sayfası; görünür içerik güncelleme tarihi yoktur ve yalnızca rota bağlamı/editoryal inceleme için kullanılır.'
  },
  {
    id: 'ktb-pafta-5-detail',
    title: 'Pafta 5: Karadere-Leton-Santos',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236212/pafta-5-karadere-leton-santos.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 5 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-6-detail',
    title: 'Pafta 6: Üzümlü-İslamlar',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236249/pafta-6-uzumlu-islamlar.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 6 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-8-detail',
    title: 'Pafta 8: Kalkan-Bezirgan-Sarıbelen',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236262/pafta-8-kalkan-bezirgan-saribelen.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 8 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-9-detail',
    title: 'Pafta 9: Hacıoğlan',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236263/pafta-9-hacioglan.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 9 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-22-detail',
    title: 'Pafta 22: Gelidonya Feneri - Melanippe',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236445/pafta-22-gelidonya-feneri---melanippe.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 22 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-23-detail',
    title: 'Pafta 23: Musadağı-Olympos',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236446/pafta-23-musadagi-olympos.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 23 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-24-detail',
    title: 'Pafta 24: Çıralı-Chimaera-Maden Ayrım Yeri',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236448/pafta-24-cirali-chimaera-maden-ayrim-yeri.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 24 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-26-detail',
    title: 'Pafta 26: Tekirova - Phaselis',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236454/pafta-26-tekirova---phaselis.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 26 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-11-detail',
    title: 'Pafta 11: Kaş-Limanağzı',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236266/pafta-11-kas-limanagzi.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 11 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-14-detail',
    title: 'Pafta 14: Üçağız-Andriake-Demre',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236358/pafta-14-ucagiz-andriake-demre.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 14 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-16-detail',
    title: 'Pafta 16: Zeytin-Alakilise-Üstyol',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236378/pafta-16-zeytin-alakilise-ustyol.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 16 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-18-detail',
    title: 'Pafta 18: Finike',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236392/pafta-18-finike.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 18 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-3-detail',
    title: 'Pafta 3: Alınca-Sidyma-Gey-Bel',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236182/pafta-3-alinca-sidyma-gey-bel.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 3 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-4-detail',
    title: 'Pafta 4: Belceğiz-Gavurağılı-Karadere',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236210/pafta-4-belcegiz-gavuragili-karadere.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 4 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-7-detail',
    title: 'Pafta 7: Akbel - Patara',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236261/pafta-7-akbel---patara.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 7 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-10-detail',
    title: 'Pafta 10: Dereköy- Çukurbağ',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236265/pafta-10-derekoy--cukurbag.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 10 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-27-detail',
    title: 'Pafta 27: Tahtalı',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236455/pafta-27-tahtali.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 27 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-30-detail',
    title: 'Pafta 30: Ovacık - Göynük Kanyon',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236475/pafta-30-ovacik---goynuk-kanyon.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 30 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ktb-pafta-31-detail',
    title: 'Pafta 31: Sarıçınar - Hisarçandır',
    publisher: 'T.C. Kültür ve Turizm Bakanlığı',
    url: 'https://likyayolu.ktb.gov.tr/TR-236479/pafta-31-saricinar---hisarcandir.html',
    sourceType: 'official-route',
    authorityScope: ['official-pafta-description', 'official-route-context'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Pafta 31 için resmî ayrıntı sayfası. Sayfada görünür içerik güncelleme tarihi yoktur; rota bağlamı ve editoryal inceleme için kullanılır, güncel hizmet/koşul iddiası için kullanılmaz.'
  },
  {
    id: 'ibrahim-2014-likya-route-plan',
    title: 'Likya Yolu Rotası: Harita, Etaplar ve 509 km Planı',
    publisher: 'İbrahim Uylaş',
    url: '/likya-yolu-rotasi/',
    sourceType: 'first-hand',
    authorityScope: ['historical-plan', 'historical-route-variant'],
    publishedAt: '2021-03-23',
    updatedAt: '2026-07-22',
    accessedAt: '2026-08-27',
    reuse: 'file-reuse-permitted',
    notes:
      '2014 hazırlık planı, 465 km kâğıt üzeri rota ve 430 km tarihsel GPS bağlamı için birincil site içi kaynaktır; güncel koşul kaynağı değildir.'
  },
  {
    id: 'ibrahim-2014-likya-walk',
    title: 'Likya Yolu: 11 Günde Yürüdüğüm Parkur',
    publisher: 'İbrahim Uylaş',
    url: '/likya-yolu-11-gunde-yurudugum-parkur/',
    sourceType: 'first-hand',
    authorityScope: ['historical-walk', 'historical-daily-stage'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'file-reuse-permitted',
    notes:
      "20–30 Eylül 2014 arasında yürünmüş 230 km'lik deneyim için birincil site içi kaynaktır; tam rota veya güncel koşul kaynağı değildir."
  },
  {
    id: 'wikiloc-10846819',
    title: 'Ölüdeniz–Hisarçandır tarihsel rota kaydı',
    publisher: 'Wikiloc',
    url: 'https://tr.wikiloc.com/wikiloc/spatialArtifacts.do?event=view&id=10846819',
    sourceType: 'gps-platform',
    authorityScope: ['historical-gps-embed'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-27',
    reuse: 'embed-permitted',
    notes:
      'Mevcut Likya rota yazısında gömülü tarihsel 430 km kayıt. Sahiplik, kayıt tarihi ve kapsadığı varyant ayrıca doğrulanmadan öneri verisinde kullanılmaz.'
  },
  {
    id: 'wikiloc-terms',
    title: 'Wikiloc Terms of Use',
    publisher: 'Wikiloc Outdoor, S.L.',
    url: 'https://www.wikiloc.com/wikiloc/terms_en.html',
    sourceType: 'gps-platform',
    authorityScope: ['platform-link-and-reuse-terms'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Wikiloc kayıtları yalnızca özgün kayıt sayfasına haricî bağlantı olarak sunulur. GPX, harita geometrisi veya platform içeriği yerelde kopyalanmaz ya da yeniden dağıtılmaz.'
  },
  {
    id: 'wikiloc-45522573',
    title: 'Likya Yolu - Lycian Way - 05AY - Alınca-Sidyma-Bel',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-05ay-alinca-sidyma-bel-45522573',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-01-14',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Wikiloc kaydı Mayıs 2011 olarak işaretlenmiştir. Pafta 3 için yalnızca haricî GPS aday kaynağıdır; başlık/varış farkı, yön, varyant ve güncel koşullar ayrıca doğrulanmadan rota önerisi veya ölçüm kaynağı olmaz.'
  },
  {
    id: 'wikiloc-24692574',
    title: 'Likya Yolu (Lycian Way) Ovacık - Kozağaç - Kirme - Faralya',
    publisher: 'Metin ULUIŞIK (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-ovacik-kozagac-kirme-faralya-24692574',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-05-07',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2018 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 1 ile Kirme ortak noktasına rağmen iz Faralya’ya uzanır; bu yüzden yalnızca aday araştırma kaynağıdır.'
  },
  {
    id: 'wikiloc-58521662',
    title: 'Likya Yolu yürüyüşü Faralya - Alınca etabı',
    publisher: 'aliyesido (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-yuruyusu-faralya-alinca-etabi-58521662',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-10-13',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Ekim 2020 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 2 ile başlık düzeyinde eşleşir; geometri, yön, varyant ve güncel koşullar doğrulanmadan öneri kaynağı değildir.'
  },
  {
    id: 'wikiloc-249383008',
    title: 'Likya Yolu (5. Gün): Bel - Gavurağlı - Karadere',
    publisher: 'erolgeygel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-5-gun-bel-gavuragli-karadere-15-km-249383008',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2026-02-05',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2026 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 4’teki Belceğiz adı ile kayıt başlığındaki Bel ilişkisinin ve rotanın birebirliği ayrı doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-249385073',
    title: 'Likya Yolu (6. Gün): Karadere - Letoon - Xantos',
    publisher: 'erolgeygel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-6-gun-karadere-letoon-xantos-19-km-249385073',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2026-02-05',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2026 olarak kaydedilmiş haricî GPS kaydı. Açıklama birden fazla referans iz kullanıldığını belirttiği için ilk-el iz/provenans, resmî pafta eşleşmesi ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-41617254',
    title:
      'Likya yolu 4 Xanthos - Çavdir - Çayköy - İnpinar - Üzümler - İslamlar - Akbel',
    publisher: 'arducerdal (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-4-xanthos-cavdir-caykoy-inpinar-uzumler-islamlar-akbel-41617254',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2019-09-23',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Eylül 2019 olarak kaydedilmiş geniş kapsamlı haricî GPS kaydı. Üzümlü ve İslamlar geçişi nedeniyle Pafta 6 araştırma adayıdır; daha geniş hat, yorumlardaki değişiklik uyarıları ve güncel durum ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-16611531',
    title: 'Likya Yolu (Lycian Way) Akbel - Delikkemer - Patara Yürüyüşü',
    publisher: 'Metin ULUIŞIK (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-akbel-delikkemer-patara-yuruyusu-16611531',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2017-03-01',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2017 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 7 ile başlık düzeyinde örtüşür; geometri, yön, varyant ve güncel koşullar doğrulanmadan öneri kaynağı değildir.'
  },
  {
    id: 'wikiloc-35437239',
    title: 'Likya Yolu Kalkan Bezirgan Yaylası ve Sarıbelen',
    publisher: 'GezErsin (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-kalkan-bezirgan-yaylasi-ve-saribelen-35437239',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2019-04-20',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2019 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 8 ile başlık düzeyinde örtüşür; kayıt içindeki lojistik ifadeler güncel kabul edilmez ve ikinci inceleme bekler.'
  },
  {
    id: 'wikiloc-249421274',
    title: 'Likya Yolu (9. Gün): Sarıbelen - Gökçeören - Hacıoğlan',
    publisher: 'erolgeygel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-9-gun-saribelen-gokceoren-hacioglan-19-km-249421274',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2026-02-05',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2026 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 9 yalnızca Hacıoğlan başlığını verdiği için kapsam/bitiş, iz geometrisi ve kaynak açıklamasındaki çoklu referans kullanımı ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-54664242',
    title: 'Dereköy-Phellos-Çukurbağ (Likya Yolu-Lycian Way) 16072020',
    publisher: 'Fatih Sz (Wikiloc profil adı)',
    url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/derekoy-phellos-cukurbag-likya-yolu-lycian-way-16072020-54664242',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-08-14',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Temmuz 2020 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 10 ile başlık düzeyinde örtüşür; kaynak açıklaması bazı kesimlerde rota varyantı seçildiğini belirttiği için iz ve resmî hat ayrıca karşılaştırılmalıdır.'
  },
  {
    id: 'wikiloc-73446903',
    title: 'Kaş Limanağzı Likya yolu',
    publisher: 'Oktatlon Doğa Sporları Kulübü (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/kas-limanagzi-likya-yolu-73446903',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2021-05-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Mayıs 2021 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 11 ile başlık düzeyinde örtüşür; geometri, yön, başlangıç/bitiş noktaları ve güncel koşullar doğrulanmadan öneri kaynağı değildir.'
  },
  {
    id: 'wikiloc-60785877',
    title: "Likya Yolu - 01/15 Üzümlü'den Boğazcık ve Kılınçlı'ya (2020 10)",
    publisher: 'Yaban Adımlar Likya (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-01-15-uzumluden-bogazcik-ve-kilincliya-2020-10-60785877',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-11-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Ekim 2020 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 12’deki Çoban–Boğazcık sınırına Üzümlü başlangıcı ve Kılınçlı uzantısı nedeniyle yalnızca geniş kapsamlı adaydır; geometri, pafta sınırı, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-76403817',
    title: 'Likya Yolu 9 Boğazcik-Aperlai-Üçagiz-Kaleköy-Çayağzi',
    publisher: 'arducerdal (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-9-bogazcik-aperlai-ucagiz-kalekoy-cayagzi-76403817',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2021-06-21',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Haziran 2021 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 13 ile ana yer adları örtüşür ancak kayıt Kaleüçağız ve Çayağzı’na uzanır; kapsam, geometri, yön ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-167948987',
    title: 'Kaleüçağız - Simena Kalesi - Harabe - Çakıl Plajı - Andriake',
    publisher: 'hafize.yigit (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/kaleucagiz-simena-kalesi-cakil-plaji-andriake-demre-167948987',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2024-04-20',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2024 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 14’teki Üçağız–Andriake–Demre hattına Kaleüçağız başlangıcıyla yaklaşır; başlangıç adının eşleşmesi, Demre uzantısı, geometri ve güncel koşullar ikinci inceleme bekler.'
  },
  {
    id: 'wikiloc-167357934',
    title: 'Likya Yolu Demre-Alakilise (14.04.2024)',
    publisher: 'Özgür Arda BAYRAM (Wikiloc profil adı)',
    url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/likya-yolu-demre-alakilise-14-04-2024-167357934',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2024-04-14',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2024 tarihli, seri hâlinde sunulmuş haricî GPS kaydı. Resmî Pafta 15’teki Demre–Vadi–Belören ile başlık bire bir örtüşmez; ara yer adları, geometri, yön ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-167482893',
    title: 'Likya Yolu Alakilise-Yukarıbeymelek (15.04.2024)',
    publisher: 'Özgür Arda BAYRAM (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-alakilise-yukaribeymelek-15-04-2024-167482893',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2024-04-15',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2024 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 16’daki Zeytin–Alakilise–Üstyol ile yalnızca Alakilise ortaklığı taşır; kapsam, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-31198631',
    title: 'Likya yolu Finike - Demre (Beymelek)',
    publisher: 'Mustafa Aygün (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-finike-demre-beymelek-31198631',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-12-08',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Aralık 2018 olarak kaydedilmiş haricî GPS kaydı. Kayıt sahibi yürüyüşü tamamlayamadığını ve kırmızı-beyaz işaretlerden saptığını yazdığı için Pafta 17 için yalnızca düşük güvenli araştırma adaydır; geometri, Demre–Beymelek–Yeni Yol sınırı ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-167567463',
    title: 'Likya Yolu Yukarıbeymelek-Finike (16.04.2024)',
    publisher: 'Özgür Arda BAYRAM (Wikiloc profil adı)',
    url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/likya-yolu-yukaribeymelek-finike-16-04-2024-167567463',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2024-04-16',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2024 tarihli, seri içindeki Finike varışlı haricî GPS kaydı. Resmî Pafta 18’in tek yer adlı başlığı nedeniyle pafta kapsamı, başlangıç, bitiş, geometri ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-168492600',
    title:
      'Likya yolu 8. gün: Hasyurt Plajı Kamp Alanı - Kumluca - Karagöz - Korsan Koyu Mevkii Kamp Alanı',
    publisher: 'nusret_ykl (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-hasyurt-plaji-kamp-alani-kumluca-karagoz-korsan-koyu-mevkki-kamp-alani-168492600',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2024-04-25',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2024’te yüründüğü belirtilen geniş kapsamlı haricî GPS kaydı. Hasyurt–Kumluca ortaklığı nedeniyle Pafta 19 için adaydır; Karagöz ve Korsan Koyu uzantısı, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-22774217',
    title: 'Likya Yolu - Lycian Way - 21 - Karaöz-Gelidonya Feneri-Adrasan',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-21-karaoz-gelidonya-feneri-adrasan-22774217',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2018 olarak kaydedilmiş haricî GPS kaydı. Pafta 21 başlığıyla doğrudan örtüşür ve Melanippe ara noktasını da içerir; pafta 22 için kapsam, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-71361789',
    title: 'Likya Yolu / Olympos - Musa Dağı - Adrasan',
    publisher: 'tansel.unsal (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-olympos-musa-dagi-adrasan-71361789',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2021-04-24',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2021 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 23’teki Musa Dağı–Olympos yer adlarını içerir ancak Adrasan’a uzanır; pafta sınırı, geometri, yön ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-22774290',
    title: 'Likya Yolu - Lycian Way - 23A - Çıralı-Yanartaş-Ulupınar-Beycik',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-23a-cirali-yanartas-ulupinar-beycik-22774290',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2018 olarak kaydedilmiş haricî GPS kaydı. Çıralı, Yanartaş, Ulupınar ve Beycik yer adlarını içerir; Pafta 24 ve 25 için resmî sınırlar, varyant, geometri, yön ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-22774582',
    title: 'Likya Yolu - Lycian Way - 24B - Tekirova-Phaselis-Aşağı Kuzdere',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-24b-tekirova-phaselis-asagi-kuzdere-22774582',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2018 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 26’daki Tekirova–Phaselis ile örtüşür ancak Aşağı Kuzdere’ye uzanır; pafta sınırı, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-22774199',
    title: 'Likya Yolu - Lycian Way - 20 - Finike-Mavikent-Karaöz',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-20-finike-mavikent-karaoz-22774199',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Şubat 2018 olarak kaydedilmiş haricî GPS kaydı. Mavikent ve Gagai ara noktalarını içerir ancak Finike–Karaöz hattının tamamına uzanır; Pafta 20 sınırı, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-58025240',
    title: 'Likya Yolu / Beycik - Tahtalı Dağı - Yayla Kuzdere',
    publisher: 'Cengiz İspir (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-beycik-tahtali-dagi-yayla-kuzdere-58025240',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-10-05',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Ekim 2020 olarak kaydedilmiş haricî GPS kaydı. Tahtalı geçişi nedeniyle Pafta 27 için adaydır; tek yer adlı resmî paftanın kapsamı, geometri, yön ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-117706933',
    title: 'Likya Yolu - Tekirova Phaselis Kuzdere',
    publisher: 'brkgoktas (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-tekirova-phaselis-kuzdere-117706933',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2022-10-30',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Ekim 2022 olarak kaydedilmiş haricî GPS kaydı. Phaselis–Kuzdere ana adlarını içerir fakat Tekirova uzantısı vardır; Pafta 28 sınırı, geometri, yön, varyant ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-102922041',
    title: 'Hiking-012 Ovacık - Göynük Kanyonu (Likya Yolu-Doğa yürüyüşü)',
    publisher: 'guideofadventure (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/hiking-012-ovacik-goynuk-kanyonu-likya-yolu-lycia-way-antalya-102922041',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2022-05-15',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Mayıs 2022 olarak kaydedilmiş haricî GPS kaydı. Resmî Pafta 30 ile başlık düzeyinde örtüşür; geometri, yön, varyant ve güncel geçilebilirlik ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-23809595',
    title: 'Göynük Kanyonu - Sarı çınar / Likya Yolu',
    publisher: 'ilker gök (Wikiloc profil adı)',
    url: 'https://tr.wikiloc.com/gezi-yuruyus-rotalari/goynuk-kanyonu-sari-cinar-likya-yolu-23809595',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-04-07',
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Nisan 2018 olarak kaydedilmiş gidiş-dönüş haricî GPS kaydı. Açıklaması Hisarçandır–Göynük Kanyonu etabının alt kesimi olduğunu söyler; Sarıçınar–Hisarçandır resmi sınırı, yön, geometri ve güncel koşullar ayrıca doğrulanmalıdır.'
  },
  {
    id: 'wikiloc-22769736',
    title: 'Likya Yolu - Lycian Way - 03 - Faralya-Kabak',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-03-faralya-kabak-22769736',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Şubat 2018 kaydıdır. Faralya–Kabak alt kesimi için araç hareketi karışmış David 258066011 kaydının alternatifidir. Kelebekler Vadisi inişini veya Pafta 2 tamamını kapsadığı iddia edilmez; Kabak köyü/koyu ve Alınca devamı ayrıca eşleştirilmelidir.'
  },
  {
    id: 'wikiloc-59521959',
    title:
      'Likya Yolu - Lycian Way - 11bY - Gokceoren-Hacioglan-Phellos-Cukurbag',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://fi.wikiloc.com/vaellus-reitit/likya-yolu-lycian-way-11by-gokceoren-hacioglan-phellos-cukurbag-59521959',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-10-30',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Haziran 2011 kayıt tarihi ile Ekim 2020 yükleme tarihi ayrı tutulur. Hacıoğlan Deresi, Phellos ve Çukurbağ ara noktaları vardır; Pafta 9–10 için geniş kapsamlı adaydır. İngilizce/Türkçe sayfa araçla açılamadığı için aynı kayıt kimliğinin erişilebilen Fince Wikiloc sayfası kullanıldı. Güncel geçiş veya tam pafta geometri kanıtı değildir.'
  },
  {
    id: 'wikiloc-48212039',
    title: 'St.Nicholas Yolu - Rota8 - Beymelek - Ision Kale - Myra',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/st-nicholas-yolu-rota8-beymelek-ision-kale-myra-48212039',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-04-03',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Ağustos 2014 kaydıdır. Pafta 17 yaklaşımı için ters yönlü kısmi aday; Myra, İsion Kale ve Taşevler ara noktalarını içerir. Lagün–Bonda devamı ve diğer adayla kesintisiz birleşim kanıtı değildir.'
  },
  {
    id: 'wikiloc-18027142',
    title: 'LİKYA YOLU (ST. NICHOLAS YOLU) 2 - Alternatif Parkur: Finike-Demre',
    publisher: 'Emre Demircioglu (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-st-nicholas-yolu-2-alternatif-parkur-finike-demre-18027142',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2017-06-01',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Ekim 2016 kaydıdır. Yazar Myra–Beymelek arasındaki yaklaşık 4 km yaklaşımı önceki gün yürüdüğünü ve sapmalar olabileceğini belirtir. Pafta 17 güney kolu araştırmasında 48212039 ile birlikte incelenecek adaydır; tam ve kesintisiz pafta olarak doğrulanmadı.'
  },
  {
    id: 'wikiloc-48750651',
    title:
      'Likya Yolu - Lycian Way - 25Ay - Yayla Kuzdere-Gedelme-Goynuk Yayla',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-25ay-yayla-kuzdere-gedelme-goynuk-yayla-48750651',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2020-05-01',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Şubat 2018 kayıt tarihi, Mayıs 2020 yükleme tarihinden ayrılır. Bakanlığın Pafta 29 ayrıntısında tarif edilen Yayla Kuzdere–Gedelma batı kolu için adaydır. Gedelme camisi üstündeki revize patika girişini tarif eder; eski 22774510 kaydıyla karıştırılmamalıdır. Doğu kolu veya güncel geçilebilirlik kanıtı değildir.'
  },
  {
    id: 'wikiloc-22774675',
    title: 'Likya Yolu - Lycian Way - 27 - Goynuk - Hisarcandir',
    publisher: 'altugsenel (Wikiloc profil adı)',
    url: 'https://www.wikiloc.com/hiking-trails/likya-yolu-lycian-way-27-goynuk-hisarcandir-22774675',
    sourceType: 'gps-platform',
    authorityScope: ['external-gps-candidate', 'third-party-route-record'],
    publishedAt: '2018-02-19',
    updatedAt: null,
    accessedAt: '2026-10-15',
    reuse: 'link-only',
    notes:
      'Şubat 2018 kaydıdır. Sarıçınar Düzlüğü, Dayısı/Hüdacık, Elmayanı ve Hisarçandır ara noktaları, resmî Pafta 31 tarifindeki bağlamı destekler. Başlangıcı Göynük olduğundan pafta sınırı ayrıca karşılaştırılmalıdır; eski kısmi 23809595 kaydından daha geniş kapsamlı adaydır.'
  },
  {
    id: 'official-112-emergency',
    title: '112 Acil Çağrı Merkezi',
    publisher: 'T.C. İçişleri Bakanlığı İller İdaresi Genel Müdürlüğü',
    url: 'https://112.gov.tr/',
    sourceType: 'official-condition',
    authorityScope: ['official-emergency-guidance'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Acil durumlarda resmî yönlendirme kaynağına bağlantı vermek için kullanılır. Bu kaynak, parkurda telefon kapsaması veya müdahale süresi iddiasını desteklemez.'
  },
  {
    id: 'official-mgm-antalya-weather',
    title: 'Meteoroloji 4. Bölge Müdürlüğü — Antalya',
    publisher: 'Meteoroloji Genel Müdürlüğü',
    url: 'https://antalya.mgm.gov.tr/',
    sourceType: 'official-condition',
    authorityScope: ['official-weather-warning', 'official-weather-forecast'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Antalya ve çevresi için resmî tahmin/uyarı doğrulama yoludur. Tek başına rota üzerindeki mikro koşullar veya güvenli geçiş iddiası değildir.'
  },
  {
    id: 'official-ogm-fire-notices',
    title: 'Orman Genel Müdürlüğü duyuruları',
    publisher: 'Orman Genel Müdürlüğü',
    url: 'https://www.ogm.gov.tr/tr/haberler',
    sourceType: 'official-condition',
    authorityScope: ['official-forest-fire-notice'],
    publishedAt: null,
    updatedAt: null,
    accessedAt: '2026-08-28',
    reuse: 'link-only',
    notes:
      'Yangın/orman kısıtlamaları için resmî duyuru başlangıç noktasıdır. Yerel makam veya korunan alan duyurusu gerektiğinde ayrıca kaynak kaydı eklenmelidir.'
  }
]

const sourceById = Object.fromEntries(
  sources.map(source => [source.id, source])
)

module.exports = {
  sources,
  sourceById
}
