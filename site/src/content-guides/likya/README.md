# Likya rehber verisi

Bu klasör, Likya Yolu rehberinin tek veri kaynağıdır. Arayüz bileşenleri veya MDX tabloları rota, kaynak, tarihsel deneyim ya da koşul bilgisini kendi içinde yeniden tanımlamamalıdır.

## Veri ayrımı

- `sources.js`: Bir iddianın hangi kaynağa dayandığını ve kaynağın hangi tür iddiayı destekleyebileceğini tutar.
- `route-sections.js`: Bakanlığın 31 paftalık sıralı rota envanteri. Pafta, yürüyüş günü değildir.
- `walking-stages.js`: Pratik yürüyüş etapları. İlk kayıtlar yalnızca 2014 deneyimini korur; resmî paftayla uzlaştırılmadan planlayıcıya giremez.
- `historical-experiences.js`: 509 km, 465 km, 430 km ve 230 km'nin ayrı tarihsel anlamlarını tutar.
- `route-plans.js`: 3/5/7 günlük ve tam rota önerileri için yalnızca doğrulanmış planları; ayrıca katalog kapalıyken kullanıcıya gösterilecek neden ve sonraki adımları tutar. Bu dosyada plan yoksa planlayıcı kullanıcıdan cevap toplamaz.
- `stage-guides.js`: Korunan etap URL’lerinin merkezi eşlemesi. Tarihsel etaplar, resmî paftayla uzlaştırılmadan güncel rehber olarak yayınlanmaz.
- `western-region.js`, `central-region.js` ve `eastern-region.js`: Bölgesel editoryal paketlerin yalnızca kaynaklı pafta envanterini ve uygun olduğunda 2014 arşiv bağlantılarını tutar. Doğu paketi, 2014 tam rota planını yürünmüş deneyim değil, doğrulanacak plan notu olarak etiketler.
- `conditions.js`: Hava, yangın, kapanış, su, servis veya ulaşım gibi değişken bilgiler için kapsamı ve doğrulama yolu tanımlanmış kayıtları tutar.
- `condition-status.js`: Koşul kayıtlarını kaynak dosyasını değiştirmeden yayın tarihinde `review-due` durumuna düşürür ve kapsam başına dört kullanıcı satırı üretir. Bakım akışı `site/docs/likya-condition-workflow.md` dosyasındadır.
- `release-readiness.js`: Kanonik rehber kabuğunun açılabilmesi için gerekli veri kapsamını değerlendirir. Yayın karar ve geri alma akışı `site/docs/likya-release-gate.md` dosyasındadır.
- `preparation-center.js`: Güncel hazırlık merkezi için dokuz konuyu, seçime bağlı ama evrensel gereksinimleri gizlemeyen kontrol listesi kurallarını ve tarihsel arşiv bağlantılarını tutar.

## Güncel olmayan veri kuralı

2014 yazıları, GPS gömüsü ve topluluk paylaşımları güncel rota/koşul verisi değildir. Her değişken bilgi, ayrı kaynak ve `reviewDueAt` kaydı olmadan kullanıcıya güncelmiş gibi gösterilemez.

## Doğrulama

`npm run validate:likya:data` komutu; kaynak kimliklerini, 31 paftalık envanteri, iç makale bağlantılarını ve gelecek plan/koşul kayıtlarının referanslarını denetler.

Komut uyarı verdiğinde veri otomatik olarak yayınlanabilir anlamına gelmez. Uyarılar, özellikle pafta-etap uzlaştırması ve mesafe verisi tamamlanmadan yeni plan/etap sayfası yayınlanmaması gerektiğini gösterir.
