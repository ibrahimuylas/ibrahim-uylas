# Validate and launch the Likya guide

**Type:** Quality and release

**Priority:** P1 — the guide must be complete, responsive and trustworthy before replacing the canonical page experience

**Risk:** High

## Goal

Integrate and validate all P1 Likya guide work, then prepare a controlled public release without changing unrelated site behavior.

## Release Gate

Do not market or label the guide as complete until:

- the official route inventory is complete;
- West, Central and East coverage is complete;
- 3/5/7/full plan records are reviewed;
- the planner has no unsupported result state;
- preparation and first-hand archive paths are connected;
- freshness statuses exist for every stage and plan;
- responsive, accessibility, link, build and SEO checks pass.

Implementation may be merged in smaller changes, but the canonical-page composition should switch publicly only when the core guide gate passes or behind an explicit non-indexed preview mechanism.

## Automated Validation

Add repository-native commands, using Node's built-in test runner where practical:

- `validate:likya:data`: Spec 009 entity/source integrity.
- `test:likya:planner`: table-driven matching and no-match cases.
- `validate:likya:freshness`: Spec 019 status rules.
- `validate:likya:links`: all internal Likya URLs, previous/next, plan/stage and archive links.
- existing `validate:seo:likya` and HTTP canonical checks.
- production Gatsby build and HTML validation.

Avoid adding a large test framework solely for this feature.

## Functional Test Matrix

### Guide shell

- Both hero CTAs reach the correct focused section.
- 3/5/7/full quick links resolve.
- Historical archive and reactions/comments appear in the intended order.
- Normal non-Likya posts still use the unchanged generic post template.

### Planner

- Representative valid combination for every primary and alternative plan.
- Unsupported season, experience and lodging combinations.
- Back/edit/reset behavior.
- Invalid/stale shared URL.
- Copy link and print summary.
- No-JavaScript fallback.

### Atlas

- Complete section count/order.
- Each region and filter.
- No-result recovery.
- Deferred map load, map failure and external GPS action.
- Map/list selection synchronization.

### Stage and plan pages

- Previous/next boundaries.
- Route variant and source labels.
- Historical/current separation.
- Review-due and official-notice states.
- Missing optional elevation/GPS/service fields.

### Preparation and archive

- Checklist modes, persistence, reset and print.
- Archive chronology and matching current-stage links.
- Existing canonical dotted journal URLs and legacy redirects.

## Responsive QA Matrix

Validate at minimum:

- 390×844 mobile portrait;
- 844×390 mobile landscape;
- 768×1024 tablet portrait;
- 1024×768 tablet landscape;
- 1280×800 desktop;
- 1440×900 wide desktop.

At every viewport verify:

- global header/mobile navigation and theme controls;
- hero image crop, H1 line breaks and CTA layout;
- planner controls and focus order;
- atlas filters, route cards and map bounds;
- day-plan/stage flow;
- status panels, long place names and source links;
- comments/reactions/footer handoff;
- no viewport-level horizontal overflow.

Capture before/after references using the current `/category/rotalar/` page and normal post screens. Visual QA must compare like-for-like viewport screenshots, not rely on memory.

## Accessibility Gate

- WCAG 2.2 AA target for new interactions.
- One H1 and logical headings.
- Full keyboard completion of planner, filters, disclosures, map alternatives and checklist.
- Visible focus in light/dark themes.
- Correct link/button semantics and fieldset/legend grouping.
- Screen-reader announcement for planner progress, validation errors and filter result count.
- 48×48 px touch targets.
- Contrast verified for normal, selected, disabled, warning and freshness states.
- `prefers-reduced-motion` respected.
- No critical information available only by color, hover, map or animation.

## Performance Gate

- Core route/plan content is server-rendered.
- Third-party maps and GPS embeds are deferred and never all load at once.
- No guide-wide image is served at original dimensions when responsive variants exist.
- Avoid a new client state/runtime dependency for simple local filtering.
- Compare mobile Lighthouse or equivalent lab results against the pre-change canonical page. Investigate a performance-score regression greater than five points.
- Target CLS below 0.1 in lab runs and reserve map/image space.
- Planner input must respond immediately with local data; no network request is required to calculate a result.

## SEO and Link Gate

- `/likya-yolu-rotasi/` remains canonical for planner query states.
- No duplicate indexable result/filter URLs.
- Unique purpose/title/description for stage and plan pages.
- Server-rendered short answers for route distance/variants, duration, start/end and guide scope.
- Structured data reflects only visible content; use `ItemList`/breadcrumb relationships where valid and FAQ markup only for visible reviewed FAQs.
- Sitemap contains retained canonical pages only.
- All 31-page legacy-cluster links and new guide links resolve to HTTP 200 or one documented permanent redirect.
- Third-party embeds/links have accessible titles and valid destinations.

## Content and Safety Review

Editorial review must confirm:

- every factual route claim has a source or dated first-hand attribution;
- official pafta versus walking-stage language is consistent;
- no old price, water, business, transport or restriction appears current;
- every recommendation states exclusions and current checks;
- route totals/variants do not conflate 509, 465, 430, 230 or the verified official/current total;
- book/community content is paraphrased appropriately and not copied;
- no “safe/open” inference is made from missing warning data;
- Turkish place names, apostrophes, units and direction labels are consistent.

## Analytics QA

- Events from Spec 008/011 fire once per intended action.
- No free text, exact private dates or checklist state is sent.
- Result IDs and duration/season bands match data records.
- Normal page-view and related-article analytics remain unaffected.

## Rollout and Recovery

1. Capture current canonical-page screenshots, Search Console baseline and build output.
2. Preview the complete guide on the implementation branch.
3. Run automated and manual gates.
4. Publish the canonical-page switch in a reviewable change with a documented rollback path to the prior post composition.
5. Crawl the production Likya graph and inspect main mobile/desktop journeys.
6. Monitor build errors, broken embeds and planner events.
7. Compare organic performance only after a complete measurement window; avoid immediate title churn.

The rollback restores the previous page composition while preserving new data/content files. Do not delete or overwrite historical content during launch.

## Acceptance Criteria

1. All automated Likya validation, Gatsby build, HTML and SEO commands pass with recorded output.
2. All functional states in the matrix pass at the defined viewports in light and dark themes.
3. New interactions meet the accessibility gate and remain navigable without maps or JavaScript where specified.
4. The full official route, all required plans, preparation topics and archive are reachable with no broken link or incomplete published stage.
5. Performance shows no unexplained regression greater than the documented threshold and third-party embeds remain deferred.
6. Content/safety review signs off every route, plan and changing-condition claim.
7. Production rollout includes post-release crawl, analytics smoke test and a non-destructive rollback procedure.

## Out of Scope

- Deploying as part of writing this specification.
- Guaranteeing future SEO improvement.
- Releasing optional automated source monitoring from Spec 021.
