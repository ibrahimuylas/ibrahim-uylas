# Build the canonical Likya guide shell

**Type:** Feature

**Priority:** P1 — this is the primary entry screen for both guided and self-directed use

**Risk:** Medium

## Goal

Redesign the composition of `/likya-yolu-rotasi/` so the first screen behaves like a guide application while preserving the canonical URL, search value, global design system and access to the full 2014 article.

## Implementation Boundary

- Keep the work site-specific under `site/src`; do not change reusable theme packages for one page.
- Use the active shadowed post container to detect the canonical Likya slug and render a dedicated `LikyaGuidePage` composition while retaining the normal post composition for every other article.
- Continue using the existing article query, `Seo`, `Layout`, global header/footer, reactions/comments services and article data where relevant.
- Do not create a competing static Gatsby page at the same path as the MDX-generated article.
- Keep the route data and UI separate: the page consumes Spec 009 data rather than embedding route records in JSX.

## Current Page Changes

### Remove from the primary reading path

- The generic large article card must no longer wrap the entire guide.
- The 2014 banner, author metadata, “Bu yazıda” block and long 16-day plan must not appear before the visitor sees the planning choices.
- The 11-day Markdown table and raw Google/Wikiloc embeds must not dominate the first screen.

### Preserve and reposition

- Preserve the current H1 search intent, with final wording reviewed during SEO validation.
- Retain the hero image when it supports the guide composition; use the same image pipeline and crop rules as the current route-category hero.
- Retain author attribution as “İbrahim'in saha deneyimi ve editoryal rehber” or equivalent, without making an old post date look like a current-condition verification.
- Render the historical 2014 body under the first-hand archive section or link to a dedicated retained historical view. It must remain server-rendered and indexable unless a separate SEO consolidation decision says otherwise.
- Keep reactions, comments and related articles below the guide/archive content, not between planner sections.

## Page Structure

### 1. Compact trust strip

Directly below the global header, show:

- Breadcrumb or compact context link back to `/category/rotalar/`.
- “Rota temeli” source label and last editorial review date.
- A short warning that current weather, fire and access checks are separate.

This strip is informative, not a green/red “safe” banner.

### 2. Guide hero

Hero copy:

- Eyebrow: `Likya Yolu Rehberi`.
- H1: a concise version of the existing canonical topic.
- One paragraph promising help based on time, season, experience and lodging choice.
- Primary CTA: `Bana rota öner`.
- Secondary CTA: `Tüm rotaları keşfet`.
- Quick links for `3 gün`, `5 gün`, `7 gün` and `Baştan sona`.

Use the visual grammar of `/category/rotalar/`: split image/content card on desktop, image-first stacked card on mobile, existing blue button and outlined secondary action.

### 3. “Nereden başlamalıyım?” decision area

Present two distinct cards:

- `Karar vermeme yardım et`: starts Spec 011.
- `Kendim incelemek istiyorum`: opens Spec 012.

Both choices remain visible without JavaScript and link to their corresponding server-rendered sections.

### 4. Short-plan rail

Show the verified 3-, 5- and 7-day primary plans plus the full-route orientation. Each card includes:

- duration;
- start/end;
- best-fit season band;
- difficulty;
- accommodation mode;
- one-sentence reason to choose it;
- clear detail action.

Do not show unverified or placeholder recommendations on production.

### 5. “Bugün kontrol et” panel

Summarize the checks the user must make before departure:

- weather;
- fire/forest access and local restrictions;
- route/transport disruption;
- water and open services.

Display source links and review status from Spec 019. Absence of a site warning must be worded as “kayıtlı güncel uyarı yok; resmî kaynakları yine kontrol et,” never “rota açık/güvenli.”

### 6. Guide index

Provide one-hop navigation to:

- complete atlas;
- all stages by West/Central/East;
- preparation and equipment;
- GPS/navigation;
- water, lodging and transport;
- solo walking and safety;
- historical 2014 archive.

### 7. First-hand archive

Use a visually distinct, clearly dated section containing:

- 2014 509/465/430 km plan explanation;
- actual 11-day, 230 km itinerary;
- 11 daily journals;
- preparation, backpack, solo and pre-departure articles;
- video and original maps where retained.

The section must say what remains useful today and what must be rechecked.

## Responsive Behavior

### Mobile: below 768 px

- One column throughout the initial journey.
- Hero image renders before copy, matching the current category-guide pattern.
- Primary and secondary CTAs are full width and stacked.
- Quick duration choices wrap into a two-column grid; no horizontal scroll is required to find a duration.
- Status and source details use disclosure components with meaningful button labels and expanded state announced to assistive technology.
- Plan cards show the decision summary first; secondary metadata may wrap but must not be clipped.
- Map embeds are deferred and opened on demand; the route list is the default.
- Do not introduce a bottom sticky CTA over the site's current mobile navigation.

### Tablet: 768–1199 px

- Hero may remain stacked or use a balanced split only when the image and H1 retain adequate width.
- Decision cards and plan cards can use two columns.
- The main guide index may use two columns; maps remain below or beside lists only when at least 360 px wide.

### Desktop: 1200 px and above

- Hero uses the existing split-card composition.
- Planner/result and atlas/map areas may use a `minmax(0, 1fr)` main column with a bounded secondary column.
- Sticky in-page summary is permitted only inside the content column, below the global header and without hiding footer/reactions.
- Historical prose retains normal article line length rather than stretching to the map width.

## Interaction and State Requirements

- Every in-page target receives focus after an explicit CTA jump when appropriate.
- Query-string result state from Spec 011 must restore only after hydration and must not cause a server/client markup mismatch.
- Use native links for navigation and buttons for state changes.
- Loading skeletons are unnecessary for static route data. External maps use the existing deferred-embed pattern with an explicit load action.
- Error or incomplete-data states provide a route/source link and a way back to the atlas.

## Accessibility

- One page H1; logical H2/H3 order across guide and historical sections.
- Avoid putting the entire planner in one unlabeled `div`; use landmarks, fieldsets and labelled sections.
- All card actions have descriptive names such as “5 günlük planı incele.”
- Color is never the sole signifier of difficulty or freshness.
- Focus, hover and selected states work in light and dark themes.
- Any carousel-like row must have an equivalent wrapping layout or explicit accessible controls; prefer wrapping grids.

## SEO and Content Requirements

- Preserve the canonical `/likya-yolu-rotasi/` URL and existing route-topic ownership.
- The page must contain a short server-rendered answer to distance, duration, start/end and route-variant questions before interactive-only content.
- Do not generate thin indexable URLs for every planner answer. Query parameters are shareable states but canonicalize to the main page.
- Historical dates and current review dates use different labels.
- Structured data is limited to visible content and reviewed in Spec 020.

## Acceptance Criteria

1. The canonical page opens with the guide hero and two decision paths, not the 2014 article table or raw embeds.
2. “Bana rota öner,” “Tüm rotaları keşfet,” 3/5/7-day plans and full-route guidance are reachable above the historical archive.
3. The original 2014 plan and related personal content remain accessible, clearly dated and connected to the modern guide.
4. The special page composition is implemented site-locally and does not change normal post rendering.
5. Mobile, tablet and desktop behavior follows the explicit rules above with no viewport overflow or mobile-nav collision.
6. With JavaScript disabled, route plans, atlas links, preparation links and the archive remain navigable.
7. Global header, footer, typography, dark mode, colors and general card language remain visibly consistent with the live site.

## Out of Scope

- Recommendation scoring and question logic, covered by Spec 011.
- Authoring the plan records, covered by Spec 017.
- A real-time status service.
- Global post-template redesign.
