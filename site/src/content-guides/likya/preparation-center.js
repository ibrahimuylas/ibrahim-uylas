const preparationTopics = [
  {
    id: 'hazirlik',
    title: 'Hazırlık ve antrenman',
    shortAnswer: [
      'Kondisyon ile arka arkaya günlerce yürüyebilmek aynı şey değildir.',
      'Yola çıkmadan önce gerçek çantayla deneme yürüyüşleri yap.',
      'Süre, iniş-çıkış, iki gün üst üste yürümek ve toparlanma hissini birlikte gözlemle.',
      'Beklediğinden fazla zorlanıyorsan günü veya planı kısaltmak güvenli bir karardır.',
      'Bu sayfa tıbbi uygunluk değerlendirmesi yapmaz.'
    ],
    apply: [
      'Önce rahat bir zeminde zaman ayakta kalma denemesi yap; sonra yük, eğim ve ardışık gün sayısını tek tek artır.',
      'Denemede kullanacağın ayakkabı, çorap ve çanta yola götüreceğin ekipmanla aynı olsun.',
      'Deneme sonrası ağrı, su toplaması, yorgunluk ve toparlanma notu al; planını buna göre sadeleştir.'
    ],
    deepLinks: [
      {
        label: '2014’teki hazırlık günlüğümü oku',
        href: '/likya-yolu-hazirliklari/'
      }
    ]
  },
  {
    id: 'canta',
    title: 'Ekipman ve çanta',
    shortAnswer: [
      'Önce güvenlik, yön bulma, su taşıma ve hava korumasını; sonra konfor eşyalarını düşün.',
      'Su, gün içindeki en değişken çanta ağırlığıdır.',
      'Kamp, pansiyon ve karma kalış aynı liste değildir.',
      'Her parçanın gerçekten kullanılacağı bir senaryo olmalı.',
      'Eski bir çanta listesi, ürün önerisi veya ideal ağırlık kuralı değildir.'
    ],
    apply: [
      'Eşyaları evde üç gruba ayır: her yürüyüşte gerekli, koşula bağlı, taşımaya değmeyecek.',
      'Paketlenmiş çantayı bir deneme gününde taşı; sadece tartıya değil dengene ve gün sonu hissine de bak.',
      'Su kabı, yağmur/ısı koruması ve telefon gücü için ayrı bir erişim planı yap.'
    ],
    deepLinks: [
      {
        label: '2014’teki sırt çantama göz at',
        href: '/likya-parkuru-sirt-cantam/'
      }
    ]
  },
  {
    id: 'ayakkabi-uyku',
    title: 'Ayakkabı, hava ve uyku',
    shortAnswer: [
      'Yeni ayakkabı veya uyku sistemini ilk kez yolda deneme.',
      'Ayakkabı ve çorabı zeminde, yükle ve uzun yürüyüşte test et.',
      'Isı, yağmur ve gece serinliği ayrı kararlar gerektirir.',
      'Konaklama biçimi, taşıyacağın uyku ekipmanını doğrudan değiştirir.',
      'Su toplaması ihtimalini azaltmak için sürtünme noktalarını deneme yürüyüşünde bul.'
    ],
    apply: [
      'Hava korumasını katman mantığıyla; uyku sistemini ise planlanan geceleme biçimiyle birlikte dene.',
      'Yağmur ihtimali ve sıcak günleri, tek bir “mevsim uygun” etiketi yerine çantanda ayrı senaryolar olarak düşün.',
      'Ayakkabı/çorap değişimi için gün sonunda kuru kalacak küçük bir yedek ayır.'
    ],
    deepLinks: []
  },
  {
    id: 'navigasyon',
    title: 'GPS ve navigasyon',
    shortAnswer: [
      'Resmî pafta, işaretler ve üçüncü taraf kayıtlar birbirinin aynısı olmayabilir.',
      'GPS kaydı güncel geçiş, güvenlik veya açık hizmet kanıtı değildir.',
      'Çevrimdışı harita, güç yedeği ve rota kolu kontrolü tek bir telefon ekranından daha dayanıklıdır.',
      'Kayıt sahibinin ve sağlayıcının indirme/kullanım koşullarına uy.',
      'Varyant gördüğünde hangi yön ve kolu açtığını tekrar doğrula.'
    ],
    apply: [
      'Resmî pafta kaynağını, kullanacağın harita uygulamasını ve varsa harici GPS kaydını yola çıkmadan önce aynı yerde karşılaştır.',
      'Telefonu çevrimdışı kullanımda dene; şarj kablosu, güç kaynağı ve kağıt/başka cihaz yedeğini kendi sistemine göre hazırla.',
      'Kararsız kaldığın noktaları önceden işaretle; o günkü erişim ve işaret durumunu ayrıca kontrol et.'
    ],
    deepLinks: [
      {
        label: 'Resmî pafta envanterini aç',
        href: 'https://likyayolu.ktb.gov.tr/'
      }
    ]
  },
  {
    id: 'su-yemek',
    title: 'Su ve yiyecek',
    shortAnswer: [
      'Su planı; mesafe, sıcaklık, yükselti, taşıma kapasitesi ve dolum belirsizliğine birlikte dayanır.',
      'Eski su veya işletme notları, bugün açık ya da güvenli olduğu anlamına gelmez.',
      'Her gün için birincil dolum fikriyle birlikte yedek senaryo kur.',
      'Yiyecek planını konaklama ve yeniden tedarik belirsizliğine göre sadeleştir.',
      'Güncel dolum/işletme bilgisini çıkıştan kısa süre önce doğrula.'
    ],
    apply: [
      'Her günün başlangıç suyu, olası dolum noktası ve dolum yoksa kararını not et.',
      'Kısa yürüyüşte iyi çalışan yiyecek düzenini uzun günlerde dene; yeni beslenme düzenini patikada deneme.',
      'Bir işletmeye veya çeşmeye bağlı kararları tarihli bir doğrulama notuyla işaretle.'
    ],
    deepLinks: []
  },
  {
    id: 'konaklama',
    title: 'Kamp, pansiyon ve karma kalış',
    shortAnswer: [
      'Kamp daha çok ekipman ve kurulum kararı; pansiyon daha çok erişim ve rezervasyon belirsizliği getirir.',
      'Karma plan, iki sistemin de yedeğini gerektirir.',
      'Kamp alanı veya arazi erişimi için varsayım yapma; yerel ve resmî koşulları kontrol et.',
      'Fiyat ve işletme açık bilgilerini kalıcı kabul etme.',
      'İz bırakmama ilkeleri; atık, ateş, su kaynağı ve kültürel alan kararlarını kapsar.'
    ],
    apply: [
      'Her gece için ana seçenek, iletişim/doğrulama yöntemi ve bozulursa yedek seçenek yaz.',
      'Kamp için izin/erişim belirsizliğini çözmeden gün sonu hedefini kesinleştirme.',
      'Pansiyon odaklı yürüyüşte bile gecikme veya bağlantı kaçırma ihtimali için basit bir yedek taşı.'
    ],
    deepLinks: []
  },
  {
    id: 'ulasim-cikis',
    title: 'Ulaşım ve rota çıkışları',
    shortAnswer: [
      'Planlanan bitiş ile acil/erken çıkış aynı şey değildir.',
      'Toplu taşıma, araç geri alma ve bağlantı süreleri yürüme gününden ayrı planlanır.',
      'Tek bir son sefer veya dar bağlantı üstüne tüm planı kurma.',
      'Her gün için ulaşılabilir bir karar/çıkış ihtimalini düşün.',
      'Güncel ulaşım bilgisini doğrudan işletici veya yerel resmî kanaldan doğrula.'
    ],
    apply: [
      'Başlangıç, planlanan bitiş ve erken çıkış için üç ayrı ulaşım notu oluştur.',
      'Araç bırakacaksan dönüş ve araç alma adımını yürüyüşten bağımsız planla.',
      'Kaçan bağlantı halinde nerede kalacağını ve kiminle iletişime geçeceğini önceden yaz.'
    ],
    deepLinks: []
  },
  {
    id: 'tek-basina',
    title: 'Tek başına veya birlikte yürümek',
    shortAnswer: [
      'Tek başına yürümek kişisel bir tercih değil, iletişim ve geri dönüş planı da gerektirir.',
      'Deneyim, uzaklık, hava ve rota belirsizliği kararı değiştirir.',
      'Birine planını, geceleme niyetini ve kontrol saatini bırak.',
      'Dönüş kararı için kendi eşiklerini yola çıkmadan belirle.',
      'Kişisel bir yalnız yürüyüş hikâyesi evrensel izin veya güvenlik kuralı değildir.'
    ],
    apply: [
      'Kontrol kişisi, gün içi mesaj penceresi ve haber alınamazsa ne yapacağı konusunda açıkça anlaş.',
      'Tek başına kullanımda navigasyon, güç, su ve çıkış yedeklerini daha muhafazakâr planla.',
      'Grup yürüyüşünde de tempo ayrılması, buluşma noktası ve karar yetkisini baştan konuş.'
    ],
    deepLinks: [
      {
        label: '2014 yalnız yürüme kararını oku',
        href: '/likya-yoluna-neden-tek-gidiyorsun/'
      }
    ]
  },
  {
    id: 'acil-durum-sorumluluk',
    title: 'Acil durum ve patika sorumluluğu',
    shortAnswer: [
      'Rota niyetini, çevrimdışı iletişim bilgisini ve çıkış düşünceni paylaş.',
      'Telefon kapsamasına veya dış yardımın hızına dair varsayım yapma.',
      'Acil durumda resmî yönlendirmeyi takip et; Türkiye’de tek acil çağrı numarası 112’dir.',
      'Ateş, atık, su kaynakları ve kültürel alanlarda etkini en aza indir.',
      'Güncel yangın, yasak ve erişim duyuruları yolculuk öncesi yeniden kontrol edilmelidir.'
    ],
    apply: [
      'Güncel rota planını ve kritik çıkışlarını paylaşacağın kişiyi belirle.',
      'Acil durumda konumunu, erişim yolunu ve temel durumu net aktarabilmek için gerekli bilgiyi erişilebilir tut.',
      'Kısıt veya risk işareti gördüğünde planı zorlamak yerine geri dönme/çıkış kararını uygula.'
    ],
    deepLinks: [
      { label: '112 Acil Çağrı Merkezi', href: 'https://112.gov.tr/' }
    ]
  }
]

