# Spec 046 — Export pafta review workspace

**Status:** Completed  
**Priority:** P0 — editorial evidence  
**Depends on:** Spec 045  
**Scope:** Internal editorial workflow; no public route release

## Outcome

The reconciliation data can now be exported as a pafta-by-pafta review workspace. Each packet presents the official detail-page URL, its bounded review prompt, candidate external GPS links and the required decision checks in one place.

## Acceptance criteria

- [x] Candidate links remain explicitly marked as candidates and external-download-only.
- [x] The export does not copy GPS geometry, measurements or current-condition claims.
- [x] A pafta without a candidate link states that additional research is required.
- [x] The workspace does not alter review, eligibility or public-release status.
