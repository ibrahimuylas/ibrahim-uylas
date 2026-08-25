# Build the complete Likya route atlas

**Type:** Feature

**Priority:** P1 — informed visitors must be able to inspect the entire route without using the planner

**Risk:** Medium

## Goal

Provide a complete, self-directed view of the Likya Yolu while keeping the default guide experience recommendation-led. The atlas must expose every official route section, walking stage, plan, preparation page and source-backed GPS record through both list and map paths.

## Entry Points

- `Tüm rotaları keşfet` in the Likya guide hero.
- `Kendim incelemek istiyorum` decision card.
- `Tüm etaplar` links from planner results and short-plan pages.
- West/Central/East links in the guide index.
- Updated Likya section on `/category/rotalar/`.

The primary implementation lives at `/likya-yolu-rotasi/#tum-etaplar` unless usability or SEO validation proves that a dedicated canonical atlas URL is necessary. Do not create duplicate thin pages by default.

## Atlas Structure

### 1. Orientation header

Show:

- total official sections found in Spec 009;
- official route source/edition label;
- route direction and branch explanation;
- difference between official map sections and suggested walking days;
- latest editorial review date;
- link to route-source methodology.

Do not publish an unsourced total-distance headline.

### 2. Region navigation

Use West, Central and East as plain-language editorial groupings. Each region control shows:

- start/end boundary;
- number of official sections and practical stages;
- one-line landscape/logistics character;
- link that scrolls to and focuses the region heading.

All three regions remain in server-rendered HTML. A selected region may reduce visual noise, but the page must not require JavaScript to reveal its links.

### 3. Filters

Offer filters only after the grouped default list:

- duration compatibility: day walk, 2–3, 4–5, 6–7, 8+;
- difficulty/daily load;
- camp, pension/business or mixed;
- coast, ancient sites, quiet nature or balanced;
- route region;
- source/freshness state where useful.

Avoid requiring a visitor to know a place name. Text search is a supporting tool for known names, not the first interaction.

Filter behavior:

- Use local static data; no network request.
- Announce result count changes to assistive technology without moving focus.
- Show removable active-filter chips and `Filtreleri temizle`.
- A no-result state suggests the smallest relaxation and links to the planner.
- Shareable filter state may use query parameters, but canonical remains the main route page.

### 4. Route list

Every official route section appears in order. Where a practical walking stage spans or splits official sections, show that relationship explicitly.

Each route card contains:

- sequence and region;
- start/end and route name;
- verified distance or `mesafe doğrulanıyor`;
- difficulty with reason available on detail;
- expected time range where supportable;
- common lodging mode;
- one key logistics note;
- GPS coverage state;
- source/freshness label;
- `Etap rehberini aç` action.

The card must not display transient water, business or access claims without condition metadata.

### 5. Map mode

- Provide `Liste` and `Harita + liste` views; list is the default on mobile.
- The map mirrors the ordered list and never replaces it.
- Select a route on the map to focus its matching list card; selecting a card may focus the map only when the map is loaded.
- Branches use text labels or an accessible legend in addition to color.
- External map/track embeds load through the existing deferred-embed pattern.
- If route geometry cannot be legally hosted, use attributed outbound map links and a schematic/order view rather than recreating geometry.
- A map failure leaves the complete list operational.

### 6. Cross-guide index

After the route list, link to:

- 3-, 5- and 7-day plans;
- full-route guide;
- preparation center;
- all historical journals;
- source and freshness methodology.

## `/category/rotalar/` Changes

The general route-category page already provides the site's desired visual language and must stay a broad route guide.

Required adjustments:

- Hero CTA `Likya Yolu'nu planla` links directly to `/likya-yolu-rotasi/#planlayici` rather than a local category anchor.
- Add a clear secondary Likya action `Tüm Likya etapları` to `/likya-yolu-rotasi/#tum-etaplar`.
- Update the Likya section summary from “509 km tarihsel plan ve 11 etap” to distinguish the complete modern guide from the 2014 archive.
- Retain the existing featured image, card style, general-route sections and all-content filters.
- Do not duplicate the full atlas or recommendation form inside the category page.

## Responsive Behavior

### Mobile

- Grouped route list is the default; map loads only after `Haritayı aç`.
- Region navigation is a wrapping grid or vertical list, not a clipped tab strip.
- Filters open in the existing accessible sheet/dialog pattern and expose active-filter count on the trigger.
- Route cards use a vertical layout. Key facts form a readable two-column grid only when labels fit.
- The map has a bounded height and a visible `Listeye dön` action; it never traps page scroll.

### Tablet

- Region cards and filters may use two columns.
- `Harita + liste` may stack map above the list.

### Desktop

- Atlas may use a list/map split with both columns `minmax(0, ...)` and a sticky map bounded by the atlas section.
- Region headings and list order remain visible; map interaction does not collapse the source/status details.

## Accessibility and Performance

- Ordered route information uses semantic lists/headings; do not fake order through CSS positioning.
- Map markers have matching text controls and accessible names.
- Filtering is usable with keyboard and does not require drag gestures.
- Defer all third-party map code until explicit interaction or near-viewport loading consistent with current privacy/performance policy.
- Do not load every GPS embed on initial page render.
- Long route lists may use progressive rendering only if all links remain present in server-rendered HTML or an equivalent crawlable index.

## Acceptance Criteria

1. Every official route section inventoried in Spec 009 appears exactly once in ordered atlas navigation and links to a detail page or a clearly marked pending-data state that is not published as complete.
2. Users can browse by West/Central/East, filter routes and find every plan/preparation/archive page without completing the planner.
3. Mobile users receive the full list before loading a map; map failure never blocks navigation.
4. Every route card exposes source, GPS coverage and freshness state without implying unsupported current conditions.
5. `/category/rotalar/` hands visitors to the planner or atlas while retaining its existing general-route design and content.
6. Filter and map interactions are keyboard accessible, screen-reader labelled and free of viewport-level horizontal overflow.
7. No unauthorized route geometry or GPX file is introduced.

## Out of Scope

- Turn-by-turn navigation.
- Editing route geometry in the browser.
- Crowd-sourced route reviews or ratings.
- A second full Likya app embedded in the general route category page.
