# Desktop Article Contents Navigation — Design QA

## Evidence

- Reference:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-fd2ae51a-833b-4920-8319-dedb5e816d57.png`
- Implementation:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-desktop-full.png`
- Focused comparison:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-design-comparison.png`
- Wide-iPad source:
  `/tmp/codex-remote-attachments/019f9361-288d-70a1-b5ea-4148631e48be/4FE98FD8-C9D5-4F98-8846-105C2A4676B9/1-Pasted-Image-1.jpg`
- Wide-iPad implementation:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-ipad-1280-light.png`
- Wide-iPad comparison:
  `/Users/uylas/.codex/visualizations/2026/07/24/019f9361-288d-70a1-b5ea-4148631e48be/article-contents-ipad-comparison.jpg`
- Desktop viewport: 1440 × 900, dark theme
- Comparison crop: 894 × 506
- Wide-iPad viewport: 1280 × 894, light theme, 1:1 source and
  implementation pixels

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
- At 1280 pixels the left gutter now contains the section rail instead of the
  mobile-style pill.
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
- At 1280 pixels the wide-tablet rail is active regardless of hover or pointer
  media capability. Its touch gesture owns movement only inside the 64-pixel
  rail: the first tap or drag opens and updates the preview, a second tap on
  the selected mark navigates, and scrolling elsewhere on the page remains
  unchanged.
- Resizing an open tablet sheet to the desktop breakpoint closes the modal,
  restores scrolling, and switches to the desktop rail.

## Implementation iteration

Browser QA exposed a race where a fixed-rail click could update the fragment and
focus without changing the scroll position. Rail navigation now runs on the next
animation frame. The retest placed each selected heading at the top of the
viewport for click, Enter, and Space. Escape was also adjusted to close only the
preview rather than discarding keyboard focus.

The wide-iPad comparison then exposed a P1 responsive mismatch: the
`(hover: hover)` and `(pointer: fine)` requirements forced a 1280-pixel iPad to
show the mobile pill even though its left gutter could hold the rail. The
desktop-navigation query now depends on the 1200-pixel layout breakpoint alone.
The post-fix 1280 × 894 comparison shows the rail in the available gutter, while
1024 and 390 pixels continue to use the pill and sheet without horizontal
overflow.

Touch QA then exposed that the newly visible wide-iPad rail still used only the
mouse hover path, so dragging over its marks scrolled the article. The rail now
suppresses the browser pan gesture only inside its own bounds and tracks pointer
movement across marks. A first tap keeps the preview open, a glide changes the
previewed section, a second tap selects it, and an outside tap clears the
preview.

A follow-up wide-iPad test exposed a second activation edge case. When the rail
appeared beneath an already-positioned iPad pointer, Safari could emit movement
without a new enter event. The movement handler previously required an active
touch interaction, so clicking once was needed to focus and reveal the first
preview. Pointer movement can now start the preview directly for mouse,
hover-capable stylus, and missed-down touch paths. A document-level movement
guard also closes the preview when Safari omits the corresponding leave event.

## Validation

- `npm run build` from `site/`: passed
- Prettier check for all changed implementation and specification files: passed
- `git diff --check`: passed
- At the 1280 × 894 browser viewport, the rail measured 64 pixels wide,
  `touch-action: none` was active, and document width matched the viewport
  without horizontal overflow.
- After the rail appeared through scrolling, moving onto its marks without any
  prior click opened the first preview, moving to another mark updated it, and
  moving outside the rail closed it. Direct selection still updated the
  fragment and focused the destination heading.
- Browser console checked: the production preview still reports the existing
  minified React hydration errors `#418`/`#423`; the responsive change adds no
  new error signature.
- Gatsby emitted existing dependency-compatibility and Browserslist warnings;
  no build failure was introduced.

final result: passed
