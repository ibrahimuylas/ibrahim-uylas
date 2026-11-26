const { sourceById } = require('./sources')

const bookReferenceClaimTypes = [
  'route-context',
  'official-boundary',
  'endpoint-and-direction',
  'route-variant',
  'historical-context'
]

const isDateLike = value =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)

const isCompleteBookReferenceEvidence = (
  evidence,
  sourcesById = sourceById
) => {
  const source = sourcesById[evidence?.sourceId]

  return (
    source?.sourceType === 'book' &&
    Array.isArray(evidence?.sectionIds) &&
    evidence.sectionIds.length > 0 &&
    typeof evidence.edition === 'string' &&
    Boolean(evidence.edition) &&
    typeof evidence.pageReference === 'string' &&
    Boolean(evidence.pageReference) &&
    bookReferenceClaimTypes.includes(evidence.claimType) &&
    typeof evidence.paraphrase === 'string' &&
    evidence.paraphrase.trim().length >= 30 &&
    evidence.paraphrase.trim().length <= 500 &&
    !evidence.quote &&
    isDateLike(evidence.capturedAt) &&
    Boolean(evidence.reviewedBy) &&
    evidence.rightsStatus === 'citation-only'
  )
}

const buildBookReferenceEvidenceCoverage = ({
  routeSections = [],
  bookReferenceEvidence = []
} = {}) =>
  routeSections.map(section => {
    const evidence = bookReferenceEvidence.filter(item =>
      item.sectionIds?.includes(section.id)
    )

    return {
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      evidenceIds: evidence.map(item => item.id),
      status:
        evidence.length > 0
          ? 'book-context-indexed'
          : 'book-context-not-yet-indexed',
      doNotPublish: true,
      nextAction:
        evidence.length > 0
          ? 'Kaydı resmî pafta ve bağımsız kaynak karşılaştırmasında kullan; güncel koşul veya metrik üretme.'
          : 'Kitaptan kaynak künyesi, baskı, sayfa ve kısa bir özet geldiğinde kaynak kaydını ekle.'
    }
  })

