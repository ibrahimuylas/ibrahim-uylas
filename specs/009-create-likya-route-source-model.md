# Create the canonical Likya route and source model

**Type:** Foundation

**Priority:** P1 — every guide, plan and recommendation depends on trustworthy structured route data

**Risk:** High

## Goal

Create a versioned, source-backed data model for the complete Likya Yolu route before writing the new guide pages. The Ministry of Culture and Tourism route maps/paftas are the initial route-baseline candidate; their completeness, current availability, reuse terms and exact section order must be documented rather than assumed.

## Source Policy

### Route baseline

1. Inventory the Ministry's full Likya route map set, expected to contain 31 paftas, and record the actual count found.
2. Record page title, publisher, canonical URL, publication/update information when present, access date and map/pafta number.
3. Treat Ministry material as the route-definition baseline only after the inventory confirms that the referenced map is official and applicable.
4. Do not infer current path access, water, lodging or safety from a route map.

### Supporting route interpretation

Altuğ Şenel, Kate Clow, `likyayolu.org`, Wikiloc and İbrahim's field notes may clarify variants, walking-stage boundaries and practical decisions. They must be recorded as supporting sources, not silently merged into the official baseline.

Book wording, diagrams and proprietary GPS files must not be copied. The guide may write original summaries based on fact checking and may link to legitimate purchase or source pages.

### Current conditions

Weather, forest-fire restrictions, local closures, water observations, transport and business availability use the condition model in Spec 019. A current-condition source never overwrites the canonical route definition.

## Proposed Repository Structure

Use site-local data and validation, not reusable theme packages:

```text
site/src/content-guides/likya/
  sources.js
  route-sections.js
  walking-stages.js
  route-plans.js
  conditions.js
  validation.js
  README.md
```

Exact filenames may follow existing repository conventions, but route data must not be embedded separately in multiple UI components or MDX tables.

## Data Entities

### `Source`

Required fields:

- `id`: stable internal identifier.
- `title`, `publisher`, `url`.
- `sourceType`: `official-route`, `official-condition`, `book`, `community`, `gps-platform`, `first-hand`, or `editorial`.
- `authorityScope`: the claims this source can support, such as route geometry, route name, historical experience or current closure.
- `publishedAt` and `updatedAt` when the source supplies them.
- `accessedAt`.
- `reuse`: `link-only`, `quote-with-limit`, `embed-permitted`, `file-reuse-permitted`, or `unknown`.
- `notes`: factual limitations or edition information.

Facebook group posts may be included only as anonymized user-need evidence. They are not accepted as a route or safety authority.

### `OfficialRouteSection`

Represents one official pafta/map section, not necessarily one walking day.

Required fields:

- `id`, `sequence`, `name`, `start`, `end`.
- `editorialRegion`: `west`, `central`, or `east`.
- `officialMapSourceId` and official pafta/map number.
- `routeVariants`: explicit branches that leave and rejoin the baseline.
- `geometryStatus`: `external-reference`, `licensed-local`, or `not-available`.
- `distanceKm`: value plus source and qualification; never a source-free number.
- `relatedStageIds` and `relatedArticleSlugs`.
- `verifiedAt` and `verifiedBy`.

If geometry cannot legally be stored, keep an external source reference and build list-based navigation. Do not digitize a copyrighted map merely to satisfy the UI.

### `WalkingStage`

Represents a practical day or sub-day unit that the planner can combine.

Required fields:

- `id`, `name`, `start`, `end` and ordered official section IDs.
- `distanceKm` and, where verified, ascent/descent and expected time range.
- `difficulty`: controlled editorial scale with a written reason.
- `dailyLoad`: `light`, `moderate`, `demanding`, or `expert`.
- `terrainTags`, `experienceTags`, `seasonTags`, `lodgingModes`.
- `transportStart`, `transportEnd` as source-backed summaries or unknown states.
- `exitPoints`, `waterNotes`, `serviceNotes` as condition references, not timeless strings.
- `gpsTracks`: one or more external track records.
- `sourceIds`, `reviewedAt`, `reviewStatus`.

### `GpsTrack`

- `provider`, `externalId`, `url`, `embedUrl` when permitted.
- `owner`, `routeVariant`, `direction`, `distanceKm` as reported by the provider.
- `coverageStart`, `coverageEnd` and related official section IDs.
- `recordedAt`, `accessedAt` and known limitations.
- `rights`: whether embed, download link or local copy is permitted.

The UI must say whose track it is and what variant it covers. A track must not be labelled “resmî GPX” unless the publishing authority explicitly says so.

### `HistoricalExperience`

Links existing 2014 content without contaminating current data:

- `articleSlug`, `experienceDate`, `routeCoverage`, `distanceKm`.
- `relatedStageIds`.
- `contentKind`: planned itinerary, walked itinerary, daily journal, equipment or reflection.
- `historicalDisclaimer`.

## Distance and Variant Rules

- 509 km, 465 km, 430 km and 230 km must remain separate named records with their exact meanings; never average or substitute them.
- The total shown as “official/current full route distance” must be calculated or quoted only after the source inventory resolves route variants and edition date.
- User-facing totals must include a qualifier such as “selected branch,” “track provider distance,” “2014 plan” or “actually walked.”
- Where two sources disagree, store both claims, document the reason if known and choose one display value through an explicit editorial decision.

## Validation

Add a Node-based validation command using existing tooling. It must fail the build or validation task when:

- IDs or sequences are duplicated.
- A walking stage references a missing official section or source.
- A route plan references a missing stage.
- A displayed factual field lacks a permitted source or historical attribution.
- A GPS record has no owner, coverage or rights state.
- A current-condition record has no review state.
- An internal article slug does not resolve to a retained content page.

The validator should also report, without necessarily failing, missing optional fields such as ascent/descent or transport detail.

## Editorial Workflow

1. Capture the official-map inventory and archive only metadata/links unless reuse is permitted.
2. Normalize names and route order without changing source wording inside citations.
3. Reconcile existing 11 stage articles and the 2014 route plan against the official sections.
4. Record unclear branches and discrepancies as open data issues.
5. Review the data before writing regional prose.
6. Require source and review metadata in the same change as any new factual route data.

## Responsive and Design Impact

This specification does not create a screen, but the model must support compact mobile summaries:

- A stage card can render name, distance, difficulty, one key fit reason and freshness state without loading the full record.
- Map geometry must never be the only way to understand order or coverage.
- Long source titles and Turkish place names must wrap without truncating critical distinctions.
- Units are stored numerically but rendered with Turkish labels and locale formatting.

## Acceptance Criteria

1. The complete official Ministry map/pafta set is inventoried with actual count, order, source URLs, access dates and reuse status.
2. Every official route section has one stable record and belongs to one documented editorial region.
3. Every existing Likya route article and journal is mapped to the relevant route section/stage or explicitly marked unrelated/overlapping.
4. GPS tracks are external, attributed, coverage-specific records with rights states; no unauthorized GPX file is committed.
5. The four historical distance figures are separately modelled and accurately labelled.
6. Automated validation detects broken IDs, missing sources, unresolved internal slugs and unsafe current-condition records.
7. UI code can consume one shared source of truth for atlas cards, stage pages, short plans and recommendations.

## Out of Scope

- Writing regional guide prose.
- Designing the planner or map UI.
- Purchasing, scanning or reproducing guide books.
- Declaring a route safe, open or currently supplied with water.
- Hosting third-party map or GPS assets without permission.
