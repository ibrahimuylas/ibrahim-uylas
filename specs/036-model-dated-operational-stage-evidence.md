# Spec 036 — Model dated operational stage evidence

**Status:** Completed  
**Priority:** P0 — safety and route usefulness  
**Depends on:** Specs 034–035  
**Scope:** Internal evidence model; no public availability claims

## Goal

Store operational facts separately from route geometry and candidate GPS research. Water, resupply, lodging, transport and emergency exits may change; each claim must therefore be source-backed and have a review horizon.

## Evidence record

Each record is attached to a candidate practical-stage research record and contains:

- One fact type: water, resupply, lodging, transport or emergency exit.
- `verified` or `unavailable` decision; unknowns remain `not-confirmed` and do not satisfy the queue.
- At least one registered source, the date checked, the next review date, reviewer and a short bounded note.

The operational coverage report shows all five missing categories for each candidate pafta. It contains no prefilled facts and makes no statement that a service is available, unavailable or safe.

## Rules

- Historical diary text, route titles and community GPS tracks are not copied into operational evidence.
- `unavailable` still requires a dated source; absence of a record is never interpreted as unavailable.
- A complete operational card remains non-public until official pafta review, navigation evidence, route metrics and release requirements are also complete.
- Pafta 29 keeps its no-candidate state.

## Acceptance criteria

- [x] Every candidate pafta has an explicit five-fact operational evidence queue.
- [x] Undated or source-free operational claims are not complete evidence.
- [x] No current service claims, metrics or itinerary data were added to public content.
