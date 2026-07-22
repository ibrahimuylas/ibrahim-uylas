# Make the Likya Yolu route page the navigational and SEO hub

**Type:** Epic
**Priority:** P1 — the main landing page has high organic visibility while the live journey index sends readers to broken destinations
**Risk:** Medium

## Problem / Opportunity

The site has 31 live Likya-related pages with useful first-hand Turkish content, but they do not operate as one coherent collection.

The primary page, `/likya-yolu-rotasi/`, recorded 73,477 impressions, 275 clicks, 0.4% CTR and an average position of 6.2 during the three-month baseline ending 19 July 2026. It is therefore the clear candidate to own the main search intent around “Likya Yolu rotası”, “Likya Yolu haritası”, “Likya Yolu kaç km” and related route-planning queries.

The current content architecture prevents readers and search engines from moving reliably through the collection:

- `/likya-yolu-11-gunde-yurudugum-parkur/` has 22 broken link destinations on the live site: 19 internal 404s and 3 links to the retired `yolacikmali.com` domain.
- The working daily URLs use dotted slugs such as `/likya-yolu-8.-gun/`, while many links point to non-existent clean variants such as `/likya-yolu-8-gun/`.
- The main route page does not link to the 11 route-section guides or 11 daily journals.
- Each route-section guide links only to its matching journal; it has no main-hub, previous-section or next-section navigation.
- The daily journals have no purposeful series navigation.
- `/likya-yolu-yuruyus-rotasi/` overlaps with the main route page, while `/likya-yolu-oludenizden-ucagiza-11-gun-230km/` overlaps with the 11-day itinerary.
- The 11 route-section articles are short and reuse nearly identical opening copy, which weakens page differentiation and can produce repetitive search snippets.
- The collection uses several distances—509 km, 465 km, 430 km and 230 km—without an immediately clear distinction between route variants, the original plan and the distance actually walked.
- Thirty of the 32 body images in the daily journals have empty alternative text.
- Some route facts and dates conflict, including the Kaş–Körmen introduction describing the wrong section and a Kınık–Üzümlü date that does not match the journal chronology.

The opportunity is to preserve the original first-person writing while adding a clear editorial layer that connects planning information, route sections and journey stories.

## Proposed Solution

Make `/likya-yolu-rotasi/` the permanent main hub and organise every other Likya page beneath one of four reader needs: planning the whole route, inspecting a section, reading the 11-day journey, or preparing equipment and logistics.

### Phase 1 — Repair navigation and protect existing URLs

1. Publish the canonical link corrections already prepared locally for the 11-day itinerary.
2. Replace all links to the retired domain with the equivalent local canonical pages.
3. Preserve the existing dotted daily URLs as canonical because they work and may already carry search signals.
4. Add permanent, one-hop aliases from intuitive variants such as `/likya-yolu-8-gun/` to `/likya-yolu-8.-gun/`.
5. Run a crawl of all 31 Likya pages and their embedded resources before deployment.

### Phase 2 — Establish the content hierarchy

1. Add a prominent route table to `/likya-yolu-rotasi/` with day, section, distance, practical route guide and journal links.
2. Link the main hub to preparation, backpack, solo-walking, actual-itinerary and video content.
3. Add a consistent series navigation block to every route guide: previous section, main route, matching journal and next section.
4. Add a consistent series navigation block to every daily journal: previous day, 11-day itinerary, practical route guide, main route and next day.
5. Use descriptive anchors such as “Sarıbelen–Gökçeören etap rehberi” instead of generic wording such as “buradan devam edin”.

### Phase 3 — Strengthen the main hub without replacing the original account

Add an editorial layer before and around the existing route plan:

1. Give a short answer explaining why 509 km, 465 km, 430 km and 230 km appear in the collection.
2. Separate “2014 yılında planladığım rota” from “11 günde gerçekten yürüdüğüm 230 km”.
3. Place the route map, source and verification date near the top of the page.
4. Add a concise quick-facts section covering the historical plan, stage count, direction and experience date.
5. Add a useful FAQ covering distance, duration, start/end points, difficulty, water, camping and navigation only where answers can be supported.
6. Keep the existing 2014 freshness warning visible near practical information.

The original Turkish narrative must remain intact. New material must be visibly distinguishable as editorial context, a historical note or a verified current update.

### Phase 4 — Apply a route-guide template to all 11 section pages

Preserve the existing observations and add a consistent structure:

- Section number, start/end points and distance.
- Walking time or range when supportable.
- Terrain and difficulty.
- Major climbs, descents and navigation hazards.
- Water and food observations.
- Accommodation, camping and exit-point observations.
- Landmarks and nearby supporting articles.
- A first-person lesson from the corresponding journal.
- Experience date and, when separately verified, a current-information date and source.
- Descriptive link to the matching journal and series navigation.

Correct factual or labelling errors only after verification. Do not silently present 2014 prices, water availability, access conditions or businesses as current.

### Phase 5 — Add editorial wrappers to the 11 journals

The journals are the collection’s strongest evidence of first-hand experience and should not be rewritten into generic SEO articles. Add only:

