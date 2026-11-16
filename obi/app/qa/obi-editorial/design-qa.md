# Obi selected editorial homepage — 16 November 2026

final result: passed

Source visual truth: `../design/mockups/obi-home-2026-11-16/01-quiet-editorial.png` (first displayed generated image, explicitly selected by the user). Implementation: `http://127.0.0.1:4173/`, English landing page, first real portrait, secondary sections collapsed.

## Evidence and normalization

- Source: 1330 × 1182 px. Requested browser CSS viewport: 1330 × 1182, devicePixelRatio 1. Browser screenshot output: 1315 × 1169 px; its screenshot-backend scaling was normalized to 1330 × 1182 for comparisons, with no crop or device frame.
- Initial implementation screenshot: `qa/obi-editorial/desktop-initial.jpg`; initial combined comparison: `qa/obi-editorial/comparison-initial.jpg`.
- Final implementation screenshot: `qa/obi-editorial/desktop-final.jpg`; both source and final implementation were opened together in `qa/obi-editorial/comparison-final.jpg`.
- Focused hero typography/dates/facts comparison: `qa/obi-editorial/comparison-hero-detail.jpg`, opened and inspected after the full-view comparison.
- Responsive screenshots: `qa/obi-editorial/{en,tr}-{width}x{height}.jpg`. Machine-readable observations: `qa/obi-editorial/responsive-results.json`; initial findings retained in `responsive-results-initial.json`.

## Findings and comparison history

1. Initial P2: greeting scale was too small and the subtitle stayed on one line, changing the hierarchy. Increased the serif display size, constrained subtitle width, adjusted date spacing and fact-row rhythm. Final combined and focused comparisons confirm the intended two-line lead, two prominent dates and left/right editorial composition.
2. Initial P2: the longer Turkish greeting overflowed its desktop column at 1440 px. Added a language-aware display-size clamp. Rechecked Turkish at 320, 768 and 1440 px, captured revised evidence and updated the result matrix: no heading or root overflow remains in all 14 cases.
3. Final comparison: no remaining actionable P0/P1/P2 findings. Minor raster/font rendering differences are P3; the generated design does not specify a font file. The real portrait deliberately uses the supplied photograph, not the mockup’s subtly regenerated dog.

## Required fidelity surfaces

- Fonts/typography: DM Serif Display is locally bundled for greeting, story and parent names; Inter remains UI/body. Latin-ext is bundled for Turkish. Display size, two-line lead, date emphasis and hierarchy were checked in full-view and focused comparisons. No truncated headings remain. Body text stays 13–14 px on phones and 14 px for story/notes.
- Spacing/layout: profile left, real gallery right, approximately square large photo, complete four-thumbnail grid, two date columns, horizontal desktop timeline and unboxed parent strip match the selected composition. Phones use one column; timeline becomes vertical. No nested cards or added dashboard surfaces.
- Colors/tokens: existing ivory #f8fbfe, navy #10294c, muted blue #587294, blue dividers and date icons retained. No invented brand palette, gradient or decorative raster replacement.
- Image quality/assets: existing full-size WebP and bounded thumbnails are reused. Main gallery uses a face-safe crop; enlarged originals remain available with provenance. Parent portraits use existing reviewed framing. AI gallery frames retain an explicit badge; archived originals are unchanged. Standard Phosphor calendar/navigation icons are used.
- Copy/content: exact birth date, approximate homecoming, unconfirmed eye colour, breeder attribution and all existing records remain. Photo credits are available in gallery lightboxes and the profile/photo-history disclosure. Siblings and AI comparison remain secondary and collapsed.

## Responsive and interaction verification

Both English and Turkish were rendered at 320 × 740, 390 × 844, 430 × 932, 768 × 1024, 1024 × 768, 844 × 390 landscape and 1440 × 1024. All 14 final observations report no document overflow and no greeting overflow; four navigation controls and all four gallery thumbnails remain present. Phone, tablet and landscape screenshots were visually inspected.

At 390 × 844: gallery opens within the viewport; Next changes to photo 2 of 4; closing returns to the page. Billie’s parent profile opens and fits, with all 11 health rows. Family navigation opens the tree; Show siblings changes 11 visible dogs to 17. All mobile tree animations compute to `none`, transitions to `0s`. Browser console: zero errors in the reviewed session. Physical iPhone testing was not performed.

Repository checks: 29 app tests, four hosting tests and production build passed. Existing large-bundle warning remains. No runtime, hosting template, archived medical grade or source record was replaced.

## Follow-up polish

P3 only: generated typography has small optical differences from the bundled display font; exact raster matching is not asserted. Real photo pose/texture is intentionally more faithful to the user’s original than the generated concept.

## Implementation checklist

- [x] Resolve displayed selection and archive all three generated mocks/prompts.
- [x] Implement editorial layout with original photographs and preserved interactions.
- [x] Fix initial typography and Turkish overflow findings.
- [x] Re-capture and inspect full-view plus focused comparisons.
- [x] Verify two languages, seven viewport sizes, gallery/profile/tree interactions, and console.
- [x] Pass application, hosting and production-build checks.

## Production verification

Netlify production deploy `6afaf88b3f08a369a02c4f39` is live at https://obi.uylas.net. The actual production Turkish page was inspected at 390 × 844; heading and document overflow were both false, all four gallery thumbnails were present, and the new typography/photo layout rendered correctly. Screenshot: `qa/obi-editorial/production-mobile.jpg` (relative to app root). Browser viewport override was reset after verification.

## Canonical branch commit checks

Before committing, the changes were reconciled with the existing clean `codex/obi-family-archive` checkout. Earlier user-confirmed October photo identities, corresponding sibling concepts and their regression checks were preserved. The primary seven-week portrait, selected layout and approved November concept are unchanged. A fresh dependency install, 29 app tests, production build and four hosting tests passed in that checkout. No new browser verification or publication was performed during this commit-only request.
