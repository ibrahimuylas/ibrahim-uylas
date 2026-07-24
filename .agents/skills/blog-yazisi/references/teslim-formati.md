# Teslim formatı

Tek bir Markdown yanıtında aşağıdaki sırayı kullan.

## 1. SEO özeti

- **Önerilen başlık**
- **Slug**
- **Meta açıklaması** — yaklaşık 120-160 karakter; doğal ve sayfaya özel
- **Ana sorgu**
- **Destekleyici sorgular**
- **Kategori**
- **Önerilen iç bağlantılar** — yalnızca repoda bulunan sayfalar

## 2. Yayına hazır yazı

Kopyalanabilir bir `mdx` kod bloğu ver. Projenin ön yüz yapısını kullan:

```mdx
---
title: Yazı başlığı
slug: ascii-kebab-case
description: "Sayfaya özel meta açıklaması"
date: YYYY-MM-DDTHH:mm:ss.sssZ
featured: false
private: false
author: İbrahim Uylaş
category: Kategori
thumbnail: seo-uyumlu-banner-dosya-adi.webp
thumbnailText: Bannerın kısa ve gerçek açıklaması
tags:
  - "#etiket"
keywords:
  - ana sorgu
---

Giriş...
```

Taslak aşamasında yayın tarihi bilinmiyorsa `date: YAYIN_TARIHI` yaz; tarih uydurma.

Görsel yer tutucularını, açıkladıkları fikrin ilk kez anlatıldığı paragrafın hemen arkasına şu biçimde ekle. Görselleri otomatik olarak bölüm sonuna yığma:

```md
![Görselde gerçekten görülecek içeriğin açıklaması](seo-uyumlu-dosya-adi.webp "Kısa görsel başlığı")

*Gerekliyse tek cümlelik caption.*
```

## 3. Görsel planı

| No | Yerleşim | Görsel | Dosya adı | Alt metin | Caption |
|---|---|---|---|---|---|
| Banner | Yazının üstü | Kullanıcının fotoğrafından hazırlanacak sahne | `...-banner.webp` | ... | — |
| 1 | İlgili açıklayıcı paragrafın hemen sonrası | ... | `....webp` | ... | ... |

Banner için kadraj ve boşluk yönünü belirt. Kullanıcı kendi fotoğrafını kullanacaksa yeni yüz veya yapay kişi üretme.

## 4. AI görsel promptları

Banner dışındaki her AI görseli için ayrı başlık ve Stitch'e doğrudan kopyalanabilir bağımsız bir prompt bloğu ver. Banner promptunu yalnızca kullanıcı açıkça isterse aynı formatta ekle.

Her promptta kısa ve somut cümlelerle şu sırayı kullan:

1. Sahne ve ana nesne
2. Kompozisyon ve kamera açısı veya infografik düzeni
3. Işık, renk ve premium outdoor editoryal görsel dil
4. 3:2 yatay oran ve en az 1600 piksel genişlik
5. Yasaklar: logo, filigran, bozuk anatomi, anlamsız metin

Promptları başka görsellere veya önceki promptlara atıf yapmadan kendi başına anlaşılır yaz. Stil tutarlılığını sağlamak için aynı estetik tanımını her promptta açıkça tekrarla. İnfografiklerde yalnızca gerekli Türkçe etiketleri tırnak içinde eksiksiz ver; diğer görsellerde metin isteme. Dosya adı, WebP dönüşümü, sıkıştırma, SEO açıklaması veya promptun nasıl kullanılacağı gibi üretim sonrası bilgileri promptun içine koyma.

Prompttan sonra şu yayın notunu yalnızca bir kez ver:

> Görselleri yayın öncesinde belirtilen dosya adlarıyla WebP'ye dönüştürün; gözle fark edilmeyecek ölçüde sıkıştırın ve genişliği en az 1400 piksel koruyun.

## 5. Son kontrol

Kısa bir kontrol listesi ver:

- Kullanıcı deneyimleri doğru aktarıldı
- Teknik iddialar doğrulandı
- Yayımlanmamış içeriklere bağlantı verilmedi
- Görsel yolları ve dosya adları birbiriyle eşleşiyor
- Yorum çağrısı doğal ve konuya özel
