# Site performance review — 27 July 2026

## Delivered

- Replaced eager article embeds with centralized deferred components:
  YouTube loads on click; route/map embeds load near the viewport and retain a
  manual fallback.
- Deferred Disqus code and network activity until the comments area approaches
  the viewport or the reader asks to load it.
- Added reserved embed heights and contextual spinners to reduce layout shift
  and make slow third-party content understandable.
- Reduced homepage GraphQL data by limiting each category to the six cards the
  active layout can display, removing unused author fields, and requesting only
  the image rendition each card or hero uses.
- Replaced Google-hosted Inter and DM Serif Display with four local WOFF2
  subsets using `font-display: swap`.
- Added 10-second client and 8-second server newsletter timeouts, sanitized
  failures, and server tests.
- Added durable Netlify CDN caching to successful Instagram feed responses.
- Increased the production build worker count from one to two after a clean
  benchmark.

## Measurements

| Check                                      |  Before |           After | Result                      |
| ------------------------------------------ | ------: | --------------: | --------------------------- |
| Homepage `page-data.json`                  |  378 KB |          140 KB | 63% smaller                 |
| Clean Gatsby build                         |   242 s |           210 s | 13% faster                  |
| Google Fonts hosts in generated output     | Present |               0 | Removed                     |
| Initial YouTube iframes on checked article |       1 |               0 | Request deferred            |
| Initial route iframes on Aytepe            |      14 | 1 near viewport | 13 requests deferred        |
| Initial Disqus iframes                     |       1 |               0 | Request and bundle deferred |

The final build generated 330 pages. Browser checks covered 1440 × 1000 and
390 × 844 viewports in light and dark modes. The mobile document width matched
its viewport, and the browser console had no warnings or errors.

## Reliability and remaining risk

The production dependency audit reports 78 transitive findings (21 low,
23 moderate, and 34 high). Most are in the Gatsby 5 build toolchain, Gatsby's
Sharp 0.32 integration, and Decap CMS dependencies. The available automated
fixes propose incompatible Gatsby package downgrades, while current Decap CMS
requires React 19. Those changes were intentionally not forced into this
performance delivery.

A future isolated migration should evaluate React 19/Decap CMS together and
track Gatsby support for Sharp 0.35+. Until then, the site runtime improvements
in this change avoid adding new third-party execution to article startup.
