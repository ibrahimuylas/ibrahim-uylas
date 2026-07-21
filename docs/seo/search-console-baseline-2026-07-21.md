# Search Console baseline — 21 July 2026

This document records the pre-optimisation organic-search baseline for
`ibrahimuylas.com`. It is the reference point for the SEO work started on
21 July 2026.

The Search Console performance report was updated through 19 July 2026. The
indexing report was last updated on 10 July 2026. Consequently, this baseline
does **not** include the effect of the metadata, sitemap and indexing changes
deployed in commit `4e6c000` on 21 July 2026.

## Outcomes

The measurement cycle should answer four questions:

1. Did the new titles, descriptions and answer-first content improve CTR?
2. Did the clean sitemap and resolved server errors improve index coverage?
3. Which high-impression pages gained or lost clicks and ranking position?
4. Which query groups should be prioritised in the next content batch?

## Property-level baseline

### Last three months

The reporting period is 20 April–19 July 2026.

| Metric           |   Value |
| ---------------- | ------: |
| Clicks           |   1,026 |
| Impressions      | 216,979 |
| CTR              |    0.5% |
| Average position |     7.8 |

### Last 28 days

| Metric      | Value | Change from preceding period |
| ----------- | ----: | ---------------------------: |
| Clicks      |   259 |                         -19% |
| Impressions | 57.2k |                         -19% |

The 28-day decline predates the 21 July deployment and must not be attributed
to the new implementation. Seasonality, query demand and ranking movement must
be considered separately in future comparisons.

## Priority query baseline

| Query                               | Clicks | Impressions |   CTR | Position |
| ----------------------------------- | -----: | ----------: | ----: | -------: |
| likya yolu haritası                 |     41 |       4,337 |  0.9% |      1.2 |
| acelle yaylası                      |     33 |       9,897 |  0.3% |     10.0 |
| likya yolu                          |     30 |      19,617 |  0.2% |      8.0 |
| karacaköy göleti                    |     29 |         221 | 13.1% |      1.8 |
| denizli göleti                      |     27 |       6,402 |  0.4% |      4.4 |
| çatalca karacaköy göleti yol tarifi |     20 |         208 |  9.6% |      2.6 |
| likya yolu kaç km                   |     15 |      16,192 |  0.1% |      5.3 |
| denizli göleti yorumlar             |     15 |         355 |  4.2% |      2.3 |
| turnalık yaylası                    |     12 |       1,354 |  0.9% |      3.5 |
| çatalca karacaköy göleti            |     11 |         195 |  5.6% |      1.6 |

The clearest CTR opportunities are `likya yolu kaç km`, `likya yolu`,
`denizli göleti` and `acelle yaylası`. `likya yolu haritası` also warrants an
intent review because its position is very strong but its CTR remains below 1%.

## Priority landing-page baseline

| Landing page                                   | Clicks | Impressions |  CTR | Position |
| ---------------------------------------------- | -----: | ----------: | ---: | -------: |
| `/likya-yolu-rotasi/`                          |    275 |      73,477 | 0.4% |      6.2 |
| `/karacakoy-goleti/`                           |    149 |      10,091 | 1.5% |      5.8 |
| `/gebze-denizli-goleti/`                       |    130 |      26,815 | 0.5% |      6.4 |
| `/acelle-yaylasi/`                             |     60 |      16,727 | 0.4% |     10.0 |
| `/likya-yolu-rotasi-oludenizden-kabak-koyuna/` |     44 |       1,120 | 3.9% |      7.5 |
| `/evde-kano-yapimi/`                           |     38 |       1,212 | 3.1% |      5.9 |
| `/bolu-yedigoller/`                            |     20 |       2,046 | 1.0% |      9.4 |
| `/buff-nedir-ne-ise-yarar/`                    |     16 |      14,812 | 0.1% |      6.8 |
| `/turnalik-yaylasi/`                           |     16 |       2,100 | 0.8% |      4.7 |
| `/begendik-koyu/`                              |     15 |       1,628 | 0.9% |      8.8 |

