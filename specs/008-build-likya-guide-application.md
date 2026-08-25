# Build the Likya Yolu guide application

**Type:** Epic

**Priority:** P1 — this will become the site's primary Likya Yolu planning experience

**Risk:** High

## Goal

Turn `/likya-yolu-rotasi/` from a long, historically useful article into a guided, application-like route-planning experience without breaking the site's visual identity, existing URLs or first-person archive.

The default experience must help a visitor answer “I have this many days, when and how should I walk?” The same screen must also let an informed visitor inspect every route section, plan, preparation guide and historical journal independently.

## Product Principles

1. **Guide first, catalog second.** The primary action is “Bana rota öner”; “Tüm rotaları keşfet” is always available but secondary.
2. **One clear answer.** A completed planning flow returns one recommended plan and no more than two materially different alternatives.
3. **Official route and current conditions are different data.** Ministry route material defines the route baseline after verification; weather, fire, closure, water and business information always has its own source and review date.
4. **Historical writing remains historical.** The 2014 plan, 11-day walk, equipment and journals remain accessible and retain İbrahim's voice. They are not presented as current field conditions.
5. **Progressive detail.** Every screen begins with a short decision-ready answer, then offers day-by-day detail, sources and deeper reading.
6. **No false live promise.** The product never says a route is safe or open solely because no warning is recorded. It tells the user which current checks remain their responsibility.
7. **Existing design wins.** New screens reuse the site's header, footer, type, colors, cards, spacing, dark mode and interaction conventions.

## Current-Screen Change Matrix

