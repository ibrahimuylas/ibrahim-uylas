# Desktop Article Contents Navigation — Design QA

## Evidence

- Reference:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-fd2ae51a-833b-4920-8319-dedb5e816d57.png`
- Implementation:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-desktop-full.png`
- Focused comparison:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-design-comparison.png`
- Desktop viewport: 1440 × 900, dark theme
- Comparison crop: 894 × 506

The reference and implementation use different page content, so the comparison
targets the navigator geometry, line hierarchy, card position, surface
treatment, typography hierarchy, and interaction state. The implementation
intentionally keeps the requested detail to one line, so its preview is shorter
than the multi-line Codex reference.

## Visual findings

- The navigation remains fixed at the left-middle edge and does not change the
  article width.
- The preview begins 108 pixels from the left edge, matching the reference's
  approximately 107-pixel offset.
- The preview width is 640 pixels, matching the reference closely.
- The 12 section marks use three title-based lengths; the focused mark expands
  to 52 pixels.
- The preview title and extracted paragraph remain on one line with safe
  truncation.
- No horizontal overflow occurs at 390, 768, 1024, or 1440 pixels.
- Light and dark theme tokens are inherited from the existing site design
  system.

## Interaction and responsive QA

- The desktop navigator is hidden before the inline contents table passes the
  viewport and appears after it passes.
- Mouse click, Enter, and Space update the URL fragment, place focus on the
  destination heading, and scroll that heading to the top of the viewport.
- Focus opens the same preview state as hover. Escape closes the preview while
  preserving focus.
- The hover and focus paths share the same preview handler; leaving a mark or
  the rail clears the preview.
- At 390 pixels the existing bottom-left pill and modal sheet remain in use.
  The backdrop is transparent with `blur(10px)`, background scrolling is
  locked, Escape closes the sheet, and focus returns to the pill.
- At 768 and 1024 pixels the tablet sheet remains active. Its two columns have
  `min-width: 0`, long headings do not overlap, and no horizontal overflow is
  introduced.
- Resizing an open tablet sheet to the desktop breakpoint closes the modal,
  restores scrolling, and switches to the desktop rail.

## Implementation iteration

Browser QA exposed a race where a fixed-rail click could update the fragment and
focus without changing the scroll position. Rail navigation now runs on the next
animation frame. The retest placed each selected heading at the top of the
viewport for click, Enter, and Space. Escape was also adjusted to close only the
preview rather than discarding keyboard focus.

## Validation

- `npm run build` from `site/`: passed
- Prettier check for all changed implementation and specification files: passed
- `git diff --check`: passed
- Gatsby emitted existing dependency-compatibility and Browserslist warnings;
  no build failure was introduced.

final result: passed
