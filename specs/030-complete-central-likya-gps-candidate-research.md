# Spec 030 — Complete Central Likya GPS candidate research

**Status:** Completed  
**Priority:** P0 — evidence collection  
**Depends on:** Specs 022–024, 029  
**Scope:** Internal candidate intake only; no route publication

## Goal

Add external-only GPS research leads for Paftas 15–18, completing candidate-level coverage of the Central Likya group.

## Triage decisions

- Pafta 15 uses a Demre–Alakilise trace: the official Vadi and Belören scope must be checked.
- Pafta 16 uses an Alakilise–Yukarıbeymelek trace: it shares only one named place with the official pafta.
- Pafta 17 uses a Finike–Demre (Beymelek) trace explicitly reported as incomplete and partially off-route; it is deliberately marked low confidence.
- Pafta 18 uses a Yukarıbeymelek–Finike trace; the one-name official pafta does not define a complete boundary.

## Safeguards

- Every record remains `candidate`, `externalDownloadOnly: true`, and non-public.
- No GPS file, geometry, measurement, logistics or conditions claim is copied into the guide.
- A separate geometry and operational review is required before any candidate can become eligible.

## Acceptance criteria

- [x] Paftas 15–18 report `research`; no Central pafta remains unmapped.
- [x] The incomplete Pafta 17 trace is labelled low confidence.
- [x] All records preserve canonical URL, attribution and available dates.
- [x] No public GPS link, downloadable file or itinerary is added.
