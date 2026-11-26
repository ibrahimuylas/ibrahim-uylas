# Spec 024 — Add verified external Wikiloc navigation links

**Status:** Proposed  
**Priority:** P0 — navigation-source safety  
**Depends on:** Specs 022–023  
**Scope:** External links only; no GPX ingestion, mirroring, or public itinerary release

## Goal

When a practical stage has a genuinely equivalent Wikiloc trace, give visitors a clear option to open its original record and download it through Wikiloc. This reduces friction for hikers while preserving the author’s and platform’s ownership model.

## Eligibility for display

An external Wikiloc link is displayable only when an editor records and reviews:

- Original Wikiloc URL, immutable record ID, displayed author, upload date, record date, and access date.
- Exact official pafta coverage, start/end, and walking direction comparison.
- The trace’s declared route type and any meaningful discrepancy from the practical stage.
- A `verified` match decision by a named reviewer; `candidate` links stay internal.
- An explicit external-only delivery setting. No copied GPX, generated geometry, embedded map tile, or local download endpoint is permitted.

The card must say that the trace is an external community record, may differ from current route conditions, and should be checked against the official pafta and live restrictions before walking.

## Ranking

For a stage with multiple verified records, rank by:

1. Coverage/direction match.
2. Most recent recorded date, not merely upload date.
3. Named author and meaningful description/waypoints.
4. Evidence of direct walking rather than route planning or a loop/vehicle variant.

Do not use views, downloads, likes, TrailRank, or premium status as a safety or route-quality signal.

## Data and validation

- Add a structured `externalGpsLinks` array to the internal research record.
- Permit `gpsEvidence` to be either a rights-cleared local file or one or more reviewed external links.
- Require every external link to reference a registered `gps-platform` source, use a Wikiloc URL, expose no local file path, and have a supported match state.
- Only a `verified` external link can satisfy the GPS-navigation requirement for an eligible research record.
- Keep a stale-link review date; broken or removed external records return to `needs-review` and must not appear publicly.

## Public interaction when released

- Label: “Wikiloc’ta aç ve indir”.
- Open in a new tab; do not imply that downloading is free, available without sign-in, or available in a particular file format.
- Show author, recorded date, route-match note, and external-link disclaimer beside the action.
- Do not show the action on unreleased stages, plans, atlas records, or the current gated shell.

## Acceptance criteria

- [ ] External GPS data is never mirrored or presented as site-owned.
- [ ] Candidate, stale, broken, or unverified records cannot reach public cards.
- [ ] A verified external link can fulfil the navigation-link requirement without weakening route-metric, logistics, and official-pafta evidence requirements.
- [ ] The release gate and all current public content remain withheld until verified stages and plans exist.
