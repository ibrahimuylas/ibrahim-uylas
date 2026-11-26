# Spec 053 — Yerel Likya rehberi önizleme modu

## Amaç

Kanonik rehberin genel yayın kapısı kapalıyken, editoryal ekip tüm ekranları
yerelde uçtan uca inceleyebilmelidir.

## Kapsam

- `npm run develop:likya-preview --workspace site` komutu yalnızca yerel
  geliştirme sunucusunda Likya rehber kabuğunu ve tarihsel etap ekranlarını
  görünür yapar.
- Normal `develop` ve production build akışları değişmez; `guide-meta` yayın
  kapısı genel erişim için tek otorite olmaya devam eder.

## Kabul kriterleri

- Önizleme bayrağı kapalıyken `foundation` durumundaki kanonik rehber açılmaz.
- Önizleme bayrağı açıkken `/likya-yolu-rotasi/` tüm rehber ekranlarını
  gösterir.
- Önizleme bayrağı açıkken korunan tarihsel etap sayfaları da incelenebilir.
- Pafta bazlı sayfalar kendi yayın kapısından bağımsız olarak açılmaz.
