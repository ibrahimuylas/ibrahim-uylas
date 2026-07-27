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
- The 12 section marks use four title-based lengths; the focused mark expands
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

---

# Camping Guide Equipment Editorial Grid Design QA — 2026-07-27

## Comparison target

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-608f0a9b-45da-4a56-924c-23d17960e513.png`
- Desktop implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/equipment-desktop.png`
- Mobile implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/equipment-mobile.png`
- Mobile dark-theme implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/equipment-mobile-dark.png`
- Combined source/implementation comparison:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/equipment-comparison.png`
- Source pixels: 2292 × 1818.
- Tested CSS viewports: 1280 × 1100 and 390 × 1000.
- State: equipment section in light and dark themes.

## Fidelity surfaces

- Typography: the section and card headings use the site's existing DM Serif
  Display family; card metadata and descriptions retain the existing Inter
  system. The mobile title uses the reference's blue editorial treatment.
- Spacing and layout: desktop uses a full-width section header followed by a
  three-column, two-row grid. Mobile collapses to a single column with
  image-first cards and full-width touch targets.
- Colors and tokens: borders, shadows, backgrounds, and dark-mode surfaces use
  existing Theme UI tokens. Link accents use the mode-aware `alphaDark` token
  and preserve their color after a visited state.
- Images: all six cards now have meaningful media. Five use their article
  assets; the MSR article uses a project-local, generated editorial product
  photograph because its previous thumbnail was the generic site banner.
- Copy and metadata: the six configured article titles, excerpts, categories,
  reading times, dates, URLs, and analytics handlers remain unchanged.

## Comparison history

### Pass 1

- [P1] The MSR card had no meaningful image and would have required a blank
  placeholder.
- [P2] Mobile card links and the section CTA used a blue that was too subdued
  against the dark content surface.

Fixes: generated a realistic MSR-style backpacking stove photograph, promoted
the 2 Seconds article's existing lead image to its thumbnail, and moved
editorial accents to the mode-aware `alphaDark` token with explicit visited
colors.

### Pass 2

The final combined comparison matches the Stitch structure while keeping the
site's real content and brand system. No actionable P0, P1, or P2 differences
remain.

## Interaction and validation

- All six article links are exposed in the equipment landmark and the first
  card navigated to `/buff-nedir-ne-ise-yarar/` in browser testing.
- The “Tüm ekipman yazılarını gör” link resolves to
  `/category/ekipmanlar/`.
- Mobile cards, floating contents navigation, and scroll-to-top control do not
  create horizontal overflow.
- Dark-theme title and CTA accents resolve to `rgb(163, 191, 250)` on the dark
  content surface.
- Root `npm test`: passed, 28 of 28 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build: passed, 333 pages.
- Generated HTML validation: passed, including the camping guide SSR contract.

final result: passed

# Camping Guide Stitch Hero Design QA

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-1377e05b-bdeb-47c1-8a8a-f52142a1901c.png`
- Source hero asset:
  `/Users/uylas/Downloads/premium_outdoor_editorial_photography_3_2_landscape._a_small_technical_trekking.png`
- Desktop implementation:
  `/var/tmp/ibrahim-uylas-design-qa/camping-hero-desktop-final.jpg`
- Mobile implementation:
  `/var/tmp/ibrahim-uylas-design-qa/camping-hero-mobile-final.jpg`
- Desktop combined comparison:
  `/var/tmp/ibrahim-uylas-design-qa/camping-hero-desktop-comparison-final.png`
- Mobile combined comparison:
  `/var/tmp/ibrahim-uylas-design-qa/camping-hero-mobile-comparison-final.png`
- Source image: 2608 × 1556 px.
- Desktop viewport: 1280 × 1000 CSS px; browser capture 1265 × 988 px.
- Mobile viewport: 390 × 1000 CSS px; browser capture 375 × 962 px.
- Density normalization: native browser density; source and implementation hero
  crops were resized to equal comparison widths without changing aspect ratio.
- State: light theme for source comparison; dark theme checked separately.

## Full-view comparison evidence

