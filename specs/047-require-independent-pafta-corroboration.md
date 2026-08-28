# Spec 047 — Require independent pafta corroboration

**Status:** Completed  
**Priority:** P0 — evidence integrity  
**Depends on:** Spec 046  
**Scope:** Internal editorial validation; no public route release

## Outcome

A complete pafta comparison now requires corroboration from a source outside the Ministry route corpus. An official route page cannot corroborate another official route page, and GPS-platform links remain ineligible for this check.

## Acceptance criteria

- [x] A qualifying corroboration has a distinct publisher and an eligible source type: book, community, first-hand or editorial.
- [x] Ministry route pages and GPS-platform links cannot satisfy independent corroboration.
- [x] Existing queue and validation tests reject a superficially complete, single-corpus review.
- [x] No pafta becomes reviewed, eligible or public through this change.
