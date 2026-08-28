# Spec 037 — Model source-backed route metrics

**Status:** Completed  
**Priority:** P0 — planning accuracy  
**Depends on:** Specs 034–036  
**Scope:** Internal metric evidence; no public distances or itineraries

## Goal

Prevent untraceable distances, elevation figures and estimated durations from entering the planner. A practical stage needs separately reviewed values for distance, ascent, descent and expected walking time.

## Metric record

Every metric records a value, one of three measurement methods (`official-source`, `rights-cleared-gps-analysis`, or `field-observation`), source IDs, checked and review-due dates, reviewer and a bounded note.

Candidate platform data is not copied. In particular, a Wikiloc candidate link alone cannot supply a local distance, elevation or duration value.

## Rules

- All four metrics are required before the metric queue is complete.
- Values without a method, source, review dates or reviewer are incomplete.
- Metric completion does not publish a pafta or make it eligible for a route plan.
- Pafta 29 remains without a candidate and receives no inferred metrics.

## Acceptance criteria

- [x] Each candidate pafta has an explicit four-metric evidence queue.
- [x] The data model rejects a metric without a declared measurement method.
- [x] No candidate GPS figures, distance estimates or public itinerary claims were added.
