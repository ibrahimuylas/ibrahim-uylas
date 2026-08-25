# Create the shared Likya stage-guide template

**Type:** Feature

**Priority:** P1 — every route section needs the same decision-ready structure

**Risk:** Medium

## Goal

Create one reusable, site-specific template that turns route data, current-condition references and first-hand observations into concise stage guides. Apply it to retained existing stage URLs and use it for newly required sections.

## Page Role

A stage page answers:

- Is this section a plausible fit for me?
- What does the day involve?
- How do I reach and leave it?
- Which GPS track/variant am I looking at?
- Which details are current, historical or not recently verified?
- What should I check immediately before walking?

It does not attempt to replace the full planner, a navigation device or the original journal.

## URL and Content Rules

- Preserve an existing canonical URL when it accurately represents the same practical stage.
- Do not rename the current dotted daily-journal URLs; those are archive pages, not stage pages.
- Where the official map boundaries and existing article boundaries differ, model the relationship and avoid silently relabelling an old experience.
- New page slugs use normalized Turkish-independent URL characters and a stable route naming convention documented in the data README.
- Every stage page links to the canonical guide, previous/next practical stage, relevant plan packs and matching historical experience when one exists.

## Required Page Composition

### 1. Stage header

- Region and sequence.
- H1 with start–end names.
- One-sentence “who this is for” summary.
- Difficulty and verified distance/time range.
- Source label and editorial review date.
- Primary action `Bu etabı planıma ekle` only if the authored plan model supports it; otherwise `Bu etaba uygun planları gör`.

### 2. Decision card

Above deep prose, answer:

- best fit;
- main challenge;
- preferred lodging mode;
- recommended season band;
- when to choose another stage.

This content must be editorially authored, not generated from generic tags alone.

### 3. Route and effort

- Start/end and ordered official-section coverage.
- Terrain and surface.
- Ascent/descent and high point where verified.
- Realistic effort range and factors that change it.
- Route variants with clear tradeoffs.
- Explicit note when the figures come from a third-party track rather than the official route source.

### 4. Day flow

Use three to six meaningful waypoints rather than narrating every turn:

- segment/waypoint;
- cumulative distance or approximate position;
- effort/terrain change;
- verified decision or hazard note;
- exit possibility.

Turn-by-turn directions are out of scope.

### 5. Water, food and accommodation

Separate stable infrastructure from changing conditions:

- what category of service may exist;
- last observation/review date;
- source and confidence/status;
- backup quantity/plan guidance where supportable;
- no unsourced price or guaranteed opening statement.

### 6. Access, exit and transport

- how to reach the start and leave the end;
- public-transport limitations;
- private-car recovery issue;
- early exit points and what they connect to;
- emergency limitations without promising rescue coverage.

### 7. Map and GPS

- Deferred overview map.
- Attributed GPS tracks, each labelled by owner, date, direction, branch and coverage.
- `Wikiloc'ta aç/indir` or equivalent outbound action when allowed.
- Offline-navigation preparation link.
- Clear warning to compare the track with current signs and official/local notices.

### 8. “Yola çıkmadan kontrol et”

Render status items from Spec 019 for weather, forest/fire restrictions, route disruption, water/services and transport. A missing record remains visible as “yakın tarihte doğrulanmadı.”

### 9. İbrahim's field note

When the current site has first-hand material:

- show the experience date prominently;
- include a short original summary or supported excerpt;
- link to the full journal;
- never edit the note into a current-condition claim.

### 10. Continue the journey

- previous stage;
- next stage;
- matching 3/5/7/full plans;
- main atlas;
- relevant preparation guide.

## Current 11 Stage-Article Changes

For each existing practical article:

- Retain canonical URL and useful first-person observation.
- Replace repeated generic opening copy with a unique decision summary.
- Correct start/end, date or label errors only after source verification.
- Add official-section relationship, source metadata and freshness labels.
- Replace isolated matching-journal link with full series navigation.
- Move 2014 prices, water and business statements into dated historical notes.
- Add meaningful image alt text and captions where the subject can be identified.
- Do not add unverified walking times, ascent or current camping claims to fill an empty template field.

## Component and Data Boundaries

- Build reusable presentational sections such as `StageQuickFacts`, `StageDecision`, `StageDayFlow`, `StageConditions`, `StageGps`, `StageSources` and `LikyaSeriesNavigation` under site-local components.
- Components receive normalized data from Spec 009; they do not parse MDX prose to calculate facts.
- Existing MDX may provide first-hand narrative through a dedicated slot/section.
- Use the existing deferred embed and analytics utilities.
- Do not add stage-specific `if (slug === ...)` layout branches beyond a central data lookup.

## Responsive Behavior

### Mobile

- Stage facts render as a compact one- or two-column definition list.
- Day flow uses vertical cards/steps; no wide itinerary table.
- Map is deferred and below the summary.
- Previous/next navigation stacks with descriptive labels and 48 px targets.
- Source detail uses disclosures but keeps status/date visible before expansion.

### Tablet

- Decision and quick facts may share a two-column grid.
- Day flow remains the main readable column.

### Desktop

- Main guide content and a bounded summary/source rail may sit side by side.
- The rail may be sticky only within the stage content boundary.
- Maps can use full content width but cannot stretch prose line length.

## Acceptance Criteria

1. One template can render retained existing stages and new stages from structured data without slug-specific JSX.
2. Every rendered stage contains a decision summary, route/effort, day flow, services, access/exit, GPS, current-check panel, sources and onward navigation—or clearly labels a field as not verified.
3. Historical observations and current-condition records are visually and semantically distinct.
4. Existing canonical stage URLs and first-hand content are preserved where page roles match.
5. Every GPS track is attributed and variant-specific; maps are deferred and have list/link alternatives.
6. Mobile pages are readable without tables or horizontal overflow; keyboard and screen-reader navigation covers every control.
7. The template matches the existing site in light and dark modes and introduces no global design change.

## Out of Scope

- Writing all regional stage content.
- Live tracking or route deviation alerts.
- Automatically converting an arbitrary GPX file into prose.
- Guaranteeing water, lodging or path access.
