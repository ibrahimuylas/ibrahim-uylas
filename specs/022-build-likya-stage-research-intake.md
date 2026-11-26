# Spec 022 — Build the Likya stage-research intake and evidence workflow

**Status:** Proposed  
**Priority:** P0 — required before route, stage, or itinerary publication  
**Depends on:** Specs 009–021  
**Scope:** Editorial-data foundation and release evidence; no public route recommendations yet

## Problem

The guide has a complete official-section inventory, a historical 2014 walking record, preparation content, and a release gate. It deliberately does **not** yet have a source-backed practical stage catalogue. That is the remaining blocker for publishing stage pages, GPS downloads, 3/5/7-day recommendations, or a through-hike plan.

The current historical record is useful context, but it cannot establish a present-day route: it does not reconcile to the 31 official paftas and has no current GPS ownership, condition, logistics, or evidence trail. Converting it into recommendations would create false certainty.

This spec creates a repeatable intake process that turns authorised, attributable research into reviewable stage records. The process should be able to operate in small batches and be repeated when route data changes.

## Outcome

Every eventual published practical stage can answer, in one place:

- Which official route section(s) it represents.
- Where its start and finish are, and what direction it is described in.
- Which GPS trace is offered, who supplied it, when it was recorded, and whether the site may redistribute it.
- Which distance, ascent/descent, duration, terrain, water, resupply, accommodation, transport, and exit claims are supported by which sources.
- When its route facts and its operational facts were last checked.
- Whether it is ready for a route plan, visible only as research, or withheld.

The public guide remains unavailable until the existing release gate evaluates the verified catalogue as ready.

## Source hierarchy and rights

Research must record the source type, URL or citation, access date, quoted claim in the research notes, and permission/reuse status for every imported fact.

1. **Official route reference:** the Ministry of Culture and Tourism Likya Yolu paftas and route pages define the official-section baseline.
2. **Primary route evidence:** GPS files or field notes produced by the team, a named contributor, or a provider with explicit redistribution permission.
3. **Operational evidence:** official local/transport/accommodation/operator pages, confirmed directly with the business or authority, or a dated named field report.
4. **Secondary references:** Altuğ Şenel, Kate Clow, and other reputable guides can identify research leads and contextual history. They must be cited precisely and cannot be copied wholesale or treated as a live operational source.
5. **Community posts:** useful only as leads. A Facebook post, forum comment, or unverified social update never alone makes a stage publishable.

Wikiloc and comparable platforms can be offered as an **external navigation/download option** only. The guide must link visitors to the original record and its author; it must not mirror, bundle, scrape, or redistribute the GPX file or map geometry. A platform record is an optional navigation aid, not an official-route or current-conditions claim.

Do not extract map geometry, GPS traces, screenshots, or book text unless its licence or explicit permission permits the intended use. If rights are unclear, store only a source reference and mark the record as withheld.

## Research record model

Create one internal research record per proposed practical stage. It may be incomplete while under research, but must use explicit status rather than guessed values.

### Identity and reconciliation

- Stable internal `stageId`; do not reuse the historical `ibrahim-2014-stage-*` IDs as current stages.
- Turkish public title, optional English title, route direction, and intended walking order.
- Start/end settlement or waypoint names, with source-backed coordinates.
- One or more `officialSectionIds` from the 31-section inventory.
- A reconciliation note where a practical stage crosses, splits, or combines official sections.
- Geographic group: Western (1–10), Central (11–18), or Eastern (19–31), based on the mapped official sections.

### Route and GPS evidence

- GPS source ID, original filename or URL, owner, licence/permission, recorded/updated date, and checksum or immutable version reference where possible.
- For an external-only GPS option: platform, original record URL and ID, author, recorded/uploaded date, access date, matching direction, and the evidence used to verify equivalence. Its download destination must be explicitly `external-provider`.
- GPS direction and any known deviation from the official path.
- Calculated distance, elevation gain/loss, and moving-time method, each labelled with its tool/version and calculation date.
- Surface/terrain, navigation complexity, exposure, and objective hazards, with a cited basis and an uncertainty field.
- A map-preview geometry only where display rights are known.

### Logistics and safety evidence

- Water points and reliability qualifier; never present a seasonal source as guaranteed.
- Food/resupply, accommodation/camping, transport access, emergency exit, mobile coverage, and permit/restriction notes.
- `routeFactsCheckedAt` and `operationalFactsCheckedAt` independently; operations age faster than route geometry.
- A linkable current-conditions category, without copying weather/fire/closure assertions into the stage record.

