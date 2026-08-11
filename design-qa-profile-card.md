# Design QA — Homepage profile card

- Source visual truth: `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-8ef16d10-aea6-4a1d-bc19-99de74cad299.png`
- Supplied photo: `/Users/uylas/Desktop/bu-adam-kim.jpeg`
- Browser-rendered implementation: `/var/tmp/ibrahim-homepage-viewport-1440.png`
- Focused implementation crop: `/var/tmp/ibrahim-about-card-implementation.png`
- Side-by-side comparison: `/var/tmp/ibrahim-about-card-comparison.png`
- Route and state: `http://127.0.0.1:8000/#one-cikanlar`, light theme, default state
- Viewport: 1440 × 1000 CSS px, device scale factor 1
- Source pixels: 936 × 1680; normalized card crop: 508 × 1550 → 328 × 1000
- Implementation pixels: 1425 × 1000 viewport capture; normalized card crop: 254 × 788 → 322 × 1000

## Full-view comparison evidence

The profile card remains aligned with the featured and recent post grid. Its existing background, corner radius, text hierarchy, spacing rhythm, and CTA styling are preserved. The new image fills the card width without changing the surrounding grid or creating horizontal overflow.

## Focused-region comparison evidence

The focused side-by-side comparison confirms the requested intentional change: the mountain icon and “Merhaba,” heading are removed, and the supplied photo now owns the top of the card. The crop keeps the face, hand gesture, blue jacket, sky, and mountain context visible. The source file remains portrait-oriented and CSS `object-fit: cover` controls the displayed crop.

## Required fidelity surfaces

- Fonts and typography: unchanged from the existing card; paragraph size, weight, line height, and CTA type remain consistent.
- Spacing and layout rhythm: the photo joins the card edges cleanly; content padding and bottom-aligned CTA are preserved.
- Colors and visual tokens: the existing light-blue card surface and primary CTA token remain unchanged.
- Image quality and asset fidelity: the supplied 768 × 1024 image is rendered through Gatsby image optimization. No stretching, identity alteration, or visible compression artifact is present.
- Copy and content: both biography paragraphs and “Bu adam kim?” CTA are unchanged; only “Merhaba,” was removed as requested.

## Responsive and interaction checks

- 1440 px desktop: passed; full card visible and balanced with the main content.
- 1024 px breakpoint: passed; image, copy, and CTA fit without overflow.
- Below 1024 px: the existing site sidebar behavior continues to hide this card.
- CTA target remains `/ibrahim-uylas-kimdir/` with its existing accessible label.
- Browser console: no non-warning runtime errors; existing React development warnings remain unrelated to this change.

## Findings

No actionable P0, P1, or P2 differences remain. The visible difference from the source is the requested photo replacement.

## Comparison history

- First pass: no P0/P1/P2 issue found. The subject crop, card proportions, text flow, and CTA placement were accepted without a corrective visual iteration.

## Follow-up polish

No P3 follow-up is required.

final result: passed
