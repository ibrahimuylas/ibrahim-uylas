# Spec 034 — Reconcile official paftas with practical-stage evidence

**Status:** Completed  
**Priority:** P0 — publication integrity  
**Depends on:** Specs 022–024, 033  
**Scope:** Internal editorial verification workflow; no public route content

## Goal

Turn the candidate inventory into a reviewable, official-pafta-first work queue without promoting any third-party GPS trace to a verified route or a visitor-facing recommendation.

## Decision

An external GPS candidate is only a lead. It cannot establish the official pafta boundary, a practical walking-stage decision, direction, route variant, current operational facts or rights to reuse a file.

Every official pafta receives an internal reconciliation item with:

- The official map reference inherited from the authoritative pafta inventory.
- Linked candidate research records, where they exist.
- A separate external-match status: `candidate`, `verified`, `rejected` or absent.
- Required checks for boundary, endpoints/direction, variant, independent corroboration, navigation link and practical-stage decision.
- A non-public state until all existing eligibility evidence is complete.

## Queue states

- `unmapped`: no accepted candidate record exists.
- `candidate-review`: one or more external records are leads only; they require manual comparison with the official reference.
- `facts-and-rights-review`: a navigation match has been verified but route facts, independent corroboration or publication evidence remains incomplete.
- `blocked`: an available external record has been rejected and cannot be used.
- `evidence-complete`: all existing eligibility evidence is present; this still requires the separate release workflow.

## Rules

- The queue is generated from `routeSections` and `stageResearchRecords`; it never maintains a second pafta list.
- No GPX, geometry, external-map tiles, measured metrics or operational claims are imported.
- `candidate-review` never changes an external link to `verified` and never makes it public.
- Pafta 29 remains `unmapped` until direct evidence exists.
- Public planner, atlas, route plans and canonical guide remain gated.

## Acceptance criteria

- [x] Exactly 31 official-pafta review items are generated in official order.
- [x] All currently sourced GPS records remain in `candidate-review`; Pafta 29 is `unmapped`.
- [x] A candidate cannot satisfy the navigation, boundary, corroboration or stage-decision checks.
- [x] The report is available for editorial work and no visitor-facing route content changes.
