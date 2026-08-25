# Add the Likya source status and freshness workflow

**Type:** Foundation and operations

**Priority:** P1 — current-condition claims must degrade safely when the site cannot be continuously updated

**Risk:** High

## Goal

Create a manual-first, low-maintenance workflow for weather links, fire/forest restrictions, closures, route disruption, water, services and transport. Make the age and authority of information visible to users without promising a real-time safety service.

This work is deliberately separate from route definition and content writing.

## Core Promise

The site can reliably say:

- which source was checked;
- when it was checked or observed;
- what the source said at that time;
- when the item should be reviewed again;
- what the visitor must still verify before departure.

The site cannot reliably say a route is safe/open merely because it has no recorded warning.

## Status Taxonomy

Use plain Turkish labels with text and icon, never color alone:

### `official-notice`

User label: `Resmî duyuru var`.

For active or open-ended official closure, restriction or disruption notices. Must show source, effective date and review/expiry rule. This state can block a plan recommendation when the notice applies to its route/date.

### `season-reviewed`

User label: `Bu sezon kaynak kontrol edildi`.

Means the named source was reviewed during the current editorial window. It does not mean “safe,” “open” or “water guaranteed.” Show checked date and what category was checked.

### `historical-note`

User label: `Tarihsel saha notu`.

For İbrahim's or another dated field observation. Always show observation date and never use it as a current status.

### `review-due`

User label: `Yakın tarihte doğrulanmadı`.

Used automatically after `reviewDueAt` or when a changing claim lacks a recent enough check. The UI prioritizes the official/current source link.

### `unknown`

User label: `Güncel bilgi bulunamadı`.

For missing or conflicting information. Do not hide the row.

Avoid labels such as `güvenli`, `açık`, `sorun yok` or a standalone green check.

## Condition Record

Required fields:

- `id`, `category`, applicable route/stage/region IDs;
- `summary` written narrowly;
- `status`;
- `sourceId` and direct source URL;
- `observedAt` or `checkedAt`;
- `effectiveFrom`, `effectiveTo` where supplied;
- `reviewDueAt` chosen for the specific claim;
- `editorialOwner`;
- `blocksRecommendation` and written reason;
- `replacementCheck`: what the visitor should verify now;
- `archivedAt` when superseded.

Do not use one universal expiry period. A closure, seasonal water observation and bus timetable age differently. Each content type gets a documented default review interval, and the record may choose a shorter interval.

## Source Tiers

1. **Primary official:** national/local public authorities and official operators for their own notices.
2. **Direct operator/local primary:** transport operator, municipality, protected area or named business for its own operation.
3. **Recent field observation:** attributed and dated, useful as a lead but not authoritative for legality/safety.
4. **Community signal:** identifies a question or possible change and triggers review; it is not published as fact without verification.

Facebook group content belongs to tier 4 unless the linked post itself is an official source. Do not scrape or republish personal posts.

## User-Facing Status Panel

Every plan and stage includes `Yola çıkmadan kontrol et` with these rows:

- weather;
- fire/forest access and local restrictions;
- route/transport disruption;
- water and services.

Each row shows status label, checked/observed date, narrow summary and `Kaynağı aç`. When the site has no recent record, show the official verification path rather than removing the row.

The guide home shows a compact aggregate, but individual stage/plan records remain the authority for scope.

## Manual Editorial Workflow

### Scheduled guide review

- Run a full source review before the main spring and autumn walking periods.
- Review all `review-due` items and route-source links.
- Record the review even when the source contains no applicable notice; phrase this as “source checked,” not “no risk.”

### Before highlighting a plan

- Check every blocking condition category for the plan's stages.
- Prevent `season-reviewed` publication if a required source is unavailable or ambiguous.
- Record reviewer and review date in the same change.

### When a warning is learned

- Verify it with the highest available source tier.
- Add/update the condition record, scope and effective dates.
- Rebuild the site.
- Remove the block only after a new source check; archive rather than delete the old notice.

### When no timely maintenance is possible

- Let records degrade to `review-due` automatically at build time.
- Keep source links and user responsibility visible.
- Never leave an old “this season checked” badge indefinitely.

## Validation and Build Behavior

Add a validation script that fails on:

- `official-notice` without primary source and effective/review fields;
- `season-reviewed` past its `reviewDueAt`;
- a safety-sensitive summary with no source;
- a recommendation-blocking record with no route scope;
- duplicate active notices for the same source/scope that conflict;
- invalid URLs or missing source IDs.

The production build date must be available to derive display state. Do not mutate source files during build.

## Operational Documentation

Add a concise maintainer runbook covering:

- where each source type is checked;
- how to add, extend, supersede and archive a record;
- how to run validation and preview affected pages;
- Turkish wording examples for each status;
- escalation rule for conflicting official sources;
- rollback procedure for an incorrect notice;
- responsibility statement that the system is informational, not emergency monitoring.

## Responsive and Accessibility Requirements

- Mobile panels use one row per category with status/date visible before expansion.
- Long official titles and URLs wrap; raw URLs need not be printed in the interface.
- Status icons are decorative when the text label is present.
- Date semantics are explicit: `Kaynak kontrolü`, `Saha gözlemi`, `Yürürlük` and `Sonraki inceleme` must not be merged into one “güncellendi” date.
- High-priority notices appear before maps and day details without relying on animation.

## Acceptance Criteria

1. Every stage and plan renders all four current-check categories, including explicit unknown/review-due states.
2. No current-condition claim appears without source, scope, date and review rule.
3. Expired “this season checked” states degrade automatically and fail validation where appropriate.
4. Active official notices can block affected recommendations but never infer that unaffected routes are safe.
5. A maintainer can update one record, validate it and identify every affected page without editing JSX or multiple articles.
6. Historical field notes remain distinct from current checks in data and UI.
7. The workflow can operate manually without a database, CMS or continuous monitoring service.

## Out of Scope

- Automatic publication from scraped pages or APIs.
- Weather forecasting or fire-risk calculation.
- Emergency alerts or user-location monitoring.
- Treating Facebook/community posts as verified conditions.
