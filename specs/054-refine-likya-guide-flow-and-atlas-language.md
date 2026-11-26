# Spec 054 — Likya rehberi akışı ve rota keşfi sadeleştirmesi

## Amaç

Rehberi kaynak/uyarı katmanlarından arındırarak, ziyaretçinin rota seçme,
hazırlanma ve bölümleri keşfetme akışına odaklamak.

## Değişiklikler

- Ana sayfadaki genel hava, yangın, su/hizmet özetleri ve tek kaynak vurgusu
  kaldırılır. Bu değişken bilgiler rota bazında doğrulanmadan gösterilmez.
- Rehber indeksi kaldırılır; masaüstünde yerine sabit sol bölüm navigasyonu
  gelir.
- Hazırlık kartları numaralanır; mobilde yatay kaydırılabilir tek sıraya geçer.
  Belirsiz “Uygula” etiketi “Yola çıkmadan önce dene” olarak değişir.
- Kontrol listesi, seçim → ilgili maddeler → ilerleme → kopyala/yazdır akışını
  açıkça anlatır. Seçim alanları, görünür menü öğeleriyle çalışır.
- “Tarihsel saha arşivi” kişisel ve anlaşılır bir dile çevrilir.
- Atlasın kullanıcı dili “bölüm” olur. Kaynaklı envanter blokları ve tekrarlı
  2014 bağlantıları kaldırılır; filtre daima açık, butonlar görünür ve kartlar
  boşluksuz monolog yerine görselli iki kolon düzeninde gösterilir.
- Kart fotoğrafları 2014 Likya arşivinden genel bağlam görselleridir; belirli
  bir bölümü temsil ettikleri iddia edilmez.

## Kabul kriterleri

- Genel/rota dışı güncel koşul iddiası gösterilmez.
- Mobilde hazırlık kartları yatay kaydırılabilir; masaüstünde iki kolon kalır.
- Kullanıcı kontrol listesinin ne yaptığını ve kontrol tamamlanınca ne
  yapabileceğini anlayabilir.
- Atlas filtreleri başlangıçta açıktır; kullanıcı görünür bir kontrolle bölge
  veya yer adına göre arama yapabilir.
- Kullanıcı arayüzünde “pafta” yerine “bölüm” kullanılır.