- A quick-facts block with day, date, route and distance.
- A note that the entry was written during the 2014 walk.
- A descriptive link to the matching practical guide.
- Previous/index/next navigation.
- Descriptive image alt text and captions based on what the photographs show.
- An optional short “Bu etaptan öğrendiğim” summary when it can be drawn from the existing entry.

### Phase 6 — Resolve overlapping page roles

Recommended default:

1. Move the useful full-route map from `/likya-yolu-yuruyus-rotasi/` into the main hub, then permanently redirect the overlapping URL to the hub.
2. Move the unique video from `/likya-yolu-oludenizden-ucagiza-11-gun-230km/` into `/likya-yolu-11-gunde-yurudugum-parkur/`, then permanently redirect the thinner summary URL to the itinerary.
3. Preserve any unique useful copy before redirecting a URL.
4. Keep the main hub focused on general planning and the 11-day itinerary focused on the author’s actual 230 km experience.

### Phase 7 — On-page SEO, validation and measurement

1. Give each retained page a unique, descriptive title and description based on its specific intent.
2. Use one page H1 supplied by the template, followed by a logical H2/H3 hierarchy.
3. Categorise the main hub under `Rotalar` so breadcrumbs and related content match its role.
4. Add a visible and structured modification date only after a substantive review.
5. Keep only canonical retained URLs in the sitemap.
6. Validate canonical tags, permanent redirects, structured data, mobile navigation and embedded maps.
7. Review the first complete post-change Search Console window on or after 20 August 2026. Avoid another main-page title rewrite until two complete 28-day windows have been measured.

## Scope

### MVP

- Repair the 22 broken destinations from the 11-day itinerary.
- Preserve canonical dotted journal URLs and add aliases for common clean variants.
- Make `/likya-yolu-rotasi/` the explicit hub.
- Add hub, matching-page and previous/next navigation across all 11 route guides and 11 journals.
- Add the 11-stage route table to the main hub.
- Distinguish historical plans from actual walked distance and from any verified current information.
- Correct confirmed factual labelling errors.
- Validate the complete link graph before deployment.

### Follow-on scope

- Expand all route-section pages using the shared template.
- Add journal wrappers, captions and image alt text.
- Consolidate the two overlapping summary pages after preserving their unique material.
- Add unique titles and descriptions based on page-level Search Console query data.
- Add a lightweight automated internal-link check to the build or release workflow.

### Nice-to-haves

- A reusable Likya series-navigation component rather than manually repeated Markdown.
- A downloadable route checklist or printable stage summary.
- A visually accessible route-progress diagram.
- Annual verification reminders for safety-sensitive route information.

## Acceptance Criteria

1. All links within the 31-page Likya collection either resolve directly to an HTTP 200 canonical page or, for documented legacy aliases, complete exactly one permanent redirect to that canonical page; no editorial link ends on a 4xx, 5xx or retired domain.
2. `/likya-yolu-rotasi/` visibly links to all 11 route-section guides, all 11 daily journals, the 11-day itinerary and the retained preparation articles through descriptive anchor text.
3. Every retained route-section guide includes a link to the main hub, its matching journal, and the available previous and next section; every retained daily journal includes the main hub or itinerary index, its matching route guide, and the available previous and next day.
4. The main hub clearly and accurately distinguishes the full route or route variants, the author’s 465 km historical plan and the 230 km actually walked, with the experience date and freshness warning visible before safety-sensitive details.
5. The original first-person Turkish narratives remain present and materially unchanged; additions are labelled as historical context, editorial summary or verified current information, and no unsupported current safety, water, price, access or accommodation claim is introduced.
6. Every retained page has a unique purpose, title, description and logical heading hierarchy; all meaningful journal images have accurate alt text or are intentionally marked decorative.
7. A pre-deployment validation report confirms the retained canonical URLs, redirects, sitemap membership, internal-link crawl, embedded-map status and mobile series navigation, and records the Search Console baseline for later comparison.

## Out of Scope

- Implementing or deploying any content, code, redirect or metadata change as part of this specification task.
- Rewriting the author’s voice, sanitising the travel stories or translating the collection into another language.
- Claiming that 2014 route conditions, water points, businesses, prices or camping permissions are current without verification.
- Producing new GPX data or modifying third-party Wikiloc tracks without an authoritative source.
- Expanding the plan beyond the Likya-related content cluster.
- Committing, pushing, opening a pull request or publishing the resulting implementation unless separately requested.

## Open Questions

1. Should `/likya-yolu-yuruyus-rotasi/` be consolidated into the main hub as recommended, or retained as a dedicated map/GPX page with a narrower search intent?
2. Should the video summary page be merged into the 11-day itinerary as recommended, or kept as a standalone multimedia story?
3. Which authoritative route sources should be used for current distance, access, water and safety verification, and who will own future freshness reviews?
4. Can the author identify the subjects and locations in the journal photographs where the image itself is not sufficient to write accurate alt text?

These questions do not block the MVP link repair and navigation work.

## Suggested Next Step

Review and approve the two recommended consolidations and the preferred current-information sources. Then use `$ralph` to break this specification into small implementation tasks, starting with link repair and the hub navigation table. Do not combine the initial repair with broad prose or title rewrites; validate the repaired link graph first and expand the collection in subsequent reviewable changes.