The final desktop comparison places the Stitch source on the left and the
implementation on the right. Both use a compact editorial card, a roughly
60/40 content-to-image split, a single-line serif title, two CTAs, and a
three-column summary row. The final mobile comparison uses the same ordering
as the source: image, title and description, summary row, then stacked CTAs.

## Focused region evidence

The hero itself was cropped from both source and implementation because the
source board includes unrelated canvas and sample navigation. At desktop the
implemented hero measures 1076 × 471 CSS px, close to the source hero's 2.36:1
proportion. At mobile it measures about 348 × 702 CSS px, keeps the title on
one line, and has no horizontal overflow.

## Findings

- Fonts and typography: the existing DM Serif Display heading closely matches
  the source's editorial serif. The mobile title is 32 px on one line; the
  desktop title is 56 px with a 58.8 px line height. UI copy retains the
  site's existing sans-serif family and readable optical weights.
- Spacing and layout rhythm: desktop uses the source's compact wide card and
  mobile reorders the same content into an image-first stack. Padding, borders,
  radii, summary dividers, and CTA spacing align with the selected design.
- Colors and visual tokens: the source blue is represented by `#1552d6`;
  neutral surfaces and text continue to use the site's theme tokens. Light and
  dark themes both retain sufficient contrast.
- Image quality and asset fidelity: the exact supplied 1264 × 848 raster is
  served through Gatsby's responsive image pipeline with WebP/AVIF output,
  eager loading, a blurred placeholder, and a focal crop that keeps the sun
  and tent visible at both breakpoints.
- Copy and content: invented route, community, and rating claims from the mock
  were replaced with real hub values: 29 contents, 6 topics, and 5 starting
  steps. Both CTAs preserve the guide's existing section targets.

## Comparison history

### Pass 1

- [P2] The first desktop implementation expanded to 962 px tall instead of the
  source's compact landscape proportion.
- [P2] The first mobile title wrapped onto two lines.

Fixes: replaced theme spacing indices with measured pixel padding, reduced the
desktop minimum height to 460 px, tightened desktop vertical gaps, and reduced
the mobile title to 32 px.

### Pass 2

The final combined comparisons show no remaining actionable P0, P1, or P2
difference. The source's white feather at the desktop image boundary is not
reproduced so the split remains correct in dark mode; this is accepted P3
polish.

## Interaction and browser checks

- Primary CTA navigates to `#baslangic`.
- Secondary CTA navigates to `#tum-icerikler`.
- Final production page contains one H1 and the hero image loads successfully.
- Desktop and mobile captures have zero horizontal overflow.
- Dark mode resolves the hero surface, title, and body text to the existing
  dark theme tokens without layout changes.
- Console/error pass: the final browser interaction sequence surfaced no
  uncaught page error. The development build retains one existing unrelated
  iframe-title warning in `DeferredEmbed.jsx`.
- `npm test`, Gatsby production build, generated HTML validation, Prettier,
  and `git diff --check`: passed.

## Follow-up polish

- P3: add a theme-aware raster feather between text and image only if matching
  the source's soft desktop transition becomes more important than preserving
  the current clean dark-mode split.

final result: passed

# Site Performance and Deferred Loading — Design QA (27 July 2026)

## Evidence and state

- Source visual truth:
  `/Users/uylas/Projects/ibrahim-uylas/specs/assets/004-instagram-showcase-selected.png`
- Browser-rendered desktop light homepage:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/home-desktop-light.png`
- Browser-rendered desktop dark homepage:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/home-desktop-dark.png`
- Browser-rendered mobile light homepage:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/home-mobile-light.png`
- Browser-rendered mobile dark homepage:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/home-mobile-dark.png`
- Loaded six-post showcase:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/instagram-desktop-loaded.png`
- Combined source/loaded-state comparison:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/instagram-loaded-reference-comparison.png`
- Mobile article:
  `/Users/uylas/Projects/ibrahim-uylas/artifacts/performance/article-mobile-light.png`
- Desktop CSS viewport: 1440 × 1000 at device scale 1.
- Mobile CSS viewport: 390 × 844 at device scale 1; the browser content width
  was 375 pixels.
