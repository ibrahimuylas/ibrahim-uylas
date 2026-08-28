# Spec 029 — Seed Central Likya GPS candidate research

**Status:** Completed  
**Priority:** P0 — evidence collection  
**Depends on:** Specs 022–024, 028  
**Scope:** Internal candidate intake only; no route publication

## Goal

Create one rights-preserving, external-only Wikiloc candidate record for each of the first four Central Likya paftas: Kaş–Limanağzı, Çoban–Boğazcık, Boğazcık–Üçağız, and Üçağız–Andriake–Demre.

## Triage decisions

- Pafta 11: a Kaş–Limanağzı titled trace is the closest direct lead, but its geometry and endpoints remain unverified.
- Pafta 12: the available Üzümlü–Boğazcık–Kılınçlı trace is a broad lead, not a confirmation of the official Çoban–Boğazcık boundary.
- Pafta 13: the Boğazcık–Aperlai–Üçağız trace continues to Kaleüçağız and Çayağzı; only the Pafta 13 overlap is under research.
- Pafta 14: the Kaleüçağız–Andriake trace is a near-title lead; its start-name relationship to Üçağız and its Demre extension require comparison with the official pafta.

## Safeguards

- Preserve author, record date, upload date and canonical source URL.
- Mark every link as `candidate`, `externalDownloadOnly: true`, and non-public.
- Do not import GPX, map geometry, distance, elevation, water, transport, accommodation, trail-marking or condition claims from the records.
- None of the candidates becomes eligible or published without a separate official-pafta geometry review and operational fact check.

## Acceptance criteria

- [x] Paftas 11–14 report `research`; they remain excluded from public guide output.
- [x] Central coverage reports 4 research candidates and 4 unmapped paftas.
- [x] All candidate links stay external-only and contain explicit scope/variant uncertainty notes.
- [x] No public GPS link, downloadable file, or plan is added.
