# Likya Yolu koşul kaydı çalışma akışı

Bu sistem bilgilendirme amaçlıdır; canlı izleme, acil durum uyarısı veya rota güvenliği garantisi vermez. Kayıt yokluğu, rotanın açık ya da güvenli olduğu anlamına gelmez.

Otomatik kaynak izleme değerlendirmesi için [Likya koşul kaynağı izleme değerlendirmesi](./likya-condition-monitoring-evaluation.md) notuna bakın. Mevcut karar `manual-only`dir.

## Kaynak sırası

1. Birincil resmî kaynak: yetkili kamu kurumu veya kendi duyurusunu yayımlayan resmî işletici.
2. Doğrudan yerel işletici: ulaşım, korunan alan veya konaklama kendi faaliyeti için.
3. Tarihli saha gözlemi: yalnızca bağlam/araştırma ipucu olarak.
4. Topluluk sinyali: araştırma tetikleyicisi; doğrulanmadan kayıt özeti yapılmaz.

Facebook grubu paylaşımları dördüncü sıradadır. Kişisel paylaşımlar kopyalanmaz veya koşul gerçeği olarak yayımlanmaz.

## Kayıt ekleme ve güncelleme

`src/content-guides/likya/conditions.js` içindeki `conditions` dizisine tek kayıt ekleyin. Her kayıtta kategori, dar kapsamlı özet, durum, `sourceId`, doğrudan `sourceUrl`, kontrol/gözlem tarihi, `reviewDueAt`, editoryal sorumlu, kapsam, kullanıcı için yeni doğrulama adımı ve engelleme nedeni bulunmalıdır.

- `official-notice`: Resmî duyuru var. `effectiveFrom`, birincil resmî kaynak ve gözden geçirme kuralı zorunludur.
- `season-reviewed`: Bu sezon kaynak kontrol edildi. “Güvenli/açık” anlamına gelmez; `reviewDueAt` geçince arayüzde otomatik olarak `review-due` görünür ve doğrulama başarısız olur.
- `historical-note`: Tarihsel saha notu. `observedAt` zorunludur ve güncel durum değildir.
- `review-due`: Yakın tarihte doğrulanmadı.
- `unknown`: Güncel bilgi bulunamadı.

Eski uyarıyı silmeyin: `archivedAt` ekleyin ve yeni kaydı ayrı id ile oluşturun. Aynı kaynak/kapsam için etkin iki resmî duyuru eklemeyin.

## Düzenli inceleme

Ana ilkbahar ve sonbahar yürüyüş döneminden önce tüm `review-due` kayıtlarını, resmî rota bağlantılarını ve bir planın dört kontrol kategorisini gözden geçirin. Kaynakta ilgili duyuru yoksa “kaynak kontrol edildi” yazın; “risk yok” yazmayın.

Bir uyarı öğrenildiğinde en yüksek kaynak düzeyinde doğrulayın, kapsamını belirleyin, kaydı güncelleyin, siteyi yeniden üretin. Çelişen resmî kaynaklarda daha dar kapsamlı/son tarihli kaynak çözüme ulaşana kadar `unknown` veya engelleme durumunu koruyun.

## Kontrol ve geri alma

```sh
npm run validate:likya:conditions
npm run validate:likya:data
npm run build
```

Hatalı bir kayıt için yayımlanan değişikliği geri alın veya kaydı `archivedAt` ile arşivleyip doğru kaynaklı yeni bir kayıt ekleyin. Eski kaydı tamamen silmek yerine iz bırakın.