const checklistItems = [
  {
    id: 'rota-niyeti',
    label:
      'Rota niyetim, geceleme düşüncem ve kritik çıkışlarım bir yakınımla paylaşıldı.',
    universal: true
  },
  {
    id: 'offline-navigasyon',
    label:
      'Çevrimdışı harita/navigasyon, güç yedeği ve rota kolu kontrol edildi.',
    universal: true
  },
  {
    id: 'su-plani',
    label: 'Su taşıma kapasitem ve güncel dolum doğrulama planım hazır.',
    universal: true
  },
  {
    id: 'hava-kisitlama',
    label:
      'Hava, yangın/orman ve diğer resmî erişim duyuruları çıkıştan hemen önce kontrol edilecek.',
    universal: true
  },
  {
    id: 'deneme-yuruyusu',
    label:
      'Ayakkabı, çorap, çanta ve temel sistemlerimi yükle deneme yürüyüşünde kullandım.',
    universal: true
  },
  {
    id: 'kamp-sistemi',
    label: 'Çadır/uyku sistemi, arazi erişimi ve iz bırakmama planım hazır.',
    lodgingModes: ['camp', 'mixed']
  },
  {
    id: 'konaklama-dogrulama',
    label:
      'Geceleme için güncel iletişim/doğrulama ve gecikme halinde yedek planım var.',
    lodgingModes: ['pension', 'mixed']
  },
  {
    id: 'uzun-yuruyus',
    label:
      'Arka arkaya yürüyüş günleri ve toparlanma için deneme/çıkış planı yaptım.',
    durationBands: ['5', '7', 'full']
  },
  {
    id: 'soguk-yagmur',
    label:
      'Serin/yağışlı koşul için test edilmiş katman ve kuru yedek düzenim var.',
    seasonBands: ['winter', 'spring', 'autumn']
  },
  {
    id: 'sicaklik',
    label:
      'Sıcak günler için tempo, gölge/mola ve su kararlarımı yeniden gözden geçirdim.',
    seasonBands: ['summer']
  },
  {
    id: 'solo-protokol',
    label: 'Kontrol kişim, haberleşme pencerem ve geri dönüş eşiğim net.',
    companionModes: ['solo']
  },
  {
    id: 'grup-protokol',
    label: 'Grup için tempo, buluşma noktası ve karar alma düzeni konuşuldu.',
    companionModes: ['group']
  }
]

const historicalArchiveLinks = [
  {
    label: '2014’teki hazırlık günlüğümü oku',
    href: '/likya-yolu-hazirliklari/',
    note: 'Tarihsel plan ve antrenman notları; güncel hazırlık reçetesi değildir.'
  },
  {
    label: '2014’teki sırt çantama göz at',
    href: '/likya-parkuru-sirt-cantam/',
    note: 'Dönemine ait gerçek çanta kaydı; ürün veya ideal ağırlık önerisi değildir.'
  },
  {
    label: '2014’teki Likya Yolu planımı ve notlarımı oku',
    href: '/likya-yolu-2014-planim/',
    note: 'Rota, su ve konaklama notları 2014 deneyimime aittir; güncel koşul rehberi değildir.'
  },
  {
    label: 'Neden tek gittim?',
    href: '/likya-yoluna-neden-tek-gidiyorsun/',
    note: 'Kişisel yalnız yürüme perspektifi; evrensel güvenlik izni değildir.'
  }
]

module.exports = {
  checklistItems,
  historicalArchiveLinks,
  preparationTopics
}
