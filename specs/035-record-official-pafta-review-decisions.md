# Spec 035 — Record official pafta review decisions

**Status:** Completed  
**Priority:** P0 — editorial evidence  
**Depends on:** Spec 034  
**Scope:** Internal editorial records; no public route release

## Goal

Give an editor a precise, auditable record format for a manual official-pafta comparison. The record captures a decision; it does not infer one from a Wikiloc title, route trace or source list.

## Verified review requirements

A review can be marked `verified` only when it contains:

- The official pafta ID and the specific candidate research record inspected.
- The official source, URL and date checked.
- Explicit `matches-official-reference` decisions for start, end, direction and route variant.
- At least one independently checked corroborating source and its review date.
- A named reviewer, decision date and concise decision note.

Draft, incomplete and rejected reviews are excluded from the completed-review index. A complete official review still leaves the pafta non-public: it does not verify an external navigation link, create metrics, establish current logistics or satisfy the release gate.

## Acceptance criteria

- [x] No manual review is pre-filled from candidate GPS data.
- [x] Only structurally complete `verified` reviews enter the reconciliation queue.
- [x] A reviewed pafta remains non-public until all independent stage eligibility evidence exists.
- [x] Validation and reporting retain the existing withheld release posture.
