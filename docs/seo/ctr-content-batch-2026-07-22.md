# Search Console CTR content batch — 22 July 2026

This batch targets four non-Likya landing pages with strong Google visibility
but unusually low click-through rates. The source period is 20 April–19 July
2026, before the changes below.

## Page baseline

| Page                    | Clicks | Impressions |  CTR | Position | Initial CTR target |
| ----------------------- | -----: | ----------: | ---: | -------: | -----------------: |
| `/barakli-goleti/`      |      2 |       5,493 | 0.0% |      7.4 |             >=0.5% |
| `/savsat-karagol/`      |     13 |       8,233 | 0.2% |      7.5 |             >=0.7% |
| `/cehennem-selaleleri/` |     11 |       4,176 | 0.3% |      8.7 |             >=0.7% |
| `/bozcaarmut-goleti/`   |      5 |       1,900 | 0.3% |      5.0 |             >=1.0% |

Targets are directional. CTR must be reviewed together with impressions and
average position, using the guardrails in the main Search Console baseline.

## Query evidence

### Baraklı Göleti

- `baraklı göleti`: 2,703 impressions, 0 clicks, position 7.0.
- `baraklı göleti yol tarifi`: 376 impressions, 0 clicks, position 4.8.
- `baraklı göleti nerede`: 66 impressions, 0 clicks, position 4.6.

### Şavşat Karagöl

- `artvin karagöl yol tarifi`: 1,195 impressions, 0 clicks, position 4.1.
- `şavşat yol tarifi`: 1,170 impressions, 1 click, 0.1% CTR, position 6.8.
- `şavşat karagöl yol tarifi`: 673 impressions, 6 clicks, 0.9% CTR,
  position 3.3.

### Cehennem Şelaleleri

- `cehennem şelaleleri`: 2,044 impressions, 0 clicks, position 10.8.
- `cehennem şelaleleri fotoğraflar`: 417 impressions, 1 click, 0.2% CTR,
  position 1.7.
- `cehennem şelalesi nerede`: 142 impressions, 0 clicks, position 7.8.

### Bozcaarmut Göleti

- `bozcaarmut göleti`: 1,176 impressions, 1 click, 0.1% CTR, position 2.0.
- `bozcaarmut göleti kaç km`: 94 impressions, 0 clicks, position 8.3.
- `bilecik bozcaarmut göleti`: 73 impressions, 0 clicks, position 3.3.

## Implementation

- Preserve every existing URL with an explicit frontmatter slug before changing
  article titles.
- Rewrite titles around the demonstrated location, directions, camping,
  walking and photo intent while keeping them short enough for the site-title
  suffix.
- Put the route answer and known distance near the beginning of each article.
- Surface the date of old field observations before fee, facility and road
  details, with a clear instruction to verify current conditions.
- Replace empty image alt text with descriptive, page-specific alternatives.
- Repair heading hierarchy so the primary article sections use level-two
  headings and their subsections use level-three headings.

## Review dates

- **21 August 2026:** First complete 28-day window; check recrawl status and
  record early clicks, impressions, CTR and position without declaring a trend.
- **18 September 2026:** Second complete 28-day window; compare against this
  baseline and decide whether to keep, revise or scale the pattern.

Avoid another title change before the first review unless Google has recrawled
the page and a factual or technical defect is found.
