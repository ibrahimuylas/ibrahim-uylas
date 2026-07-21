# Search Console indexing recovery — 21 July 2026

This document records the implementation and external validation state for the
indexing-recovery work. Search Console's Page indexing report was last updated
on 10 July 2026, so its totals do not yet reflect the changes deployed or
verified on 21 July.

## Current outcome

| Area                            |         Search Console | Live verification                                       | Action                                              |
| ------------------------------- | ---------------------: | ------------------------------------------------------- | --------------------------------------------------- |
| Server error (5xx)              | 24 historical examples | All 24 finish on HTTP 200                               | Validation started 21 July; wait for Google         |
| Crawled — currently not indexed |            16 examples | 7 archives, 5 redirecting aliases, 4 canonical articles | Archives set to `noindex,follow`; articles retained |
| Page with redirect              |    3 homepage variants | All redirect to `https://www.ibrahimuylas.com/`         | Intentional canonicalisation; no fix required       |
| Sitemap                         |        322 cached URLs | 181 live URLs                                           | Successful submission; wait for Google to reread    |
| Internal Markdown links         |           Not reported | All resolve directly with HTTP 200                      | Legacy redirects and 404 targets corrected          |

## Crawled — currently not indexed classification

### Intentional archive exclusions

These seven URLs are tag, author or paginated archive pages rather than unique
landing pages:

| URL                               | Classification      |
| --------------------------------- | ------------------- |
| `/tag/batinkampyerleri/`          | Tag archive         |
| `/author/ibrahim-uylas/page/3/`   | Author pagination   |
| `/tag/kampyerleriverotalar/`      | Tag archive         |
| `/category/rotalar/page/9/`       | Category pagination |
| `/tag/yuruyusekipmanlari/page/2/` | Tag pagination      |
| `/tag/sinopkampyerleri/`          | Tag archive         |
| `/tag/yolhikayeleri/page/7/`      | Tag pagination      |

Tag, author and paginated archive pages are excluded from the sitemap and now
emit `robots: noindex,follow`. The footer links that previously promoted the
Trekking and Hiking tag archives now point to the corresponding evergreen
guides instead.

### Redirecting article aliases

These five Search Console examples omit the site's canonical trailing slash.
Each now redirects once to an HTTP 200 canonical article, and each canonical
URL is present in the live sitemap:

| Search Console example                 | Canonical target                        |
| -------------------------------------- | --------------------------------------- |
| `/trekking-ayakkabisi-nasil-olmali`    | `/trekking-ayakkabisi-nasil-olmali/`    |
| `/lowa-zephyr-gtx-mid-bot-sage`        | `/lowa-zephyr-gtx-mid-bot-sage/`        |
| `/yalova-fistikli-trekking`            | `/yalova-fistikli-trekking/`            |
| `/doga-yuruyusunun-faydalari-nelerdir` | `/doga-yuruyusunun-faydalari-nelerdir/` |
| `/su-gecirmez-yuruyus-tozlugu`         | `/su-gecirmez-yuruyus-tozlugu/`         |

These aliases should not themselves be indexed. Search Console may eventually
reclassify them as redirects while their canonical targets remain eligible.

### Canonical articles to retain

These four examples are canonical, return HTTP 200 without a redirect and are
included in the live sitemap:

| URL                                    | Assessment                                                               |
| -------------------------------------- | ------------------------------------------------------------------------ |
| `/iskoc-yaylalari-inverness-1.-bolum/` | Substantive first-person travel article; retain                          |
| `/ferrino-cadir-kazigi/`               | Thin equipment note expanded with use cases and a clear decision summary |
| `/kackar-daglari-anlik-bilinc-kaybi/`  | Substantive first-person mountain story; retain                          |
| `/ya-kampta-biri-kaybolursa/`          | Substantive first-person safety story with video; retain                 |

The thin `/yalova-fistikli-trekking/` canonical target was also expanded with
a route summary, freshness warning, planning guidance and contextual links.

## Historical 5xx validation set

All 24 examples below were checked on 21 July. Every request finishes on HTTP
200; the two forms without a trailing slash redirect once to the slash version.

- `/menekse-subatimi-yaylasi-kampi/`
- `/sile-sakligol/`
- `/2-seconds-easy-3-kamp-cadiri/`
- `/likya-parkuru-sirt-cantam/`
- `/inonu-yaylasindan-aytepeye-trekking/`
- `/likya-yolu-rotasi-kinikdan-uzumluye/`
- `/serindere-kanyonu-kamp-alani/`
- `/uyku-tulumu-alirken-nelere-dikkat-edilmelidir`
- `/papaz-cayiri/`
- `/category/diger-her-sey/`
- `/iskoc-yaylalari-nc500-rotasi-4.-bolum/`
- `/author/ibrahim-uylas/`
- `/karlik-yaylasi/`
- `/esenkoy-delmece-yaylasi-narli-trekking/`
- `/likya-yolu-rotasi-gokceorenden-kasa/`
- `/suluklu-gol-azrail-teget-gecti`
- `/uyku-tulumu-alirken-nelere-dikkat-edilmelidir/`
- `/likya-yolu-rotasi-kormen-adasindan-kaleucagiza/`
- `/dag-basinda-bekle-geliyorum/`
- `/trabzon-uzungol/`
- `/suluklu-gol-azrail-teget-gecti/`
- `/msr-pocket-rocket-kamp-ocagi/`
- `/dagin-basinda-da-dunya-kucukmus/`
- `/yuvacik-iznik-trekking/`

Search Console shows **Validation Started**, with a start date of 21 July 2026.
Google controls the completion date, so this item remains externally pending.

## Internal crawl-path corrections

The implementation removes avoidable crawl waste by:

- adding trailing slashes to navigation and article links;
- replacing links to the retired `yolacikmali.com` domain with current local
  article paths;
- correcting legacy Likya route and daily-log paths that returned 404;
- removing two empty links to unavailable legacy image URLs; and
- replacing a broken `/yol-hikayeleri/` link with a relevant canonical article.

After the corrections, every unique internal Markdown destination tested
against the live site returns HTTP 200 with zero redirects.

## Follow-up checks

- **28 July 2026:** Check whether 5xx validation has passed and whether Search
  Console has reread the sitemap.
- **4 August 2026:** Confirm archive examples begin moving to excluded-by-noindex
  and review recrawl status for the four canonical articles.
- **On or after 20 August 2026:** Compare the first complete 28-day performance
  window with the baseline in
  `docs/seo/search-console-baseline-2026-07-21.md`.

Do not start validation for the archive or redirect groups. Their exclusion is
intentional; only canonical article coverage and the historical 5xx validation
need to improve.
