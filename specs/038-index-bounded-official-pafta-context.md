# Spec 038 — Index bounded official pafta context

**Status:** Completed  
**Priority:** P0 — primary-source intake  
**Depends on:** Specs 034–037  
**Scope:** Internal primary-source index; no current-condition or route publication

## Goal

Add the first inspected Ministry pafta-detail pages to the research system without mistaking an undated descriptive page for a current field report.

## Indexed sources

- Pafta 21: Karaöz–Adrasan
- Pafta 27: Tahtalı
- Pafta 30: Ovacık–Göynük Kanyon
- Pafta 31: Sarıçınar–Hisarçandır

Each is an official route-description source accessed on 2026-08-28. No visible page-update date is recorded, so each observation is explicitly limited to route context and editorial review prompts.

## Rules

- The index may guide an editor to compare a candidate with the official map; it cannot verify an external GPS link.
- It cannot supply current water, service, hazard, transport, metric or publication data.
- Pafta 31’s forward-looking description is retained only as a review flag, not a current route-change claim.
- All indexed observations remain internal and `doNotPublish`.

## Acceptance criteria

- [x] Four official pafta-detail URLs are registered with source scope and access date.
- [x] Every observation carries explicit prohibited uses for current and publishable data.
- [x] The coverage report distinguishes indexed context from unindexed detail pages without changing public content.
