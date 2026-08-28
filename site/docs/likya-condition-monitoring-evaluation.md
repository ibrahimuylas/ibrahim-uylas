# Likya koşul kaynağı izleme değerlendirmesi

**Karar: MANUAL-ONLY — otomatik izleme benimsenmedi.**

Bu değerlendirme, Spec 019’daki manuel koşul akışını değiştirmez. Hiçbir izleyici, kamusal koşul kaydını otomatik oluşturmaz, güncellemez veya “açık/güvenli” sonucu üretmez.

## Değerlendirme özeti

| Kategori                   | Temsilci yetkili kaynak                                        | Erişim / kararlılık                                                                                                                                                                                    | Rota kapsamı                                   | Karar       |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ----------- |
| Hava / meteorolojik uyarı  | MGM Antalya Bölge Müdürlüğü                                    | Güncel HTML tahmin ve uyarı sayfası var; belgelenmiş otomasyon API’si veya veri yeniden kullanım akışı tespit edilmedi. MGM, site bölümlerini/erişimini haber vermeden değiştirebileceğini belirtiyor. | İl/bölge düzeyi; etap veya mikro koşul değil.  | Manual-only |
| Yangın / orman erişimi     | Orman Genel Müdürlüğü duyuru ve haberleri                      | Resmî ve erişilebilir; duyurular ülke geneli, olay/haber odaklı. Likya paftasıyla kararlı bir eşleme veya makine dostu kısıtlama akışı bulunmadı.                                                      | Rota bazlı erişim hükmü çıkarılamaz.           | Manual-only |
| Rota kapanışı / varyant    | KTB Likya Yolu sayfaları                                       | Resmî pafta envanteri güçlü; ana sayfadaki duyurular genel Bakanlık içeriğiyle karışıyor. Yapılandırılmış kapanış/erişim feed’i tespit edilmedi.                                                       | Pafta başlıkları var; güncel geçiş durumu yok. | Manual-only |
| Yerel yasak / korunan alan | İlgili kaymakamlık, belediye, korunan alan veya yerel işletici | Rota boyunca tek bir yetkili ve tek tip yayın yüzeyi yok.                                                                                                                                              | Olayın yerine göre değişir.                    | Manual-only |
| Ulaşım kesintisi           | İlgili taşıyıcı / yerel işletici                               | Rota çapında ortak bir resmî operatör veya kararlı veri yüzeyi yok.                                                                                                                                    | Planlanan başlangıç/bitişe bağlı.              | Manual-only |

İncelenen kaynaklar: [MGM Antalya](https://antalya.mgm.gov.tr/), [MGM kullanım şartları](https://www.mgm.gov.tr/site/yasal-uyari.aspx), [OGM duyuruları](https://www.ogm.gov.tr/tr/duyurular?hl=tr-TR) ve [KTB Likya Yolu](https://likyayolu.ktb.gov.tr/).

## Neden POC çalıştırılmadı?

Spec 021, yalnızca izinli ve düşük sıklıkla erişilebilen kaynaklar için en fazla üç kaynakta POC öngörür. İncelenen sayfalarda otomatik erişim, hız limiti veya veri yeniden kullanımı için yeterli bir makine-tüketim sözleşmesi bulunmadı. MGM’nin kullanım uyarısı da site bölümlerinin ve erişimin önceden haber verilmeden değişebileceğini söylüyor.

Bu şartlarda HTML parmak izi çıkaran bir cron, bakım yükünü azaltmaktan çok yanlış alarm ve sessiz hata riski yaratır. Bu nedenle repo içinde fetch yapan veya kamuya açık veriyi değiştiren bir prototip oluşturulmadı.

## Yanlış alarm ve kaçırma örnekleri

| Durum                                                   | Olası sonuç                                       | Güvenli davranış                                                                           |
| ------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Sayfa şablonu, menü veya genel haber değişir            | Rota dışı değişiklik “uyarı” gibi görünür.        | Teknik inceleme oluştur; koşul kaydı yayımlama.                                            |
| Ulusal yangın haberi değişir                            | Likya kapsamıyla ilgisiz değişiklik öncelik alır. | Yetkili yerel kaynaktan kapsam doğrula.                                                    |
| Yerel orman girişi kısıtlaması ulusal sayfada yer almaz | İzleyici değişiklik görmez.                       | Manuel yerel/resmî kontrol akışını sürdür.                                                 |
| Sayfa erişilemez veya yeniden tasarlanır                | “Uyarı yok” şeklinde yanlış yorumlanabilir.       | `monitor unavailable` olarak kaydet; halka açık kaydı değiştirme.                          |
| İki resmî kaynak çelişir                                | Anahtar kelime eşlemesi yanlış sonuç verir.       | Daha dar kapsamlı ve tarihli kaynak çözüme ulaşana kadar `unknown` veya bloklu durum koru. |

## İşletim maliyeti ve sorumluluk

Otomasyonun asgari maliyeti, her kaynak için erişim/izin doğrulaması, değişiklik ayıklama, hata izleme, rota kapsamı eşleme ve insan onayıdır. Mevcut kaynaklarda bu yükün sezon başı ve plan öne çıkarma öncesi manuel incelemeden düşük olacağı gösterilemedi.

Önerilen sahip: `Likya rehber editörü` rolü. Önerilen bildirim kanalı: mevcut geliştirme iş akışındaki izlenebilir bir inceleme kaydı (issue veya değişiklik talebi). Bildirim yalnızca kaynak bağlantısı, gözlem zamanı, teknik hata/değişiklik ve olası bölgeyi içermelidir; kamusal koşul verisini değiştiremez.

## Yeniden değerlendirme koşulları

Ancak aşağıdaki koşullardan sonra yeni bir spike açılabilir:

1. Kaynağın belgelenmiş API/feed’i, izin ve hız limiti bulunması.
2. Değişikliğin rota kapsamına anlamlı biçimde eşlenebildiğinin örneklerle gösterilmesi.
3. Başarısız fetch, sayfa düzeni değişikliği ve çelişkili kaynak için insan inceleme yolunun tanımlanması.
4. Bu işten sorumlu editör rolünün kabul edilmesi.
5. Spec 019 manuel akışının kesintisiz yedek olarak kalması.

Topluluk grupları, kişisel paylaşımlar, kitaplar, Wikiloc, konaklama işletmeleri ve giriş yapılmış sosyal ağlar otomatik izleme kapsamına alınmaz.
