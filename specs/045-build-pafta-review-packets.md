# Spec 045 — Build pafta review packets

**Status:** Completed  
**Priority:** P0 — editorial evidence  
**Depends on:** Spec 044  
**Scope:** Internal editorial workflow; no public route release

## Outcome

The reconciliation queue now supplies each pafta with a review packet: its bounded Ministry route-context record, the candidate record IDs to inspect and the full set of required checks. The packet aids a human comparison but cannot create a review decision or alter publication eligibility.

## Acceptance criteria

- [x] All 31 paftas receive exactly one indexed official-context record in the reporting workflow.
- [x] The packet exposes the source ID, access date, route context and manual review prompt.
- [x] Adding a context packet alone preserves `unmapped`/non-public status.
- [x] The reconciliation report makes the evidence available to editors without surfacing it in public route content.