- Source pixels: 853 × 1844. Loaded implementation pixels: 1265 × 712.
- Density normalization: both comparison inputs were scaled to 700 pixels high
  and placed in one image. The source is a narrow full-page direction while
  the implementation crop is the desktop section, so the comparison judges
  hierarchy, controls, media treatment, and rail density rather than identical
  breakpoint geometry.
- State: light and dark fallback states, a controlled valid six-post response,
  mobile and desktop layouts, deferred video before/after activation, route
  embeds near and away from the viewport, and comments before activation.

## Findings

No actionable P0, P1, or P2 visual difference remains in the changed
performance surfaces. The comparison preserves the source hierarchy, identity
lockup, primary/secondary action contrast, portrait media treatment, partial
next-card affordance, and placement between the Kampçılık and Doğa
Yürüyüşleri sections. The responsive implementation intentionally uses a wider
desktop editorial heading and approximately 4.45 visible cards, while the
source image establishes the narrow-screen direction.

## Fidelity surfaces

- Fonts and typography: Inter and DM Serif Display render from four local
  WOFF2 files with `font-display: swap`; generated HTML and JavaScript contain
  no Google Fonts host. Heading weight, body hierarchy, wrapping, and control
  letter spacing remain consistent in light and dark states.
- Spacing and layout rhythm: the desktop identity/actions row, mobile stacked
  structure, 5:6 gallery cards, and reserved embed heights prevent layout
  collapse. At 375 CSS pixels the document scroll width exactly matched the
  viewport.
- Colors and visual tokens: all new placeholders, spinners, buttons, borders,
  and surfaces use the existing Theme UI tokens. Light and dark screenshots
  retain readable contrast without a new parallel palette.
- Image quality and asset fidelity: the local fallback portrait is preserved;
  the controlled successful state used six real raster images with cover
  cropping and installed carousel/video icons. No CSS-drawn or placeholder
  asset replaces visible source imagery.
- Copy and content: the Turkish actions, loading labels, profile copy, and
  `Son 6 paylaşım` accessibility contract remain intact. Deferred embeds retain
  their exact source URLs in non-fetching data attributes for validation.

## Interaction and responsive checks

- A YouTube article rendered one deferred video and zero YouTube iframes before
  activation. `Videoyu yükle` created exactly one iframe.
- Aytepe rendered 14 reserved route containers, but only the first near-viewport
  map activated on initial load; the other 13 remained request-free.
- Disqus rendered zero iframes on initial article load while keeping a deferred
  comments region and manual activation.
- The controlled Instagram response rendered six lazy images and six outbound
  post links; the loading skeleton was removed after success.
- The 375-pixel mobile document had no page-level horizontal overflow.
- Browser console errors and warnings after the final checks: none.

## Comparison history

### Pass 1

The generated homepage validation exposed that the visually hidden
`Son 6 paylaşım` contract only existed after hydration. It was moved to
unconditional server-rendered content so script-free and loading states retain
the gallery description.

The existing SEO validator also treated an eager iframe as the only valid proof
that a map or video survived rendering. Deferred containers now expose the
exact source as `data-deferred-src`, and the validator accepts either an active
iframe or the non-fetching deferred source. The post-fix validation retained
all 13 checked maps and the checked video without restoring eager requests.

### Final pass

The combined source and loaded-state comparison plus mobile/desktop light/dark
captures show no remaining actionable P0, P1, or P2 issue. No additional visual
fix was required after the final comparison.

## Validation

- Production Gatsby build: passed, 330 pages.
- Root tests: passed, 20 of 20.
- Generated HTML validation: passed.
- Likya canonical, crawl, structured-data, and retained-embed validation:
  passed.
- Dependency tree check: passed.
- `git diff --check`: passed.
- Production dependency audit still reports Gatsby/Sharp/Decap transitive
  advisories; safe upstream-compatible fixes are not currently available
  without a breaking React or Gatsby toolchain migration.

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

---

# Codex-style article rail fidelity update — 2026-07-27

