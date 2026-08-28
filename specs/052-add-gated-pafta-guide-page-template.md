# Spec 052 — Kanıt kapılı pafta rehberi sayfa şablonu

## Amaç

Bir resmî pafta, ana Likya Yolu rehberi tamamen açılmayı beklemeden kendi
kanıt/yayın kapısını geçtiğinde bağımsız ve mobil uyumlu bir rehber sayfası
olarak yayınlanabilmelidir.

## Kapsam

- Gatsby, yalnızca `canPublish: true` olan pafta kayıtları için
  `/likya-yolu/<pafta-slug>/` sayfası oluşturur.
- Sayfa şablonu; resmî başlık, kaynaklı metrikler, rota bağlamı, karar
  noktaları, resmî harita bağlantısı, doğrulanmış haricî GPS bağlantısı (varsa)
  ve koşul kontrol panelini gösterir.
- Sayfa hem oluşturulurken hem de çalışırken yayın kapısını tekrar denetler.
- Yayın kaydı; ilgili uygun araştırma kaydını, yeterli uzunlukta özet/anlatıyı
  ve en az iki karar noktasını içermeden `ready` sayılmaz.

## Kabul kriterleri

- Kanıtı eksik pafta için dinamik public sayfa üretilmez.
- Bir paftadaki uygun araştırma kaydı, sayfanın bağlandığı `primaryResearchRecordId`
  ile aynı olmalıdır.
- Haricî GPS bağlantısı yalnızca doğrulanmış, indirme için haricî bağlantı
  statüsündeki kayıtlarla görünür.
- Güncel güvenlik/hizmet iddiaları koşul panelinin tarihli kaydı dışında
  yapılmaz.
- Küçük ekranda tüm kartlar tek kolona iner; mevcut Theme UI renk, tipografi ve
  odak görünürlüğü korunur.