### Editorial state

- `research`, `needs-review`, `withheld`, `eligible`, or `published` status.
- Missing-evidence checklist and named owner for the next verification step.
- Reviewer, review date, change log, and source IDs used for approval.
- A plain-language uncertainty note shown to editors and, once published, users where it affects decisions.

## Completion rules

A stage may become `eligible` only when all of the following are true:

- It reconciles to at least one official route section.
- Its start, finish, direction, distance, elevation, and intended GPS trace are present and source-backed.
- Either GPS ownership and public redistribution permission are recorded for a local file **or** a verified external-provider GPS record is available. An external record is linked out only, never rehosted.
- The route facts have a documented review date and source IDs.
- Water, resupply, sleep/camping, transport, and emergency-exit data are either source-backed or explicitly marked unavailable; none may be silently omitted.
- A reviewer has resolved material discrepancies between the official baseline, GPS, field evidence, and secondary sources.
- The data validators pass and the record has no `needs-review` or `withheld` prerequisite.

`published` additionally requires the release owner to run the existing release gate successfully with `LIKYA_REQUIRE_READY=1`, and to document the release decision. Until then, all new records stay internal or withheld from planning.

## Batch workflow

Work in bounded geographic batches so the guide can be researched without claiming partial-route readiness:

1. **Intake:** list the candidate practical stages for a group and connect each to official paftas. Capture source references before interpreting them.
2. **Evidence capture:** acquire or record GPS permissions, calculate route metrics reproducibly, and gather route/logistics sources.
3. **Reconciliation:** compare GPX and practical boundaries with the official-section inventory. Record deviations rather than normalising them away.
4. **Safety and logistics review:** identify facts that require an in-season recheck and route them to the manual conditions workflow from Spec 021.
5. **Editorial review:** resolve gaps, rights questions, and discrepancies. Leave unresolved records `withheld`.
6. **Data entry and validation:** add only approved evidence to the structured catalogue; run data, freshness, link, and release checks.
7. **Release decision:** publish only after all three geographic groups make the release gate ready. A completed batch is useful research, but is not a public promise that the whole route is ready.

Each batch must produce a reconciliation report listing every official section in that group and its status: `unmapped`, `research`, `needs-review`, `eligible`, or `published`.

## Relationship to existing content

- Keep the 2014 records in `historicalExperience` as an archived personal account. They may supply research leads but cannot be promoted automatically.
- Keep `routeSections` as the official pafta inventory; no distance, difficulty, or walking-time fields should be inferred merely to fill gaps.
- Add new practical-stage data only through a dedicated source-backed catalogue, not by modifying the historical stage array in place.
- Keep `routePlans` empty until their component stages are eligible. Plan selection must continue to reject withheld stages.
- Keep current-condition updates in the manual monitoring workflow. Stage research can link to it but cannot claim that closures, fire restrictions, or weather are live.

## Proposed implementation slice after research design approval

1. Add a structured private/editorial stage-research catalogue and schema validator.
2. Add source IDs, evidence metadata, review state, and pafta reconciliation fields; initially populate only records with genuine evidence.
3. Create an internal reconciliation report generator for the three official-section groups.
4. Extend the release validator so it counts only reviewed, rights-cleared practical stages and reports the missing official sections precisely.
5. Add public stage cards, GPS downloads, and itinerary recommendations only after the catalogue makes the canonical gate ready.

The first implementation must not fabricate a sample GPX, coordinates, operational claim, licence, or current status just to make the UI look complete.

## Acceptance criteria

- [ ] A written source/rights policy distinguishes official references, primary evidence, secondary sources, and community leads.
- [ ] The record model covers identity, official reconciliation, GPS provenance, route metrics, logistics, freshness, uncertainty, review, and release state.
- [ ] Every official pafta can be assigned a transparent research status without inventing a practical stage.
- [ ] Historical content remains visibly historical and cannot satisfy publication criteria.
- [ ] Eligibility rejects missing GPS permission, missing official reconciliation, stale/unreviewed facts, and unresolved discrepancies.
- [ ] The workflow keeps temporary research evidence out of the public planner and route atlas.
- [ ] The existing release gate remains the sole mechanism for enabling the guide shell and recommendations.

## Out of scope

- Automated scraping or unattended publishing of weather, fire, closure, or restriction notices.
- Reproducing proprietary book maps, text, or third-party GPS tracks without permission.
- Publishing a partial route as a complete 3/5/7-day recommendation.
- Changing the established public visual design before verified content is available.
