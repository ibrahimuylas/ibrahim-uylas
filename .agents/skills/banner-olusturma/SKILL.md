---
name: banner-olusturma
description: Blog yazıları için kullanıcı fotoğrafından veya AI görselinden, ana konuyu ve önemli ayrıntıları farklı ekranlarda koruyan bannerlar tasarla; kadraj güvenliği, dosya adlandırma, alt metin, WebP teslimi ve yayın öncesi görsel kontrolünü uygula. Yeni bir blog bannerı oluşturma, mevcut bir bannerı yeniden kadrajlama veya blog-yazısı görsel planını üretim dosyasına dönüştürme isteklerinde kullan.
---

# Banner oluşturma

Blog bannerını yalnızca güzel görünen bir görsel olarak değil, masaüstü ve dar mobil ekranlarda birlikte çalışan bir kapak görseli olarak hazırla. Öncelik, ana nesnenin ve fotoğrafın anlamını korumaktır; metin eklemek veya görüntüyü zorla sabit bir orana kırpmak ikincil tercihtir.

## İş akışı

1. Kaynak görseli incele.
   - Piksel ölçüsünü, yönünü ve oranını kontrol et.
   - Ana nesneyi, yüzleri, çadırı veya ürünü; ayrıca korunması gereken kenar ayrıntılarını belirle.
   - Kullanıcı fotoğrafı verildiyse kimliği ve yüzü koru; yapay kişi veya yeni yüz üretme.

2. Kadraj kararını ver.
   - Önce görselin tamamını, özgün oranını koruyarak kullanmayı dene.
   - Kırpma gerekiyorsa ana nesneyi orta güvenli bölgede tut; üstte gökyüzü, altta zemin ve yanlarda bağlam için pay bırak.
   - Banner içine başlık, logo, filigran veya anlamsız yazı yerleştirme. Başlık sayfada görselin altında/yanında render edilir.
   - İnsan yüzü, ürün, çadır veya ekipman kenara çok yakınsa yeni üretim promptunda bunu açıkça güvenli bölgede iste.

3. Üretim yönünü seç.
   - Kullanıcının fotoğrafı varsa önce fotoğrafı kadrajlayan veya yalnızca gerekli alanları genişleten düzenleme yaklaşımını kullan.
   - AI görseli gerekiyorsa bağımsız, Stitch-friendly bir prompt yaz: sahne ve ana nesne; kompozisyon ve kamera; ışık ve renk; teknik çıktı; kısıtlar.
   - AI çıktısında yatay 3:2 kompozisyon, en az 1600 px genişlik, premium outdoor editoryal estetik, logo/filigran/metinsiz çıktı iste.
   - 3:2 kaynak görsel üretmek, kaynakta daha fazla ayrıntı bırakır; site veya sosyal platform özel bir oran istiyorsa o oran için ayrıca türev üret.

4. Site uyumluluğunu kontrol et.
   - Bu projedeki blog hero görsellerinde genişlik 1600 px ile sınırlandırılır ve yükseklik zorlanmaz; görselin doğal oranı korunur.
   - İçeriği tamamlanmış eski 1600×650 bannerları yeniden kırpma veya yeniden üretme.
   - Yeni bannerı da 1600×1067 (3:2) gibi doğal oranıyla teslim et; render katmanında sabit 1600×650 kırpma ekleme.
   - Masaüstü, yaklaşık 768 px tablet ve 320–430 px mobil genişlikte ana nesnenin görünür kaldığını kontrol et. Özellikle mobilde üst ve alt ayrıntıların kesilmediğini doğrula.

5. Teslim paketini oluştur.
   - ASCII kebab-case ve konuya özel bir dosya adı kullan: `konu-ana-nesne-banner.webp`.
   - WebP’ye dönüştür; gözle fark edilmeyecek biçimde sıkıştır ve genişliği en az 1400 px koru.
   - Görselin gerçekten görünen içeriğini tarif eden bir `alt` metni ve kısa `thumbnailText` üret.
   - Kaynak dosyayı silme veya üzerine yazma; yeni türevi yazı klasöründe ayrı dosya olarak tut.

## Kontrol listesi

- [ ] Kaynak görselin ölçüsü ve oranı kontrol edildi.
- [ ] Ana nesne, yüz ve bağlam farklı ekranlarda görünür durumda.
- [ ] Görselde istenmeyen metin, logo veya filigran yok.
- [ ] Dosya adı ASCII kebab-case ve alt metin gerçeğe uygun.
- [ ] WebP genişliği en az 1400 px.
- [ ] Blog frontmatter’ındaki `thumbnail` dosya adıyla birebir eşleşiyor.
- [ ] Eski bannerların kaynak dosyaları değiştirilmedi.
