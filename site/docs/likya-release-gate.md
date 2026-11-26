# Likya rehber yayın kapısı

Kanonik `/likya-yolu-rotasi/` sayfası, `guide-meta.js` içinde hem `shellEnabled: true` hem de `releaseStatus: 'ready'` olmadıkça yeni rehber kabuğuna geçmez. Bu ikili koşul, veri dosyaları var diye eksik bir rehberin yanlışlıkla yayımlanmasını önler.

## Otomatik kapılar

```sh
npm run test:likya:planner
npm run validate:likya:freshness
npm run validate:likya:links
npm run validate:likya:release
LIKYA_REQUIRE_READY=1 npm run validate:likya:release
npm run build
npm run validate:html
npm run validate:seo:likya
```

Son komutun `LIKYA_REQUIRE_READY=1` ile başarısız olması, yayınlanacak rehberin eksik olduğu anlamına gelir. Normal `validate:likya:release` komutu ise yayın kararını `HAZIR` veya `BEKLET` olarak raporlar; durum incelemesi için sıfır çıkış koduyla biter.

## Manuel kontrol özeti

- 390×844, 844×390, 768×1024, 1024×768, 1280×800 ve 1440×900 görünümünde rehber, normal rota kategorisi ve normal bir yazıyı karşılaştırın.
- Açık/koyu temada klavye ile CTA, atlas filtresi, açıklamalar ve kontrol listesini tamamlayın; odak, metin etiketi ve 48 px dokunma hedeflerini kontrol edin.
- Planlayıcı için geçerli, mevsim/deneyim/konaklama uyumsuz, geri alma ve paylaşım URL senaryolarını; plan yayımlandığında ayrıca yazdır/no-JS senaryosunu yürütün.
- Harita/GPS işlemlerinin ertelendiğini, kaynak bağlantılarının çalıştığını ve yatay taşma olmadığını kontrol edin.
- Yayın öncesinde her planın dört koşul kategorisini, kaynak tarihini ve engelleme gerekçesini inceleyin.

## Yayın ve geri alma

Önce mevcut kanonik sayfanın ve `/category/rotalar/` sayfasının aynı viewport ekran görüntülerini alın. İnceleme dalında tam rehberi gözden geçirin. Yayın sonrası ana mobil/masaüstü yolculukları, kırık bağlantılar ve analitik olaylarını denetleyin.

Hatalı yayın durumunda `shellEnabled` değerini `false` yaparak önceki yazı bileşimine dönün; veri ve tarihsel içerik dosyalarını silmeyin. Daha sonra kaynaklı düzeltmeyi ayrı bir değişiklikte yapın.
