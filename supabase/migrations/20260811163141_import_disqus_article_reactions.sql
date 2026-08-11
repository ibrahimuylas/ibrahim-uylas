-- Preserve aggregate article reaction counts from the 2026-08-11 Disqus export.
-- Visitor identities and individual votes are not available in the export/API.
with imported_articles as (
  select
    item ->> 'path' as path,
    item ->> 'title' as title,
    item -> 'counts' as counts
  from jsonb_array_elements(
    $disqus_reactions_20260811$
[
  {
    "path": "/2-seconds-easy-3-kamp-cadiri/",
    "title": "2 Seconds Easy 3 Kamp Çadırı",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 1,
      "sad": 0
    }
  },
  {
    "path": "/32.km-ilk-maraton-kosusu/",
    "title": "32.km - ilk maraton koşusu",
    "counts": {
      "like": 2,
      "funny": 2,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/abant-golunde-kamp-yapmali-mi/",
    "title": "Abant Gölünde Kamp Yapmalı mı?",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 0,
      "surprised": 3,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/acelle-yaylasi/",
    "title": "Acelle Yaylası",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/aktur-camping/",
    "title": "Aktur Camping",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ayi-sesi-mi-o/",
    "title": "Ayı Sesi mi O?",
    "counts": {
      "like": 0,
      "funny": 2,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/barakli-goleti/",
    "title": "Baraklı Göleti",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/bir-hayale-yolculuk-isle-of-skye/",
    "title": "Bir Hayale Yolculuk - Isle of Skye",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/borcka-karagol/",
    "title": "Borçka Karagöl",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/bozcaarmut-goleti/",
    "title": "Bozcaarmut Göleti",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/buff-nedir-ne-ise-yarar/",
    "title": "Buff Nedir, Ne İşe Yarar?",
    "counts": {
      "like": 13,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/carsak-ne-demek/",
    "title": "Çarşak Ne Demek",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/cehennem-selaleleri/",
    "title": "Cehennem Şelaleleri",
    "counts": {
      "like": 5,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/cliff-jacobson-ile-kampcilik/",
    "title": "Cliff Reis İle Kampçılık",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/doga-yuruyusleri-icin-gerekli-ekipmanlar/",
    "title": "Doğa Yürüyüşleri İçin Gerekli Ekipmanlar",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/doga-yuruyuslerinde-corap-tercihi/",
    "title": "Doğa Yürüyüşlerinde Çorap Tercihi",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/doga-yuruyuslerinde-dikkat-edilmesi-gerekenler/",
    "title": "Doğa Yürüyüşlerinde Dikkat Edilmesi Gerekenler",
    "counts": {
      "like": 4,
      "funny": 1,
      "love": 2,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/doga-yuruyuslerinde-nasil-giyinilmelidir/",
    "title": "Doğa Yürüyüşlerinde Nasıl Giyinilmelidir?",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/doga-yuruyusunun-faydalari-nelerdir/",
    "title": "Doğa Yürüyüşlerinin Faydaları",
    "counts": {
      "like": 0,
      "funny": 1,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/dogada-kamp-yapmak-guvenli-midir/",
    "title": "Doğada Kamp Yapmak Güvenli midir?",
    "counts": {
      "like": 11,
      "funny": 3,
      "love": 2,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/dogu-karadeniz-kampi/",
    "title": "Doğu Karadeniz Kampı",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/dupnisa-magarasi/",
    "title": "Dupnisa Mağarası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/el-yapimi-kamp-bicagi/",
    "title": "El Yapımı Kamp Bıçağı",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ercuva-yaylasi/",
    "title": "Ercuva Yaylası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/erfelek-tatlica-selaleleri/",
    "title": "Erfelek Tatlıca Şelaleleri",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/erikli-yaylasi-erikli-selalesi/",
    "title": "Erikli Yaylası - Erikli Şelalesi",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 0,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/evde-kano-yapimi/",
    "title": "Evde Kano Yapımı",
    "counts": {
      "like": 12,
      "funny": 1,
      "love": 3,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ferrino-lightent-2-kamp-cadiri/",
    "title": "Ferrino Lightent 2 Kamp Çadırı",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/four-ways-to-unlock-the-true-power-of-tv-through-programmatic/",
    "title": "Four ways to unlock the true power of TV through programmatic",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/gebze-denizli-goleti/",
    "title": "Gebze Denizli Göleti",
    "counts": {
      "like": 5,
      "funny": 0,
      "love": 2,
      "surprised": 0,
      "angry": 0,
      "sad": 2
    }
  },
  {
    "path": "/gtx-ayakkabi-ne-demek/",
    "title": "GTX Ayakkabı Ne Demek?",
    "counts": {
      "like": 11,
      "funny": 1,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/guvenli-kamp-atesi-icin-en-iyi-10-ipucu/",
    "title": "Güvenli Kamp Ateşi İçin En İyi 10 İpucu",
    "counts": {
      "like": 4,
      "funny": 0,
      "love": 0,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/how-to-use-technology-to-increase-your-productivity/",
    "title": "How to Use Technology to Increase Your Productivity",
    "counts": {
      "like": 0,
      "funny": 1,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ibrahim-uylas-kimdir-2014/",
    "title": "Kim Bu Adam? - 2014",
    "counts": {
      "like": 4,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ibrahim-uylas-kimdir/",
    "title": "Kim Bu Adam?",
    "counts": {
      "like": 16,
      "funny": 0,
      "love": 3,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/igneada-kampi/",
    "title": "İğneada Kampı",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/iki-kisilik-uyku-tulumu-hakkinda/",
    "title": "İki Kişilik Uyku Tulumu Hakkında",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/iskoc-yaylalari-ben-nevis-2.-bolum/",
    "title": "İskoç yaylaları - Ben Nevis 2. Bölüm",
    "counts": {
      "like": 6,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/iskoc-yaylalari-inverness-1.-bolum/",
    "title": "İskoç yaylaları - Inverness 1. Bölüm",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/iskoc-yaylalari-isle-of-skye-3.-bolum/",
    "title": "İskoç yaylaları - Isle of Skye 3. Bölüm",
    "counts": {
      "like": 8,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/iskoc-yaylalari-nc500-rotasi-4.-bolum/",
    "title": "İskoç yaylaları - NC500 Rotası 4. Bölüm",
    "counts": {
      "like": 7,
      "funny": 0,
      "love": 0,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/iznik-sansarak-kanyonu/",
    "title": "İznik Sansarak Kanyonu",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/kackar-daglari-naletleme-gecidi/",
    "title": "Kaçkar Dağları Naletleme Geçidi",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/kamp-hayatina-bulasmak-ister-misiniz/",
    "title": "Kamp Hayatına Bulaşmak İster misiniz?",
    "counts": {
      "like": 5,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/karacakoy-goleti/",
    "title": "Karacaköy Göleti",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/karlik-yaylasi/",
    "title": "Karlık Yaylası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/kaya-ustu-yaylasi-kampi/",
    "title": "Arabayla Kaya Üstü Yaylası mı? Sakın!!!",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/kilimli-koyu/",
    "title": "Kilimli Koyu",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/likya-parkuru-sirt-cantam/",
    "title": "Likya Parkuru Sırt Çantam",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/likya-yolu-1-gun/",
    "title": "Likya Yolu 1. Gün",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/likya-yolu-11-gunde-yurudugum-parkur/",
    "title": "Likya Yolu 11 Günde Yürüdüğüm Parkur",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 1
    }
  },
  {
    "path": "/likya-yolu-8.-gun/",
    "title": "Likya Yolu 8. Gün",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/likya-yolu-rotasi-oludenizden-kabak-koyuna/",
    "title": "Likya Yolu Rotası Ölüdeniz'den Kabak Koyuna",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/likya-yolu-rotasi/",
    "title": "Likya Yolu Rotası",
    "counts": {
      "like": 31,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 1,
      "sad": 0
    }
  },
  {
    "path": "/lowa-zephyr-gtx-mid-bot-sage/",
    "title": "Yeni Botlarım LOWA ZEPHYR",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/menekse-yaylasi/",
    "title": "Menekşe Yaylası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/neden-yola-cikmali/",
    "title": "Neden Yola Çıkmalı?",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/olgunlar-meretet-yaylasi/",
    "title": "Olgunlar(Meretet) Yaylası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/ormandan-gelen-ciglik/",
    "title": "Ormandan Gelen Çığlık",
    "counts": {
      "like": 1,
      "funny": 1,
      "love": 0,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/outdoor-ne-demek/",
    "title": "Outdoor Ne Demek?",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 1,
      "angry": 1,
      "sad": 0
    }
  },
  {
    "path": "/papaz-cayiri/",
    "title": "Papaz Çayırı",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/patara-plaji/",
    "title": "Patara Plajı",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/purenli-yaylasi/",
    "title": "Pürenli Yaylası",
    "counts": {
      "like": 0,
      "funny": 1,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/rubicon-bir-baska-hayalin-baslangici/",
    "title": "Rubicon Bir Başka Hayalin Başlangıcı",
    "counts": {
      "like": 8,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/safranbolu-tokatli-kanyonu/",
    "title": "Safranbolu Tokatlı Kanyonu",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/saklikent-kanyonu/",
    "title": "Saklıkent Kanyonu",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 2,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/scottish-highlands-inverness-1.-bolum/",
    "title": "Scottish Highlands - Inverness 1. Bölüm",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/serindere-kanyonu-kamp-alani/",
    "title": "Serindere Kanyonu",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/sicakdere-kanyonu/",
    "title": "Sıcakdere Kanyonu",
    "counts": {
      "like": 0,
      "funny": 1,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/sile-sakligol/",
    "title": "Şile Saklıgöl",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/sinekli-yaylasi/",
    "title": "Sinekli Yaylası",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/son-6dk/",
    "title": "Son 6dk",
    "counts": {
      "like": 4,
      "funny": 0,
      "love": 2,
      "surprised": 1,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/su-gecirmez-yuruyus-tozlugu/",
    "title": "Su Geçirmez Yürüyüş Tozluğu",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/suluklu-gol-azrail-teget-gecti/",
    "title": "Sülüklü Göl'de Azrail Teğet Geçti",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/tarakli-karagol-yaylasi/",
    "title": "Taraklı Karagöl Yaylası",
    "counts": {
      "like": 4,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/tchibo-polar-buff/",
    "title": "Tchibo Polar Buff",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/tek-basina-iskoc-yaylalarinda-29-gunde-5500km/",
    "title": "Tek Başına İskoç Yaylalarında 29 Günde 5500km",
    "counts": {
      "like": 7,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/the-north-face-m-storm-hike-gtx-erkek-ayakkabi-t932zs/",
    "title": "The North Face M Storm Hike Erkek Ayakkabı",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/trabzon-uzungol/",
    "title": "Trabzon Uzungöl",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/trekking-ile-hiking-arasindaki-farklar-nelerdir/",
    "title": "Trekking ile Hiking Arasındaki Farklar Nelerdir?",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/trekking-nedir-slug-optional/",
    "title": "Trekking Nedir",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/turnalik-yaylasi/",
    "title": "Turnalık Yaylası",
    "counts": {
      "like": 6,
      "funny": 1,
      "love": 0,
      "surprised": 0,
      "angry": 1,
      "sad": 0
    }
  },
  {
    "path": "/uyku-tulumu-alirken-nelere-dikkat-edilmelidir/",
    "title": "Uyku Tulumu Alırken Nelere Dikkat Edilmelidir",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/uyku-tulumu-yetersiz-kalirsa-ne-yapilmalidir/",
    "title": "Uyku Tulumu Yetersiz Kalırsa Ne Yapmalıyım?",
    "counts": {
      "like": 1,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/yedigoller-trekking-tek-basima-ilk-yolculuk/",
    "title": "Bolu Yedigöller Tek Başıma İlk Trekking Maceram",
    "counts": {
      "like": 2,
      "funny": 0,
      "love": 2,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/yukari-kavrun-yaylasi/",
    "title": "Yukarı Kavrun Yaylası",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/yuruyus-batonu-ne-ise-yarar/",
    "title": "Yürüyüş Batonu Nedir, Nasıl Olmalıdır?",
    "counts": {
      "like": 3,
      "funny": 0,
      "love": 0,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  },
  {
    "path": "/yuvacik-iznik-trekking/",
    "title": "İznik Trekking",
    "counts": {
      "like": 0,
      "funny": 0,
      "love": 1,
      "surprised": 0,
      "angry": 0,
      "sad": 0
    }
  }
]
    $disqus_reactions_20260811$::jsonb
  ) as source(item)
), upserted_threads as (
  insert into public.article_reaction_threads(path, title)
  select path, title
  from imported_articles
  on conflict (path) do update set
    title = excluded.title,
    updated_at = now()
  returning id, path
)
insert into public.article_reaction_totals(
  thread_id,
  reaction,
  imported_count,
  updated_at
)
select
  threads.id,
  totals.reaction,
  totals.imported_count,
  now()
from upserted_threads threads
join imported_articles imported using (path)
cross join lateral jsonb_each_text(imported.counts) as values_by_reaction(reaction, imported_count_text)
cross join lateral (
  select
    values_by_reaction.reaction,
    values_by_reaction.imported_count_text::integer as imported_count
) totals
where totals.reaction in ('like', 'funny', 'love', 'surprised', 'angry', 'sad')
on conflict (thread_id, reaction) do update set
  imported_count = excluded.imported_count,
  updated_at = now();
