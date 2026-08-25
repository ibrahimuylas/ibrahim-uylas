# Publish 3-, 5-, 7-day and full-route Likya plans

**Type:** Content and feature

**Priority:** P1 — these plans are the recommendation engine's actual answers

**Risk:** High

## Goal

Publish a small, editorially verified set of day-by-day plans that can answer the most common duration questions without overwhelming users. Create one default and one genuinely different alternative for 3, 5 and 7 walking days, plus a full-route orientation for people considering the entire trail.

Do not publish dozens of mechanically combined itineraries. Quality and clear fit matter more than catalog size.

## Required Plan Set

| Duration       |          Required records | Purpose                                                                                                                    |
| -------------- | ------------------------: | -------------------------------------------------------------------------------------------------------------------------- |
| 3 walking days | 1 primary + 1 alternative | First taste of the route with different scenery/logistics tradeoffs.                                                       |
| 5 walking days | 1 primary + 1 alternative | The most likely annual-leave use case; must be practical to enter and exit.                                                |
| 7 walking days | 1 primary + 1 alternative | A more immersive continuous section with recovery/exit planning.                                                           |
| Full route     |        1 orientation plan | Explains route scale, variants, rest/resupply logic and how to build a personal schedule; not a false universal day count. |

Final start/end names must be chosen only after Specs 009 and 014–016 confirm route order, GPS coverage, transport and stage effort. Empty or speculative plan slots must not appear in production.

## Plan Selection Criteria

Each primary should optimize for:

- coherent continuous walking rather than arbitrary highlights;
- realistic arrival/departure logistics;
- a clear fit for a healthy first-time multi-day walker;
- at least one plausible exit or recovery option;
- supported accommodation mode;
- source-backed GPS coverage for the selected branch;
- enough verified practical information to publish responsibly.

Each alternative must change at least two meaningful dimensions, such as region, terrain, accommodation, solitude, archaeological focus or daily load. Reversing direction alone is not a sufficient alternative.

## Plan Record

Required fields:

- stable `id`, name, duration and editorial priority;
- start/end, direction, region coverage and ordered stage IDs;
- total distance/ascent with source qualification;
- best-fit audience and minimum experience;
- recommended and excluded season bands;
- daily-load band and pack assumptions;
- lodging modes and resupply approach;
- transport-start and transport-end summaries;
- trip-character tags;
- solo suitability note;
- route-variant and GPS records;
- hard exclusions/cautions;
- fallback/exit strategy;
- source IDs and editorial review metadata;
- recommendation-match tags for Spec 011.

## Day-by-Day Content Template

Every walking day includes:

1. Day number and start/end.
2. Verified distance and ascent/descent where available.
3. Expected effort range and the main effort driver.
4. Three to five route-flow waypoints.
5. Water/food strategy with freshness state.
6. Overnight mode and backup.
7. Exit point or recovery choice.
8. GPS track/branch used.
9. One concise caution.

Arrival and departure days are shown separately when transport realistically consumes time. Do not market a five-calendar-day trip as five full walking days if that assumption is impractical.

## Plan Page Composition

- H1, duration, start/end and one-sentence promise.
- `Bu plan kime uygun?` and `Şu durumda seçme` cards.
- Compact total facts and season bands.
- Day-by-day vertical plan.
- Accommodation and food/water strategy.
- Getting there, leaving and early exits.
- Map/GPS coverage with attribution.
- Required preparation and pack adjustments.
- “Yola çıkmadan kontrol et” panel.
- One relevant first-hand story when available.
- Alternative plan and complete atlas links.

## Full-Route Orientation

The full-route record is different from a short fixed plan. It must explain:

- official route extent and variants from Spec 009;
- likely schedule ranges by daily-load profile rather than one promised number;
- how rest, resupply, accommodation and transport shape stage boundaries;
- West/Central/East breakdown;
- what a first-time through-walker should test before committing;
- how to use the complete stage atlas and GPS sources;
- where the 2014 509/465/430/230 km records fit historically;
- which current checks cannot be planned months in advance.

Do not convert İbrahim's 16-day 2014 paper plan into the default modern full-route itinerary.

## Recommendation Explanations

For every plan, author reusable reasons tied to planner answers:

- duration fit;
- season fit;
- experience/load fit;
- lodging fit;
- desired trip character;
- transport fit.

Also author explicit conflict text. The UI should say “Bu planı önermiyorum çünkü…” instead of silently lowering a score.

## Print and Phone Summary

- Add print CSS for a compact plan summary; no separate PDF generator.
- Include route name, days, overnight points, critical exits, GPS/source links, current-check checklist and emergency preparation reminder.
- Exclude global navigation, comments, related cards and decorative imagery from print.
- Print output includes generated date and condition-review dates so a saved copy does not look timeless.

## Responsive Behavior

- Mobile uses vertical day cards, with key facts before expandable detail.
- Do not use the existing wide comparison-table pattern for the primary plan view.
- Tablet may pair daily effort and overnight detail but keeps each day visually intact.
- Desktop may use a summary rail and full day-flow column.
- Plan actions wrap and remain 48 px high; source URLs never overflow.

## Acceptance Criteria

1. Exactly one primary and one distinct alternative are published for each 3-, 5- and 7-day duration.
2. Every short plan is a continuous, source-backed route with realistic arrival/departure, lodging and exit logic.
3. Every day contains the required effort, service, overnight, exit, GPS and caution information or an explicit unresolved state that blocks publication.
4. The full-route guide explains scale and planning ranges without recycling the 2014 plan as current fact.
5. All plan records pass data validation and deterministic recommendation test cases.
6. Plan pages are usable on mobile, printable and fully navigable without loading a map.
7. No plan is shown as suitable in an excluded season or with incompatible experience/lodging answers.

## Out of Scope

- Arbitrary user-defined day combinations.
- Booking or live availability.
- Automatically adjusting a plan from weather forecasts.
- Claiming the selected primary plans are the only good ways to walk the route.
