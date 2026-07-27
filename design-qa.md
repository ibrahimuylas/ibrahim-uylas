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

# Homepage Instagram Showcase — Design QA (27 July 2026)

## Reference and scope

- Selected reference: `specs/assets/004-instagram-showcase-selected.png`
- Homepage placement: between `Kampçılık` and `Doğa Yürüyüşleri`
- Target widths: 390, 640, 768, 1023, 1024, and 1440 pixels
- Themes: light and dark

The selected raster establishes the integrated pale-indigo band, left accent,
compact profile/actions hierarchy, subordinate gallery label, and square-image
rail. The specification's explicit six-across layout from 1024 pixels and
approximately 2.4 visible tiles below 1024 pixels controls geometry where the
directional raster differs.

## Reviewed visual and interaction evidence

The completed Item 22 served-browser matrix covered every target width in both
themes with a controlled successful six-post response. At 390, 640, 768, and
1023 pixels, 2.39–2.40 tiles were visible and horizontal movement remained
inside the snapping rail. At 1024 and 1440 pixels, the rail rendered one equal
six-tile row with matching client and scroll widths. In every case, document
and section scroll widths matched their client widths.

The implementation follows the reference hierarchy: one integrated
pale-indigo section, the established left-accent heading, compact 72-pixel
profile portrait and copy, emphasized `Takip et`, outlined `Mesaj at`, a
subordinate `Son 6 paylaşım` label, and square thumbnails. CTA contrast measured
11.99:1 and 10.80:1 in light mode and 10.64:1 and 7.78:1 in dark mode; both
targets measured 44 pixels high. Keyboard focus showed the compiled three-pixel
focus-visible outline, and native keyboard traversal scrolled the rail without
widening the document.

The controlled successful gallery rendered six lazy-loaded 320 × 320 images.
Focused automated coverage passes for delayed request state, complete and
malformed responses, failed requests, unsafe URLs, caption alternatives capped
at 120 characters, caption-free fallback alternatives, analytics allowlisting,
and stale asynchronous completion after cancellation. Source and SSR policy
retain the local profile/actions during idle and failure states. Fresh served
browser checks confirmed six reserved loading slots before a delayed success,
then six lazy 320 × 320 images; malformed and 503 responses removed the rail
without an error panel or broken image; and a script-free production-HTML route
retained the local portrait, profile copy, gallery label, and both exact action
links without a loading state.

## Current validation outcome

- Complete root `npm test`: passed, 16 of 16 tests.
- Focused formatting, JavaScript syntax, and `git diff --check`: passed.
- Clean Gatsby build: passed in the supported Node 18.20.4 environment with 330
  pages and 1,072 Sharp jobs.
- Generated homepage validation: passed after scoping category-order checks
  around the unique showcase marker.
- Fresh served-browser fallback state matrix: passed for delayed success,
  malformed payload, upstream failure, and JavaScript-free SSR output; each
  retained exact actions and document-width containment.
- Production Meta/Netlify smoke check: pending the site owner provisioning
  credentials and deploying. It has not been claimed as run.

final result: passed