// These are page-specific, paraphrased notes from the user's photographed copy.
// They remain historical context until each claim is reconciled with the official
// inventory and an independent current observation; no guidebook text is copied.
const bookReferenceEvidence = [
  {
    id: 'book-senel-fethiye-kayakoy-ovacik-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-1'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 51–52',
    claimType: 'historical-context',
    paraphrase:
      'Kitap, Fethiye kaya mezarlarından Kayaköy üzerinden Ovacık’a uzanan 18 km’lik bağlantıyı resmî pafta 1’in öncesindeki yaklaşım olarak ayrı anlatır. Yaklaşık 6–7 saatlik bu tarihsel tarifte yerleşim araları kısa, su ve yiyecek ikmali Kayaköy–Ovacık çevresinde mümkün görünür; bu bilgi güncel geçiş veya hizmet kanıtı değildir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-ovacik-faralya-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-1', 'ktb-pafta-2'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 61–62',
    claimType: 'route-context',
    paraphrase:
      'Ovacık–Kozağaç–Kirme–Faralya bölümü kitapta 14 km ve orta zorlukta, ağırlıkla patika bir yürüyüş olarak özetlenir. Su için Ovacık’tan Kozağaç’a kadar hazırlıklı olmak, Kozağaç ve Kirme çeşmelerini kontrol etmek; yiyecek ve konaklama için ise Faralya’daki işletmelere güvenmemek gerekir. Eski işletme bilgileri bugün doğrulanmalıdır.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-faralya-kabak-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-2'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 69–70',
    claimType: 'route-variant',
    paraphrase:
      'Faralya–Kabak, kitapta 7 km ve kolay bir bağlantı olarak geçer; kısa sürse de kırmızı-beyaz işaretlerden ayrılmamak özellikle vurgulanır. Faralya’dan çıkarken taşınan suyun Kabak’a yetebileceği, Kabak’ta çeşme ve farklı konaklama seçenekleri bulunduğu not edilir; bunlar tarihsel saha gözlemidir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-kabak-alinca-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-2', 'ktb-pafta-3'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 75–76',
    claimType: 'route-variant',
    paraphrase:
      'Kabak–Alınca için kitap iki seçenek ayırır: daha uzun vadi yaklaşımı ve daha kısa şelale kolu. İki kol da zorlu kabul edilir; Alınca’ya kadar su taşımak, ayrımdaki kaynakları yerinde kontrol etmek ve tek öğünlük yiyeceği önceden hazırlamak gerekir. Rota seçimi resmî harita ve güncel iz doğrulaması olmadan yapılmamalıdır.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-alinca-bel-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-3'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 83–84',
    claimType: 'endpoint-and-direction',
    paraphrase:
      'Alınca–Bel bölümü kitapta yaklaşık 17 km ve uzun bir yürüyüş günü olarak planlanır; Sidyma ve Dodurga üzerinden ilerleyen anlatıda patika, köy yolu ve asfalt birlikte kullanılır. Su için köy çeşmeleri ve sarnıçlar kontrol edilir, Bel’de markete güvenilmemesi önerilir; konaklama ve yiyecek için yerel halkla önceden konuşmak gerekir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-bel-pydnai-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-4'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 99–100',
    claimType: 'route-context',
    paraphrase:
      'Bel–Gavurağılı–Pydnai (Özlen) kitabın uzun ve zorlu günlerinden biri olarak 15 km civarında verilir. Bel ve Gavurağılı çevresindeki çeşmeler ile yol üzerindeki kaynaklar not edilse de köyde işletme bulunmayabileceği belirtilir; Özlen’e varmadan su ve yiyecek planını tamamlamak tarihsel anlatının ana dersidir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-pydnai-xanthos-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-5'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 107–108',
    claimType: 'route-context',
    paraphrase:
      'Pydnai’den Letoon ve Xanthos’a uzanan 14 km’lik bölüm kitapta daha kolay, köy yolu ve asfalt ağırlıklı bir gün olarak anlatılır. Kumlova ve Kınık’ta ikmal imkânı bulunduğu, antik alanlarda kamp yapılmaması gerektiği not edilir; işletme ve giriş koşulları güncel kaynaklardan ayrıca teyit edilmelidir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-xanthos-uzumlu-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-5', 'ktb-pafta-6'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 113–114',
    claimType: 'route-context',
    paraphrase:
      'Xanthos–Çavdır–Çayköy–Üzümlü hattı kitapta yaklaşık 16 km ve zorlu bir gün olarak bölünür; köy geçişleri ile vadi bölümünün ritmi birbirinden farklıdır. Çeşme ve kaynakların gün içinde yenilenebileceği, Üzümlü’de yiyecek ve konaklama seçeneklerinin aranabileceği yazılır; eski köy hizmetleri güncel kabul edilmemelidir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-uzumlu-bezirgan-2026-09-08',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-6', 'ktb-pafta-7', 'ktb-pafta-8'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 121–122',
    claimType: 'official-boundary',
    paraphrase:
      'Üzümlü–Akbel–Bezirgan bağlantısı kitapta yaklaşık 17 km, uzun ve yer yer zorlu bir gün olarak tarif edilir; bu kitap bölümü resmî pafta sınırlarıyla birebir eşleşmediği için üç komşu envanter kaydıyla karşılaştırılmalıdır. Köy çeşmeleri, Akbel’deki ikmal ve Bezirgan’daki yerel işletmeler tarihsel seçeneklerdir; bugün için ayrıca doğrulama gerekir.',
    capturedAt: '2026-09-08',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-finike-karaoz-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-18', 'ktb-pafta-19', 'ktb-pafta-20'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 237–238',
    claimType: 'route-context',
    paraphrase:
      'Finike–Mavikent–Karaöz kitabın yerleşimler üzerinden ilerleyen 32 km’lik, orta zorlukta uzun günlerinden biridir. Mavikent–Karaöz arasında çeşmeler ve sık ikmal noktaları anlatılır; buna karşılık Karaöz’den sonraki Gelidonya–Adrasan yönü için ayrı bir günlük kumanya gerekir. Karaöz’deki işletmelerin sezon dışında kapalı olabileceği özellikle hatırlatılır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-karaoz-adrasan-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-21', 'ktb-pafta-22'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 243–244',
    claimType: 'route-variant',
    paraphrase:
      'Karaöz–Korsan Koyu–Gelidonya Feneri–Adrasan yaklaşık 24 km, zor ve 8–9 saatlik bir gün olarak aktarılır. Gelidonya’ya birkaç kilometre kala son güvenilir çeşme not edilir; fener ile Deve Çiftliği arasındaki uzun bölümde su kaynağı bulunmadığı için taşıma planı kritik hale gelir. Eski çeşmelerin akışı bugün ayrıca kontrol edilmelidir.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-adrasan-cirali-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-21', 'ktb-pafta-23', 'ktb-pafta-24'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 253–254',
    claimType: 'route-context',
    paraphrase:
      'Adrasan–Musa Dağı–Olympos–Çıralı yaklaşık 17 km ve zor bir etap olarak verilir; Musa Dağı geçişi belirgin bir tırmanış içerir. Adrasan’dan su ve tek günlük yiyecek almak, Olympos’a kadar ara ikmal beklememek gerekir. Olympos ve Çıralı’daki işletmeler tarihsel konaklama seçeneği olarak anlatılır; antik alanda kamp yapılmaması gerektiği ayrıca vurgulanır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-cirali-beycik-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-24', 'ktb-pafta-25'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 263–264',
    claimType: 'route-context',
    paraphrase:
      'Çıralı–Yanartaş–Ulupınar–Beycik yaklaşık 21 km ve zor bir dağ geçişi olarak özetlenir. Çıralı veya Yanartaş’tan su doldurmak, Ulupınar’daki kaynakları kontrol etmek ve Beycik’e kadar yiyecek taşımak gerekir. Kitap, Yanartaş çevresini sit alanı olduğu için kamp açısından uygun görmez; Ulupınar ve Beycik’te tarihsel konaklama seçenekleri anlatılır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-beycik-yayla-kuzdere-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-25', 'ktb-pafta-27', 'ktb-pafta-28'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 271–272',
    claimType: 'route-context',
    paraphrase:
      'Beycik–Tahtalı Dağı–Yayla Kuzdere kitabın 16 km’lik, zor ve çoğunlukla patika etaplarından biridir. Beycik’ten çıkarken su tazelemek, Emzikçesme ve Çukuryayla çevresindeki kaynakları yerinde kontrol etmek; Yayla Kuzdere’ye kadar işletme beklememek gerekir. Yayla çevresinde yerel konaklama ve kamp seçenekleri tarihsel olarak not edilmiştir.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-yayla-goynuk-yayla-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-28', 'ktb-pafta-29', 'ktb-pafta-30'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 279–280',
    claimType: 'route-context',
    paraphrase:
      'Yayla Kuzdere–Gedelme–Göynük Yayla yaklaşık 18 km, zor ve 6–7 saatlik bir gün olarak tarif edilir. Yayla Kuzdere’den çıkarken suyu yenilemek, Gedelme’den sonra uzun orman bölümünde yeni kaynak beklememek gerekir. Gedelme’de yiyecek ve konaklama, Göynük Yayla’da ise sınırlı yerel imkânlar tarihsel seçenek olarak belirtilir.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-cirali-tekirova-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-24', 'ktb-pafta-26'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 287–288',
    claimType: 'route-variant',
    paraphrase:
      'Çıralı–Maden Koyu–Tekirova, sahil rotasından ilerleyen 25 km’lik zor bir gün olarak anlatılır. Çıralı’dan çıkarken yeterli su ve yiyecek almak gerekir; Maden Koyu çevresinde kamp olanağı bulunsa da su kaynağına güvenilmez. Tekirova’ya kadar işletme yoktur, sonrasında pansiyon ve ikmal seçenekleri başlar.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-tekirova-asagi-kuzdere-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-26', 'ktb-pafta-28'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 297–298',
    claimType: 'route-context',
    paraphrase:
      'Tekirova–Phaselis–Alacasu–Aşağı Kuzdere yaklaşık 20 km ve zor bir etap olarak verilir. Tekirova’dan çıkmadan su almak, Phaselis veya Alacasu çevresindeki kaynakları yerinde kontrol etmek gerekir; Alacasu’dan sonra uzun ve yorucu bir çıkış vardır. Yol üzerinde kamp yeri bulunsa da işletme bahçesi veya köy pansiyonu gibi seçenekler güncel doğrulama ister.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-asagi-goynuk-yayla-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-28', 'ktb-pafta-29', 'ktb-pafta-30'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 307–308',
    claimType: 'route-context',
    paraphrase:
      'Aşağı Kuzdere–Roma Köprüsü–Göynük Yayla yaklaşık 19 km ve zor bir gün olarak anlatılır. Aşağı Kuzdere, Roma Köprüsü ve vadi çıkışındaki kaynaklardan su yenilenmesi; Göynük Yayla’ya kadar yeni bir kaynak bulunmayabileceği için taşıma planı yapılması önerilir. Göynük Yayla’da sınırlı yerel yemek, konaklama ve kamp seçenekleri aktarılır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-goynuk-yayla-goynuk-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-30'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 315–316',
    claimType: 'route-context',
    paraphrase:
      'Göynük Yayla–Göynük Milli Parkı–Göynük yaklaşık 19 km ve zor bir yürüyüş olarak verilir. İlk bölümde dere yatakları su imkânı sağlasa da parkın üst kesimlerinde Velisuyu Pınarı sonrasında uzun bir susuzluk olabilir. Milli park içindeki kamp ve işletme koşulları koruma kurallarıyla birlikte güncel olarak kontrol edilmelidir.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-goynuk-hisarcandir-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-30', 'ktb-pafta-31'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 325–326',
    claimType: 'official-boundary',
    paraphrase:
      'Göynük–Hisarçandır kitabın 27 km’lik, 10–11 saat süren zor günlerinden biri olarak işlenir; bu kitap bölümü resmî pafta sınırlarıyla ayrıca karşılaştırılmalıdır. Dere ve regülatör çevreleri başlangıçta su imkânı sunsa da sıcak aylarda üst kaynakların kuruyabileceği belirtilir. İşletme bulunmayan yayla geçişleri için yiyecek ve su planı erkenden yapılmalıdır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-hisarcandir-citdibi-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-31'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 337–338',
    claimType: 'route-context',
    paraphrase:
      'Hisarçandır–Çıtdibi yaklaşık 9 km, orta zorlukta ve 3–4 saatlik kısa bir etap olarak anlatılır. Hisarçandır çevresindeki çeşmelerden sonra Çandır Çayı’na kadar su planı rahat görünse de dere geçişlerinde dikkat gerekir. Çıtdibi’nde kamp, bungalov ve yerel işletme seçenekleri tarihsel olarak not edilmiştir.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  },
  {
    id: 'book-senel-citdibi-geyikbayiri-2026-09-09',
    sourceId: 'book-altug-senel-adim-adim',
    sectionIds: ['ktb-pafta-31'],
    edition: 'Fotoğraflanan nüsha; baskı yılı doğrulanmadı',
    pageReference: 's. 345–346',
    claimType: 'official-boundary',
    paraphrase:
      'Çıtdibi–Karabel–Elmin–Geyikbayırı yaklaşık 18 km ve zor bir dağ etabı olarak tarif edilir; resmî envanterle sınırı ayrıca eşleştirilmelidir. Kaynaklar arasında mesafe uzun olduğu için Çıtdibi’nden dolum yapmak, köy ve çiftlik geçişlerinde su istemek gerekir; Karabel çevresinde yeni kaynak bulunmayabileceği belirtilir. Yol üzerindeki konaklama imkânları kaya tırmanışı işletmelerine bağlıdır.',
    capturedAt: '2026-09-09',
    reviewedBy: 'İbrahim Uylaş',
    rightsStatus: 'citation-only'
  }
]

module.exports = {
  bookReferenceClaimTypes,
  bookReferenceEvidence,
  buildBookReferenceEvidenceCoverage,
  isCompleteBookReferenceEvidence
}