| Current screen                                  | Required change                                                                                                                                                                   | Must remain                                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/likya-yolu-rotasi/`                           | Replace the generic long-article-first composition with the dedicated guide shell defined in Spec 010. Put the planner and short-plan entry points before the historical article. | Canonical URL, SEO equity, global header/footer, author attribution, relevant original material and links. |
| `/category/rotalar/`                            | Update the Likya hero CTA and Likya section so they lead directly to the planner and route atlas. Do not turn the general route category into a second Likya application.         | Existing category hero, visual hierarchy, other route sections, filters and responsive behavior.           |
| Existing 11 practical stage articles            | Apply the shared stage-guide structure in Spec 013 where the article corresponds to an official section or a supported walking stage.                                             | Existing canonical URLs, first-hand observations and matching journal links.                               |
| Existing 11 daily journals                      | Add a historical label, quick facts and clear links back to the current guide and matching stage.                                                                                 | Original narrative, photos, canonical dotted URLs and series order.                                        |
| Preparation, backpack and solo-walking articles | Add current editorial wrappers and connect them to the preparation center described in Spec 018.                                                                                  | Personal voice, original dates and existing URLs.                                                          |
| 11-day itinerary page                           | Position it as the “2014'te gerçekten yürüdüğüm 230 km” archive and link it from relevant modern plans.                                                                           | Video, journals and first-hand itinerary record.                                                           |
| Global navigation and footer                    | No structural redesign. A direct Likya link may be added only if it follows current navigation capacity and responsive patterns.                                                  | Logo, search, theme control, mobile navigation and current site-wide hierarchy.                            |

## Information Architecture

The canonical guide page contains six reader-facing areas:

1. **Guide home:** purpose, two primary paths, concise trust/freshness message.
2. **Guided planner:** short question flow and personalized recommendation result.
3. **Short plans:** editorially verified 3-, 5- and 7-day plans plus a full-route entry.
4. **Route atlas:** the complete route split into West, Central and East editorial groups, with access to every section.
5. **Preparation center:** readiness, equipment, navigation, water/food, lodging, transport, solo walking, emergencies and trail ethics.
6. **First-hand archive:** the 2014 plan, the actual 11-day walk, journals, video and personal preparation articles.

“West, Central and East” are navigation labels, not official route names. Their exact boundaries must be recorded during the official-map inventory in Spec 009.

## Relationship to Existing Likya Work

Spec 001 remains the link-integrity and SEO-hub foundation for this epic. Its canonical URL, redirect, series-navigation, historical-labelling and broken-link requirements still apply. This epic extends the page into a guided product; it does not reopen repaired URLs or discard the existing content cluster.

## Visual and Responsive Guardrails

- Reuse Theme UI tokens and existing components before adding new tokens or variants.
- Use the live `/category/rotalar/` guide as the visual reference: DM Serif Display headings, Inter body copy, `alpha` blue accents, `contentBg` surfaces, `omegaLight` borders, existing `lg` radii and restrained shadows.
- Keep the existing global content width and spacing rhythm. A dedicated Likya page may be wider than a prose article only for map, planner and route-atlas areas.
- Mobile first: single-column reading order, image before hero copy where the existing route-guide hero does so, full-width primary actions and no viewport-level horizontal overflow.
- Tablet: use two columns only where both columns remain independently readable; do not compress day cards into desktop density.
- Desktop: allow a two-column planner/result or atlas/map layout, while keeping prose lines at a readable measure.
- Minimum interactive target is 48×48 px. Keyboard focus must be visible in both themes.
- Do not add a new sticky bottom action that competes with the site's existing mobile navigation.
- Respect `prefers-reduced-motion`; route selection and accordion state must not depend on animation.
- Every interactive map must have an equivalent list and link-based path.

## Scope by Specification

| Spec                                                   | Work item                                            | Type                  | Priority | Depends on                        |
| ------------------------------------------------------ | ---------------------------------------------------- | --------------------- | -------- | --------------------------------- |
| [009](./009-create-likya-route-source-model.md)        | Canonical route and source data model                | Foundation            | P1       | —                                 |
| [010](./010-build-likya-guide-shell.md)                | Likya guide shell and current-screen integration     | Feature               | P1       | 009 interface                     |
| [011](./011-build-guided-likya-recommendation-flow.md) | Guided route recommendation flow                     | Feature               | P1       | 009, 017                          |
| [012](./012-build-likya-route-atlas.md)                | Complete route atlas and self-directed exploration   | Feature               | P1       | 009                               |
| [013](./013-create-likya-stage-guide-template.md)      | Shared stage-guide template                          | Feature               | P1       | 009, 019 interface                |
| [014](./014-publish-western-likya-guide-content.md)    | Western Likya content package                        | Content               | P1       | 009, 013                          |
| [015](./015-publish-central-likya-guide-content.md)    | Central Likya content package                        | Content               | P1       | 009, 013                          |
| [016](./016-publish-eastern-likya-guide-content.md)    | Eastern Likya content package                        | Content               | P1       | 009, 013                          |
| [017](./017-publish-likya-trip-plans.md)               | 3-, 5-, 7-day and full-route plans                   | Content/feature       | P1       | 009 and relevant regional content |
| [018](./018-build-likya-preparation-center.md)         | Preparation center and first-hand archive            | Content/feature       | P1       | 010, 013                          |
| [019](./019-add-likya-source-status-workflow.md)       | Source status and freshness workflow                 | Foundation/operations | P1       | 009                               |
| [020](./020-validate-and-launch-likya-guide.md)        | Responsive, accessibility, SEO and launch validation | Quality/release       | P1       | all P1 specs                      |
| [021](./021-evaluate-likya-condition-monitoring.md)    | Evaluate automated official-source monitoring        | Spike                 | P2       | 019                               |

## Delivery Waves

### Wave 1 — trustworthy foundation

- Complete official-map and source inventory.
- Freeze data contracts and editorial labels.
- Build the page shell, route atlas skeleton and shared stage template using verified sample records.

### Wave 2 — complete guide coverage

- Publish West, Central and East content packages behind the implementation branch.
- Build the preparation center and connect the historical archive.
- Do not publicly position the page as a complete guide until every official route section is represented.

### Wave 3 — decision support

- Publish the 3-, 5- and 7-day plans and full-route orientation.
- Connect the deterministic recommendation flow.
- Add shareable result URLs and print styles after the core result is stable.

### Wave 4 — freshness and release

- Apply source status and review workflow to every safety-sensitive field.
- Complete responsive, accessibility, build, link, SEO and content validation.
- Release only after the core guide is complete; implementation may still be merged in smaller reviewable changes.

### Wave 5 — optional monitoring

- After the manual workflow proves workable, evaluate a small number of official sources for change detection.
- Keep human review mandatory and leave this wave outside the MVP launch gate.

## Non-Functional Requirements

- Gatsby build and server-side rendering must succeed without relying on `window` during render.
- Core route data, plan summaries and navigation must be present in server-rendered HTML.
- With JavaScript unavailable, users can still reach all route, plan, preparation and archive pages; only personalization may degrade.
- No account, database or runtime AI service is required for MVP.
- No new dependency may be added when current Gatsby, React, Theme UI and icon tooling can meet the requirement.
- Light and dark themes must use semantic tokens; no component may assume a white background or dark text.
- All factual route content must be traceable to a source record or explicitly labelled first-hand/historical.

## Analytics and Success Signals

Track only coarse, privacy-respecting events:

- `likya_planner_start`
- `likya_planner_complete` with duration band, month/season band and result ID; never the user's exact travel date
- `likya_plan_open`
- `likya_stage_open`
- `likya_explore_filter`
- `likya_source_open`
- `likya_historical_archive_open`

The first product review should answer:

- What proportion of guide visitors start and finish the planner?
- Which 3/5/7/full duration bands are requested most?
- Do visitors open the recommended plan or abandon at the result?
- Can users reach self-directed exploration without completing the planner?
- Does the canonical route page retain or improve organic entry performance without creating duplicate search intent?

## Acceptance Criteria

1. A first-time visitor can either receive a route recommendation or open the complete route atlas within one primary action from the canonical page.
2. Every official route section included in the verified Ministry inventory is reachable from the guide without using the site search.
3. Every recommendation clearly separates route-baseline facts, current-condition checks and historical first-hand notes.
4. The canonical page, category handoff, stage pages, preparation pages and archive form one coherent link graph with no dead end.
5. Mobile, tablet and desktop layouts follow the existing design system and pass Spec 020 without a global header, footer or theme redesign.
6. The original 2014 material remains accessible and is never presented as current advice.
7. The implementation can ship in the documented waves without publishing a partially populated guide as “complete.”

## Out of Scope

- Native iOS/Android applications.
- User accounts, saved trips across devices or community posting.
- Booking, payment, accommodation inventory or business-price guarantees.
- Turn-by-turn navigation, background GPS tracking or emergency dispatch.
- Automatic publication of weather, fire, closure or safety claims.
- Rehosting third-party GPX files, Ministry maps or book content without permission.
- Redesigning the rest of the site.