## Comparison target

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-9e31bd0b-fd33-4b6c-8cc1-4e084f77803a.png`
- Browser-rendered implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa348-67fa-7fa1-a97a-d12716df54c9/article-contents-codex-hover-final.png`
- Focused side-by-side comparison, source on the left and implementation on
  the right:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa348-67fa-7fa1-a97a-d12716df54c9/article-contents-codex-rail-comparison-final.png`
- Source pixels: 946 × 502. The source is a desktop Codex crop with unknown
  capture density.
- Implementation pixels and CSS viewport: 1330 × 900 at device scale 1.
- Density normalization: the rail was compared with unscaled 100 × 320 pixel
  crops from both images, combined into a single 200 × 320 comparison.
- State: dark mode, 12 article marks visible, sixth mark hovered, preview open.

## Full-view and focused evidence

The full browser view confirms that the rail remains vertically centred, the
hovered mark is the only bright 52-pixel mark, the article stays usable, and
the preview does not create horizontal overflow. The focused comparison was
required because the source and implementation contain different surrounding
products and copy. At rail scale, both use a four-pixel stroke,
low-contrast passive marks, and a single bright 52-pixel hovered mark. The
implementation supports the source's four passive widths; this article's title
lengths exercise the 20, 28, and 40-pixel widths.

At a 1330-pixel viewport the rail ends 31.5 pixels before the article card. At
1920 pixels it moves with the centred 1140-pixel content container and ends
40.5 pixels before the card instead of remaining at the viewport edge.

## Fidelity surfaces

- Fonts and typography: the requested rail contains no visible text. Existing
  preview typography remains unchanged and follows the site's Theme UI tokens.
- Spacing and layout rhythm: the line lengths and active width match the source.
  The implementation retains 24-pixel interactive rows rather than the
  source's approximately 20-pixel visual rhythm to preserve the specified
  minimum pointer target.
- Colors and visual tokens: passive lines use the existing neutral token at
  0.22 opacity; the active line uses the theme heading token at full opacity.
  The focused comparison shows the same subdued-passive/bright-active
  hierarchy as the source in dark mode.
- Image quality and asset fidelity: the rail requires no raster, logo,
  illustration, or icon asset. No placeholder or generated asset is used.
- Copy and content: article titles and preview copy remain sourced from the
  existing table of contents; the update does not change content.

## Comparison history

### Pass 1

- [P2] Passive marks were substantially brighter than the Codex source.
- [P2] Three-pixel marks landed on half pixels when vertically centred and
  appeared softer than the four-pixel source marks.

Fixes: reduced passive opacity from 0.72 to 0.22 and increased mark height from
three to four pixels. The existing width animation was also replaced with a
fixed 52-pixel layer animated by horizontal scale, eliminating stale painted
tails when marks contract.

### Pass 2

The combined focused comparison shows no remaining actionable P0, P1, or P2
difference in the requested rail. The 24-pixel row rhythm is an accepted P3
accessibility trade-off.

## Interaction and browser checks

- Sweeping the pointer over all 12 marks and then leaving the rail produced
  zero active marks, removed the tooltip, and restored every passive width.
- A hovered mark measured 52 × 4 pixels; all other marks measured one of
  20, 28, or 40 pixels for this article and retained passive opacity.
- Browser console errors and warnings after the final interaction pass: none.
- Gatsby production build: passed. Existing Gatsby dependency and Node
  deprecation warnings remain non-blocking.
- Prettier and `git diff --check`: passed.

## Follow-up polish

- P3: reduce row spacing only if the 24-pixel target requirement is explicitly
  relaxed; no change is recommended for the current accessible implementation.

final result: passed

# Camping Guide Card Layout Design QA

- Source visual truth: `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-00092dff-c979-4af6-8b24-3eb86ebacbf5.png`
- Desktop implementation: `/tmp/camping-guide-cards-final-desktop.png`
- Mobile implementation: `/tmp/camping-guide-cards-final-mobile.png`
- Combined comparison: `/tmp/camping-guide-cards-final-before-after.png`
- Desktop viewport: 1280 × 1300 CSS px; implementation capture 1265 × 1288 px
- Mobile viewport: 390 × 844 CSS px; implementation capture 375 × 832 px
- Source image: 2490 × 2556 px, normalized to 1265 px wide for comparison
- Device density: browser screenshots compared at their native capture density
- State: equipment section, light theme

## Full-view comparison evidence

The source used small inline thumbnails beside constrained summary text. The
implementation moves valid article photography into a consistent, full-width
180 px media area above the card content. Titles, summaries, and metadata now
use the full card width. Cards without a meaningful image remain text-only.

## Focused region evidence

The equipment card grid was inspected at desktop and mobile sizes. At desktop,
image cards measure about 337 px wide with a 335 × 180 px media area. At mobile,
the first image card measures about 348 px wide with a 346 × 160 px media area.
No horizontal overflow was detected.

## Findings

- Fonts and typography: Existing families, weights, hierarchy, and copy are
  preserved. Full-width text substantially improves wrapping.
- Spacing and layout rhythm: Image and content regions are clearly separated;
  row heights remain aligned within the two-column grid.
- Colors and visual tokens: Existing light and dark theme surfaces, borders,
  accents, and shadows are preserved.
- Image quality and asset fidelity: Real article images use a consistent cover
  crop. The default MSR placeholder and the image-less 2 Seconds article do not
  create oversized empty media areas.
- Copy and content: Titles, summaries, metadata, links, and tracking behavior
  are unchanged.
- Browser verification: Desktop and mobile layouts were checked; no console
  errors or warnings were present.

## Comparison history

1. Initial implementation enlarged every available thumbnail.
2. P2 finding: the MSR default placeholder became an oversized gray media
   block.
3. Fix: added an editorial image exclusion for the placeholder-backed article.
4. Post-fix evidence confirms four real image cards and two clean text-only
   cards in the equipment section.

No actionable P0, P1, or P2 findings remain.

final result: passed

---

# Camping Guide Hero Left Fade Design QA — 2026-07-27

## Comparison target

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-4013a914-5a44-478a-9328-9a305a1b2d05.png`
- Desktop implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/hero-left-fade-desktop.png`
- Mobile implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/hero-left-fade-mobile.png`
- Desktop dark-theme implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/hero-left-fade-desktop-dark.png`
- Focused source/implementation comparison:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/hero-left-fade-comparison.png`
- Tested CSS viewports: 1280 × 850 and 390 × 900.

