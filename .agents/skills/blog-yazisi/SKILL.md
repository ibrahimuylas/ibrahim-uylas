---
name: blog-yazisi
description: Kaynak bir URL ve kullanıcının kişisel notlarından, İbrahim Uylaş'ın üslubuna uygun özgün Türkçe blog yazısı; SEO alanları, görsel yerleşim planı ve AI görsel promptları üretir. Bir yazıyı Türkçeye uyarlama, kaynak yazıdan yeni içerik hazırlama, blog şablonunu kullanma, yayın paketi oluşturma veya mevcut taslağı İbrahim'in üslubuyla yeniden yazma isteklerinde kullan.
---

# Blog yazısı

Kaynak metni birebir çevirmek yerine aynı konuyu özgün bir Türkçe yazı olarak yeniden kur. Kullanıcının yalnızca gerçekten verdiği kişisel deneyimleri kullan.

## Başlamadan önce

1. [İbrahim'in yazı üslubunu](references/yazi-uslubu.md) tamamen oku.
2. [Teslim formatını](references/teslim-formati.md) tamamen oku.
3. Repodaki konuyla ilgili en güncel 2-3 yazıyı incele. Eski yazılardaki imla hatalarını üslup özelliği sayma.
4. Kaynak URL'yi aç ve güncel içeriği incele. Teknik veya zamana duyarlı iddiaları güvenilir birincil kaynaklarla doğrula.

## Girdileri yorumla

Beklenen girdiler:

- Kaynak URL
- Kullanıcının kişisel deneyimleri ve eklemek istediği bilgiler
- Varsa hedef anahtar kelime, hedef uzunluk ve kategori

Eksik ama engelleyici olmayan ayrıntıları makul biçimde belirle. Kişisel deneyim, tarih, mesafe, kullanılan ürün veya sonuç uydurma. Önemli bir belirsizlik varsa taslakta açıkça işaretle.

## Yazıyı üret

1. Kaynaktan konu kapsamını ve doğrulanabilir olguları çıkar.
2. Cümleleri veya bölüm sırasını birebir kopyalama. Yeni bir anlatı ve başlık düzeni kur.
3. Bir ana arama niyeti ve en fazla 3-5 destekleyici sorgu belirle.
4. Başlığı, slug'ı, meta açıklamasını ve soru biçimindeki H2 başlıklarını doğal biçimde anahtar kelimelerle uyumlu hâle getir.
5. İlk bölümde okuyucunun sorusuna hızlı cevap ver; kişisel hikâyeyi yalnızca kullanıcı sağladıysa anlatıya yedir.
6. Teknik bilgiyi günlük kullanım senaryolarına çevir. Kesin olmayan değerleri mutlak kural gibi sunma.
7. Yalnızca repoda gerçekten bulunan ve metne doğal oturan 2-4 iç bağlantı öner veya ekle. Yayımlanmamış yazılara bağlantı verme.
8. Son bölümde okuyucunun kendi deneyimini somut ayrıntılarla paylaşmasını isteyen tek bir doğal yorum çağrısı kullan.

## Görselleri planla

- Kullanıcının fotoğrafından hazırlanacak 1 banner öner.
- Yazının uzunluğuna göre 4-5 AI görseli planla.
- Her görsel için yerleşim, amaç, SEO uyumlu ASCII dosya adı, gerçek içeriği tarif eden alt metin ve gerekiyorsa kısa caption ver.
- Görselleri sırf süs olsun diye değil, bölümün anlaşılmasını veya ritmini iyileştirmek için kullan.
- Promptlarda ortak olarak şunları iste:
  - 3:2 yatay kompozisyon
  - En az 1600 piksel genişlik
  - Makale boyunca tutarlı, premium outdoor editoryal estetik
  - Marka, filigran ve anlamsız yazı olmaması
  - İnfografik değilse görsel üzerinde metin olmaması
  - İnfografikse yalnızca verilen Türkçe etiketlerin eksiksiz kullanılması
- WebP, sıkıştırma ve nihai dosya adı üretim sonrası teslim talimatıdır; görsel modelinin sahne promptuna teknik dosya biçimi gibi yedirme.

## Teslim ve sınırlar

- Kullanıcı repo değişikliği istemediyse dosya oluşturma veya değiştirme; tek bir kopyalanabilir Markdown paketinde teslim et.
- Kullanıcı yalnızca ilk taslağı istiyorsa banner üretme veya görselleri dönüştürme. Banner ve WebP işlemlerini görseller seçildikten sonraki aşamaya bırak.
- Kaynak yazıdan uzun veya yakın bir çeviri yapma; özgün anlatım kullan.
- SEO adına anahtar kelime doldurma, gereksiz SSS bölümü veya sahte uzmanlık ekleme.
- Kullanıcının sesi ile doğrulanabilir teknik bilgiyi birbirine karıştırma.
- Teslimden önce tarihleri, sayıları, iç bağlantıları, görsel sayısını ve Markdown yapısını kontrol et.
