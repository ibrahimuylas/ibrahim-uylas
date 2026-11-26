# Spec 023 — Build the Likya pafta research board

**Status:** Proposed  
**Priority:** P0 — research operations  
**Depends on:** Spec 022  
**Scope:** Internal editorial tooling; no public route content

## Problem

Spec 022 defines what a safe, publishable practical stage needs, but a researcher still needs a reliable starting point for each of the 31 official paftas. A blank stage catalogue does not show what to research next, which official reference applies, or which evidence is still missing.

## Outcome

Create an internal, generated research board with exactly one card per official pafta. It uses the verified official inventory as its only prefilled source and makes the remaining research work explicit. It is a work queue, not a claim that each pafta is a one-day stage.

## Research card

Each card must include:

- Official pafta ID, title, region, stated start/end, and official map/reference link.
- Current practical-stage coverage state derived from the Spec 022 research catalogue.
- A checklist for: official-boundary review, practical stage decision, GPS owner and reuse permission, route metrics, terrain/hazards, water, resupply, sleep/camping, transport, emergency exit, and review.
- A safe next action that points to the official reference first.
- A `doNotPublish` state until at least one rights-cleared, evidence-complete practical stage covers the pafta.

## Rules

- The board must be generated from `routeSections`; hand-maintained parallel pafta lists are prohibited.
- Existing practical-stage research can change the card’s evidence status, but cannot change official titles or geometry.
- Missing evidence is shown as missing, never filled with an estimate or a historic claim.
- The board is unavailable to the public planner, atlas, and stage pages.
- A card reaching `eligible` is not public publication; it only tells the release workflow that the research evidence is complete.

## Implementation

1. Add a pure board builder that combines `routeSections` and `stageResearchRecords`.
2. Export a concise command-line report, sortable by regional group and urgency.
3. Test 31-card coverage, official-source inheritance, unresolved-state behaviour, and evidence-complete behaviour.
4. Keep the release gate dependent on actual stage/recommendation publication; the board is evidence intake only.

## Acceptance criteria

- [ ] The board contains exactly 31 cards in official pafta order.
- [ ] Each card links to its official source and has no invented distance, GPS, or logistics data.
- [ ] Every card exposes the same evidence checklist and a clear next action.
- [ ] A source-backed practical-stage record changes only the matching pafta card(s).
- [ ] Public recommendation data remains unchanged and the canonical shell remains gated.