## Fidelity review

- The desktop image stays transparent through the first 16 percent, feathers
  across the next 20 percent, and becomes fully opaque at 36 percent. The
  focused comparison shows the same broad white margin and soft photographic
  reveal as the source.
- The fade reveals the hero's existing content surface, so it resolves to white
  in light mode and the correct card surface in dark mode.
- The effect starts only at the desktop breakpoint. Mobile retains the original
  unmasked, full-width image.
- The source image, crop, focal point, rounded container, content, interactions,
  and responsive ordering remain unchanged.

## Comparison history

### Pass 1

The first implementation matched the reference's fade length and softness. No
actionable P0, P1, or P2 differences were found. Mobile and dark-mode checks
also passed without overflow or hard image seams.

## Validation

- Root `npm test`: passed, 28 of 28 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build: passed, 333 pages.
- Generated HTML validation: passed, including the camping guide SSR contract.

final result: passed

---

# Camping Guide Reading Path Three-Column Design QA — 2026-07-27

## Comparison target

- Source visual truth:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-91244c3f-3c37-44c3-87b1-31f8bc6f8e7f.png`
- Desktop implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/reading-path-three-column-desktop-tall.png`
- Mobile implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/reading-path-three-column-mobile.png`
- Desktop dark-theme implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/reading-path-three-column-desktop-dark.png`
- Source/implementation comparison:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/reading-path-three-column-comparison.png`
- Tested CSS viewports: 1280 × 1600 and 390 × 900.

## Fidelity review

- The reading path becomes a three-column grid from the 1024 px desktop
  breakpoint while retaining one column on mobile and two columns on tablet.
- The five-step reading order remains unchanged: cards 1–3 form the first row
  and cards 4–5 form the second.
- All five cards use their real article thumbnails on desktop, producing a
  consistent editorial rhythm and removing the tall empty text-only cards.
- The two previously text-only cards keep their original image-free treatment
  on tablet and mobile, so the existing narrow-screen content density is
  preserved.
- Card surfaces, borders, radii, typography, metadata, badges, hover behavior,
  links, and tracking remain consistent with the existing guide.
- The layout was verified in light and dark themes with no horizontal overflow,
  cropped text, or broken card alignment.

## Comparison history

1. P1 finding: the two-column desktop grid mixed image and text-only cards,
   creating large empty areas and an unnecessarily tall reading path.
2. Fix: changed the desktop breakpoint to three columns and exposed each
   article's existing thumbnail on desktop.
3. Post-fix comparison confirms a shorter, balanced 3+2 composition without
   changing the mobile and tablet layouts.

No actionable P0, P1, or P2 findings remain.

## Validation

- Root `npm test`: passed, 29 of 29 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build: passed, 333 pages.
- Generated HTML validation: passed, including the camping guide SSR contract.

final result: passed

---

# Camping Guide Newest Articles Three-Card Design QA — 2026-07-27

## Comparison target

- Existing production section:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/newest-cards-before-four.png`
- Updated production section:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/newest-cards-after-three.png`
- Combined comparison:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/newest-cards-three-comparison.png`
- Tested CSS viewport: 1280 × 1600.

