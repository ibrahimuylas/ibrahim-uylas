# Blog analytics review

Reviewed on 21 July 2026 for `ibrahimuylas.com`.

## Executive summary

The blog has an established content library and GA4 is receiving traffic, but the
historical numbers are not yet reliable enough for content decisions. The tag was
recently corrected, no useful conversions had been recorded, and the initial
engagement metrics were unusually low. The immediate priority is therefore to
establish trustworthy measurement before optimising individual articles from the
data.

## Directional baseline

For 23 June–20 July 2026, GA4 reported:

| Metric                         |     Value |
| ------------------------------ | --------: |
| Sessions                       |       389 |
| Engaged sessions               |        42 |
| Engagement rate                |     10.8% |
| Average engagement per session | 3 seconds |
| Views per active user          |      1.39 |
| Key events                     |         0 |

These figures are a pre-verification baseline, not performance targets. They may
reflect the earlier tracking configuration as much as visitor behaviour.

## What is working

- The existing GA4 property and production web stream receive live traffic.
- The blog has enough evergreen route, camping, and equipment content to build
  useful topic clusters and internal journeys.
- Google Search Console is associated with the production GA4 property, enabling
  search-query and landing-page analysis after data has accumulated.
- GA4 enhanced measurement covers page views, engagement, scrolls, outbound
  clicks, and file downloads.

## Main weaknesses

- There was no conversion signal, so traffic could not be connected to a useful
  reader outcome.
- Related-article journeys were not measured, making it difficult to tell whether
  recommendations help readers discover more content.
- The initial engagement rate and time were too weak and potentially too
  distorted by the former setup to support confident editorial decisions.
- Article navigation, metadata labels, calls to action, and some embedded media
  needed mobile and accessibility improvements.

## Improvements completed

- Kept the existing production GA4 property and removed the accidental duplicate
  from the implementation path.
- Linked the production Search Console domain property to GA4.
- Added `newsletter_signup` and `related_article_click` event tracking without
  sending personal information.
- Limited the GA4 plugin to Netlify production builds so deploy previews and
  local development do not enter the production property.
- Replaced the retired browser-side Mailchimp endpoint with a Netlify function
  that keeps credentials private, uses double opt-in, and returns a recoverable
  error state instead of leaving the form loading indefinitely.
- Added an article contents navigation and improved Turkish metadata and
  newsletter copy.
- Improved embedded-video loading and accessibility attributes.
- Refreshed the priority canoe article with a clearer title, stable slug, summary,
  safety note, and navigable headings.

## Next measurement cycle

1. Verify the newsletter signup and `newsletter_signup` event after deployment.
2. `newsletter_signup` was marked as a key event on 27 July 2026; confirm new
   signups appear in the key-event column.
3. Allow at least 28 days of clean data before treating engagement changes as a
   trend.
4. Review landing pages by organic search traffic, engagement, related-article
   clicks, and newsletter signup rate.
5. Refresh and interlink the strongest route, camping, and equipment articles
   based on verified Search Console queries.

Event definitions and privacy rules are maintained in the
[analytics measurement plan](./measurement-plan.md).
