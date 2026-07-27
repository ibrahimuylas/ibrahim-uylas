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

# Homepage Instagram Showcase — Premium Option 2 Revision

## Evidence and state

- Selected visual:
  `/Users/uylas/.codex/generated_images/019fa2d2-b491-7740-8616-1b139f757775/call_G9neHqcyJwRWL91SlgFHpFAm.png`
- Final desktop implementation:
  `/tmp/instagram-premium-implementation-final-1261x1247-dark.png`
- Final same-viewport comparison:
  `/tmp/instagram-premium-comparison-final.png`
- Final mobile implementation:
  `/tmp/instagram-premium-mobile-final-390x1100-dark.png`
- Desktop comparison state: 1261 × 1247, DPR 1, dark theme, complete six-post
  response.
- Mobile state: 390 × 1100, dark theme, complete six-post response.

The successful preview uses a contract-shaped local response because this
checkout has no `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, or
`INSTAGRAM_API_VERSION` configured and is not linked to a Netlify site. Live
Meta delivery is therefore an integration prerequisite, not a completed visual
QA claim.

## Iteration findings and resolution

The first combined comparison showed the right surface direction but exposed
three visible hierarchy mismatches: the heading and profile lockup were too
small, the gallery felt compressed, and square media did not match the selected
portrait-led direction. The final revision uses a 48-pixel desktop heading, a
176-pixel portrait, 30-pixel profile name, 52-pixel compact actions, and 4:5
media cards. The neutral page background, elevated identity band, indigo
primary action, outlined secondary action, Instagram icon, hidden scrollbar,
and partial next-card affordance now follow the selected option.

Tablet QA exposed a second density issue before handoff: carrying the mobile
2.4-card rail through 1023 pixels produced oversized 363 × 453 cards. The
768–1023 range now shows approximately 3.2 cards, measuring 190 × 237 at 768
pixels and 270 × 337 at 1023 pixels. At 1024 and 1440 pixels the desktop rail
returns to its denser presentation.

## Responsive, accessibility, and content QA

- Document width matched client width at 390, 640, 768, 1023, 1024, 1261, and
  1440 pixels; the gallery is the only horizontally scrolling region.
- The native rail scrollbar is hidden while touch momentum, proximity snapping,
  and keyboard scrolling remain available.
- At 390 pixels the two actions remain on one row and each measures 44 pixels
  high. Desktop actions measure 52 pixels high.
- The profile name, username, biography, portrait alternative, post
  alternatives, and exact Instagram actions come from the validated feed
  contract; the local identity remains visible when the feed is unavailable.
- Profile and media URLs remain restricted by the client policy, malformed
  payloads fail closed, and a failed media image removes the gallery rather than
  leaving a broken tile.
- Light and dark surfaces inherit the existing theme tokens. The brand primary
  remains white on `#434190`, with the established three-pixel focus-visible
  outline.

## Validation

- Root `npm test`: passed, 16 of 16 tests.
- Prettier check for all changed implementation and policy files: passed.
- `git diff --check`: passed.
- Gatsby production build under Node 18.20.4: passed, 330 pages.
- Final same-viewport combined comparison: no remaining P0, P1, or P2 visual
  mismatch.
- Production Meta/Netlify smoke check: blocked until the required environment
  variables are provisioned; live data has not been claimed as verified.

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

# Homepage Instagram Showcase — Stitch Revision

## Source and rendered evidence

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-0243d6d0-1351-4868-937d-f02f1ce21c40.png`
- Source pixels: 2544 × 986 at 144 DPI. The source contains a desktop pane
  and a separate mobile pane on one design canvas.
- Desktop implementation:
  `/tmp/stitch-instagram-desktop-section-final.png`
- Desktop combined comparison:
  `/tmp/stitch-instagram-desktop-comparison-final2.png`
- Mobile implementation:
  `/tmp/stitch-instagram-mobile-section-final.png`
- Mobile combined comparison:
  `/tmp/stitch-instagram-mobile-comparison-final2.png`
- Dark-theme implementation:
  `/tmp/stitch-instagram-desktop-dark-section.png`
- Desktop CSS viewport: 1440 × 1000 at DPR 1; captured section:
  1076 × 650 pixels.
- Mobile CSS viewport: 390 × 900 at DPR 1; captured section:
  348 × 424 pixels.
- State: successful six-post response, light theme for source comparisons,
  plus a focused dark-theme review.

The two source panes were cropped from the supplied canvas and normalized to
the exact rendered section dimensions before comparison. The Instagram images
and portrait differ because the implementation intentionally uses the
validated feed contract instead of copying the mockup's illustrative content.
The verification badge was intentionally omitted because the live feed does
not provide evidence that the account is verified.

## Comparison history

### Pass 1

- P2: the mobile gallery retained an inset while the Stitch reference begins
  at the section edge. The rail margin was removed.
- P2: the mobile editorial title was visually weaker than the reference. The
  responsive display size was increased while retaining the 48-pixel desktop
  heading.
- P2: desktop showed five complete cards while the source communicates
  horizontal continuation with four complete cards and a partial fifth. The
  desktop rail density was changed to approximately 4.45 cards.
- P2: 4:5 cards were visibly taller than Stitch in both normalized
  comparisons. Media and loading slots were changed to a 5:6 ratio.

### Final pass

The final combined comparisons show the same hierarchy, square purple portrait
frame, editorial serif heading, compact identity copy, dark primary action,
outlined secondary action, edge-to-edge media rail, hidden scrollbar, and
partial-next-card affordance. No actionable P0, P1, or P2 mismatch remains.

## Required fidelity surfaces

- Fonts and typography: `DM Serif Display` is loaded for the section heading;
  Inter remains the UI and identity typeface. Desktop heading is 48 pixels and
  mobile resolves to 30.6 pixels in the existing fluid typography system.
- Spacing and layout: desktop uses the Stitch side-by-side header and actions;
  mobile reflows to title, profile, actions, then gallery. CTA heights are
  44–48 pixels.
- Colors and tokens: the light section is white with near-black actions. Dark
  mode uses the existing content surface, light primary action, and high
  contrast outlined secondary action. The portrait ring uses Stitch's purple
  accent.
- Image quality: all media remains sourced from the Instagram feed contract,
  uses cover cropping, and preserves dedicated carousel/video icons from the
  installed icon library.
- Copy: the supplied Turkish title, profile identity, biography, `Takip et`,
  and `Mesaj at` labels are preserved. The redundant gallery label was removed
  to match Stitch.

## Responsive, interaction, and build validation

- Document width equals client width at 390, 640, 768, 1023, 1024, and 1440
  pixels. Horizontal overflow remains contained inside the gallery.
- The hidden-scrollbar rail measures 2.45 cards on mobile and approximately
  4.45 cards on desktop, with touch momentum and proximity snapping.
- Keyboard traversal reaches both actions and every post. The gallery focus
  state renders a three-pixel outline with a two-pixel offset.
- Exact profile, message, and post links remain functional and retain the
  existing analytics activation handlers.
- Browser console: no warnings or errors in the final served preview.
- Root `npm test`: passed, 16 of 16 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build under Node 18.20.4: passed, 330 pages.
- Live Meta/Netlify delivery is still pending the required environment
  variables; the browser QA uses the contract-shaped local response and does
  not claim a production Instagram smoke test.

final result: passed