## Fidelity review

- The section now receives and renders exactly the three newest Kampçılık
  articles.
- The desktop grid uses three columns, so the three cards fill one balanced row.
- Card imagery, typography, spacing, metadata, hover behavior, links, and
  tracking are unchanged.
- Browser semantic inspection confirmed three `article` elements inside the
  “Yeni eklenenler” region.

No actionable P0, P1, or P2 findings remain.

## Validation

- Root `npm test`: passed, 30 of 30 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build: passed, 332 pages.
- Generated HTML validation: passed, including the camping guide SSR contract.

final result: passed

---

# Camping Guide All Content Editorial Grid Design QA — 2026-07-27

## Comparison target

- Stitch source:
  `/var/folders/y_/wpm7ltr94vj4f0m5tcc8dcdr0000gn/T/codex-clipboard-82d61290-3a79-4b77-a9b6-23a497ffbbd9.png`
- Previous list implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/all-content-before-list.png`
- Final desktop implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/all-content-editorial-desktop.png`
- Final card-detail implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/all-content-editorial-cards.png`
- Final dark-theme implementation:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/all-content-editorial-dark.png`
- Source/implementation comparison:
  `/Users/uylas/.codex/visualizations/2026/07/27/019fa4ba-40cf-7760-a78a-7751048434fb/all-content-editorial-comparison.png`
- Tested CSS viewport: 1265 × 720.

## Fidelity review

- The heading, supporting copy, right-aligned search field, category pills,
  three-column cards, and centered progressive-load action follow the Stitch
  composition.
- Real article thumbnails, category labels, editorial serif titles, and reading
  times replace the former compact text list.
- The responsive grid is one column on mobile, two on tablet, and three on
  desktop.
- The search input, empty state, card links, and “Daha fazla içerik yükle”
  interaction remain functional.
- Category pills are navigation links. Browser verification confirmed that
  “Rotalar” opens `/category/rotalar/`.
- Light and dark theme surfaces preserve the existing site tokens.

## Comparison history

1. P1 finding: the previous two-column compact link list did not match the
   selected editorial card design.
2. Fix: replaced it with image-led cards and a 6-item progressive grid.
3. P2 finding: the search icon overlapped the placeholder text.
4. Fix: reserved explicit left padding for the icon and recaptured the final
   comparison.

No actionable P0, P1, or P2 findings remain.

## Validation

- Root `npm test`: passed, 31 of 31 tests.
- Prettier and `git diff --check`: passed.
- Gatsby production build: passed.
- Generated HTML validation: passed, including the camping guide SSR contract.

final result: passed
