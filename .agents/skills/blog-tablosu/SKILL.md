---
name: blog-tablosu
description: MDX blog yazılarındaki Markdown tablolarını responsive, erişilebilir ve sitenin mevcut CSS yapısıyla uyumlu biçimde hazırlama becerisi. Blog içeriğinde karşılaştırma, teknik özellik, rota veya zaman çizelgesi tablosu varsa kullan.
---

# Blog tablosu

Bir MDX yazısında tablo varsa bu beceriyi kullan.

## Zorunlu yapı

Çıplak Markdown tablosu bırakma. Her tabloyu sitenin mevcut responsive sarmalayıcısı içine al:

```mdx
<div className="comparison-table" role="region" aria-label="Tablonun kısa ve benzersiz açıklaması" tabIndex="0">

| Başlık | Değer |
|---|---|
| Örnek | İçerik |

</div>
```

- `aria-label` tablonun içeriğini tarif etmeli; aynı yazı içinde tekrarlanmamalı.
- İki sütunlu tablolarda `comparison-table comparison-table--two-column` sınıflarını birlikte kullan; üç veya daha fazla sütunlu uzun rota ve zaman tablolarında `comparison-table--wide` sınıfını ekle.
- İlk satır tablo başlığı olmalı ve sütun sayısı bütün satırlarda aynı kalmalı.
- Hücrelerde uzun cümleleri kısalt; karşılaştırmayı paragraf yerine tabloya uygun kısa ifadelerle ver.
- Üçten fazla sütun veya uzun rota/zaman verisi varsa yatay kaydırmayı koru; hücreleri ekran dışına taşıracak sabit genişlikler ekleme.
- Tabloyu sırf görsel çeşitlilik için değil, en az üç karşılaştırılabilir veri olduğunda kullan.
- Tablo içeriğiyle ilgili açıklamayı tablonun öncesindeki kısa paragrafta ver; tabloyu uzun açıklamalarla doldurma.

## Kontrol

- `rg -n '^\\|.*\\|$' site/content/posts -g '*.mdx'` ile çıplak tabloları ara.
- Her eşleşmenin üstünde `comparison-table` sarmalayıcısı olduğunu kontrol et.
- `git diff --check` ve site üretim derlemesini çalıştır.
- Masaüstü ve dar ekran görünümünde başlıkların, uzun değerlerin ve yatay kaydırmanın taşmadığını kontrol et.