## Technical-search baseline

| Area                            | Baseline                          |
| ------------------------------- | --------------------------------- |
| Indexed pages                   | 122                               |
| Not-indexed pages               | 43                                |
| Server error (5xx)              | 24; validation started on 21 July |
| Crawled — currently not indexed | 16                                |
| Redirected pages                | 3                                 |
| Submitted sitemap               | Successful                        |
| Search Console sitemap count    | 322 cached URLs                   |
| Live sitemap count              | 181 URLs                          |
| Core Web Vitals                 | 85 good mobile URLs; 0 poor       |
| HTTPS                           | 85 HTTPS URLs; 0 non-HTTPS        |
| Breadcrumb enhancement          | 80 valid; 0 invalid               |

The crawl report was updated on 20 July 2026 and showed 2,824 requests, a
276 ms average response time, no host problems, 93% HTTP 200 responses, 6%
HTTP 301 responses and 1% HTTP 404 responses. No active 5xx response category
was present.

## Targets and guardrails

### Initial target

- Raise property CTR from 0.5% to at least 0.8% after two complete 28-day
  post-deployment cycles.
- Use 1.0% as the subsequent directional target. At the current three-month
  impression volume, a 1.0% CTR would produce roughly 1,100 additional clicks
  compared with this baseline.

### Priority-page targets

| Landing page                | Baseline CTR | Initial target |
| --------------------------- | -----------: | -------------: |
| `/likya-yolu-rotasi/`       |         0.4% |         >=0.7% |
| `/gebze-denizli-goleti/`    |         0.5% |         >=0.8% |
| `/acelle-yaylasi/`          |         0.4% |         >=0.7% |
| `/buff-nedir-ne-ise-yarar/` |         0.1% |         >=0.4% |

CTR improvement is not sufficient if visibility falls. For every review,
record clicks, impressions, CTR and average position together. Flag a change
for investigation when average position deteriorates by more than one position
or impressions fall by more than 15% while comparable query demand is stable.

## Review checkpoints

### 7-day technical check — 28 July 2026

- [ ] Record the 5xx validation status.
- [ ] Confirm both hosts still report no crawl problems.
- [ ] Confirm the submitted sitemap remains successful.
- [ ] Check whether Search Console has reread the 181-URL sitemap.
- [ ] Record any new indexing reason or enhancement error.
- [ ] Do not judge title or content performance yet.

### 14-day discovery check — 4 August 2026

- [ ] Record indexed and not-indexed page totals.
- [ ] Review the 16 crawled-not-indexed URLs and classify valuable articles.
- [ ] Check whether priority pages have been recrawled.
- [ ] Record early CTR and position movement without treating it as a trend.
- [ ] Avoid another title rewrite unless a factual or technical defect exists.

### 28-day performance window — review on or after 20 August 2026

The first full post-deployment window closes on 18 August. Run the review at
least two days later to allow for Search Console reporting lag.

- [ ] Compare the latest 28 days with the preceding 28 days.
- [ ] Record property clicks, impressions, CTR and average position.
- [ ] Re-run the priority query and landing-page tables above.
- [ ] Separate CTR gains from ranking or demand changes.
- [ ] Review Turkey separately because it supplies 96% of current clicks.
- [ ] Record branded versus non-branded traffic; the baseline is 1%/99%.
- [ ] Select the next content batch using verified query/page results.

## Decision rules

- **Scale:** CTR improves and position/impressions remain stable; apply the
  successful content pattern to the next relevant pages.
- **Investigate:** CTR improves but impressions or position fall beyond the
  guardrails; inspect query mix, seasonality and cannibalisation.
- **Revise:** A priority page has been recrawled and completes two 28-day cycles
  without meaningful CTR improvement.
- **Wait:** The page has not been recrawled or the report still overlaps the
  pre-deployment period.
