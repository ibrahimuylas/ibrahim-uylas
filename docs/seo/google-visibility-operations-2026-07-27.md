# Google visibility operations — 27 July 2026

This is the operating record for the 90-day Turkish organic-search plan. It
separates completed changes from decisions that require a clean measurement
window.

## Completed now

- Marked `newsletter_signup` as a GA4 key event.
- Created the organic landing-page GA4 exploration documented in
  `docs/analytics/measurement-plan.md`.
- Reviewed the event payloads for `newsletter_signup` and
  `related_article_click`; both contain public page metadata only.
- Exported and classified all 84 Search Console exclusions in
  `indexing-inventory-2026-07-27.csv`.
- Rechecked all 19 historical 5xx examples. Seventeen return 200 directly and
  two redirect once to a 200 canonical URL. The validation started on 21 July
  remains active and must not be restarted.
- Removed `/authors/` and `/contact/` from the sitemap and added one-hop 301
  redirects to `/ibrahim-uylas-kimdir/` and `/iletisim/`.
- Refreshed `/turnalik-yaylasi/` and `/begendik-koyu/` without changing their
  public URL or title.
- Added descriptive alternatives to the empty informative images in Turnalık,
  Karacaköy, and Gebze Denizli Göleti. Buff, Likya Yolu, and Şavşat Karagöl had
  no empty Markdown image alternatives in their current article bodies.

No new article is commissioned in this cycle: the available evidence did not
identify an unmet query group with at least 500 impressions per 28 days and
verifiable first-hand material. The slot is therefore used for the two
evidence-backed refreshes.

## Frozen until a clean review

Do not change titles edited during 21–24 July before the first complete review
around 20–21 August. Do not mass-request indexing and do not resubmit the
successful 182-URL sitemap.

### 8 August

- Reopen the `Discovered – currently not indexed` group.
- Compare against the 40 rows in the inventory.
- Request indexing only for a small number of high-value canonical articles
  that remain excluded after live canonical, robots, sitemap, and content checks.

### 20–21 August

- Compare the first clean Search Console and GA4 windows.
- Evaluate CTR, position, impressions, engagement, related clicks, and key-event
  rate by organic landing page.
- Preserve a changed title when CTR improves without breaching a guardrail.
- Investigate when position worsens by more than one place or impressions fall
  by more than 15% without a demand explanation.

### 18 September

Apply the next refresh only after the second clean review:

1. `/acelle-yaylasi/` if CTR is still below 0.4%.
2. `/gebze-denizli-goleti/` if CTR is below 0.8% or engagement is below 15
   seconds.
3. Otherwise use `/savsat-karagol/` or `/buff-nedir-ne-ise-yarar/` when the July
   version has been recrawled and remains below target.

Before any `noindex,follow` or consolidation action, recheck the candidate
against 90-day clicks and impressions, external links, and its role in an
internal topic hub. Never delete a personal story.

## Scorecard

| Metric | Baseline | Target |
| --- | ---: | ---: |
| Search Console CTR | 0.4% | Toward 0.8% |
| Organic engagement rate | 27.1% | At least 35% |
| Average organic engagement | 21 seconds | At least 30 seconds |
| Related-article clicks / organic sessions | About 1.2% | At least 3% |
| Image Search clicks / comparable 28 days | 73 | At least 91 |
| Relevant referring domains | 5 known sites | 5 additional relevant domains |

Page CTR targets are Likya Yolu at least 0.7%, Gebze Denizli Göleti at least
0.8%, Acelle Yaylası at least 0.7%, and Buff at least 0.4%. Track Google
AI-feature impressions separately; the 4,727-impression 18 May–25 July range is
not yet a comparable 28-day baseline.

## Authority outreach tracker

Refreshed guides should be pitched as useful route, safety, or photo references,
not as generic guest-post inventory. Exclude paid links, reciprocal-link
schemes, and low-quality directories.

| Target type | Asset to offer | Qualification | Status |
| --- | --- | --- | --- |
| Hiking club | Turnalık or Beğendik dated route guide | Active site, relevant route resources, editorial link | Research |
| Regional tourism resource | Beğendik or Şavşat guide | Public visitor resource with maintained content | Research |
| Outdoor community | Gebze, Karacaköy, or Buff guide | Moderated resource page or useful discussion | Research |
| Owned Wikiloc profile | Matching embedded routes | Link must point to the exact supporting article | Ready to update |
| Photography/route resource | Image-led location guide | Original photographs and clear reuse/link policy | Prepare asset |

Record the target domain, contact date, exact asset, response, and acquired link
before counting a referring domain. The 90-day goal is five new relevant
domains, not five raw links.

## Delivery verification

For every deployment run:

```text
npm test
npm run build
npm run validate:html
npm run validate:seo
```

Then verify live canonical tags, robots directives, sitemap membership,
one-hop redirects, Article and Breadcrumb structured data, mobile rendering,
and the GA4 events in DebugView.
