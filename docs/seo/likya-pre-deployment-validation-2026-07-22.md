# Likya collection pre-deployment validation — 22 July 2026

This report records the MVP validation state for the final 29-page retained
Likya collection and its two retired overlap URLs. It is a pre-deployment
result: no deployment or Search Console outcome is claimed here.

## Outcome

The clean production build, complete generated-output validator, and
production-equivalent Netlify HTTP crawl passed. The collection retains 29
canonical pages, and all 177 editorial internal-link occurrences resolve to 30
unique direct HTTP 200 destinations. The 11 documented clean journal aliases
and two retired overlap URLs each make one permanent redirect to a direct HTTP
200 retained canonical.

| Check                                                             |                  Result |
| ----------------------------------------------------------------- | ----------------------: |
| Retained canonical pages                                          |              29/29 pass |
| Canonicals present once in sitemap                                |              29/29 pass |
| Self-referencing canonical tags                                   |              29/29 pass |
| Pages with exactly one H1 and logical headings                    |              29/29 pass |
| Valid Article JSON-LD and matching publication/modification dates |              29/29 pass |
| Valid BreadcrumbList JSON-LD                                      |              29/29 pass |
| Editorial internal links                                          | 177/177 direct HTTP 200 |
| Unique editorial destinations                                     |   30/30 direct HTTP 200 |
| Clean journal aliases                                             |     11/11 one `301` hop |
| Retired overlap URLs                                              |       2/2 one `301` hop |
| Route-guide series blocks                                         |              11/11 pass |
| Journal series blocks                                             |              11/11 pass |
| Third-party map embeds rendered                                   |           13/13 present |
| Retained video embeds rendered                                    |             1/1 present |

No collection source contains `yolacikmali.com`. Clean aliases are absent from
the sitemap and do not generate Gatsby pages. The two retired overlap URLs are
also absent from Gatsby and the sitemap. Every retained canonical occurs once
in the sitemap and returns HTTP 200 without a redirect.

## Commands and runtime

The repository-pinned Node 18.20.4 runtime was used for the clean build and
generated-output validation:

```text
npm --workspace site run clean
npm --workspace site run build
npm --workspace site run validate:seo:likya
```

The build completed successfully. Its existing non-blocking output still
includes Gatsby plugin compatibility, React Helmet migration, old
Browserslist data, and Babel deprecation warnings.

Netlify Dev 26.2.0 served `site/public` as a static site on localhost so its
checked `_redirects` artifact was active. The HTTP pass used:

```text
npm --workspace site run validate:seo:likya:http -- http://localhost:8888
```

Netlify Dev 26.2.0 was run with Node 24.14.1 because that CLI version raises a
`getRandomValues` error under Node 18. This does not affect the Node 18 Gatsby
production build.

## Canonicals, links, and structured data

The validator checks each inventory entry against its source frontmatter,
Gatsby page data, generated HTML, and sitemap entry. Each page has one
self-referencing canonical, one H1, one valid Article object whose
`mainEntityOfPage` matches the canonical, and one valid breadcrumb object whose
final item matches the canonical. Its visible publication and modification
dates also match the Article metadata.

The source crawl covers all Markdown editorial links in the 29 retained
articles. It rejects redirect sources, retired-domain references, and
destinations without generated HTML. The runtime pass independently requested
all 29 canonicals and 30 unique editorial destinations with redirect following
disabled; each returned HTTP 200 directly.

The two consolidated overlap paths are checked independently with redirect
following disabled:

| Retired URL                                     | Retained destination                     |                   Runtime result |
| ----------------------------------------------- | ---------------------------------------- | -------------------------------: |
| `/likya-yolu-yuruyus-rotasi/`                   | `/likya-yolu-rotasi/`                    | one `301` hop, then direct `200` |
| `/likya-yolu-oludenizden-ucagiza-11-gun-230km/` | `/likya-yolu-11-gunde-yurudugum-parkur/` | one `301` hop, then direct `200` |

All expected guide and journal series relationships and their rendered labels
are checked. Representative first, middle, and last guide and journal pages
were also rendered in Chrome at a true 390 px viewport. Their native links
remain visible and wrap. The already-recorded theme-shell width of 405 px at a
390 px viewport remains a separate baseline issue; it is not introduced by the
series blocks.

## Third-party embed status

Third-party availability is reported separately from internal-link health.
All 13 map iframe URLs and the one retained video iframe are present in both
source and rendered output.

| Page                                                      | Embed                 | Automated HTTP result |
| --------------------------------------------------------- | --------------------- | --------------------: |
| `/likya-yolu-rotasi-oludenizden-kabak-koyuna/`            | Wikiloc `11857759`    |                   403 |
| `/likya-yolu-rotasi-kabak-koyundan-sidyma-antik-kentine/` | Wikiloc `11866334`    |                   403 |
| `/likya-yolu-rotasi-sidymadan-karadereye/`                | Wikiloc `11873834`    |                   403 |
| `/likya-yolu-rotasi-karadereden-kinika/`                  | Wikiloc `11880735`    |                   403 |
| `/likya-yolu-rotasi-kinikdan-uzumluye/`                   | Wikiloc `11887850`    |          403 on retry |
| `/likya-yolu-rotasi-uzumluden-bezirgan-koyune/`           | Wikiloc `11922703`    |                   403 |
| `/likya-yolu-rotasi-bezirgandan-saribelene/`              | Wikiloc `11924089`    |                   403 |
| `/likya-yolu-rotasi-saribelenden-gokceorene/`             | Wikiloc `11924204`    |                   403 |
| `/likya-yolu-rotasi-gokceorenden-kasa/`                   | Wikiloc `11927609`    |                   403 |
| `/likya-yolu-rotasi-kasdan-kormen-adasina/`               | Wikiloc `11927799`    |                   403 |
| `/likya-yolu-rotasi-kormen-adasindan-kaleucagiza/`        | Wikiloc `11927952`    |                   403 |
| `/likya-yolu-rotasi/`                                     | Google Maps embed     |                   200 |
| `/likya-yolu-rotasi/`                                     | Wikiloc `10846819`    |                   403 |
| `/likya-yolu-11-gunde-yurudugum-parkur/`                  | YouTube `k2G3v7FS7gw` |                   200 |

Wikiloc rejected the automated HTTP client for all 12 requests. The rendered
iframe URLs and track identifiers are retained, but automated HTTP 403s cannot
establish interactive browser availability. They should be manually checked
in a deployed preview if Wikiloc availability is a release requirement.

## Follow-up findings

The final metadata pass resolved the earlier collection heading-outline
findings. The Gatsby/plugin compatibility, React Helmet migration,
Browserslist-age, Babel deprecation, and 390 px theme-shell overflow findings
remain unchanged baseline follow-up work.

## Search Console baseline

The comparison baseline remains
`docs/seo/search-console-baseline-2026-07-21.md`, covering 20 April–19 July 2026. It records 1,026 clicks, 216,979 impressions, 0.5% CTR, and average
position 7.8 property-wide. `/likya-yolu-rotasi/` records 275 clicks, 73,477
impressions, 0.4% CTR, and average position 6.2.

Those figures predate this undeployed collection work. Post-deployment results
must wait for complete Search Console windows and be recorded under plan item
12; this report makes no traffic, indexing, or CTR claim.
